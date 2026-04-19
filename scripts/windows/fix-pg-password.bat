@echo off
docker exec -e PGPASSWORD=cendia cendia-postgres psql -U cendia -d postgres -c "ALTER USER cendia WITH PASSWORD 'cendia_sovereign_2025';"
