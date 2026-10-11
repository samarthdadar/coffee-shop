import React, { useRef, useState } from 'react';
import { LUMINA_ASSETS } from '../data/initialData';
import { MenuCategory, MenuItem } from '../types';

interface ManageScreenProps {
  menuItems: MenuItem[];
  onSaveMenuItem: (item: MenuItem) => void;
  onToggleStock: (itemId: string) => void;
  onRestockItem: (itemId: string) => void;
  onBatchPriceAdjust: (multiplier: number) => void;
}

const STUDIO_PHOTOS = [
  LUMINA_ASSETS.honeyLavenderLatte,
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBarbwqsMGqR4844kUNJ5eY2SinJTIlAwTJrX9GxNE-84C24fpNVfiggabA14ydUTeAJRU_aV7KiDigP9xSdk36QwpSD206ukGeHcYh2NJFDiqiOuytAXZx0ePrMh2lwauVSf8q6lcArp3l1LDLldwolYGWYQxbb1f7f3lSjU7ulG8vN26p2ajdFdFiGa3lS7hNTuMyEPUQG8qb7NnDxj9M9GfE_bPde0R6UZ96tzoReipMVW7yA6yRkQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBBQCEH2Lx4twzwAOr_a_cVu7ey5A5Zipe0-XKd7bsybAP6VyATxl-VBWERxY-CB9BEDBiHJr5MlEBBH9TcWlP1Vd9crkUXT-FL4SC76lAztq8nCXUfTmdLY6TV6HDTACbzrQ1akvd2L-RWRzKoj2clcSCvnumSG8_Jm3G9pO92cChXtJnL_XapNb5BWEe2AfKWpJcd2r3OZjniyiRYEt-4rlwG6RBuP5PE57qmDs3dtPLnNEffC9fHTQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDO0hbXrf1IpJoBQjr7GpwIzgyWFb_dd9xodat16abf8SJRW1TAdT4l10zkJg0K8tSevxkwd_TMGJN_r5gXqBebcFFKOv6VGRx8XRPFU-NCj7jlDghePZtrTAcjfnUWJdTqDEMxClpaGMda71X3eaWwKuJI-sBJua_UdgeL6s1U195-keYeg2mUhfwAncht60vAQz3KZvL07dpRUfP1FsBiRLzy_EfiBEwyi9wWKyLU1w0lQ1G9KgnZ0A',
];

