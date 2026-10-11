import React, { useState } from 'react';
import { MenuCategory, MenuItem, ScreenId, TableSession } from '../types';

interface MenuScreenProps {
  menuItems: MenuItem[];
  quantities: Record<string, number>;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onSelectForCustomize: (item: MenuItem) => void;
  onNavigate: (screen: ScreenId) => void;
  activeTable: TableSession;
  isDark: boolean;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({
  menuItems,
  quantities,
  onUpdateQuantity,
  onSelectForCustomize,
  onNavigate,
  activeTable,
  isDark,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'all'>('reserve-coffee');
  const [filterByCategoryOnly, setFilterByCategoryOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDietaryFilter, setShowDietaryFilter] = useState(false);
  const [activeDietaryTag, setActiveDietaryTag] = useState<string | null>(null);
  const [isFavoriteHero, setIsFavoriteHero] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const heroItem = menuItems.find((item) => item.isFeaturedHero) || menuItems[0];
  const listItems = menuItems.filter((item) => item.id !== heroItem.id && item.availableOnTablets !== false);

  const filteredListItems = listItems.filter((item) => {
    const matchesSearch =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badgeText?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !filterByCategoryOnly || selectedCategory === 'all' || item.category === selectedCategory;

    const matchesDietary =
      !activeDietaryTag || (item.dietaryBadges && item.dietaryBadges.includes(activeDietaryTag));

    return matchesSearch && matchesCategory && matchesDietary;
  });

  const heroMatchesSearch =
    !searchQuery.trim() ||
    heroItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    heroItem.description.toLowerCase().includes(searchQuery.toLowerCase());

  // Calculate tray totals from quantities map
  const totalTrayItems = Object.entries(quantities).reduce((acc, [, qty]) => acc + qty, 0);
  const totalTrayPrice = Object.entries(quantities).reduce((acc, [id, qty]) => {
    const found = menuItems.find((m) => m.id === id);
    return acc + (found ? found.price * qty : 0);
  }, 0);

  const handleCategoryClick = (cat: MenuCategory) => {
    if (selectedCategory === cat && filterByCategoryOnly) {
      setFilterByCategoryOnly(false);
    } else if (selectedCategory === cat && !filterByCategoryOnly) {
      setFilterByCategoryOnly(true);
    } else {
      setSelectedCategory(cat);
      setFilterByCategoryOnly(cat !== 'reserve-coffee');
    }
  };

  const handleQuickAdd = (itemId: string) => {
    onUpdateQuantity(itemId, 1);
    setRecentlyAddedId(itemId);
    setTimeout(() => {
      setRecentlyAddedId((prev) => (prev === itemId ? null : prev));
    }, 1000);
  };

  const heroQty = quantities[heroItem.id] || 0;

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* Table Status & Live Greeting */}
      {isDark ? (
        <div className="flex items-center justify-between px-space-xs">
          <div className="inline-flex items-center gap-space-xs px-3.5 py-1.5 rounded-full bg-surface-container-high/70 backdrop-blur-xl shadow-md">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span className="text-label-md text-on-surface-variant font-medium">
              {activeTable.tableName} <span className="text-outline-variant">•</span> {activeTable.zone}
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container/60 backdrop-blur-md">
            <span
              className="material-symbols-outlined text-primary text-[15px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
            <span className="text-label-sm text-primary font-bold uppercase tracking-wider">
              Roast Bar Live
            </span>
          </div>
        </div>
      ) : (
        <section className="flex items-center justify-between bg-surface-container-low px-space-md py-space-sm rounded-[1.5rem] shadow-sm">
          <div className="flex items-center gap-space-sm min-w-0">
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary"></span>
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-label-sm uppercase tracking-wider text-on-surface-variant truncate">
                Guest Station
              </span>
              <span className="text-title-md text-on-surface font-semibold truncate">
                {activeTable.tableName} • {activeTable.zone}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-space-sm py-1 bg-surface-variant rounded-full text-on-surface flex-shrink-0">
            <span className="material-symbols-outlined text-[16px] text-primary">wifi_tethering</span>
            <span className="text-label-sm font-semibold">Live Synced</span>
          </div>
        </section>
      )}

      {/* Interactive Search Bar & Filter Action */}
      <section className="flex flex-col gap-space-xs">
        <div className="flex items-center gap-space-sm">
          <div
            className={`relative flex-1 flex items-center px-space-md py-2.5 transition-all ${
              isDark
                ? 'h-12 rounded-full bg-surface-container-lowest/70 backdrop-blur-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] focus-within:shadow-[0_0_20px_rgba(255,184,109,0.25)]'
                : 'bg-surface-container-low rounded-[1.25rem] shadow-sm'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant mr-2 flex-shrink-0">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-body-md text-on-surface placeholder:text-on-surface-variant outline-none"
              placeholder="Search single origins, botanicals, brioches..."
              type="text"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchQuery('')}
                className="text-on-surface-variant hover:text-on-surface ml-1"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
          <button
            type="button"
            aria-label="Filter Preferences"
            onClick={() => setShowDietaryFilter(!showDietaryFilter)}
            className={`h-11 w-11 flex items-center justify-center rounded-full shadow-sm active:scale-95 transition-all flex-shrink-0 ${
              showDietaryFilter || activeDietaryTag
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface hover:bg-primary-container hover:text-on-primary-container'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
          </button>
        </div>

        {/* Expandable Dietary & Origin Quick Filters */}
        {showDietaryFilter && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            {['Single Origin', 'Vegan Option', 'Seasonal', 'Gluten Free'].map((tag) => {
              const active = activeDietaryTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveDietaryTag(active ? null : tag)}
                  className={`px-3 py-1 rounded-full text-label-sm font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface shadow-xs'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
            {filterByCategoryOnly && (
              <button
                type="button"
                onClick={() => setFilterByCategoryOnly(false)}
                className="px-3 py-1 rounded-full text-label-sm font-bold text-primary bg-primary/10 whitespace-nowrap"
              >
                Show All Categories
              </button>
            )}
          </div>
        )}
      </section>

      {/* Category Nav Pills */}
      <nav className="flex items-center gap-space-xs overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'reserve-coffee' as MenuCategory, label: 'Reserve Coffee', icon: 'local_cafe' },
          { id: 'artisan-brunch' as MenuCategory, label: 'Artisan Brunch', icon: 'brunch_dining' },
          { id: 'warm-bakery' as MenuCategory, label: 'Warm Bakery', icon: 'bakery_dining' },
          { id: 'cold-bar' as MenuCategory, label: isDark ? 'Cold Botanicals' : 'Cold Bar', icon: 'liquor' },
        ].map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat.id)}
              className={`px-space-md py-2 rounded-full text-label-md flex items-center gap-1.5 flex-shrink-0 transition-all duration-200 ${
                isActive
                  ? isDark
                    ? 'bg-primary/20 text-primary font-semibold shadow-[0_4px_16px_rgba(255,184,109,0.25)]'
                    : 'bg-primary text-on-primary font-semibold shadow-sm'
                  : 'bg-surface-container-low text-on-surface hover:bg-surface-variant shadow-sm'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[16px] ${
                  isActive ? '' : 'text-on-surface-variant'
                }`}
              >
                {cat.icon}
              </span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Hero Highlight: Craftsman Pick */}
      {heroMatchesSearch && (!filterByCategoryOnly || selectedCategory === 'reserve-coffee') && (
        <article
          className={`relative flex flex-col rounded-[1.5rem] shadow-md overflow-hidden transition-all ${
            isDark
              ? 'bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low shadow-xl'
              : 'bg-surface-container-low'
          }`}
        >
          <div
            onClick={() => onSelectForCustomize(heroItem)}
            className="relative w-full h-48 bg-surface-container-highest overflow-hidden cursor-pointer group"
          >
            <img
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              alt={heroItem.name}
              src={isDark ? heroItem.imageDark : heroItem.imageLight}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"></div>
            <div className="absolute top-space-md left-space-md flex items-center gap-1 px-space-sm py-1 rounded-full bg-surface-container-low/90 backdrop-blur-md text-on-surface shadow-sm">
              <span
                className="material-symbols-outlined text-[15px] text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span className="text-label-sm uppercase font-bold tracking-wider">
                Master Craftsman Pick
              </span>
            </div>
            <div className="absolute bottom-space-md left-space-md right-space-md flex items-center justify-between text-white">
              <span className="text-label-md bg-white/25 dark:bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 text-white font-semibold">
                <span className="material-symbols-outlined text-[14px] text-amber-300">timer</span>
                <span>⏱ {heroItem.prepTime} extraction</span>
              </span>
              <span className="text-title-lg font-bold text-white drop-shadow-sm">
                ${heroItem.price.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="p-space-md flex flex-col gap-space-sm">
            <div
              onClick={() => onSelectForCustomize(heroItem)}
              className="flex flex-col cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-title-lg text-on-surface font-semibold tracking-tight hover:text-primary transition-colors">
                  {heroItem.name}
                </h2>
              </div>
              <p className="text-body-md text-on-surface-variant mt-0.5">
                {isDark ? heroItem.shortDescription : heroItem.description}
              </p>
            </div>

            {/* Flavor Sensory Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {(heroItem.tags || ['Wild Honey', 'Jasmine Blossom', 'Oak Smoke']).map((tag, idx) => (
                <span
                  key={tag}
                  className={`text-label-sm px-2.5 py-1 rounded-full ${
                    idx === 0
                      ? 'bg-primary-container text-on-primary-container font-semibold'
                      : 'bg-surface-variant text-on-surface font-medium'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Row with Quantity Stepper */}
            <div className="flex items-center justify-between pt-space-xs mt-1">
              {isDark ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Add to favorites"
                    onClick={() => setIsFavoriteHero(!isFavoriteHero)}
                    className={`w-9 h-9 rounded-full bg-surface-container-highest/80 flex items-center justify-center active:scale-95 transition-all ${
                      isFavoriteHero ? 'text-primary' : 'text-on-surface hover:text-primary'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: isFavoriteHero ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      favorite
                    </span>
                  </button>
                  <span className="text-label-sm text-outline font-medium">98 Barista Rating</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelectForCustomize(heroItem)}
                  className="text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors text-left"
                >
                  Recommended: Oat Silk
                </button>
              )}

              <div className="flex items-center gap-space-sm bg-surface-variant px-space-xs py-1 rounded-full">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => onUpdateQuantity(heroItem.id, -1)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface shadow-sm active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined text-[16px]">remove</span>
                </button>
                <span className="text-label-md text-on-surface font-bold px-1.5 tabular-nums">
                  {heroQty}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => onUpdateQuantity(heroItem.id, 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-primary text-on-primary shadow-sm active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      )}

      {/* Curated Offerings List Section Header */}
      <div className="flex items-center justify-between pt-space-xs">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-primary">auto_awesome</span>
          <h3 className="text-title-md text-on-surface font-semibold">
            {isDark ? 'Curated Offerings' : 'Kitchen & Bar Signatures'}
          </h3>
        </div>
        <span className="text-label-sm text-on-surface-variant">
          {filteredListItems.length} Creations Ready
        </span>
      </div>

      {/* Curated Offerings Items */}
      <div className="flex flex-col gap-space-md">
        {filteredListItems.map((item) => {
          const qty = quantities[item.id] || 0;
          const isAddedFeedback = recentlyAddedId === item.id;

          const badgeClasses =
            item.badgeColor === 'secondary'
              ? 'bg-secondary-container text-on-secondary-container'
              : item.badgeColor === 'tertiary'
              ? 'bg-tertiary-fixed text-on-tertiary-fixed'
              : item.badgeColor === 'primary'
              ? 'bg-primary-container text-on-primary-container'
              : 'bg-surface-variant text-on-surface';

          return (
            <div
              key={item.id}
              className={`flex gap-space-md p-space-md rounded-[1.5rem] shadow-sm hover:shadow-md transition-all ${
                isDark
                  ? 'bg-surface-container/70 backdrop-blur-xl hover:bg-surface-container-high/80'
                  : 'bg-surface-container-low'
              }`}
            >
              {/* Thumbnail */}
              <div
                onClick={() => onSelectForCustomize(item)}
                className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-container-highest cursor-pointer group"
              >
                <img
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={item.name}
                  src={isDark ? item.imageDark : item.imageLight}
                />
                <span className="absolute bottom-1 right-1 text-label-sm text-[10px] bg-surface-container-lowest/80 backdrop-blur-xs text-on-surface px-1.5 py-0.5 rounded-full font-bold">
                  {item.prepTime === 'Fresh' ? 'Fresh' : `⏱ ${item.prepTime}`}
                </span>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div
                  onClick={() => onSelectForCustomize(item)}
                  className="flex flex-col min-w-0 cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-label-sm text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold ${badgeClasses}`}
                    >
                      {item.badgeText || 'Artisan Pick'}
                    </span>
                    {!item.inStock && (
                      <span className="text-label-sm text-[10px] uppercase px-2 py-0.5 rounded-md bg-error-container text-on-error-container font-bold">
                        86&apos;d
                      </span>
                    )}
                  </div>
                  <h4 className="text-title-md text-on-surface font-semibold truncate mt-1">
                    {item.name}
                  </h4>
                  {item.freshnessNote ? (
                    <p className="text-label-sm text-tertiary font-semibold flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[13px]">oven_gen</span>
                      <span>{item.freshnessNote}</span>
                    </p>
                  ) : (
                    <p className="text-label-sm text-on-surface-variant line-clamp-1 mt-0.5 font-normal">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Price & Add/Stepper Row */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-title-md font-bold text-on-surface tabular-nums">
                    ${item.price.toFixed(2)}
                  </span>

                  {!item.inStock ? (
                    <span className="text-label-sm text-error font-bold">Sold Out</span>
                  ) : qty > 0 ? (
                    <div className="flex items-center gap-2 bg-surface-variant px-1.5 py-1 rounded-full">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface shadow-sm active:scale-90 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[14px]">remove</span>
                      </button>
                      <span className="text-label-sm text-on-surface font-bold px-1 tabular-nums">
                        {qty}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-primary text-on-primary shadow-sm active:scale-90 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[14px]">add</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(item.id)}
                      className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-label-md font-bold active:scale-95 transition-all shadow-sm ${
                        isAddedFeedback
                          ? 'bg-tertiary text-on-tertiary'
                          : 'bg-primary-container text-on-primary-container hover:opacity-90'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {isAddedFeedback ? 'check' : 'add'}
                      </span>
                      <span>{isAddedFeedback ? 'Added' : 'Add'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dark Mode Interactive Brewing Radar Sensory Card (from HTML 1) */}
      {isDark && (
        <div className="p-space-md rounded-DEFAULT bg-surface-container-lowest/80 backdrop-blur-2xl shadow-xl space-y-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">
                filter_vintage
              </span>
              <span className="text-title-md text-on-surface font-semibold">
                Today&apos;s Roasting Profile
              </span>
            </div>
            <span className="text-label-sm text-tertiary font-bold tracking-wide uppercase">
              Batch #849
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="p-2.5 rounded-2xl bg-surface-container/60 text-center">
              <span className="text-label-sm text-outline-variant uppercase">Acidity</span>
              <p className="text-title-md text-primary font-bold mt-0.5">Medium-Bright</p>
              <span className="text-label-sm text-on-surface-variant">Citrus Nectar</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-surface-container/60 text-center">
              <span className="text-label-sm text-outline-variant uppercase">Body</span>
              <p className="text-title-md text-secondary font-bold mt-0.5">Silk Velvet</p>
              <span className="text-label-sm text-on-surface-variant">Molasses</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-surface-container/60 text-center">
              <span className="text-label-sm text-outline-variant uppercase">Aroma</span>
              <p className="text-title-md text-tertiary font-bold mt-0.5">Intense</p>
              <span className="text-label-sm text-on-surface-variant">Jasmine Oak</span>
            </div>
          </div>
        </div>
      )}

      {/* Artisan Sensory Banner: Kitchen Sourcing Pledge */}
      <aside className="flex items-center gap-space-md p-space-md bg-surface-variant rounded-[1.5rem] shadow-inner mt-space-xs">
        <div className="w-10 h-10 rounded-full bg-tertiary-container/20 text-tertiary flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-[22px]">eco</span>
        </div>
        <div className="flex flex-col min-w-0">
          <h5 className="text-label-md text-on-surface font-bold uppercase tracking-wider">
            Direct-Origin Traceability
          </h5>
          <p className="text-body-md text-on-surface-variant text-[13px] leading-tight mt-0.5">
            Every coffee bean and flour grain is sourced directly from certified organic
            regenerative estate partners.
          </p>
        </div>
      </aside>

      {/* Bottom Floating Order Dock Widget */}
      <section className="sticky bottom-20 z-30 w-full mt-space-xs">
        <div
          className={`flex items-center justify-between p-space-sm pl-space-md backdrop-blur-2xl transition-all ${
            isDark
              ? 'rounded-full bg-surface-container-highest/90 shadow-[0_12px_36px_rgba(0,0,0,0.7),0_0_24px_rgba(255,184,109,0.18)]'
              : 'rounded-2xl bg-surface-container-lowest/95 shadow-[0_12px_36px_rgba(15,23,42,0.18)]'
          }`}
        >
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-title-md text-on-surface font-bold tabular-nums">
                {totalTrayItems} in Tray
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant"></span>
              <span className="text-title-md text-primary font-bold tabular-nums">
                ${totalTrayPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-[13px] text-tertiary">schedule</span>
              <span className="text-label-sm font-medium">Est. prep: 6–8 mins</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('cart')}
            className="flex items-center gap-2 px-space-lg py-3 rounded-full bg-primary text-on-primary text-label-lg font-bold shadow-[0_4px_16px_rgba(217,119,6,0.35)] active:scale-95 hover:opacity-95 transition-all"
          >
            <span>Order Now</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </section>
    </div>
  );
};
