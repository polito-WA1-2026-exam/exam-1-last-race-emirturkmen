import db from '../db.js';

const gamesDAO = {
  createGame: (userId, startId, endId, score, isValid) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO games (user_id, start_station_id, end_station_id, score, is_valid) VALUES (?, ?, ?, ?, ?)',
        [userId, startId, endId, score, isValid ? 1 : 0],
        function (err) {
          if (err) return reject(err);
          resolve(this.lastID);
        }
      );
    });
  },

  createGameSegment: (gameId, connectionId, orderIndex) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO game_segments (game_id, connection_id, order_index) VALUES (?, ?, ?)',
        [gameId, connectionId, orderIndex],
        function (err) {
          if (err) return reject(err);
          resolve(this.lastID);
        }
      );
    });
  },

  getConnectionsByIds: (segmentIds) => {
    return new Promise((resolve, reject) => {
      if (segmentIds.length === 0) return resolve([]);
      const placeholders = segmentIds.map(() => '?').join(', ');
      db.all(`SELECT * FROM connections WHERE id IN (${placeholders})`, segmentIds, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  getRanking: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT users.id as user_id, users.username as user_username,
               MAX(games.score) as user_max_score
        FROM users
        JOIN games ON games.user_id = users.id
        GROUP BY user_id
        ORDER BY user_max_score DESC
      `;
      db.all(sql, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
};

export default gamesDAO;
