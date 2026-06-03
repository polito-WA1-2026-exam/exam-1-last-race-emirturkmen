CREATE TABLE IF NOT EXISTS stations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    effect INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      username TEXT NOT NULL,
                                      password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS line_stations (
                                             line_id INTEGER NOT NULL,
                                             station_id INTEGER NOT NULL,
                                             position INTEGER NOT NULL,
                                             FOREIGN KEY (line_id) REFERENCES lines(id),
    FOREIGN KEY (station_id) REFERENCES stations(id)
    );

CREATE TABLE IF NOT EXISTS connections (
                                           id INTEGER PRIMARY KEY AUTOINCREMENT,
                                             line_id INTEGER NOT NULL,
                                             station1_id INTEGER NOT NULL,
                                             station2_id INTEGER NOT NULL,
                                             FOREIGN KEY (line_id) REFERENCES lines(id),
    FOREIGN KEY (station1_id) REFERENCES stations(id),
    FOREIGN KEY (station2_id) REFERENCES stations(id)
    );

CREATE TABLE IF NOT EXISTS games (
                                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                                           user_id INTEGER NOT NULL,
                                           start_station_id INTEGER NOT NULL,
                                           end_station_id INTEGER NOT NULL,
                                           score INTEGER NOT NULL,
                                           is_valid INTEGER NOT NULL,
                                           played_at TEXT NOT NULL,
                                           FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (start_station_id) REFERENCES stations(id),
    FOREIGN KEY (end_station_id) REFERENCES stations(id)
    );

CREATE TABLE IF NOT EXISTS game_segments (
                                             id INTEGER PRIMARY KEY AUTOINCREMENT,
                                             game_id INTEGER NOT NULL,
                                             connection_id INTEGER NOT NULL,
                                             order_index INTEGER NOT NULL,
                                             FOREIGN KEY (game_id) REFERENCES games(id),
    FOREIGN KEY (connection_id) REFERENCES connections(id)
    );

