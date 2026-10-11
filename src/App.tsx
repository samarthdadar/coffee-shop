import React, { useEffect, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { CartScreen } from './components/CartScreen';
import { CustomizerScreen } from './components/CustomizerScreen';
import { Header } from './components/Header';
import { KitchenScreen } from './components/KitchenScreen';
import { ManageScreen } from './components/ManageScreen';
import { MenuScreen } from './components/MenuScreen';
import {
  INITIAL_CART_ITEMS,
  INITIAL_KITCHEN_TICKETS,
  INITIAL_MENU_ITEMS,
  TABLE_SESSIONS,
} from './data/initialData';
import {
  CartItem,
  CustomSpec,
  KitchenItemStatus,
  KitchenTicket,
  MenuItem,
  ScreenId,
  TableSession,
} from './types';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('menu');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [kitchenTickets, setKitchenTickets] = useState<KitchenTicket[]>(INITIAL_KITCHEN_TICKETS);
  const [activeTable, setActiveTable] = useState<TableSession>(TABLE_SESSIONS[0]);

  // Menu screen quantities (initialized to match Image 2.png steppers and $24.75 tray total)
  const [menuQuantities, setMenuQuantities] = useState<Record<string, number>>({
    'geisha-cortado': 1,
    'caramel-float': 1,
  });
  const [hasInteractedWithMenuTray, setHasInteractedWithMenuTray] = useState<boolean>(false);

  // Selected item for Craft Customizer
  const [customizingItem, setCustomizingItem] = useState<MenuItem>(INITIAL_MENU_ITEMS[0]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Scroll to top on screen switch
  const handleNavigate = (screen: ScreenId) => {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update quantity from MenuScreen and sync with CartScreen
  const handleUpdateMenuQuantity = (itemId: string, delta: number) => {
    setHasInteractedWithMenuTray(true);
    setMenuQuantities((prev) => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      const updated = { ...prev };
      if (next === 0) {
        delete updated[itemId];
      } else {
        updated[itemId] = next;
      }
      return updated;
    });

    const targetItem = menuItems.find((m) => m.id === itemId);
    if (!targetItem) return;

    setCartItems((prevCart) => {
      const existingIndex = prevCart.findIndex((c) => c.menuItemId === itemId && !c.customSpec);
      if (existingIndex > -1) {
        const currentQty = prevCart[existingIndex].quantity;
        const newQty = currentQty + delta;
        if (newQty <= 0) {
          return prevCart.filter((_, idx) => idx !== existingIndex);
        }
        return prevCart.map((c, idx) =>
          idx === existingIndex ? { ...c, quantity: newQty } : c
        );
      } else if (delta > 0) {
        const newCartEntry: CartItem = {
          id: `cart-${Date.now()}`,
          menuItemId: targetItem.id,
          name: targetItem.shortName || targetItem.name,
          subtitle: targetItem.description,
          price: targetItem.price,
          quantity: delta,
          image: targetItem.imageCart || targetItem.imageLight,
          stationBadge:
            targetItem.category === 'artisan-brunch'
              ? 'Kitchen Hearth'
              : targetItem.category === 'warm-bakery'
              ? 'Pastry Bar'
              : 'Barista Bar',
          stationColor:
            targetItem.category === 'artisan-brunch'
              ? 'primary'
              : targetItem.category === 'warm-bakery'
              ? 'tertiary'
              : 'secondary',
          prepBadge:
            targetItem.prepTime === 'Fresh' ? 'Ready now' : `${targetItem.prepTime} prep`,
          isReadyNow: targetItem.prepTime === 'Fresh',
        };
        return [...prevCart, newCartEntry];
      }
      return prevCart;
    });
  };

  const handleSelectForCustomize = (item: MenuItem) => {
    setCustomizingItem(item);
    handleNavigate('custom');
  };

  const handleAddCustomizedToCart = (
    item: MenuItem,
    spec: CustomSpec,
    finalPrice: number
  ) => {
    const specSummary = [
      spec.vesselLabel.split(' ')[0],
      spec.milkLabel.replace('Minor Figures ', '').replace('Organic ', ''),
      spec.tempLabel,
      spec.pumps > 0 ? `${spec.pumps}p ${spec.sweetenerLabel.replace('House ', '')}` : 'Unsweetened',
      spec.notes,
    ]
      .filter(Boolean)
      .join(' • ');

    const newCartItem: CartItem = {
      id: `cart-custom-${Date.now()}`,
      menuItemId: item.id,
      name: item.shortName || item.name,
      subtitle: specSummary,
      price: finalPrice,
      quantity: 1,
      image: item.imageCart || item.imageLight,
      stationBadge: 'Barista Bar',
      stationColor: 'secondary',
      prepBadge: `${item.prepTime} prep`,
      customSpec: spec,
    };

    setCartItems((prev) => [newCartItem, ...prev]);
    setHasInteractedWithMenuTray(true);
    setMenuQuantities((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
  };

  const handleUpdateCartQty = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;

    const newTicket: KitchenTicket = {
      id: `ticket-${Date.now()}`,
      tableNumber: activeTable.tableName,
      zone: activeTable.zone,
      guests: activeTable.guests,
      elapsedSeconds: 5,
      targetMinutes: 10,
      status: 'active',
      items: cartItems.map((c, idx) => ({
        id: `kt-new-${Date.now()}-${idx}`,
        name: c.name,
        quantity: c.quantity,
        modifiers: c.subtitle,
        image: c.image,
        station:
          c.stationBadge === 'Kitchen Hearth'
            ? 'Warm Kitchen'
            : c.stationBadge === 'Pastry Bar'
            ? 'Pastry Atelier'
            : 'Espresso Bar',
        status: c.isReadyNow ? 'ready' : c.stationBadge === 'Kitchen Hearth' ? 'cooking' : 'extracting',
      })),
    };

    setKitchenTickets((prev) => [newTicket, ...prev]);
  };

  // Kitchen KDS actions
  const handleCycleKitchenItemStatus = (ticketId: string, itemId: string) => {
    const order: KitchenItemStatus[] = ['extracting', 'cooking', 'ready', 'urgent'];
    setKitchenTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;
        return {
          ...ticket,
          items: ticket.items.map((item) => {
            if (item.id !== itemId) return item;
            const nextStatus = order[(order.indexOf(item.status) + 1) % order.length];
            return { ...item, status: nextStatus };
          }),
        };
      })
    );
  };

  const handleBumpTicket = (ticketId: string) => {
    setKitchenTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status: 'completed',
              items: ticket.items.map((i) => ({ ...i, status: 'ready' })),
            }
          : ticket
      )
    );
  };

  const handleRecallTicket = (ticketId: string) => {
    setKitchenTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: 'active' } : ticket
      )
    );
  };

  // Manage screen actions
  const handleSaveMenuItem = (newItem: MenuItem) => {
    setMenuItems((prev) => {
      const exists = prev.some((m) => m.id === newItem.id);
      if (exists) {
        return prev.map((m) => (m.id === newItem.id ? newItem : m));
      }
      return [...prev, newItem];
    });
  };

  const handleToggleStock = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === itemId ? { ...m, inStock: !m.inStock } : m))
    );
  };

  const handleRestockItem = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((m) =>
        m.id === itemId
          ? { ...m, inStock: true, stockCount: (m.stockCount || 3) + 12 }
          : m
      )
    );
  };

  const handleBatchPriceAdjust = (multiplier: number) => {
    setMenuItems((prev) =>
      prev.map((m) => ({
        ...m,
        price: +(m.price * multiplier).toFixed(2),
      }))
    );
  };

  // Compute quantities to pass to MenuScreen so initial load shows exact 3 in Tray • $24.75 from Image 2.png
  const effectiveMenuQuantities = hasInteractedWithMenuTray
    ? menuQuantities
    : {
        'geisha-cortado': 1,
        'caramel-float': 1,
        'kyoto-cold-drip-virtual': 1,
      };

  const activeTicketCount = kitchenTickets.filter((t) => t.status === 'active').length;
  const navCartBadge = hasInteractedWithMenuTray
    ? cartItems.reduce((sum, c) => sum + c.quantity, 0)
    : 2;

  return (
    <div className="bg-surface text-on-surface relative min-h-screen flex flex-col selection:bg-primary selection:text-on-primary transition-colors duration-200">
      {/* Dark Mode Ambient Radial Lighting Pools (from HTML 1) */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-container/15 blur-3xl animate-[ambientPulse_10s_ease-in-out_infinite]"></div>
          <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-tertiary-container/10 blur-3xl animate-[ambientPulse_14s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-16 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"></div>
        </div>
      )}

      {/* Top App Bar */}
      <Header
        activeScreen={activeScreen}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        activeTable={activeTable}
        tables={TABLE_SESSIONS}
        onSelectTable={setActiveTable}
        activeTicketCount={activeTicketCount}
        onNavigate={handleNavigate}
      />

      {/* Main Content Container */}
      <main className="flex-1 flex flex-col relative w-full max-w-lg mx-auto pt-20 pb-28 px-margin z-10">
        {activeScreen === 'menu' && (
          <MenuScreen
            menuItems={
              hasInteractedWithMenuTray
                ? menuItems
                : [
                    ...menuItems,
                    // Virtual entry so initial tray calculation equals 3 items & $24.75 while keeping Kyoto Cold Drip button as "+ Add"
                    {
                      ...menuItems[4],
                      id: 'kyoto-cold-drip-virtual',
                      availableOnTablets: false,
                    },
                  ]
            }
            quantities={effectiveMenuQuantities}
            onUpdateQuantity={handleUpdateMenuQuantity}
            onSelectForCustomize={handleSelectForCustomize}
            onNavigate={handleNavigate}
            activeTable={activeTable}
            isDark={isDark}
          />
        )}

        {activeScreen === 'custom' && (
          <CustomizerScreen
            selectedItem={customizingItem}
            onAddCustomizedToCart={handleAddCustomizedToCart}
            onNavigate={handleNavigate}
          />
        )}

        {activeScreen === 'cart' && (
          <CartScreen
            cartItems={cartItems}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveCartItem={handleRemoveCartItem}
            onPlaceOrder={handlePlaceOrder}
            onNavigate={handleNavigate}
            activeTable={activeTable}
            tables={TABLE_SESSIONS}
            onSelectTable={setActiveTable}
          />
        )}

        {activeScreen === 'kitchen' && (
          <KitchenScreen
            tickets={kitchenTickets}
            onCycleItemStatus={handleCycleKitchenItemStatus}
            onBumpTicket={handleBumpTicket}
            onRecallTicket={handleRecallTicket}
          />
        )}

        {activeScreen === 'manage' && (
          <ManageScreen
            menuItems={menuItems.filter(
              (m) =>
                m.id === 'geisha-cortado' ||
                m.id === 'mushroom-brioche' ||
                m.id === 'yuzu-cruffin' ||
                m.id.startsWith('dish-')
            )}
            onSaveMenuItem={handleSaveMenuItem}
            onToggleStock={handleToggleStock}
            onRestockItem={handleRestockItem}
            onBatchPriceAdjust={handleBatchPriceAdjust}
          />
        )}
      </main>

      {/* Bottom 5-Tab Navigation Bar */}
      <BottomNav
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
        cartCount={navCartBadge}
        isDark={isDark}
      />
    </div>
  );
}
