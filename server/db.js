import sqlite from 'sqlite3';
// Open the connection with db
const db = new sqlite.Database('lastrace.sqlite', (err) => {
    if (err) throw err;
});

//
db.run('PRAGMA foreign_keys = ON', (err) => {
    if (err) throw err;
})
export default db;