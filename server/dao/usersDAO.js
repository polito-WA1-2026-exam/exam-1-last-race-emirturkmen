import db from '../db.js';
import bcrypt from 'bcrypt';

const usersDAO = {
  getUserByUsername: (username) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) return reject(err);
        resolve(user);
      });
    });
  },

  getUserById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
        if (err) return reject(err);
        resolve(user);
      });
    });
  },

  verifyPassword: (password, hash) => {
    return bcrypt.compare(password, hash);
  },
};

export default usersDAO;