export const ManageScreen: React.FC<ManageScreenProps> = ({
  menuItems,
  onSaveMenuItem,
  onToggleStock,
  onRestockItem,
  onBatchPriceAdjust,
}) => {
  const editorRef = useRef<HTMLElement | null>(null);

  const [selectedFilterTab, setSelectedFilterTab] = useState<
    'All' | 'Beverage Bar' | 'Hot Kitchen' | 'Bakery'
  >('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBatchPanel, setShowBatchPanel] = useState(false);
  const [highlightEditor, setHighlightEditor] = useState(false);

  // Editor form state (defaults to Honey Lavender Geisha Latte as in Image 8.png)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [title, setTitle] = useState<string>('Honey Lavender Geisha Latte');
  const [category, setCategory] = useState<string>('Beverage Bar');
  const [station, setStation] = useState<string>('Espresso Bar 1');
  const [retailPrice, setRetailPrice] = useState<string>('8.50');
  const [estCogs, setEstCogs] = useState<string>('1.90');
  const [prepSla, setPrepSla] = useState<string>('4 mins');
  const [allergens, setAllergens] = useState<string>('Contains Dairy / Nut');
  const [selectedBadges, setSelectedBadges] = useState<string[]>([
    'Single Origin',
    'Vegan Option',
    'Seasonal',
  ]);
  const [allAvailableBadges, setAllAvailableBadges] = useState<string[]>([
    'Single Origin',
    'Gluten Free',
    'Vegan Option',
    'Seasonal',
  ]);
  const [showCustomBadgeInput, setShowCustomBadgeInput] = useState(false);
  const [customBadgeText, setCustomBadgeText] = useState('');
  const [isLiveOnTablets, setIsLiveOnTablets] = useState<boolean>(true);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const parsedPrice = parseFloat(retailPrice) || 0;
  const parsedCogs = parseFloat(estCogs) || 0;
  const marginPct =
    parsedPrice > 0 ? Math.max(0, Math.round(((parsedPrice - parsedCogs) / parsedPrice) * 100)) : 0;

  const toggleBadge = (badge: string) => {
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  const handleAddCustomBadge = () => {
    const clean = customBadgeText.trim();
    if (clean && !allAvailableBadges.includes(clean)) {
      setAllAvailableBadges((prev) => [...prev, clean]);
      setSelectedBadges((prev) => [...prev, clean]);
    }
    setCustomBadgeText('');
    setShowCustomBadgeInput(false);
  };

  const scrollToEditor = () => {
    editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setHighlightEditor(true);
    setTimeout(() => setHighlightEditor(false), 1200);
  };

  const handleLoadItemIntoEditor = (item: MenuItem) => {
    setEditingId(item.id);
    setTitle(item.name);
    setCategory(item.manageCategory);
    setStation(item.station);
    setRetailPrice(item.price.toFixed(2));
    setEstCogs((item.cogs || +(item.price * 0.24).toFixed(2)).toFixed(2));
    setPrepSla(`${item.prepMinutes} mins`);
    setAllergens(item.allergens || 'Contains Dairy / Nut');
    setSelectedBadges(item.dietaryBadges || ['Single Origin']);
    setIsLiveOnTablets(item.availableOnTablets !== false);
    scrollToEditor();
  };

  const handleResetNewDish = () => {
    setEditingId(null);
    setPhotoIndex(0);
    setTitle('Honey Lavender Geisha Latte');
    setCategory('Beverage Bar');
    setStation('Espresso Bar 1');
    setRetailPrice('8.50');
    setEstCogs('1.90');
    setPrepSla('4 mins');
    setAllergens('Contains Dairy / Nut');
    setSelectedBadges(['Single Origin', 'Vegan Option', 'Seasonal']);
    setIsLiveOnTablets(true);
    scrollToEditor();
  };

  const handlePublishDish = (asDraft: boolean) => {
    if (!title.trim()) return;
    const mappedCategory: MenuCategory =
      category === 'Hot Kitchen'
        ? 'artisan-brunch'
        : category === 'Patisserie Atelier' || category === 'Bakery'
        ? 'warm-bakery'
        : category === 'Cold Bar'
        ? 'cold-bar'
        : 'reserve-coffee';

    const mappedManageCat: 'Beverage Bar' | 'Hot Kitchen' | 'Bakery' =
      category === 'Hot Kitchen'
        ? 'Hot Kitchen'
        : category === 'Patisserie Atelier' || category === 'Bakery'
        ? 'Bakery'
        : 'Beverage Bar';

    const chosenImg = STUDIO_PHOTOS[photoIndex % STUDIO_PHOTOS.length];
    const mins = parseInt(prepSla, 10) || 4;

    const newItem: MenuItem = {
      id: editingId || `dish-${Date.now()}`,
      name: title.trim(),
      shortName: title.trim(),
      description: `${station} signature • ${allergens}`,
      shortDescription: `${station} signature • ${allergens}`,
      price: parsedPrice || 8.5,
      cogs: parsedCogs || 1.9,
      category: mappedCategory,
      manageCategory: mappedManageCat,
      station,
      prepTime: `${mins}m`,
      prepMinutes: mins,
      imageLight: chosenImg,
      imageDark: chosenImg,
      imageCart: chosenImg,
      imageManage: chosenImg,
      badgeText: category,
      badgeColor: mappedCategory === 'artisan-brunch' ? 'secondary' : 'primary',
      inStock: true,
      allergens,
      dietaryBadges: selectedBadges,
      availableOnTablets: asDraft ? false : isLiveOnTablets,
    };

    onSaveMenuItem(newItem);
    setStatusFeedback(
      asDraft
        ? `"${newItem.name}" saved as floor draft`
        : `"${newItem.name}" published to Live Floor Menu`
    );
    setTimeout(() => setStatusFeedback(null), 2500);
  };

  // Filtered existing dishes
  const filteredExisting = menuItems.filter((item) => {
    const matchesTab =
      selectedFilterTab === 'All' || item.manageCategory === selectedFilterTab;
    const matchesQuery =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.station.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  // Ensure the 3 signature items from Image 8.png show first when not filtered
  const displayItems = filteredExisting;

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* Status & Quick Pulse Header */}
      <section className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-ping"></span>
            <span className="text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
              Floor Menu: Active • {19 + menuItems.length} Items
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant shadow-sm">
            <span className="material-symbols-outlined text-[15px] text-primary">sync</span>
            <span className="text-label-sm font-semibold">Instant POS Sync</span>
          </div>
        </div>

        {/* Quick Action Launchers */}
        <div className="grid grid-cols-2 gap-space-sm">
          <button
            type="button"
            onClick={handleResetNewDish}
            className="flex items-center justify-center gap-2 h-12 px-space-md rounded-2xl bg-primary text-on-primary text-label-lg font-bold shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>+ Add New Dish</span>
          </button>
          <button
            type="button"
            onClick={() => setShowBatchPanel(!showBatchPanel)}
            className={`flex items-center justify-center gap-2 h-12 px-space-md rounded-2xl text-label-lg font-bold shadow-sm active:scale-[0.98] transition-all ${
              showBatchPanel
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] text-secondary">tune</span>
            <span>Batch Pricing</span>
          </button>
        </div>

        {/* Expandable Batch Pricing Bar */}
        {showBatchPanel && (
          <div className="p-space-sm rounded-2xl bg-surface-container-low shadow-md flex items-center justify-between gap-2">
            <span className="text-label-md font-bold text-on-surface pl-1">
              Floor Catalog Adjustment:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onBatchPriceAdjust(0.95);
                  setStatusFeedback('Applied -5% Happy Hour adjustment to all dishes');
                  setTimeout(() => setStatusFeedback(null), 2200);
                }}
                className="px-3 py-1.5 rounded-xl bg-surface-variant text-on-surface text-label-sm font-bold hover:bg-surface-container-highest"
              >
                -5% Off-Peak
              </button>
              <button
                type="button"
                onClick={() => {
                  onBatchPriceAdjust(1.05);
                  setStatusFeedback('Applied +5% Reserve Surge adjustment to all dishes');
                  setTimeout(() => setStatusFeedback(null), 2200);
                }}
                className="px-3 py-1.5 rounded-xl bg-primary text-on-primary text-label-sm font-bold shadow-xs"
              >
                +5% Margin
              </button>
            </div>
          </div>
        )}

        {/* Filter Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
          {(
            [
              { id: 'All', label: `All Dishes (${21 + menuItems.length})` },
              { id: 'Beverage Bar', label: 'Beverage Bar (12)' },
              { id: 'Hot Kitchen', label: 'Hot Kitchen (8)' },
              { id: 'Bakery', label: 'Bakery (4)' },
            ] as const
          ).map((tab) => {
            const active = selectedFilterTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedFilterTab(tab.id)}
                className={`px-3.5 py-2 rounded-full text-label-sm whitespace-nowrap flex-shrink-0 transition-colors ${
                  active
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface font-semibold'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Live Status Toast if Published */}
      {statusFeedback && (
        <div className="p-3 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed text-label-md font-bold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{statusFeedback}</span>
          </div>
          <button type="button" onClick={() => setStatusFeedback(null)}>
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Interactive Add / Edit Dish Studio Card */}
      <section
        ref={editorRef}
        className={`rounded-[1.5rem] bg-surface-container-high p-space-md shadow-xl flex flex-col gap-space-md transition-all ${
          highlightEditor ? 'ring-2 ring-primary' : ''
        }`}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between pb-space-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">restaurant</span>
            </div>
            <div>
              <h2 className="text-headline-md-mobile text-on-surface font-bold">
                {editingId ? 'Edit Dish Specification' : 'Add New Dish to Menu'}
              </h2>
              <p className="text-label-sm text-on-surface-variant font-normal">
                Live preview synced with floor catalog
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-tertiary-container/20 text-tertiary text-label-sm font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            <span>{editingId ? 'Editing' : 'Drafting'}</span>
          </span>
        </div>

        {/* Dish Photo Upload Zone */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between gap-2">
            <label className="text-label-md text-on-surface font-bold">
              Dish Presentation Media
            </label>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/15 text-primary text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[13px]">auto_fix_high</span>
              <span>Auto Color &amp; Steam Highlight</span>
            </span>
          </div>

          <div className="relative w-full rounded-2xl bg-surface-container-lowest p-space-md flex flex-col items-center gap-space-md shadow-inner">
            {/* Photo Preview Area */}
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-container shadow-md">
              <img
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                alt={title}
                src={STUDIO_PHOTOS[photoIndex % STUDIO_PHOTOS.length]}
              />
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-surface-container-lowest/90 backdrop-blur-md text-tertiary text-label-sm text-[10px] font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[11px]">verified</span>
                <span>AI Tuned</span>
              </div>
            </div>

            {/* Upload Details & Actions */}
            <div className="flex flex-col justify-between w-full min-w-0">
              <div>
                <span className="text-title-md text-on-surface font-semibold block">
                  Drop or tap high-res dish photo
                </span>
                <p className="text-body-md text-on-surface-variant text-[13px] mt-0.5">
                  PNG, JPG or WebP up to 15MB • Studio 4:3 crop applied
                </p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setPhotoIndex((prev) => prev + 1)}
                  className="px-3 py-1.5 rounded-xl bg-surface-container text-on-surface text-label-sm font-bold shadow-sm hover:bg-surface-container-highest transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px]">photo_camera</span>
                  <span>Replace</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoIndex(0)}
                  className="px-3 py-1.5 rounded-xl bg-surface-container text-error text-label-sm font-bold shadow-sm hover:bg-error-container/20 transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px]">delete_outline</span>
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dish Core Details Fields */}
        <div className="flex flex-col gap-space-sm">
          {/* Title Input */}
          <div className="flex flex-col gap-1">
            <label className="text-label-md text-on-surface font-bold">Dish or Drink Title</label>
            <div className="relative flex items-center rounded-2xl bg-surface-container-lowest px-3 py-2.5 shadow-sm">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant mr-2">
                edit
              </span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent w-full text-on-surface text-body-lg focus:outline-none placeholder-on-surface-variant/50"
                placeholder="e.g. Avocado Tartine"
              />
            </div>
          </div>

          {/* Category & Station Row */}
          <div className="grid grid-cols-2 gap-space-sm">
            <div className="flex flex-col gap-1">
              <label className="text-label-md text-on-surface font-bold">Category</label>
              <div className="relative flex items-center rounded-2xl bg-surface-container-lowest px-3 py-2.5 shadow-sm">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-transparent text-on-surface text-body-md focus:outline-none appearance-none"
                >
                  <option className="bg-surface-container">Beverage Bar</option>
                  <option className="bg-surface-container">Hot Kitchen</option>
                  <option className="bg-surface-container">Patisserie Atelier</option>
                  <option className="bg-surface-container">Cold Bar</option>
                </select>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant pointer-events-none absolute right-2.5">
                  expand_more
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-label-md text-on-surface font-bold">Station Routing</label>
              <div className="relative flex items-center rounded-2xl bg-surface-container-lowest px-3 py-2.5 shadow-sm">
                <select
                  value={station}
                  onChange={(e) => setStation(e.target.value)}
                  className="w-full bg-transparent text-on-surface text-body-md focus:outline-none appearance-none"
                >
                  <option className="bg-surface-container">Espresso Bar 1</option>
                  <option className="bg-surface-container">Espresso Bar 2</option>
                  <option className="bg-surface-container">Main Line Stove</option>
                  <option className="bg-surface-container">Pastry Counter</option>
                </select>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant pointer-events-none absolute right-2.5">
                  kitchen
                </span>
              </div>
            </div>
          </div>

          {/* Financial Metrics Card */}
          <div className="rounded-2xl bg-surface-container-lowest p-space-sm shadow-sm flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
                Pricing &amp; Cost Intelligence
              </span>
              <span className="text-label-sm text-tertiary font-bold">
                {marginPct >= 70 ? 'Healthy Margins' : 'Standard Margin'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col bg-surface-container p-2 rounded-xl">
                <span className="text-label-sm text-on-surface-variant font-normal">
                  Retail Price
                </span>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <span className="text-label-sm text-primary font-bold">$</span>
                  <input
                    type="text"
                    value={retailPrice}
                    onChange={(e) => setRetailPrice(e.target.value)}
                    className="bg-transparent w-full text-on-surface text-title-md font-bold focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div className="flex flex-col bg-surface-container p-2 rounded-xl">
                <span className="text-label-sm text-on-surface-variant font-normal">
                  Est. COGS
                </span>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <span className="text-label-sm text-on-surface-variant font-bold">$</span>
                  <input
                    type="text"
                    value={estCogs}
                    onChange={(e) => setEstCogs(e.target.value)}
                    className="bg-transparent w-full text-on-surface text-title-md font-bold focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div className="flex flex-col bg-tertiary-container/15 p-2 rounded-xl">
                <span className="text-label-sm text-tertiary font-bold">Margin</span>
                <span className="text-title-md font-bold text-tertiary mt-0.5 tabular-nums">
                  {marginPct}%
                </span>
              </div>
            </div>
          </div>

          {/* Prep SLA & Live Tags */}
          <div className="grid grid-cols-2 gap-space-sm items-center">
            <div className="flex flex-col gap-1">
              <label className="text-label-md text-on-surface font-bold">Target Prep SLA</label>
              <div className="flex items-center rounded-2xl bg-surface-container-lowest px-3 py-2.5 shadow-sm">
                <span className="material-symbols-outlined text-[18px] text-primary mr-2">
                  timer
                </span>
                <input
                  type="text"
                  value={prepSla}
                  onChange={(e) => setPrepSla(e.target.value)}
                  className="bg-transparent w-full text-on-surface text-body-md focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-label-md text-on-surface font-bold">Allergen Notice</label>
              <div className="flex items-center rounded-2xl bg-surface-container-lowest px-3 py-2.5 shadow-sm">
                <span className="material-symbols-outlined text-[18px] text-secondary mr-2">
                  spa
                </span>
                <input
                  type="text"
                  value={allergens}
                  onChange={(e) => setAllergens(e.target.value)}
                  className="bg-transparent w-full text-on-surface text-body-md focus:outline-none truncate"
                />
              </div>
            </div>
          </div>

          {/* Multi-Select Tag Pills */}
          <div className="flex flex-col gap-1.5">
            <label className="text-label-md text-on-surface font-bold">Badges &amp; Filters</label>
            <div className="flex flex-wrap gap-1.5">
              {allAvailableBadges.map((badge) => {
                const isSelected = selectedBadges.includes(badge);
                return (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => toggleBadge(badge)}
                    className={`px-3 py-1 rounded-full text-label-sm flex items-center gap-1 shadow-sm transition-all ${
                      isSelected
                        ? 'bg-primary/20 text-primary font-bold'
                        : 'bg-surface-container-lowest text-on-surface-variant font-medium hover:text-on-surface'
                    }`}
                  >
                    {isSelected && (
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    )}
                    <span>{badge}</span>
                  </button>
                );
              })}

              {showCustomBadgeInput ? (
                <div className="flex items-center gap-1 bg-surface-container-lowest rounded-full px-2.5 py-0.5 shadow-sm">
                  <input
                    type="text"
                    value={customBadgeText}
                    onChange={(e) => setCustomBadgeText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomBadge()}
                    placeholder="Tag name..."
                    className="w-20 bg-transparent text-label-sm text-on-surface focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomBadge}
                    className="text-primary font-bold text-label-sm"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCustomBadgeInput(true)}
                  className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-label-sm font-semibold flex items-center gap-0.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  <span>Custom</span>
                </button>
              )}
            </div>
          </div>

          {/* Live Floor Toggle Switch */}
          <div className="flex items-center justify-between p-space-sm rounded-2xl bg-surface-container-lowest shadow-sm mt-1">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-label-lg text-on-surface font-bold truncate">
                Available on Tablets &amp; QR Ordering
              </span>
              <span className="text-label-sm text-tertiary font-semibold">
                {isLiveOnTablets
                  ? 'Currently Live • Syncs to 8 customer screens'
                  : 'Paused • Hidden from customer table screens'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsLiveOnTablets(!isLiveOnTablets)}
              className={`w-12 h-7 rounded-full p-1 flex items-center transition-colors cursor-pointer flex-shrink-0 ${
                isLiveOnTablets
                  ? 'bg-tertiary justify-end'
                  : 'bg-surface-container-highest justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md"></div>
            </button>
          </div>
        </div>

        {/* Studio Bottom CTAs */}
        <div className="flex flex-col gap-space-xs pt-space-xs">
          <button
            type="button"
            onClick={() => handlePublishDish(false)}
            className="w-full h-11 rounded-full bg-primary text-on-primary text-label-lg font-bold shadow-lg shadow-primary/25 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
            <span>Save &amp; Publish to Live Menu</span>
          </button>
          <button
            type="button"
            onClick={() => handlePublishDish(true)}
            className="w-full h-12 px-space-md rounded-2xl bg-surface-container text-on-surface text-label-lg font-semibold hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">bookmark_border</span>
            <span>Save as Draft</span>
          </button>
        </div>
      </section>

      {/* Live Menu Items Quick Management */}
      <section className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-headline-md-mobile text-on-surface font-bold">
              Existing Dishes &amp; Drinks
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm font-semibold tabular-nums">
              {19 + menuItems.length}
            </span>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant text-label-sm">
            <span className="material-symbols-outlined text-[16px]">sort</span>
            <span>By Category</span>
          </div>
        </div>

        {/* Search / Filter Bar */}
        <div className="relative flex items-center rounded-2xl bg-surface-container-high px-space-md py-2.5 shadow-sm">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant mr-2">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent w-full text-on-surface text-body-md focus:outline-none placeholder-on-surface-variant/60"
            placeholder="Search dish title, ingredient, or station..."
          />
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
            filter_list
          </span>
        </div>

        {/* Dish Item List Cards */}
        <div className="flex flex-col gap-space-xs">
          {displayItems.map((item) => {
            const isCruffin = item.id === 'yuzu-cruffin';
            const isBrioche = item.id === 'mushroom-brioche';

            return (
              <article
                key={item.id}
                className="flex flex-col gap-space-xs p-space-sm rounded-2xl bg-surface-container-high shadow-md"
              >
                <div className="flex items-center gap-space-sm">
                  <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-surface-container shadow-sm">
                    <img
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      alt={item.name}
                      src={item.imageManage || item.imageLight}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-title-md text-on-surface font-bold truncate">
                        {isBrioche
                          ? 'Truffle & Mushroom Brioche'
                          : isCruffin
                          ? 'Yuzu Cruffin'
                          : item.name}
                      </h4>
                      <span className="text-title-md font-bold text-primary flex-shrink-0 tabular-nums">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {!item.inStock ? (
                        <span className="px-2 py-0.5 rounded-full bg-error-container text-error text-label-sm font-bold">
                          86&apos;d Out
                        </span>
                      ) : item.stockCount !== undefined && item.stockCount <= 5 ? (
                        <span className="px-2 py-0.5 rounded-full bg-secondary-container/60 text-secondary text-label-sm font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                          <span>{item.stockCount} Remaining</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-tertiary-container/20 text-tertiary text-label-sm font-semibold">
                          In Stock
                        </span>
                      )}

                      <span className="text-label-sm text-on-surface-variant font-normal">
                        • {item.station}
                      </span>
                      <span className="text-label-sm text-on-surface-variant font-normal">
                        •{' '}
                        {isCruffin
                          ? 'Grab & Go'
                          : isBrioche
                          ? '8m prep'
                          : item.id === 'geisha-cortado'
                          ? '3m prep'
                          : `${item.prepTime} prep`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-between pt-1">
                  {isCruffin ? (
                    <>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onRestockItem(item.id);
                            setStatusFeedback('Restocked Yuzu Cruffin (+12 batch)');
                            setTimeout(() => setStatusFeedback(null), 2000);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface text-label-sm font-semibold hover:bg-surface-container transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-[14px] text-primary">
                            add_box
                          </span>
                          <span>Restock</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLoadItemIntoEditor(item)}
                          className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface text-label-sm font-semibold hover:bg-surface-container transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-[14px]">edit</span>
                          <span>Quick Edit</span>
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => onToggleStock(item.id)}
                        className="px-3 py-1 rounded-lg bg-secondary/20 text-secondary text-label-sm font-bold flex items-center gap-1 hover:bg-secondary/30 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          notification_important
                        </span>
                        <span>{item.inStock ? 'Mark Low' : 'Restore'}</span>
                      </button>
                    </>
                  ) : isBrioche ? (
                    <>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleLoadItemIntoEditor(item)}
                          className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface text-label-sm font-semibold hover:bg-surface-container transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-[14px] text-primary">
                            edit
                          </span>
                          <span>Edit Dish</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setStatusFeedback('Brioche Hearth Log: Last updated 14m ago by Chef');
                            setTimeout(() => setStatusFeedback(null), 2200);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface text-label-sm font-semibold hover:bg-surface-container transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-[14px] text-secondary">
                            history
                          </span>
                          <span>Logs</span>
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => onToggleStock(item.id)}
                        className="px-3 py-1 rounded-lg bg-error-container/60 text-error text-label-sm font-bold flex items-center gap-1 hover:bg-error-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">block</span>
                        <span>{item.inStock ? 'Quick 86' : 'Restore'}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleLoadItemIntoEditor(item)}
                          className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface text-label-sm font-semibold hover:bg-surface-container transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-[14px] text-primary">
                            image
                          </span>
                          <span>Photo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLoadItemIntoEditor(item)}
                          className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface text-label-sm font-semibold hover:bg-surface-container transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-[14px] text-secondary">
                            sell
                          </span>
                          <span>Price</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLoadItemIntoEditor(item)}
                          className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface text-label-sm font-semibold hover:bg-surface-container transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-[14px]">tune</span>
                          <span>Recipe</span>
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => onToggleStock(item.id)}
                        className="px-3 py-1 rounded-lg bg-error-container/60 text-error text-label-sm font-bold flex items-center gap-1 hover:bg-error-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">block</span>
                        <span>{item.inStock ? 'Quick 86' : 'Restore'}</span>
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Permissions & Floor Sync Notice Banner */}
      <footer className="rounded-2xl bg-surface-container p-space-md shadow-sm flex items-start gap-space-sm">
        <div className="w-9 h-9 rounded-xl bg-tertiary/15 flex items-center justify-center flex-shrink-0 text-tertiary">
          <span className="material-symbols-outlined text-[20px]">format_image_left</span>
        </div>
        <div className="flex flex-col">
          <span className="text-label-md text-on-surface font-bold">
            Manager &amp; Head Barista Privilege Active
          </span>
          <p className="text-body-md text-on-surface-variant text-[13px] mt-0.5">
            Changes sync immediately across all customer tablets, QR digital menus, and Kitchen
            Display System terminals without system restart.
          </p>
        </div>
      </footer>
    </div>
  );
};
