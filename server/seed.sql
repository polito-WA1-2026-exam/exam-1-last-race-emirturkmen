-- STATIONS (18 unique stations)
INSERT INTO stations (name) VALUES ('La Défense');    -- id: 1
INSERT INTO stations (name) VALUES ('Étoile');         -- id: 2
INSERT INTO stations (name) VALUES ('Opéra');          -- id: 3
INSERT INTO stations (name) VALUES ('Châtelet');       -- id: 4
INSERT INTO stations (name) VALUES ('Bastille');       -- id: 5
INSERT INTO stations (name) VALUES ('Vincennes');      -- id: 6
INSERT INTO stations (name) VALUES ('Clignancourt');   -- id: 7
INSERT INTO stations (name) VALUES ('Barbès');         -- id: 8
INSERT INTO stations (name) VALUES ('Strasbourg');     -- id: 9
INSERT INTO stations (name) VALUES ('Montparnasse');   -- id: 10
INSERT INTO stations (name) VALUES ('Montrouge');      -- id: 11
INSERT INTO stations (name) VALUES ('Trocadéro');      -- id: 12
INSERT INTO stations (name) VALUES ('Glacière');       -- id: 13
INSERT INTO stations (name) VALUES ('Gare de Lyon');   -- id: 14
INSERT INTO stations (name) VALUES ('Nation');         -- id: 15
INSERT INTO stations (name) VALUES ('Saint-Lazare');   -- id: 16
INSERT INTO stations (name) VALUES ('Tolbiac');        -- id: 17
INSERT INTO stations (name) VALUES ('Olympiades');     -- id: 18

-- LINES (4 hat)
INSERT INTO lines (name) VALUES ('Ligne 1');   -- id: 1
INSERT INTO lines (name) VALUES ('Ligne 2');   -- id: 2
INSERT INTO lines (name) VALUES ('Ligne 3');   -- id: 3
INSERT INTO lines (name) VALUES ('Ligne 4');  -- id: 4

-- LINE_STATIONS
-- Ligne 1: La Défense(1) → Étoile(2) → Opéra(3) → Châtelet(4) → Bastille(5) → Vincennes(6)
-- Ligne 2: Clignancourt(7) → Barbès(8) → Strasbourg(9) → Châtelet(4) → Montparnasse(10) → Montrouge(11)
-- Ligne 3: Étoile(2) → Trocadéro(12) → Montparnasse(10) → Glacière(13) → Gare de Lyon(14) → Nation(15)
-- Ligne 4: Saint-Lazare(16) → Opéra(3) → Châtelet(4) → Gare de Lyon(14) → Tolbiac(17) → Olympiades(18)


-- Ligne 1
INSERT INTO line_stations (line_id, station_id, position) VALUES (1, 1, 1);
INSERT INTO line_stations (line_id, station_id, position) VALUES (1, 2, 2);
INSERT INTO line_stations (line_id, station_id, position) VALUES (1, 3, 3);
INSERT INTO line_stations (line_id, station_id, position) VALUES (1, 4, 4);
INSERT INTO line_stations (line_id, station_id, position) VALUES (1, 5, 5);
INSERT INTO line_stations (line_id, station_id, position) VALUES (1, 6, 6);

-- Ligne 2
INSERT INTO line_stations (line_id, station_id, position) VALUES (2, 7, 1);
INSERT INTO line_stations (line_id, station_id, position) VALUES (2, 8, 2);
INSERT INTO line_stations (line_id, station_id, position) VALUES (2, 9, 3);
INSERT INTO line_stations (line_id, station_id, position) VALUES (2, 4, 4);
INSERT INTO line_stations (line_id, station_id, position) VALUES (2, 10, 5);
INSERT INTO line_stations (line_id, station_id, position) VALUES (2, 11, 6);

-- Ligne 3
INSERT INTO line_stations (line_id, station_id, position) VALUES (3, 2, 1);
INSERT INTO line_stations (line_id, station_id, position) VALUES (3, 12, 2);
INSERT INTO line_stations (line_id, station_id, position) VALUES (3, 10, 3);
INSERT INTO line_stations (line_id, station_id, position) VALUES (3, 13, 4);
INSERT INTO line_stations (line_id, station_id, position) VALUES (3, 14, 5);
INSERT INTO line_stations (line_id, station_id, position) VALUES (3, 15, 6);

-- Ligne 4
INSERT INTO line_stations (line_id, station_id, position) VALUES (4, 16, 1);
INSERT INTO line_stations (line_id, station_id, position) VALUES (4, 3, 2);
INSERT INTO line_stations (line_id, station_id, position) VALUES (4, 4, 3);
INSERT INTO line_stations (line_id, station_id, position) VALUES (4, 14, 4);
INSERT INTO line_stations (line_id, station_id, position) VALUES (4, 17, 5);
INSERT INTO line_stations (line_id, station_id, position) VALUES (4, 18, 6);

