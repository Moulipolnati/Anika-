-- Add foreign key constraints to wishlist table
ALTER TABLE public.wishlist
  DROP CONSTRAINT IF EXISTS wishlist_user_id_fkey,
  DROP CONSTRAINT IF EXISTS wishlist_product_id_fkey;

ALTER TABLE public.wishlist
  ADD CONSTRAINT wishlist_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;

ALTER TABLE public.wishlist
  ADD CONSTRAINT wishlist_product_id_fkey 
    FOREIGN KEY (product_id) 
    REFERENCES public.products(id) 
    ON DELETE CASCADE;

-- Ensure RLS is enabled
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Users can add to their own wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Users can remove from their own wishlist" ON public.wishlist;

-- Create RLS policies for wishlist
CREATE POLICY "Users can view their own wishlist"
  ON public.wishlist
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own wishlist"
  ON public.wishlist
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own wishlist"
  ON public.wishlist
  FOR DELETE
  USING (auth.uid() = user_id);