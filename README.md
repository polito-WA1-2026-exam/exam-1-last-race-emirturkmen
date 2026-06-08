# Exam #1: "Last Race"
## Student: s353921 TURKMEN EMIR 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

* GET `/api/network`
   * Request: none
   * Response: array of lines with nested stations `[{ id, name, stations: [{id, name}] }]`

* GET `/api/connections`
   * Request: none
   * Response: array of segments `[{ id, station1_id, station1_name, station2_id, station2_name, line_id, line_name }]`

* GET `/api/events`
   * Request: none (requires login)
   * Response: array of events `[{ id, description, effect }]`

* GET `/api/ranking`
   * Request: none
   * Response: array of users with best score `[{ user_id, user_username, user_max_score }]`

* GET `/api/game/new`
   * Request: none (requires login)
   * Response: randomly assigned start and destination stations `{ start: id, end: id }`

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

- Table `users` - contains xx yy zz
- Table `something` - contains ww qq ss
- ...

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)

## Use of AI Tools
Briefly describe whether you used any AI tools (e.g., ChatGPT, GitHub Copilot, Claude) while working on this project, for which purposes (e.g., clarifying concepts, debugging, generating code), and how you verified or adapted their output.
If you did not use any AI tools, simply state so.
