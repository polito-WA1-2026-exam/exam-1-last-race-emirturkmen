// imports
import express from "express";
import cors from "cors";
import morgan from "morgan";

import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import db from "./db.js";
import bcrypt from "bcrypt";

// init express
const app = express();
const port = 3001;
app.use(morgan('dev'));
app.use(express.json());
// use cors to prevent browser from blocking requests to backend as there are 2 servers
app.use(cors({
  origin: 'http://localhost:5173',  // allow only this origin
  credentials: true                 // necessary for cookies
}));

// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy((username, password, done) => {
  // Find user in DB
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false, {message: 'User not found'});

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return done(null, user);
    } else {
      done(null, false, {message: 'Wrong password'});
    }
  });
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
    if (err) return done(err);
    done(null, user);
  });
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
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

  return distances; // {istasyon_id: kaç_durak}
}

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.get("/api/network", (req, res) => {
  const sql = `
    SELECT lines.id as line_id, lines.name as line_name,
           stations.id as station_id, stations.name as station_name
    FROM lines
    JOIN line_stations ON lines.id = line_stations.line_id
    JOIN stations ON stations.id = line_stations.station_id
    ORDER BY lines.id, line_stations.position
  `;
  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    // list to nested
    const lines = [];
    for (const row of rows) {
      // if lines have this line
      let line = lines.find(l => l.id === row.line_id);
      if (!line) {
        // if not, add new
        line = { id: row.line_id, name: row.line_name, stations: [] };
        lines.push(line);
      }
      // add the station
      line.stations.push({ id: row.station_id, name: row.station_name });
    }

    res.json(lines);
  });
});

app.get("/api/connections", (req, res) => {
  const sql = `
    SELECT connections.id,
           s1.id as station1_id, s1.name as station1_name,
           s2.id as station2_id, s2.name as station2_name,
           lines.id as line_id, lines.name as line_name
    FROM connections
           JOIN stations s1 ON s1.id = connections.station1_id
           JOIN stations s2 ON s2.id = connections.station2_id
           JOIN lines ON lines.id = connections.line_id
  `;
  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  })
});

app.post('/api/sessions', passport.authenticate('local'), (req, res) => {
  // extract password from user
  const {password, ...userWithoutPassword} = req.user;
  res.json(userWithoutPassword);
});

app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    const {password, ...userWithoutPassword} = req.user;
    res.json(userWithoutPassword);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Generate random start and end station
// Can be used only by logged-in users
app.get('/api/game/new', isLoggedIn, (req, res) => {
  let connections = [];
  let stations = [];
  // Get all connections
  db.all('SELECT * FROM connections', (err, conns) => {
    if (err) return res.status(500).json({ error: err.message });
    connections = conns;
    // Get all stations
    db.all('SELECT * FROM stations', (err, stats) => {
      if (err) return res.status(500).json({ error: err.message });
      stations = stats;
      // Choose a random start station id
      const randomStartStationId = stations[Math.floor(Math.random() * stations.length)].id;
      // Calculate all distances to this start station with bfs
      let distances = bfs(randomStartStationId, connections);
      // Choose a random end station id among stations with distances >= 3 to start station.
      const destinationIds = Object.entries(distances)
          .filter(([id, dist]) => dist >= 3)
          .map(([id, dist]) => id);
      const randomDestinationStationId = Number(destinationIds[Math.floor(Math.random() * destinationIds.length)]);
      res.json({start: randomStartStationId, end: randomDestinationStationId});
    });
  });
});

app.get('/api/events', isLoggedIn, (req, res) => {
  db.all('SELECT * FROM events', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/ranking', (req, res) => {
  const sql = `
    SELECT users.id as user_id, users.username as user_username,
           MAX(games.score) as user_max_score
    FROM users
    JOIN games ON games.user_id = users.id
    GROUP BY user_id
    ORDER BY user_max_score DESC
  `;
  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

