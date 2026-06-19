import express from "express";
import cors from "cors";
import morgan from "morgan";
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import usersDAO from './dao/usersDAO.js';
import networkDAO from './dao/networkDAO.js';
import eventsDAO from './dao/eventsDAO.js';
import gamesDAO from './dao/gamesDAO.js';

const app = express();
const port = 3001;
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    // Find user in DB
    const user = await usersDAO.getUserByUsername(username);
    if (!user) return done(null, false, { message: 'User not found' });
    // Check password
    const match = await usersDAO.verifyPassword(password, user.password);
    if (match) return done(null, user);
    return done(null, false, { message: 'Wrong password' });
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usersDAO.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Not authenticated' });
};

function bfs(startId, connections) {
  const visited = new Set();
  const queue = [{ id: startId, distance: 0 }];
  const distances = {};

  while (queue.length > 0) {
    const { id, distance } = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    distances[id] = distance;

    // Find neighbors of this station
    const neighbors = connections
        .filter(c => c.station1_id === id || c.station2_id === id)
        .map(c => c.station1_id === id ? c.station2_id : c.station1_id);

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push({ id: neighbor, distance: distance + 1 });
      }
    }
  }
  return distances;
}

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.get('/api/network', async (req, res) => {
  try {
    const lines = await networkDAO.getNetwork();
    res.json(lines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/connections', async (req, res) => {
  try {
    const connections = await networkDAO.getConnections();
    res.json(connections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sessions', passport.authenticate('local'), (req, res) => {
  const {password, ...userWithoutPassword} = req.user;
  res.json(userWithoutPassword);
});

app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => res.end());
});

app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Generate random start and end station
// Can be used only by logged-in users
app.get('/api/game/new', isLoggedIn, async (req, res) => {
  try {
    const [connections, stations] = await Promise.all([
      networkDAO.getConnections(),
      networkDAO.getStations(),
    ]);

    const randomStartStationId = stations[Math.floor(Math.random() * stations.length)].id;
    const distances = bfs(randomStartStationId, connections);

    const destinationIds = Object.entries(distances)
      .filter(([, dist]) => dist >= 3)
      .map(([id]) => id);

    const randomDestinationStationId = Number(destinationIds[Math.floor(Math.random() * destinationIds.length)]);

    const startStation = stations.find(s => s.id === randomStartStationId);
    const endStation = stations.find(s => s.id === randomDestinationStationId);

    res.json({
      start: randomStartStationId,
      startName: startStation.name,
      end: randomDestinationStationId,
      endName: endStation.name
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/events', isLoggedIn, async (req, res) => {
  try {
    const events = await eventsDAO.getEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/ranking', async (req, res) => {
  try {
    const ranking = await gamesDAO.getRanking();
    res.json(ranking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/games',  isLoggedIn,async (req, res) => {
  const { startId, endId, segments } = req.body;

  // Basic validation for invalid requests
  if (!startId || !endId || !Array.isArray(segments) || segments.length === 0) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  const connections = await gamesDAO.getConnectionsByIds(segments);
  const events = await eventsDAO.getEvents();
  const lineStations = await networkDAO.getLineStations();

  // helper to mark a route invalid: save a 0-score game and respond
  const markInvalid = async () => {
    await gamesDAO.createGame(req.user.id, startId, endId, 0, false);
    return res.json({ score: 0, valid: false });
  };

  // every requested segment id must resolve to a real connection
  if (connections.some(c => !c)) {
    return markInvalid();
  }

  // Connections are undirected: a segment links station1_id and station2_id in either direction.
  // We walk the path starting from startId; at each step the segment must touch the current
  // station, and we move to its other endpoint. "exits" keeps the station we leave each segment at.
  let current = startId;
  const exits = [];
  for (const conn of connections) {
    let next;
    if (conn.station1_id === current) {
      next = conn.station2_id;
    } else if (conn.station2_id === current) {
      next = conn.station1_id;
    } else {
      // this segment is not connected to where we currently are -> broken path
      return markInvalid();
    }
    exits.push(current); // the station we entered this segment from
    current = next;
  }

  // after walking all segments we must end exactly at endId
  if (current !== endId) {
    return markInvalid();
  }

  // when two consecutive segments are on different lines, the station between them
  // (the shared station) must be an interchange that belongs to both lines.
  for (let i = 0; i < connections.length - 1; i++) {
    const currConn = connections[i];
    const nextConn = connections[i + 1];
    if (currConn.line_id !== nextConn.line_id) {
      // shared station = endpoint of currConn we arrived at = entry point of nextConn
      const interchangeStation = exits[i + 1];
      const onLine1 = lineStations.some(ls => ls.station_id === interchangeStation && ls.line_id === currConn.line_id);
      const onLine2 = lineStations.some(ls => ls.station_id === interchangeStation && ls.line_id === nextConn.line_id);
      if (!onLine1 || !onLine2) {
        return markInvalid();
      }
    }
  }

  // route is valid -> compute score with one random event per segment
  let score = 20;
  const chosenEvents = [];
  for (let i = 0; i < connections.length; i++) {
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    chosenEvents.push(randomEvent);
    score += randomEvent.effect;
  }
  // if score < 0, it has to be 0 as score cannot be less than zero at the end.
  score = Math.max(0, score);

  // save game to db
  const gameId = await gamesDAO.createGame(req.user.id, startId, endId, score, true);
  // save chosen segments in game to db
  for (let i = 0; i < segments.length; i++) {
    await gamesDAO.createGameSegment(gameId, segments[i], i);
  }
  return res.json({ finalScore: score, valid: true, events: chosenEvents });
});