-- CONNECTIONS (komşu çiftler, her hat için)

-- Ligne 1
INSERT INTO connections (line_id, station1_id, station2_id) VALUES (1, 1, 2);
INSERT INTO connections (line_id, station1_id, station2_id) VALUES (1, 2, 3);
INSERT INTO connections (line_id, station1_id, station2_id) VALUES (1, 3, 4);
INSERT INTO connections (line_id, station1_id, station2_id) VALUES (1, 4, 5);
INSERT INTO connections (line_id, station1_id, station2_id) VALUES (1, 5, 6);

-- Ligne 2
INSERT INTO connections (line_id, station1_id, station2_id) VALUES (2, 7, 8);
INSERT INTO connections (line_id, station1_id, station2_id) VALUES (2, 8, 9);
INSERT INTO connections (line_id, station1_id, station2_id) VALUES (2, 9, 4);
INSERT INTO connections (line_id, station1_id, station2_id) VALUES (2, 4, 10);
INSERT INTO connections (line_id, station1_id, station2_id) VALUES (2, 10, 11);

-- Ligne 3
INSERT INTO connections (line_id, station1_id, station2_id) VALUES (3, 2, 12);
INSERT INTO connections (line_id, station1_id, station2_id) VALUES (3, 12, 10);
INSERT INTO connections (line_id, station1_id, station2_id) VALUES (3, 10, 13);
INSERT INTO connections (line_id, station1_id, station2_id) VALUES (3, 13, 14);
INSERT INTO connections (line_id, station1_id, station2_id) VALUES (3, 14, 15);

-- Ligne 4
INSERT INTO connections (line_id, station1_id, station2_id) VALUES (4, 16, 3);
INSERT INTO connections (line_id, station1_id, station2_id) VALUES (4, 3, 4);
INSERT INTO connections (line_id, station1_id, station2_id) VALUES (4, 4, 14);
INSERT INTO connections (line_id, station1_id, station2_id) VALUES (4, 14, 17);
INSERT INTO connections (line_id, station1_id, station2_id) VALUES (4, 17, 18);


-- EVENTS (8 different events)
-- =====================
INSERT INTO events (description, effect) VALUES ('Quiet journey, no incidents', 0);
INSERT INTO events (description, effect) VALUES ('Kind passenger gave you their seat', 1);
INSERT INTO events (description, effect) VALUES ('Found a coin on the floor', 2);
INSERT INTO events (description, effect) VALUES ('Street musician, great mood boost', 3);
INSERT INTO events (description, effect) VALUES ('Unexpected express service', 4);
INSERT INTO events (description, effect) VALUES ('Wrong platform, lost time', -1);
INSERT INTO events (description, effect) VALUES ('Pickpocket stole some coins', -2);
INSERT INTO events (description, effect) VALUES ('Train delay, missed connection', -3);
INSERT INTO events (description, effect) VALUES ('Barrier malfunction, paid twice', -4);

-- =====================
-- USERS (3 username, bcrypt hash - password: "password123")
-- =====================
INSERT INTO users (username, password) VALUES ('alice', '$2b$10$KPRGVDVFgd4NwKRbWUBdPedBLhL/Hx8mIHGhzeU/6h/HdN46uEsJm');
INSERT INTO users (username, password) VALUES ('bob', '$2b$10$KPRGVDVFgd4NwKRbWUBdPedBLhL/Hx8mIHGhzeU/6h/HdN46uEsJm');
INSERT INTO users (username, password) VALUES ('charlie', '$2b$10$KPRGVDVFgd4NwKRbWUBdPedBLhL/Hx8mIHGhzeU/6h/HdN46uEsJm');

-- GAMES (alice and bob's games)
-- =====================
INSERT INTO games (user_id, start_station_id, end_station_id, score, is_valid, played_at)
VALUES (1, 1, 15, 18, 1, '2026-06-01 10:00:00');

INSERT INTO games (user_id, start_station_id, end_station_id, score, is_valid, played_at)
VALUES (1, 7, 18, 14, 1, '2026-06-02 11:00:00');

INSERT INTO games (user_id, start_station_id, end_station_id, score, is_valid, played_at)
VALUES (2, 16, 6, 22, 1, '2026-06-01 15:00:00');

INSERT INTO games (user_id, start_station_id, end_station_id, score, is_valid, played_at)
VALUES (2, 1, 11, 0, 0, '2026-06-02 09:00:00');