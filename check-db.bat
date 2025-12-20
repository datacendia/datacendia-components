@echo off
echo === RUNNING CONTAINERS ===
docker ps
echo.
echo === LISTENING PORTS ===
netstat -an | findstr "5432 5433 5434 6379 6380"
echo.
echo === DONE ===
