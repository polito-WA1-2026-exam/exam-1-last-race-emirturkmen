import sqlite from 'sqlite3';
import fs from 'fs';
// Open the connection with db
const db = new sqlite.Database('lastrace.sqlite', (err) => {
    if (err) throw err;
});

// Enable foreign key constraints
db.run('PRAGMA foreign_keys = ON', (err) => {
    if (err) throw err;
});

// Read schema.sql file
const sql = fs.readFileSync('schema.sql', 'utf8');

// Execute sql commands in schema.sql
db.exec(sql, (err) => {
    if (err) throw err;
    console.log('Schema created');

    const seedSql = fs.readFileSync('seed.sql', 'utf8');
    db.exec(seedSql, (err) => {
        if (err) throw err;
        console.log("Seed created successfully.");
    })
});


export default db;