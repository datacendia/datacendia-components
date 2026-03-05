# Prisma 5 → 7 Migration Plan

> **Created:** 2026-03-05
> **Updated:** 2026-03-05 (after attempted upgrade)
> **Current Version:** Prisma 5.22.0
> **Target Version:** Prisma 7.x (latest stable: 7.4.2)
> **Risk Level:** HIGH — requires careful testing of all DB operations
> **Status:** ATTEMPTED — reverted due to 1000+ type errors requiring per-file fixes

## Why Upgrade

1. **Security patches** — Prisma 5.x is no longer receiving security updates
2. **Performance** — Prisma 6+ has significant query engine improvements
3. **Type safety** — Prisma 7 has stricter JSON field typing (reduces `as any` casts)
4. **Native ESM** — Better ESM support aligns with our `NodeNext` module config
5. **Prisma Accelerate** — Connection pooling improvements for Railway deployment

## Breaking Changes to Address

### Prisma 5 → 6
- `prismaSchemaFolder` preview feature removed (now default) — **we already use multi-file schema**
- `jsonProtocol` is now the only wire protocol — remove any `engineType` overrides
- `@prisma/client` import paths changed — verify all imports
- `PrismaClient` constructor `log` option type changed
- Removed deprecated `rejectOnNotFound` — use `findUniqueOrThrow` / `findFirstOrThrow`

### Prisma 6 → 7
- `strictUndefinedChecks` enabled by default — `undefined` no longer silently skips fields
- Client extensions API changes
- `$queryRaw` and `$executeRaw` return type changes
- Removed `interactiveTransactions` preview feature (now default)

## Pre-Migration Checklist

- [ ] Audit all `prisma.$queryRaw` usage (currently in `applyIndexes.ts`, services)
- [ ] Audit all `findUnique` calls for `rejectOnNotFound` usage
- [ ] Audit all JSON field casts (`as any`, `as Prisma.JsonValue`)
- [ ] Run full test suite and record baseline pass/fail count
- [ ] Create database backup before migration
- [ ] Review Prisma 6 and 7 upgrade guides in full

## Migration Steps

### Phase 1: Preparation (Low Risk)
```bash
# 1. Create a migration branch
git checkout -b feat/prisma-7-migration

# 2. Backup current schema
cp -r backend/prisma/schema backend/prisma/schema.v5-backup

# 3. Run full test suite — record baseline
cd backend && npx vitest run --reporter=verbose 2>&1 | tee test-baseline-prisma5.log
```

### Phase 2: Upgrade to Prisma 6 First
```bash
# 4. Upgrade to latest Prisma 6.x
npm install prisma@6 @prisma/client@6

# 5. Regenerate client
npx prisma generate

# 6. Fix any type errors
npx tsc --noEmit --skipLibCheck

# 7. Run tests
npx vitest run
```

### Phase 3: Upgrade to Prisma 7
```bash
# 8. Upgrade to Prisma 7.x
npm install prisma@7 @prisma/client@7

# 9. Regenerate client
npx prisma generate

# 10. Fix strictUndefinedChecks errors
# Find all places where undefined is passed to Prisma and replace with explicit conditions

# 11. Run full test suite
npx vitest run

# 12. Manual smoke test — start backend and verify login flow
npm run dev
```

### Phase 4: Proper Migrations
```bash
# 13. Convert from `prisma db push` to proper migrations
npx prisma migrate dev --name initial-baseline

# 14. Verify migration file generated correctly
# 15. Test rollback: npx prisma migrate reset
```

## Risk Mitigation

1. **Do NOT upgrade in production without staging test** — use Railway preview environment
2. **Keep `prisma db push` working as fallback** during transition
3. **The 380KB `enterprise_migration.sql` should be decomposed** into proper Prisma migrations as part of this effort
4. **Test with production data volume** — not just seed data

## Timeline Estimate

- Phase 1: 1 hour
- Phase 2: 2-4 hours (depending on breaking changes)
- Phase 3: 2-4 hours
- Phase 4: 4-8 hours (migration decomposition)
- **Total: 1-2 days of focused work**

## Dependencies

- Must complete after all current audit remediation items
- Requires no active feature development during migration
- Should be done before FEPCMAC POC deployment
