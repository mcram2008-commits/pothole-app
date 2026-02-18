@echo off
cd client
echo Installing dependencies...
call npm install
call npm install axios react-router-dom leaflet react-leaflet lucide-react
call npm install -D tailwindcss postcss autoprefixer
call npx tailwindcss init -p
echo Done with client setup!
