# If Only I Knew

A deck of history: one card from history, five minutes a day. Short illustrated stories,
read-aloud narration, a quick quiz on each card, collectible cards and a family scoreboard.

## How it fits together

- `index.html` – page layout and styles
- `decks.js` – all the card content (decks, stories, quizzes, chapter pictures and artwork)
- `app.js` – app logic, generated deck artwork, and the family scoreboard (Firebase)
- `sw.js`, `manifest.webmanifest`, `icon-*.png` – lets people add it to their home screen and use it offline

## Family scoreboard

Players type their first name and a family code. Scores and requests are stored in
Firebase (Firestore) under `families/<code>/`. Security rules only let each player change
their own scores. Only first names and scores are stored.

## Adding a deck

Add the new cards to `STORIES`, `PICS` and `SCENES` in `decks.js`, then add the deck to `PATHS`.
Every quiz answer must be stated in that card's chapters.
