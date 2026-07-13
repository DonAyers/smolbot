-- smolbot: entry point
--
-- Keeps main.lua as a thin shell: wire up love callbacks and delegate to
-- src modules. Game logic should live under src/, not here.

local Player = require("src.player")

local player
local groundY

function love.load()
	love.graphics.setDefaultFilter("nearest", "nearest")
	love.graphics.setBackgroundColor(0.53, 0.8, 0.92, 1)

	groundY = love.graphics.getHeight() - 64
	player = Player.new(100, groundY)
end

function love.update(dt)
	player:update(dt, groundY)
end

function love.draw()
	local w, h = love.graphics.getDimensions()

	-- ground
	love.graphics.setColor(0.2, 0.6, 0.2, 1)
	love.graphics.rectangle("fill", 0, groundY + player.height, w, h - (groundY + player.height))

	player:draw()

	love.graphics.setColor(1, 1, 1, 1)
	love.graphics.print("arrows/AD to move, space/W to jump", 10, 10)
end

function love.keypressed(key)
	if key == "escape" then
		love.event.quit()
	end
end
