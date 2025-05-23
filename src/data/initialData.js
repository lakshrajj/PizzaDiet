export const initialData = {
  menuItems: {
    featured: [
      {
        id: 1,
        name: 'Cloud 7 Pizza',
        description: 'Our signature creation with onion, tomato, corn, paneer, capsicum, and jalapeño - a perfect harmony of flavors',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500',
        badge: '🏆 Signature',
        rating: 4.9,
        sizes: [
          { name: 'Small', price: 240 },
          { name: 'Medium', price: 450 },
          { name: 'Large', price: 600 }
        ]
      },
      {
        id: 2,
        name: 'Extravaganza Pizza',
        description: 'A lavish feast featuring black olives, onion, capsicum, mushroom, fresh tomato, and corn',
        image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500',
        badge: '🔥 Popular',
        rating: 4.8,
        sizes: [
          { name: 'Small', price: 240 },
          { name: 'Medium', price: 450 },
          { name: 'Large', price: 600 }
        ]
      },
      {
        id: 3,
        name: 'Tandoori Paneer Special',
        description: 'Authentic tandoori sauce with tender paneer, capsicum, red chili, and onion',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500',
        badge: '🌶️ Spicy',
        rating: 4.7,
        sizes: [
          { name: 'Small', price: 200 },
          { name: 'Medium', price: 400 },
          { name: 'Large', price: 580 }
        ]
      }
    ],
    'simply-veg': [
      {
        id: 4,
        name: 'Margherita Classic',
        description: 'The timeless classic with fresh mozzarella cheese and our signature pizza sauce',
        image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500',
        badge: '❤️ Classic',
        rating: 4.6,
        sizes: [
          { name: 'Small', price: 100 },
          { name: 'Medium', price: 200 },
          { name: 'Large', price: 360 }
        ]
      },
      {
        id: 5,
        name: 'Golden Corn Delight',
        description: 'Sweet golden corn with cheese and herbs - perfect for corn lovers',
        image: 'https://images.unsplash.com/photo-1552539618-7eec9b4d1796?w=500',
        badge: '🌽 Sweet',
        rating: 4.4,
        sizes: [
          { name: 'Small', price: 130 },
          { name: 'Medium', price: 250 },
          { name: 'Large', price: 400 }
        ]
      }
    ],
    deluxe: [
      {
        id: 6,
        name: 'Makhani Paneer Special',
        description: 'Rich makhani sauce with tender paneer, onions, and corn - a royal treat',
        image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500',
        badge: '👑 Royal',
        rating: 4.8,
        sizes: [
          { name: 'Small', price: 200 },
          { name: 'Medium', price: 400 },
          { name: 'Large', price: 580 }
        ]
      },
      {
        id: 7,
        name: 'Achari Paneer Pizza',
        description: 'Tangy achari sauce with onion, capsicum, corn, and paneer - unique fusion flavors',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500',
        badge: '🥒 Tangy',
        rating: 4.5,
        sizes: [
          { name: 'Small', price: 200 },
          { name: 'Medium', price: 400 },
          { name: 'Large', price: 580 }
        ]
      }
    ]
  },
  galleryItems: [
    { id: 1, category: 'pizzas', title: 'Margherita Classic', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600' },
    { id: 2, category: 'pizzas', title: 'Veggie Supreme', image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600' },
    { id: 3, category: 'specials', title: 'Cloud 7 Special', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600' },
    { id: 4, category: 'ingredients', title: 'Fresh Vegetables', image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600' },
    { id: 5, category: 'pizzas', title: 'Tandoori Paneer', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600' },
    { id: 6, category: 'specials', title: 'Extravaganza', image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=600' },
    { id: 7, category: 'ingredients', title: 'Fresh Cheese', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600' },
    { id: 8, category: 'pizzas', title: 'Makhani Special', image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600' }
  ]
};