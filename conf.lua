-- LÖVE configuration
-- https://love2d.org/wiki/Config_Files

function love.conf(t)
	t.identity = "smolbot"        -- save directory name
	t.version = "11.5"            -- LÖVE version this game was made for
	t.console = false             -- attach console (Windows only, handy for print debugging)

	t.window.title = "smolbot"
	t.window.width = 960
	t.window.height = 540
	t.window.resizable = true
	t.window.vsync = 1

	-- Disable unused modules to keep startup lean.
	t.modules.joystick = false
	t.modules.physics = false
	t.modules.video = false
end
