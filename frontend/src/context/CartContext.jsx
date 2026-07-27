import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [items, setItems] = useState([]); // { menuItem, name, price, quantity }

  const addItem = (restaurant, menuItem) => {
    if (restaurantId && restaurantId !== restaurant._id) {
      const confirmSwitch = window.confirm(
        'Your cart has items from another restaurant. Clear cart and add this item instead?'
      );
      if (!confirmSwitch) return;
      setItems([]);
    }
    setRestaurantId(restaurant._id);
    setRestaurantName(restaurant.name);
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem === menuItem._id);
      if (existing) {
        return prev.map((i) => (i.menuItem === menuItem._id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { menuItem: menuItem._id, name: menuItem.name, price: menuItem.price, quantity: 1 }];
    });
  };

  const removeItem = (menuItemId) => {
    setItems((prev) =>
      prev
        .map((i) => (i.menuItem === menuItemId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName('');
  };

  const itemsTotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{ restaurantId, restaurantName, items, addItem, removeItem, clearCart, itemsTotal, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
