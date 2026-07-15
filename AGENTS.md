# Agent notes for smolbot

This is a LÖVE 2D side-scroller, built incrementally as a learning project.
Keep changes small, playable, and easy to review.

## Running & verifying changes

- Run the game with `love .` from the project root. There is no automated
  way to visually confirm rendering from an agent session — describe what
  changed and let the human verify visually when a change affects rendering
  or feel (jump height, speed, etc.).
- Lint with `luacheck .` before considering a change done, if luacheck is
  available.
- If tests exist under `tests/` (busted-style), run them with `busted`.

## Code conventions

- `main.lua` stays thin: only `love.*` callback wiring. All actual game
  logic belongs in `src/` modules.
- Each `src/` module returns a table (usually with a constructor like
  `Module.new(...)`), following the pattern in `src/player.lua`.
- Use tabs for indentation (matches existing files).
- Prefer explicit, small modules over growing `main.lua` or any single file
  too large. Split out `src/camera.lua`, `src/level.lua`, `src/enemy.lua`,
  etc. as those systems are introduced.
- Constants (speed, gravity, jump velocity, etc.) live as local upvalues at
  the top of the module that owns them, in `SCREAMING_SNAKE_CASE`.
- Don't add third-party libraries under `libs/` without noting why in the
  commit message — prefer hand-rolled solutions while this is a learning
  project, unless a library meaningfully unblocks progress (e.g. a proper
  ECS, camera, or tilemap loader once the project outgrows hand-rolled code).

## Assets

- Sprites go in `assets/sprites/`, audio in `assets/audio/`. Reference them
  via relative paths from project root (e.g. `"assets/sprites/hero.png"`).
- Keep placeholder art (colored rectangles) until real art is ready rather
  than blocking gameplay work on asset creation.
- New sprite/animation art should be generated with `pixegen`
  (github.com/DonAyers/pixegen, cloned as a sibling directory next to
  `smolbot`, e.g. `../pixegen`) using its `love2d` export format -- see the
  "Art pipeline" section in `README.md` for the exact command shape and a
  known transparency quirk to watch for. Load the resulting `.lua` sheet
  data with `require()` the way `src/player.lua` does, rather than hardcoding
  quad rects by hand.

## Git

- The `main` branch is kept clean; commit early and often in small,
  reviewable chunks as features land.
- Follow standard imperative-mood, concise commit messages (see the user's
  global commit conventions).
