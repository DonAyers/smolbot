@echo off
echo Copying robot assets...
copy /Y "kenney_robot-pack\PNG\Side view\robot_blueBody.png" "public\assets\images\robot-idle.png"
copy /Y "kenney_robot-pack\PNG\Side view\robot_blueDrive1.png" "public\assets\images\robot-walk-1.png"
copy /Y "kenney_robot-pack\PNG\Side view\robot_blueDrive2.png" "public\assets\images\robot-walk-2.png"
copy /Y "kenney_robot-pack\PNG\Side view\robot_blueJump.png" "public\assets\images\robot-jump.png"
copy /Y "kenney_robot-pack\PNG\Side view\robot_blueHurt.png" "public\assets\images\robot-fall.png"

echo.
echo Copying platform tiles...
copy /Y "kenney_pixel-platformer\Tiles\tile_0000.png" "public\assets\images\tile-grass.png"
copy /Y "kenney_pixel-platformer\Tiles\tile_0001.png" "public\assets\images\tile-dirt.png"

echo.
echo Assets copied successfully!
pause
