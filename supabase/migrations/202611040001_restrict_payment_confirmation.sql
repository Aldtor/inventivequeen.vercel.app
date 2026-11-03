-- Bind a verified Razorpay payment to the exact database order created by this server.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS razorpay_order_id text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_razorpay_order_id
  ON public.orders (razorpay_order_id)
  WHERE razorpay_order_id IS NOT NULL;

-- Remove the previously public overload and replace it with an order-bound RPC.
DROP FUNCTION IF EXISTS public.confirm_order_payment(uuid, text, uuid);

CREATE OR REPLACE FUNCTION public.confirm_order_payment(
  p_order_id uuid,
  p_payment_id text,
  p_razorpay_order_id text,
  p_user_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rows_affected integer;
BEGIN
  IF coalesce(auth.role(), '') <> 'service_role' THEN
    RAISE EXCEPTION 'Payment confirmation is restricted to the trusted server.';
  END IF;

  PERFORM set_config('app.payment_verification_in_progress', 'true', true);

  UPDATE public.orders
  SET payment_status = 'paid',
      status = 'confirmed',
      payment_id = p_payment_id,
      updated_at = now()
  WHERE id = p_order_id
    AND razorpay_order_id = p_razorpay_order_id
    AND (p_user_id IS NULL OR user_id = p_user_id)
    AND (payment_status <> 'paid' OR payment_id = p_payment_id);

  GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
  RETURN v_rows_affected > 0;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.confirm_order_payment(uuid, text, text, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.confirm_order_payment(uuid, text, text, uuid) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_order_payment(uuid, text, text, uuid) TO service_role;
