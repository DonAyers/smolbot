-- Player: a simple controllable rectangle with platformer-style physics.
-- Intentionally minimal -- this is the seed for a side-scrolling character.

local Player = {}
Player.__index = Player

local SPEED = 220
local GRAVITY = 1400
local JUMP_VELOCITY = -520

function Player.new(x, y)
	local self = setmetatable({}, Player)
	self.x = x
	self.y = y
	self.width = 32
	self.height = 48
	self.vx = 0
	self.vy = 0
	self.onGround = false
	return self
end

function Player:update(dt, groundY)
	self.vx = 0
	if love.keyboard.isDown("left", "a") then
		self.vx = self.vx - SPEED
	end
	if love.keyboard.isDown("right", "d") then
		self.vx = self.vx + SPEED
	end

	if (love.keyboard.isDown("space", "w") or love.keyboard.isDown("up")) and self.onGround then
		self.vy = JUMP_VELOCITY
		self.onGround = false
	end

	self.vy = self.vy + GRAVITY * dt

	self.x = self.x + self.vx * dt
	self.y = self.y + self.vy * dt

	if self.y >= groundY then
		self.y = groundY
		self.vy = 0
		self.onGround = true
	end
end

function Player:draw()
	love.graphics.setColor(0.85, 0.2, 0.2, 1)
	love.graphics.rectangle("fill", self.x, self.y, self.width, self.height)
end

return Player
