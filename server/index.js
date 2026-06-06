// imports
import express from "express";
import cors from "cors";
import morgan from "morgan";
import db from "./db.js";

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
})