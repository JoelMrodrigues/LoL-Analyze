@echo off
echo Creating backend directory structure...

cd backend

echo Creating directories...
mkdir routes
mkdir models  
mkdir services
mkdir middleware

echo Creating empty files...
echo. > routes\auth.js
echo. > routes\riot.js
echo. > routes\teams.js
echo. > routes\users.js
echo. > models\User.js
echo. > models\Team.js
echo. > services\riotService.js
echo. > middleware\auth.js
echo. > middleware\errorHandler.js

echo Backend structure created!
echo Now copy the code from the artifacts into each file.
pause