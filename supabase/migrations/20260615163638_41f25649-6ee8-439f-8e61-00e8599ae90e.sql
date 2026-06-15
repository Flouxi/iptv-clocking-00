DROP POLICY IF EXISTS "Public can read orders (token-gated in app)" ON public.orders;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.orders FROM anon, authenticated;
GRANT ALL ON public.orders TO service_role;