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
const schemaSql = fs.readFileSync('schema.sql', 'utf8');

// Execute sql commands in schema.sql
db.exec(schemaSql, (err) => {
    if (err) throw err;
    console.log('Schema created');
    // Run seed only if table is empty
    db.get('SELECT COUNT(*) as count FROM stations', (err, row) => {
        if (err) throw err;
        if (row.count === 0) {
            const seedSql = fs.readFileSync('seed.sql', 'utf8');
            db.exec(seedSql, (err) => {
                if (err) throw err;
                console.log('Seed created successfully.');
            });
        } else {
            console.log('Database already seeded, skipping.');
        }
    });
});



export default db;