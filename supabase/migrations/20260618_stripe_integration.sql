-- Create stripe_products table to track Stripe resource IDs
create table if not exists stripe_products (
  id uuid default gen_random_uuid() primary key,
  product_slug text not null unique,
  stripe_product_id text not null,
  stripe_price_id text not null,
  product_name text not null,
  price_amount integer not null,
  currency text default 'sek',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create stripe_orders table to track completed orders
create table if not exists stripe_orders (
  id uuid default gen_random_uuid() primary key,
  stripe_session_id text not null unique,
  stripe_customer_id text,
  product_slug text not null,
  amount_paid integer not null,
  currency text default 'sek',
  customer_email text,
  status text default 'pending',
  created_at timestamp with time zone default now(),
  completed_at timestamp with time zone,
  metadata jsonb
);

-- Create indices for faster queries
create index if not exists idx_stripe_products_slug on stripe_products(product_slug);
create index if not exists idx_stripe_products_stripe_product_id on stripe_products(stripe_product_id);
create index if not exists idx_stripe_orders_session_id on stripe_orders(stripe_session_id);
create index if not exists idx_stripe_orders_customer_email on stripe_orders(customer_email);
create index if not exists idx_stripe_orders_created_at on stripe_orders(created_at);

-- Enable RLS (Row Level Security)
alter table stripe_products enable row level security;
alter table stripe_orders enable row level security;

-- Create policies for stripe_products (read-only for everyone)
create policy "stripe_products_read" on stripe_products
  for select using (true);

-- Create policies for stripe_orders (select own orders by email)
create policy "stripe_orders_read" on stripe_orders
  for select using (
    auth.jwt() ->> 'email' = customer_email 
    or current_setting('request.jwt.claims', true)::jsonb ->> 'role' = 'admin'
  );
