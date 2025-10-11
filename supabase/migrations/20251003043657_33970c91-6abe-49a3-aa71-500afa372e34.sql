-- Update all products with working image URLs
-- Designer Bridal Lehenga - already has good images
-- Kundan Jewelry Set - already has good image
-- Sangeet Lehenga - already has good images
-- Statement Necklace - already has good image
-- Embroidered Clutch - already has good image
-- plane t shirt - needs update with proper images

UPDATE products 
SET images = ARRAY[
  'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/8532617/pexels-photo-8532617.jpeg?auto=compress&cs=tinysrgb&w=800'
]
WHERE id = '9e086b6a-0c22-4610-b33d-da64cf446128';

-- Verify all products have valid images
UPDATE products
SET images = ARRAY[
  'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=800'
]
WHERE name = 'Designer Bridal Lehenga';

UPDATE products
SET images = ARRAY[
  'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800'
]
WHERE name = 'Kundan Jewelry Set';

UPDATE products
SET images = ARRAY[
  'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1457983/pexels-photo-1457983.jpeg?auto=compress&cs=tinysrgb&w=800'
]
WHERE name = 'Sangeet Lehenga - Teal Blue';

UPDATE products
SET images = ARRAY[
  'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=800'
]
WHERE name = 'Statement Necklace Set - Antique Gold';

UPDATE products
SET images = ARRAY[
  'https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800'
]
WHERE name = 'Embroidered Clutch - Royal Blue';