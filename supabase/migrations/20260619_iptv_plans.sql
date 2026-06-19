-- Table for mapping IPTV plans to Stripe prices and stealth settings
create table if not exists iptv_plans (
  id uuid default gen_random_uuid() primary key,
  plan_key text not null unique, -- e.g., '3m-1s'
  display_name text not null,
  price_amount integer not null, -- in SEK
  stripe_price_id text, -- optional if we want to create sessions on the fly
  stripe_checkout_url text, -- optional for pre-created sessions
  created_at timestamp with time zone default now()
);

-- Insert initial 13 plans (3 base plans * screens)
-- 3m: 349, 699, 1049, 1399, 1749, 2099
-- 1y: 699, 1049, 1399, 1749, 2099, 2449
-- 3y: 1299, 1649, 1999, 2349, 2699, 3049
-- We'll just insert a few examples, the user can add more.
insert into iptv_plans (plan_key, display_name, price_amount) values
('3m-1s', 'IPTV Nord 4K - 3 Månader (1 skärm)', 349),
('3m-2s', 'IPTV Nord 4K - 3 Månader (2 skärmar)', 699),
('1y-1s', 'IPTV Nord 4K - 1 År (1 skärm)', 699),
('1y-2s', 'IPTV Nord 4K - 1 År (2 skärmar)', 1049),
('3y-1s', 'IPTV Nord 4K - 3 År (1 skärm)', 1299)
on conflict (plan_key) do nothing;

-- Enable RLS
alter table iptv_plans enable row level security;
create policy "iptv_plans_read" on iptv_plans for select using (true);
