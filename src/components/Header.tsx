import React, { useState } from 'react';
import { ScreenId, TableSession } from '../types';
import { LUMINA_ASSETS } from '../data/initialData';

interface HeaderProps {
  activeScreen: ScreenId;
  isDark: boolean;
  onToggleDark: () => void;
  activeTable: TableSession;
  tables: TableSession[];
  onSelectTable: (table: TableSession) => void;
  activeTicketCount: number;
  onNavigate: (screen: ScreenId) => void;
}

const SCREEN_TITLES: Record<ScreenId, string> = {
  menu: 'Lumina Curated Menu',
  custom: 'Lumina Craft Customizer',
  cart: 'Lumina Table Cart & Pay',
  kitchen: 'Lumina Kitchen Staff Board',
  manage: 'Lumina Menu Manage Editor',
};

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  isDark,
  onToggleDark,
  activeTable,
  tables,
  onSelectTable,
  activeTicketCount,
  onNavigate,
}) => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showLiveInfo, setShowLiveInfo] = useState(false);

  return (
    <header
      className={`fixed top-0 w-full z-50 pt-safe backdrop-blur-xl transition-colors duration-200 ${
        isDark
          ? 'bg-surface/75 shadow-[0_4px_24px_rgba(0,0,0,0.3)]'
          : 'bg-surface-container-low/90 shadow-[0_2px_12px_rgba(15,23,42,0.06)]'
      }`}
    >
      <div className="max-w-lg mx-auto h-16 px-margin flex items-center justify-between relative">
        {/* Brand & Screen Title */}
        <button
          type="button"
          onClick={() => onNavigate('menu')}
          className="flex items-center gap-space-sm min-w-0 text-left focus:outline-none group"
        >
          {isDark && activeScreen === 'menu' ? (
            <img
              alt="Lumina Cafe Logo"
              referrerPolicy="no-referrer"
              className="h-8 w-auto object-contain flex-shrink-0"
              src={LUMINA_ASSETS.logoDark}
            />
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">coffee</span>
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-label-sm uppercase tracking-wider text-primary font-bold truncate">
              Lumina Artisan
            </span>
            <h1 className="text-title-md text-on-surface font-semibold tracking-tight truncate">
              {isDark && activeScreen === 'menu' ? 'Curated Menu' : SCREEN_TITLES[activeScreen]}
            </h1>
          </div>
        </button>

        {/* Right Controls */}
        <div className="flex items-center gap-space-xs flex-shrink-0">
          <button
            type="button"
            aria-label="Live Status"
            onClick={() => {
              setShowLiveInfo(!showLiveInfo);
              setShowQuickMenu(false);
            }}
            className="h-9 px-3 flex items-center gap-1.5 rounded-full bg-tertiary/10 text-tertiary text-label-sm font-semibold transition-all active:scale-95"
          >
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span>Live</span>
          </button>

          <button
            type="button"
            aria-label="Quick Actions"
            onClick={() => {
              setShowQuickMenu(!showQuickMenu);
              setShowLiveInfo(false);
            }}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors active:scale-95 ${
              showQuickMenu
                ? 'bg-primary text-on-primary'
                : 'bg-surface-variant text-on-surface hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>

          {isDark && (
            <div className="relative flex items-center justify-center w-9 h-9 ml-0.5">
              <img
                alt="Profile"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                src={LUMINA_ASSETS.profileAvatar}
              />
              <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-tertiary ring-2 ring-surface"></span>
            </div>
          )}
        </div>

        {/* Live Sync Status Popover */}
        {showLiveInfo && (
          <div className="absolute right-4 top-16 w-72 rounded-2xl bg-surface-container-low p-space-md shadow-2xl border border-outline-variant/40 z-50 animate-in fade-in duration-150">
            <div className="flex items-center justify-between mb-2">
              <span className="text-label-sm uppercase tracking-wider text-tertiary font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                POS & KDS Synchronized
              </span>
              <button
                type="button"
                onClick={() => setShowLiveInfo(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <p className="text-body-md text-on-surface-variant text-[13px]">
              Connected to <strong>{activeTable.tableName}</strong> ({activeTable.zone}) terminal.
              {' '}{activeTicketCount} active kitchen ticket{activeTicketCount === 1 ? '' : 's'} on the line.
            </p>
            <div className="mt-3 pt-2.5 border-t border-outline-variant/40 flex items-center justify-between">
              <span className="text-label-sm text-on-surface-variant">Roast Batch #849</span>
              <button
                type="button"
                onClick={() => {
                  setShowLiveInfo(false);
                  onNavigate('kitchen');
                }}
                className="text-label-sm text-primary font-bold flex items-center gap-1 hover:underline"
              >
                <span>View Kitchen Board</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions & Theme / Table Switcher Popover */}
        {showQuickMenu && (
          <div className="absolute right-4 top-16 w-72 rounded-2xl bg-surface-container-low p-space-md shadow-2xl border border-outline-variant/40 z-50 flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <span className="text-label-md font-bold text-on-surface">Atelier Preferences</span>
              <button
                type="button"
                onClick={() => setShowQuickMenu(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            {/* Theme Switcher */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-variant/70">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  {isDark ? 'dark_mode' : 'light_mode'}
                </span>
                <div className="flex flex-col">
                  <span className="text-label-md font-semibold text-on-surface">
                    {isDark ? 'Obsidian Dark UI' : 'Solarium Light UI'}
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    Switch ambient lighting mode
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onToggleDark}
                className="px-3 py-1.5 rounded-full bg-primary text-on-primary text-label-sm font-bold shadow-sm active:scale-95 transition-transform"
              >
                {isDark ? 'Light' : 'Dark'}
              </button>
            </div>

            {/* Active Table Station Selector */}
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
                Active Guest Station
              </span>
              {tables.map((t) => {
                const isSelected = t.id === activeTable.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      onSelectTable(t);
                      setShowQuickMenu(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-primary-container/50 text-on-surface font-semibold'
                        : 'bg-surface-container-high hover:bg-surface-variant text-on-surface-variant'
                    }`}
                  >
                    <div>
                      <div className="text-label-md font-bold text-on-surface">{t.tableName}</div>
                      <div className="text-[11px] text-on-surface-variant">
                        {t.zone} • {t.guests} Guest{t.guests > 1 ? 's' : ''}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        check_circle
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
