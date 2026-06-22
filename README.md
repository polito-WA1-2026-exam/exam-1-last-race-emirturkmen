# Exam #1: "Last Race"
## Student: s353921 TURKMEN EMIR 

## React Client Application Routes

- Route `/`: home page. Shows the rules and how the game works, plus a button on the right of the title that leads to `/play` (when logged in) or `/login` (when not).
- Route `/login`: login form (username and password).
- Route `/play`: the game itself. A single page that walks through the game phases with local state — Setup (network map), Planning (build the route), Execution (reveal events and score), Result (final score). Accessible only to logged-in users; guests are redirected to `/login`.
- Route `/ranking`: leaderboard with each user's best score. Accessible only to logged-in users; guests are redirected to `/login`.

## API Server

* GET `/api/connections`
   * Request: none (requires login)
   * Response: array of segments `[{ id, station1_id, station1_name, station2_id, station2_name, line_id, line_name }]`

* GET `/api/game/new`
   * Request: none (requires login)
   * Response: randomly assigned start and destination stations (the destination is at least 3 stops away) `{ start: id, startName, end: id, endName }`

* POST `/api/games`
   * Request body: `{ startId, endId, segments: [connectionId, ...] }` (the ordered list of selected connection ids; requires login)
   * Response (valid route): `{ valid: true, finalScore, events: [{ id, description, effect }, ...] }`
   * Response (invalid route): `{ valid: false, score: 0 }`
   * The route is validated server-side: segments are undirected, must form a continuous path from `startId` to `endId`, and line changes are only allowed at interchange stations. The game (and its segments) is saved to the database in both cases.

* GET `/api/ranking`
   * Request: none (requires login)
   * Response: array of users with their best score `[{ user_id, user_username, user_max_score }]`

* POST `/api/sessions`
   * Request body: `{ username, password }`
   * Response: logged in user `{ id, username }`

* GET `/api/sessions/current`
   * Request: none
   * Response: current user `{ id, username }` or `401` if not authenticated

* DELETE `/api/sessions/current`
   * Request: none
   * Response: empty (logout)

## Database Tables

* Table `stations` - contains `id`, `name`
* Table `lines` - contains `id`, `name`
* Table `line_stations` - contains `line_id`, `station_id`, `position` (order of station on the line)
* Table `connections` - contains `id`, `line_id`, `station1_id`, `station2_id` (an undirected segment between two stations on a line)
* Table `events` - contains `id`, `description`, `effect` (integer from -4 to +4)
* Table `users` - contains `id`, `username`, `password` (bcrypt hashed)
* Table `games` - contains `id`, `user_id`, `start_station_id`, `end_station_id`, `score`, `is_valid`, `played_at`
* Table `game_segments` - contains `id`, `game_id`, `connection_id`, `order_index`

## Main React Components

- `NavigationBar` (in `components/NavigationBar.jsx`): top navbar; always shows Home, shows Play and Ranking only when logged in, highlights the active route, and handles login/logout.
- `HomePage` (in `pages/HomePage.jsx`): rules and game phases, with the entry button (Play Now / Login to Play) next to the title.
- `LoginPage` (in `pages/LoginPage.jsx`): login form; submits on Enter and disables the button until both fields are filled.
- `PlayPage` (in `pages/PlayPage.jsx`): orchestrates the game phases (setup → planning → execution → result) with local state and guards the route against non-logged-in users.
- `Setup` (in `components/Setup.jsx`): shows the full network map before the player starts planning.
- `Planning` (in `components/Planning.jsx`): 90-second timer; builds the route by selecting only the segments reachable from the current (last reached) station, supports undo/reset, and shows a station map for reference.
- `Execution` (in `components/Execution.jsx`): submits the route, then reveals each segment's random event one by one, updating the live score and a progress bar.
- `Result` (in `components/Result.jsx`): final score (or invalid-route message) with "Play Again" and "View Ranking".
- `RankingPage` (in `pages/RankingPage.jsx`): leaderboard with medals for the top three and the logged-in user's row highlighted.
- `AuthContext` (in `context/AuthContext.jsx`): holds the logged-in user and restores the session from the server on page load.

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- alice, password123
- bob, password123
- charlie, password123

## Use of AI Tools
Briefly describe whether you used any AI tools (e.g., ChatGPT, GitHub Copilot, Claude) while working on this project, for which purposes (e.g., clarifying concepts, debugging, generating code), and how you verified or adapted their output.
If you did not use any AI tools, simply state so.
