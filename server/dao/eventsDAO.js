import db from '../db.js';

const eventsDAO = {
  getEvents: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM events', (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
};

export default eventsDAO;
