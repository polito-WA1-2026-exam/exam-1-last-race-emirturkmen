import db from '../db.js';

const networkDAO = {
  getSegments: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT segments.id,
               s1.id as station1_id, s1.name as station1_name,
               s2.id as station2_id, s2.name as station2_name,
               lines.id as line_id, lines.name as line_name
        FROM segments
               JOIN stations s1 ON s1.id = segments.station1_id
               JOIN stations s2 ON s2.id = segments.station2_id
               JOIN lines ON lines.id = segments.line_id
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
