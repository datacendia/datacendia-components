# POSTGRESQL HIGH AVAILABILITY DEPLOYMENT
**Step-by-step guide to deploy HA cluster**

---

## CURRENT STATUS

**Single Instance:**
- Container: datacendia-postgres
- Port: 5433 (mapped to 5432 internal)
- Status: Running for 6 days

**To Deploy HA:**
- Primary + Replica + PgPool
- Automatic failover
- 99.9% uptime

---

## DEPLOYMENT STEPS

### Step 1: Stop Current Backend
```powershell
# In backend terminal, press Ctrl+C
```

### Step 2: Deploy HA Cluster
```powershell
docker-compose -f docker-compose.ha.yml up -d
```

**What this creates:**
- `datacendia-postgres-primary` (port 5434)
- `datacendia-postgres-replica` (port 5435)
- `datacendia-pgpool` (port 5432) - Load balancer

### Step 3: Wait for Replication
```powershell
# Check status
docker-compose -f docker-compose.ha.yml ps

# Should show all 3 containers running
# Wait 30 seconds for replica to sync
```

### Step 4: Update Backend Configuration
```powershell
# Edit backend/.env
# Change DATABASE_URL to use PgPool:
DATABASE_URL=postgresql://cendia:cendia_sovereign_2025@localhost:5432/datacendia
```

### Step 5: Restart Backend
```powershell
cd backend
npm run dev
```

### Step 6: Verify Connection
```powershell
# Backend should start without errors
# Check health endpoint
curl http://localhost:3001/api/v1/health
```

---

## VERIFY HA IS WORKING

### Check Replication Status
```powershell
docker exec datacendia-postgres-primary sh -c 'PGPASSWORD=$POSTGRES_PASSWORD psql -U $POSTGRES_USER $POSTGRES_DB -c "SELECT * FROM pg_stat_replication;"'
```

**Should show:**
- 1 row with replica connection
- State: streaming
- Sync state: async

### Test Failover
```powershell
# 1. Stop primary database
docker stop datacendia-postgres-primary

# 2. Verify backend still works
curl http://localhost:3001/api/v1/health
# Should return 200 OK (using replica)

# 3. Check PgPool status
docker logs datacendia-pgpool --tail=20
# Should show failover to replica

# 4. Restart primary (becomes new replica)
docker start datacendia-postgres-primary
```

---

## ROLLBACK TO SINGLE INSTANCE

If HA causes issues:

```powershell
# 1. Stop HA cluster
docker-compose -f docker-compose.ha.yml down

# 2. Restore original DATABASE_URL in backend/.env
DATABASE_URL=postgresql://datacendia:datacendia_secure_2024@localhost:5433/datacendia

# 3. Restart backend
cd backend
npm run dev
```

---

## MONITORING HA CLUSTER

### PgPool Admin Interface
```
URL: http://localhost:9999
Username: admin
Password: datacendia2024
```

**Shows:**
- Backend node status
- Connection pool statistics
- Load balancing metrics

### Check Replication Lag
```sql
SELECT
  client_addr,
  state,
  sent_lsn,
  write_lsn,
  replay_lsn,
  pg_wal_lsn_diff(sent_lsn, replay_lsn) AS lag_bytes
FROM pg_stat_replication;
```

**Healthy lag:** < 1 MB

---

## BENEFITS OF HA

✅ **Zero Downtime:** Replica takes over if primary fails  
✅ **Load Balancing:** Read queries distributed across nodes  
✅ **Data Protection:** Real-time replication  
✅ **Automatic Failover:** No manual intervention needed  
✅ **99.9% Uptime:** Industry-standard reliability  

---

## COST

**Infrastructure:** $0 (Docker on your machine)  
**Disk Space:** 2x database size (primary + replica)  
**RAM:** ~1 GB additional  
**CPU:** Minimal overhead  

---

## PRODUCTION RECOMMENDATIONS

**For Production Deployment:**
1. Use managed database (AWS RDS, Azure Database, Google Cloud SQL)
2. Multi-region replication
3. Automated backups
4. Point-in-time recovery
5. Read replicas for scaling

**Managed DB Costs:**
- AWS RDS: ~$200/month
- Azure Database: ~$180/month
- Google Cloud SQL: ~$190/month

**Benefits:**
- 99.95% uptime SLA
- Automated backups
- Automated failover
- Monitoring included
- Support included

---

**HA cluster setup is ready to deploy. All configuration files created.**
