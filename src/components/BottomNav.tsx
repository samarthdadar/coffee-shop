import React from 'react';
import { ScreenId } from '../types';

interface BottomNavProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  cartCount: number;
  isDark: boolean;
}

interface NavItem {
  id: ScreenId;
  label: string;
  icon: string;
  badge?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeScreen,
  onNavigate,
  cartCount,
  isDark,
}) => {
  const navItems: NavItem[] = [
    { id: 'menu', label: 'Menu', icon: isDark ? 'local_cafe' : 'restaurant_menu' },
    { id: 'custom', label: 'Custom', icon: isDark ? 'tune' : 'palette' },
    { id: 'cart', label: 'Cart', icon: 'shopping_bag', badge: cartCount },
    { id: 'kitchen', label: 'Kitchen', icon: 'countertops' },
    { id: 'manage', label: 'Manage', icon: 'edit_note' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-50 pb-safe pointer-events-none px-margin mb-space-sm">
      <div
        className={`pointer-events-auto mx-auto max-w-lg h-16 rounded-2xl backdrop-blur-2xl flex items-center justify-between px-space-xs transition-colors duration-200 ${
          isDark
            ? 'bg-surface-container-high/85 shadow-[0_16px_36px_rgba(0,0,0,0.65)] rounded-full'
            : 'bg-surface-container/95 shadow-[0_12px_32px_rgba(15,23,42,0.12)]'
        }`}
      >
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 min-h-[44px] py-1 rounded-xl transition-all duration-200 group ${
                isActive
                  ? isDark
                    ? 'bg-primary/20 text-primary shadow-[0_0_16px_rgba(255,184,109,0.35)] rounded-full'
                    : 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className={`material-symbols-outlined text-[20px] group-hover:scale-105 transition-transform ${
                    isActive ? 'text-primary' : ''
                  }`}
                >
                  {item.icon}
                </span>
                {item.id === 'cart' && item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 w-4 h-4 rounded-full bg-primary text-on-primary text-label-sm text-[9px] flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-label-sm mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
