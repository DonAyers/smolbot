#!/usr/bin/env bash
# Run smolbot on a virtual VNC display so it can be viewed from another
# machine on the LAN. Requires `tigervnc` (for the `Xvnc` binary) and
# `love` to be installed, and a VNC password already set at ~/.vnc/passwd
# (create one with: printf '<password>\n' | vncpasswd -f > ~/.vnc/passwd).
#
# Usage: scripts/serve-vnc.sh [display] [geometry]
#   scripts/serve-vnc.sh          # uses :1, 1000x600
#   scripts/serve-vnc.sh :2 1280x720

set -euo pipefail

DISPLAY_NUM="${1:-:1}"
GEOMETRY="${2:-1000x600}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VNC_PASSWD="${HOME}/.vnc/passwd"

if [ ! -f "$VNC_PASSWD" ]; then
	echo "No VNC password file found at $VNC_PASSWD" >&2
	echo "Create one with: printf '<password>\\n' | vncpasswd -f > $VNC_PASSWD" >&2
	exit 1
fi

echo "Starting Xvnc on display $DISPLAY_NUM ($GEOMETRY)..."
Xvnc "$DISPLAY_NUM" -geometry "$GEOMETRY" -depth 24 \
	-rfbauth "$VNC_PASSWD" -SecurityTypes VncAuth -localhost=0 &
XVNC_PID=$!

# Give Xvnc a moment to start listening before pointing love at it.
sleep 1

echo "Starting love on display $DISPLAY_NUM..."
DISPLAY="$DISPLAY_NUM" love "$PROJECT_ROOT" &
LOVE_PID=$!

RFB_PORT=$((5900 + ${DISPLAY_NUM#:}))
echo "Game is running. Connect a VNC client to this machine on port $RFB_PORT."
echo "Press Ctrl+C to stop both the game and the virtual display."

trap 'kill "$LOVE_PID" "$XVNC_PID" 2>/dev/null' EXIT
wait "$LOVE_PID"
