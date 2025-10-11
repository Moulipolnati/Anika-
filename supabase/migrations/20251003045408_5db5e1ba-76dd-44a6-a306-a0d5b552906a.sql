-- Add payment_transaction_id column to orders table for tracking UPI payments
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_transaction_id text;