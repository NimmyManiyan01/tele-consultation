# KGS Teleconsultation Platform — Database Migrations (Alembic)

This directory contains version-controlled database migrations powered by **Alembic** and **SQLAlchemy 2.0 Async**.

## Environment Configuration
Alembic reads the database URL dynamically in the following order:
1. Environment variable `DATABASE_URL` (if set in shell or `.env`)
2. `app.config.settings.DATABASE_URL` (from application settings)
3. Fallback URL defined in `alembic.ini`

## Common Migration Commands

> [!NOTE]
> Always execute Alembic commands from the `backend/` directory with `PYTHONPATH=.`.

### 1. Check Migration Status
```bash
alembic current
alembic check
```

### 2. Generate a New Migration Revision (Autogenerate from ORM Models)
When models in `app/models/` are modified:
```bash
alembic revision --autogenerate -m "describe_schema_change"
```

### 3. Apply Pending Migrations to Database (Upgrade to Latest Revision)
```bash
alembic upgrade head
```

### 4. Rollback Last Migration
```bash
alembic downgrade -1
```

### 5. Stamp Existing Database (Record Revision Without Running DDL)
To record a baseline without re-running create table DDL:
```bash
alembic stamp head
```

## Migration Files Hierarchy
- `alembic.ini`: Primary configuration file.
- `migrations/env.py`: Asynchronous migration runner connecting ORM metadata (`Base.metadata`) with Alembic context.
- `migrations/script.py.mako`: Template used to generate new migration files.
- `migrations/versions/`: Directory containing timestamped revision scripts.
  - `e324b1270dad_0001_initial_schema.py`: Baseline migration establishing all 19 application tables.

