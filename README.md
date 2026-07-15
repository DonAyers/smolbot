# smolbot

A 2D side-scroller built with [LÖVE](https://love2d.org/), started as a
learning project for the engine.

## Requirements

- [LÖVE 11.5](https://love2d.org/) (`love`)
- Lua 5.1/LuaJIT (bundled with LÖVE, no separate install needed to run the game)
- Optional, for linting: [luacheck](https://github.com/mpeterv/luacheck)

## Running the game

From the project root:

```sh
love .
```

## Controls

- `A` / `Left`: move left
- `D` / `Right`: move right
- `Space` / `W` / `Up`: jump
- `Escape`: quit

## Project structure

```
smolbot/
├── main.lua          entry point, love callbacks only
├── conf.lua          love window/module configuration
├── src/              game logic (modules required from main.lua)
│   └── player.lua
├── assets/
│   ├── sprites/       images/spritesheets
│   └── audio/         sfx/music
├── libs/             third-party Lua libraries (vendored)
└── tests/            automated tests (busted)
```

## Art pipeline

Sprite art is generated with [pixegen](https://github.com/DonAyers/pixegen), a
separate sibling tool (clone it next to `smolbot`, not inside it) that turns
text prompts into retro pixel-art sprites and exports directly to LÖVE's
`.lua` quad/animation format.

```sh
cd ../pixegen
npm install
cp .env.example .env   # add POLLINATIONS_API_KEY

node --env-file=.env bin/pixegen.js sheet "a knight with a sword" \
  --anim walk --view side --recipe nes-classic -s 32x48 \
  --format love2d --name knight -o ../smolbot/assets/sprites/knight-walk/
```

This writes a packed sprite sheet PNG plus a `.lua` file with quad rects,
per-frame durations, and animation tables -- see `src/player.lua` for how to
`require()` and draw from it (frame pivots are bottom-center by default, so
they line up with a `self.x, self.y` top-left collision rect the same size
as the sprite).

**Known quirk:** the default model doesn't always return real alpha
transparency for `--recipe nes-classic`, even though it's requested --
sometimes you get an opaque near-white background instead. If that happens,
chroma-key it out with a short `pngjs` script (sample the most frequent
color in the image, zero the alpha of close matches) before dropping the
PNG into `assets/sprites/`. Worth raising upstream in `pixegen` if it keeps
recurring.

## Viewing over the network (headless machines)

If you're running on a headless Linux box and want to view the game from
another computer on the same LAN, use `scripts/serve-vnc.sh`. It starts a
virtual display with `Xvnc` (from `tigervnc`) and points `love` at it, so
any VNC client can connect and see the game window.

```sh
# one-time setup: install tigervnc, then set a VNC password.
# Replace CHOOSE_YOUR_OWN_PASSWORD below with a real password -- do not
# run this command verbatim, it is a template, not a literal value.
printf 'CHOOSE_YOUR_OWN_PASSWORD\n' | vncpasswd -f > ~/.vnc/passwd

# start serving
scripts/serve-vnc.sh          # display :1, 5901, 1000x600
```

Then connect a VNC client to `THIS_MACHINES_LAN_IP:5901` using the password
you set above (replace `THIS_MACHINES_LAN_IP` with this machine's actual
LAN address, e.g. from `ip -4 addr`).

## Linting

```sh
luacheck .
```

## Roadmap

This starts intentionally minimal: a single controllable rectangle with
gravity and jumping. Next steps as this grows into a real side-scroller:

- [ ] Camera that follows the player
- [ ] Tile-based level loading
- [x] Sprite animation (replace rectangle with real art) -- player walk
      cycle generated via `pixegen`, see "Art pipeline" above
- [ ] Enemies / hazards
- [ ] Scrolling parallax background
- [ ] Sound effects and music
- [ ] Packaging a distributable `.love` file

See `AGENTS.md` for conventions to follow when extending this project
with agent assistance.
