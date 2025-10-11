import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  category: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: WishlistItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Set up auth listener and load wishlist
  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        fetchWishlist(user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => {
          fetchWishlist(session.user.id);
        }, 0);
      } else {
        setWishlistItems([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchWishlist = async (userId: string) => {
    try {
      setLoading(true);
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', userId);

      if (wishlistError) throw wishlistError;

      if (!wishlistData || wishlistData.length === 0) {
        setWishlistItems([]);
        return;
      }

      const productIds = wishlistData.map(item => item.product_id);

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories(name)
        `)
        .in('id', productIds);

      if (productsError) throw productsError;

      const formattedProducts = productsData?.map(product => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        discountPrice: product.discount_price ? Number(product.discount_price) : undefined,
        image: product.images?.[0] || "",
        category: product.categories?.name || "Fashion"
      })) || [];

      setWishlistItems(formattedProducts);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product: WishlistItem) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to use wishlist.",
        variant: "destructive"
      });
      return;
    }

    // Check if already in wishlist
    if (wishlistItems.find(item => item.id === product.id)) {
      toast({
        description: "Item already in wishlist ❤️",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('wishlist')
        .insert({
          user_id: user.id,
          product_id: product.id
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            description: "Item already in wishlist ❤️",
          });
          return;
        }
        console.error('Supabase error adding to wishlist:', error);
        throw error;
      }

      setWishlistItems(prev => [...prev, product]);
      toast({
        description: "Added to wishlist ❤️",
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        description: "Failed to add item to wishlist, please try again.",
        variant: "destructive"
      });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    const item = wishlistItems.find(item => item.id === productId);
    
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        console.error('Supabase error removing from wishlist:', error);
        throw error;
      }

      setWishlistItems(prev => prev.filter(item => item.id !== productId));
      
      if (item) {
        toast({
          description: `Removed from wishlist`,
        });
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        description: "Failed to remove item from wishlist, please try again.",
        variant: "destructive"
      });
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const isWishlisted = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const toggleWishlist = async (productId: string) => {
    if (isWishlisted(productId)) {
      await removeFromWishlist(productId);
    }
  };

  const clearWishlist = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setWishlistItems([]);
      toast({
        title: "Wishlist Cleared",
        description: "All items have been removed from your wishlist",
      });
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to clear wishlist",
        variant: "destructive"
      });
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      isWishlisted,
      toggleWishlist,
      clearWishlist,
      loading
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};