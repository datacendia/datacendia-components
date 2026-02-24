# SOP-010: Redis Cache Management

**Category:** Operations
**Priority:** High
**Owner:** Engineering Lead
**Last Verified:** 2026-02-22 (against `backend/src/config/index.ts`, `docker-compose.dev.yml`)

---

## 1. Purpose

Define procedures for managing Redis cache operations including configuration, monitoring, troubleshooting, and cache invalidation for the Datacendia platform.

---

## 2. Redis Architecture

| Component | Purpose | TTL |
|-----------|---------|-----|
| Session cache | JWT session state | 1 hour (matches token expiry) |
| DCII cache | IISS scores, assessments | Write-through (no TTL, synced with DB) |
| Rate limiting | API rate limit counters | Sliding window (1 min / 1 hr) |
| Real-time data | WebSocket state, live feeds | Ephemeral |
| Queue | Background job queue | Until processed |

---

## 3. Connection Configuration

### 3.1 Default Development
| Setting | Value |
|---------|-------|
| Host | `localhost` |
| Port | `6380` (NOT default 6379) |
| Password | `datacendia_redis_2024` |
| URL | `redis://:datacendia_redis_2024@localhost:6380` |

**Important:** Datacendia uses port **6380** to avoid conflicts with any system Redis on default port 6379.

### 3.2 Environment Variables
```env
REDIS_URL=redis://:datacendia_redis_2024@localhost:6380
# OR individual settings:
REDIS_HOST=localhost
REDIS_PORT=6380
REDIS_PASSWORD=datacendia_redis_2024
```

### 3.3 Auto-Construction Logic
If `REDIS_URL` is not set, the backend constructs it from `REDIS_HOST`, `REDIS_PORT`, and `REDIS_PASSWORD` (`backend/src/config/index.ts`).

---

## 4. Operations

### 4.1 Start Redis (Docker)
```bash
docker-compose -f docker-compose.dev.yml up -d redis
```

### 4.2 Connect to Redis CLI
```bash
# Via Docker
docker exec -it datacendia-redis redis-cli -a datacendia_redis_2024

# Direct
redis-cli -p 6380 -a datacendia_redis_2024
```

### 4.3 Health Check
```bash
redis-cli -p 6380 -a datacendia_redis_2024 ping
# Expected: PONG

redis-cli -p 6380 -a datacendia_redis_2024 info server
```

### 4.4 Monitor Commands (Live)
```bash
redis-cli -p 6380 -a datacendia_redis_2024 monitor
```

---

## 5. Cache Invalidation

### 5.1 Flush All Cache (Development Only)
```bash
redis-cli -p 6380 -a datacendia_redis_2024 FLUSHALL
```
**WARNING:** Clears all sessions, rate limits, and cached data.

### 5.2 Flush Specific Namespace
```bash
# Find keys by pattern
redis-cli -p 6380 -a datacendia_redis_2024 KEYS "dcii:*"

# Delete specific keys
redis-cli -p 6380 -a datacendia_redis_2024 DEL "dcii:iiss:org_123"
```

### 5.3 Invalidate User Sessions
```bash
# Delete all session keys
redis-cli -p 6380 -a datacendia_redis_2024 KEYS "session:*" | xargs redis-cli -p 6380 -a datacendia_redis_2024 DEL
```

---

## 6. Monitoring

### 6.1 Memory Usage
```bash
redis-cli -p 6380 -a datacendia_redis_2024 info memory
```

### 6.2 Key Statistics
```bash
redis-cli -p 6380 -a datacendia_redis_2024 info keyspace
redis-cli -p 6380 -a datacendia_redis_2024 DBSIZE
```

### 6.3 Slow Log
```bash
redis-cli -p 6380 -a datacendia_redis_2024 SLOWLOG GET 10
```

---

## 7. Backup & Persistence

### 7.1 Manual Snapshot
```bash
redis-cli -p 6380 -a datacendia_redis_2024 BGSAVE
```

### 7.2 RDB File Location
Default: `/data/dump.rdb` inside the Docker container.

### 7.3 Restore
1. Stop Redis
2. Replace `dump.rdb` with backup
3. Start Redis

---

## 8. Troubleshooting

| Issue | Cause | Resolution |
|-------|-------|------------|
| `ECONNREFUSED` on port 6380 | Redis not running | Start Docker: `docker-compose -f docker-compose.dev.yml up -d redis` |
| `NOAUTH` error | Missing password | Include `-a datacendia_redis_2024` or set `REDIS_PASSWORD` |
| `OOM command not allowed` | Memory limit reached | Increase `maxmemory` or flush stale keys |
| Slow responses | Large keys or commands | Check `SLOWLOG`; optimize key patterns |
| Port 6380 in use | Another Redis instance | Check `netstat -an | findstr 6380` |

---

## 9. Verified Against

- `backend/src/config/index.ts`: Redis URL auto-construction, port 6380, password default
- `docker-compose.dev.yml`: Redis container on port 6380
- `COMPLETE_SERVICE_MATRIX.md`: DCII write-through cache pattern
- `BACKUP_RECOVERY.md`: Redis backup procedures

---

*Datacendia, LLC — Proprietary and Confidential*
