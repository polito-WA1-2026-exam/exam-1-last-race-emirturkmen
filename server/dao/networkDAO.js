import db from '../db.js';

const networkDAO = {
  getNetwork: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT lines.id as line_id, lines.name as line_name,
               stations.id as station_id, stations.name as station_name
        FROM lines
        JOIN line_stations ON lines.id = line_stations.line_id
        JOIN stations ON stations.id = line_stations.station_id
        ORDER BY lines.id, line_stations.position
      `;
      db.all(sql, (err, rows) => {
        if (err) return reject(err);

        const lines = [];
        for (const row of rows) {
          let line = lines.find(l => l.id === row.line_id);
          if (!line) {
            line = { id: row.line_id, name: row.line_name, stations: [] };
            lines.push(line);
          }
          line.stations.push({ id: row.station_id, name: row.station_name });
        }
        resolve(lines);
      });
    });
  },

  getConnections: () => {
    return new Promise((resolve, reject) => {
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
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  getStations: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM stations', (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  getLineStations: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM line_stations', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
};

export default networkDAO;
