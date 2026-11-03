-- Restrict payment confirmation to the trusted server after Razorpay signature validation.
-- The existing RPC is SECURITY DEFINER and must never be callable by public clients.
REVOKE EXECUTE ON FUNCTION public.confirm_order_payment(uuid, text, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.confirm_order_payment(uuid, text, uuid) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_order_payment(uuid, text, uuid) TO service_role;
