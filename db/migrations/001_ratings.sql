-- Afrolink dish ratings — schema v1 (2026-10-09)
-- Apply with: npm run db:migrate   (uses DATABASE_URL; idempotent)
--
-- Privacy by design: no names, e-mails, raw IP addresses or user agents are stored.
-- voter_hash   = HMAC(RATINGS_SECRET, random anonymous cookie id)  → one active rating per dish
-- ip_day_hash  = HMAC(RATINGS_SECRET, IP + UTC date) → rotates daily, purged after 30 days,
--                used only for rate limiting and abuse detection.

create table if not exists rating (
  id          bigserial primary key,
  env         text        not null,                       -- production | preview | development | test
  dish_id     text        not null,                       -- stable id from src/data/menu.ts (never a translated name)
  voter_hash  text        not null,
  stars       smallint    not null check (stars between 1 and 5),
  status      text        not null default 'active' check (status in ('active', 'excluded')),
  revisions   integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (env, dish_id, voter_hash)
);
create index if not exists rating_env_dish_idx on rating (env, dish_id) where status = 'active';
create index if not exists rating_env_created_idx on rating (env, created_at);

-- Append-only audit trail: every create, revision and moderation decision.
create table if not exists rating_event (
  id           bigserial primary key,
  env          text        not null,
  rating_id    bigint      not null references rating (id),
  dish_id      text        not null,
  action       text        not null check (action in ('create', 'revise', 'exclude', 'restore')),
  old_stars    smallint,
  new_stars    smallint,
  actor        text        not null check (actor in ('guest', 'admin')),
  reason       text,
  note         text,
  ip_day_hash  text,
  at           timestamptz not null default now()
);
create index if not exists rating_event_env_at_idx on rating_event (env, at);
create index if not exists rating_event_rating_idx on rating_event (rating_id);

-- Sliding-window rate limiting (rows older than 2 days are purged).
create table if not exists rate_hit (
  key  text        not null,
  at   timestamptz not null default now()
);
create index if not exists rate_hit_key_at_idx on rate_hit (key, at);

-- Write-once settings, e.g. 'launch_at:production' (start of the six-month evaluation).
create table if not exists setting (
  key     text        primary key,
  value   text        not null,
  set_at  timestamptz not null default now()
);
