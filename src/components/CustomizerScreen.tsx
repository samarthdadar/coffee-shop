import React, { useState } from 'react';
import { CustomSpec, MenuItem, ScreenId } from '../types';

interface CustomizerScreenProps {
  selectedItem: MenuItem;
  onAddCustomizedToCart: (item: MenuItem, spec: CustomSpec, finalPrice: number) => void;
  onNavigate: (screen: ScreenId) => void;
}

const VESSEL_OPTIONS = [
  {
    id: '6oz' as const,
    label: '6oz Cortado Glass',
    sublabel: 'Heavy crystal tumbler · 1:1 ratio',
    icon: 'wine_bar',
    price: 0.0,
    priceTag: 'Included',
  },
  {
    id: '8oz' as const,
    label: '8oz Ceramic Reserve',
    sublabel: 'Handcrafted stoneware cup',
    icon: 'coffee',
    price: 0.5,
    priceTag: '+ $0.50',
  },
  {
    id: '12oz' as const,
    label: '12oz Draught Double',
    sublabel: 'Double shot + micro-textured volume',
    icon: 'local_cafe',
    price: 1.25,
    priceTag: '+ $1.25',
  },
];

const MILK_OPTIONS = [
  {
    id: 'guernsey' as const,
    label: 'Organic Guernsey Whole Milk',
    sublabel: 'A2 protein · High butterfat standard',
    price: 0.0,
    priceTag: 'Standard',
    badge: undefined,
  },
  {
    id: 'oat' as const,
    label: 'Minor Figures Barista Oat',
    sublabel: 'Neutral sweetness · Dense velvety microfoam',
    price: 0.5,
    priceTag: '+ $0.50',
    badge: 'Barista Pick',
  },
  {
    id: 'almond' as const,
    label: 'Silk Sprouted Almond',
    sublabel: 'Cold-pressed · Light roasted nut notes',
    price: 0.5,
    priceTag: '+ $0.50',
    badge: undefined,
  },
  {
    id: 'macadamia' as const,
    label: 'Artisanal Macadamia Cream',
    sublabel: 'Australian macadamia · Rich buttery mouthfeel',
    price: 0.75,
    priceTag: '+ $0.75',
    badge: undefined,
  },
];

const SWEETENER_OPTIONS = [
  {
    id: 'smoked-vanilla' as const,
    label: 'House Smoked Vanilla',
    sublabel: 'Bourbon barrel smoked',
    icon: 'workspace_premium',
  },
  {
    id: 'demerara' as const,
    label: 'Raw Demerara Syrup',
    sublabel: 'Unrefined cane sugar',
    icon: 'grain',
  },
  {
    id: 'monkfruit' as const,
    label: 'Monkfruit Extract',
    sublabel: 'Zero sugar · Keto-pure',
    icon: 'nature',
  },
  {
    id: 'unsweetened' as const,
    label: 'Pure Unsweetened',
    sublabel: 'Natural espresso notes',
    icon: 'block',
  },
];

const TEMP_OPTIONS = [
  {
    id: '65' as const,
    label: '65°C Velvety',
    sublabel: 'Ideal Sweetness',
    icon: 'thermostat',
  },
  {
    id: 'ice' as const,
    label: 'Carved Ice',
    sublabel: 'Clear Block',
    icon: 'ac_unit',
  },
  {
    id: '75' as const,
    label: '75°C Hot',
    sublabel: 'Extended Heat',
    icon: 'mode_heat',
  },
];

export const CustomizerScreen: React.FC<CustomizerScreenProps> = ({
  selectedItem,
  onAddCustomizedToCart,
  onNavigate,
}) => {
  const [vessel, setVessel] = useState<'6oz' | '8oz' | '12oz'>('6oz');
  const [milk, setMilk] = useState<'guernsey' | 'oat' | 'almond' | 'macadamia'>('oat');
  const [sweetener, setSweetener] = useState<
    'smoked-vanilla' | 'demerara' | 'monkfruit' | 'unsweetened'
  >('smoked-vanilla');
  const [pumps, setPumps] = useState<number>(2);
  const [temp, setTemp] = useState<'65' | 'ice' | '75'>('65');
  const [notes, setNotes] = useState<string>('');
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);
  const [isListeningVoice, setIsListeningVoice] = useState<boolean>(false);

  const selectedVesselObj = VESSEL_OPTIONS.find((v) => v.id === vessel) || VESSEL_OPTIONS[0];
  const selectedMilkObj = MILK_OPTIONS.find((m) => m.id === milk) || MILK_OPTIONS[1];
  const selectedSweetenerObj =
    SWEETENER_OPTIONS.find((s) => s.id === sweetener) || SWEETENER_OPTIONS[0];
  const selectedTempObj = TEMP_OPTIONS.find((t) => t.id === temp) || TEMP_OPTIONS[0];

  const basePrice = selectedItem.price;
  const totalSpecPrice = basePrice + selectedVesselObj.price + selectedMilkObj.price;

  const handleQuickPill = (phrase: string) => {
    const clean = phrase.replace('+', '').trim();
    if (notes.toLowerCase().includes(clean.toLowerCase())) {
      const updated = notes
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.toLowerCase() !== clean.toLowerCase())
        .join(', ');
      setNotes(updated);
    } else {
      setNotes((prev) => (prev.trim() ? `${prev.trim()}, ${clean}` : clean));
    }
  };

  const handleVoiceSimulate = () => {
    setIsListeningVoice(true);
    setTimeout(() => {
      setIsListeningVoice(false);
      setNotes((prev) =>
        prev.trim() ? `${prev.trim()}, Extra dry foam crown` : 'Extra dry foam crown'
      );
    }, 700);
  };

  const handleSubmitOrder = () => {
    const spec: CustomSpec = {
      vessel,
      vesselLabel: selectedVesselObj.label,
      vesselPrice: selectedVesselObj.price,
      milk,
      milkLabel: selectedMilkObj.label,
      milkPrice: selectedMilkObj.price,
      sweetener,
      sweetenerLabel: selectedSweetenerObj.label,
      pumps: sweetener === 'unsweetened' ? 0 : pumps,
      temp,
      tempLabel: selectedTempObj.label,
      notes: notes.trim(),
    };

    onAddCustomizedToCart(selectedItem, spec, totalSpecPrice);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 1400);
  };

  const heroImg =
    selectedItem.imageCustomHero || selectedItem.imageLight || selectedItem.imageDark;

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* Top Navigation & Back Row */}
      <div className="flex items-center justify-between w-full">
        <button
          type="button"
          aria-label="Go Back"
          onClick={() => onNavigate('menu')}
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface shadow-sm active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-label-sm uppercase tracking-wider text-primary font-bold">
            Origin Series · Lot #82
          </span>
          <span className="text-title-md text-on-surface font-semibold">Bespoke Spec</span>
        </div>
        <button
          type="button"
          aria-label="Save Recipe"
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shadow-sm active:scale-95 transition-all ${
            isBookmarked ? 'text-primary' : 'text-on-surface'
          }`}
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
          >
            {isBookmarked ? 'bookmark' : 'bookmark_border'}
          </span>
        </button>
      </div>

      {/* Hero Dish Showcase Card */}
      <div className="w-full bg-surface-container rounded-[1.5rem] p-space-md shadow-sm relative overflow-hidden flex flex-col gap-space-md">
        <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-surface-variant flex-shrink-0">
          <img
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            alt={selectedItem.name}
            src={heroImg}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-surface-container/90 backdrop-blur-md shadow-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span className="text-label-sm text-on-surface font-semibold tracking-wide uppercase">
              Single Origin Reserve
            </span>
          </div>
          <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-primary text-on-primary text-label-lg font-bold shadow-md tabular-nums">
            ${basePrice.toFixed(2)}{' '}
            <span className="text-label-sm font-normal opacity-90">Base</span>
          </div>
        </div>

        <div className="flex flex-col gap-space-xs">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-headline-lg-mobile text-on-surface font-bold tracking-tight">
              {selectedItem.name}
            </h2>
          </div>
          <p className="text-body-md text-on-surface-variant">
            Panama Boquete cold-smoked with hickory shavings, paired with velvety double-extracted
            Geisha espresso and organic Madagascar bourbon bean reduction.
          </p>
        </div>

        {/* Tasting Notes Tags */}
        <div className="flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container text-label-sm font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">location_on</span>
            Panama Boquete
          </span>
          <span className="px-2.5 py-1 rounded-full bg-surface-variant text-on-surface text-label-sm font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">local_florist</span>
            Jasmine Florals
          </span>
          <span className="px-2.5 py-1 rounded-full bg-primary-container/30 text-on-primary-container text-label-sm font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">eco</span>
            Bourbon Vanilla
          </span>
          <span className="px-2.5 py-1 rounded-full bg-surface-variant text-on-surface text-label-sm font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">arrow_back_ios_new</span>
            Candied Bergamot
          </span>
        </div>

        {/* Roast Profile Indicator Bar */}
        <div className="w-full bg-surface-container-high rounded-2xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">
                local_fire_department
              </span>
              <span className="text-label-md text-on-surface font-semibold">
                Nordic Profile #3
              </span>
            </div>
            <span className="text-label-sm text-primary font-bold uppercase tracking-wider">
              Citric-Caramel Balance
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden flex">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: '48%' }}
            ></div>
          </div>
          <div className="flex justify-between text-label-sm text-on-surface-variant">
            <span>Light Nordic</span>
            <span className="text-primary font-semibold">City+</span>
            <span>Dark Vienna</span>
          </div>
        </div>
      </div>

      {/* Interactive Customization Form */}
      <form
        className="flex flex-col gap-space-md"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitOrder();
        }}
      >
        {/* Section 1: Vessel Architecture */}
        <section className="w-full bg-surface-container rounded-[1.5rem] p-space-md shadow-sm flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-label-sm font-bold">
                1
              </span>
              <h3 className="text-title-md text-on-surface font-semibold">Vessel Architecture</h3>
            </div>
            <span className="text-label-sm text-primary font-bold uppercase tracking-wider">
              Required
            </span>
          </div>
          <p className="text-body-md text-on-surface-variant">
            Crafted ergonomics calibrated for thermal retention and crema concentration.
          </p>

          <div className="grid grid-cols-1 gap-2 pt-1">
            {VESSEL_OPTIONS.map((opt) => {
              const isSelected = vessel === opt.id;
              return (
                <label
                  key={opt.id}
                  onClick={() => setVessel(opt.id)}
                  className={`relative flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-primary-container/25 shadow-sm'
                      : 'bg-surface-container-high hover:bg-surface-variant'
                  }`}
                >
                  <input
                    type="radio"
                    name="vessel"
                    value={opt.id}
                    checked={isSelected}
                    onChange={() => setVessel(opt.id)}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shadow-sm ${
                        isSelected ? 'text-primary' : 'text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[22px]">{opt.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-label-lg text-on-surface font-semibold">
                        {opt.label}
                      </span>
                      <span className="text-body-md text-on-surface-variant">{opt.sublabel}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-label-sm ${
                        opt.price === 0
                          ? 'text-on-surface font-semibold'
                          : 'text-primary font-bold'
                      }`}
                    >
                      {opt.priceTag}
                    </span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'bg-surface-container-highest text-on-surface-variant'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[16px] ${
                          isSelected ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        check
                      </span>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        {/* Section 2: Dairy & Plant Elixir */}
        <section className="w-full bg-surface-container rounded-[1.5rem] p-space-md shadow-sm flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-label-sm font-bold">
                2
              </span>
              <h3 className="text-title-md text-on-surface font-semibold">
                Dairy &amp; Plant Elixir
              </h3>
            </div>
            <span className="text-label-sm text-on-surface-variant">Microfoam choice</span>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            {MILK_OPTIONS.map((opt) => {
              const isSelected = milk === opt.id;
              return (
                <label
                  key={opt.id}
                  onClick={() => setMilk(opt.id)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-primary-container/25 shadow-sm'
                      : 'bg-surface-container-high hover:bg-surface-variant'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="milk"
                      value={opt.id}
                      checked={isSelected}
                      onChange={() => setMilk(opt.id)}
                      className="accent-primary w-4 h-4"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-label-md text-on-surface font-semibold">
                          {opt.label}
                        </span>
                        {opt.badge && (
                          <span className="px-1.5 py-0.5 rounded bg-tertiary/10 text-tertiary text-label-sm text-[10px] font-bold">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-label-sm text-on-surface-variant font-normal">
                        {opt.sublabel}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-label-sm flex-shrink-0 ml-2 ${
                      opt.price === 0 ? 'text-on-surface font-medium' : 'text-primary font-bold'
                    }`}
                  >
                    {opt.priceTag}
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Section 3: Sweetness Infusion & Pumps */}
        <section className="w-full bg-surface-container rounded-[1.5rem] p-space-md shadow-sm flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-label-sm font-bold">
                3
              </span>
              <h3 className="text-title-md text-on-surface font-semibold">Sweetness Infusion</h3>
            </div>
            <span className="text-label-sm text-primary font-semibold">Real Ingredients</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {SWEETENER_OPTIONS.map((opt) => {
              const isSelected = sweetener === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSweetener(opt.id);
                    if (opt.id === 'unsweetened') {
                      setPumps(0);
                    } else if (pumps === 0) {
                      setPumps(2);
                    }
                  }}
                  className={`p-3 rounded-2xl text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'bg-primary-container/25 shadow-xs'
                      : 'bg-surface-container-high hover:bg-surface-variant'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        isSelected ? 'text-primary' : 'text-on-surface-variant'
                      }`}
                    >
                      {opt.icon}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? 'bg-primary' : 'bg-transparent'
                      }`}
                    ></span>
                  </div>
                  <div className="mt-2">
                    <p className="text-label-md text-on-surface font-semibold">{opt.label}</p>
                    <p className="text-label-sm text-on-surface-variant font-normal">
                      {opt.sublabel}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Pump Stepper Bar */}
          <div className="w-full bg-surface-container-high rounded-2xl p-3 flex items-center justify-between mt-1">
            <div className="flex flex-col">
              <span className="text-label-md text-on-surface font-semibold">
                Vanilla Intensity
              </span>
              <span className="text-label-sm text-on-surface-variant font-normal">
                {pumps === 0
                  ? 'Pure unsweetened'
                  : pumps === 2
                  ? 'Balanced recipe (2 pumps)'
                  : `${pumps} pump${pumps > 1 ? 's' : ''}`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Decrease pumps"
                onClick={() => setPumps((p) => Math.max(0, p - 1))}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface shadow-sm active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">remove</span>
              </button>
              <span className="text-title-md text-primary font-bold min-w-[20px] text-center tabular-nums">
                {pumps}
              </span>
              <button
                type="button"
                aria-label="Increase pumps"
                onClick={() => {
                  if (sweetener === 'unsweetened') setSweetener('smoked-vanilla');
                  setPumps((p) => Math.min(6, p + 1));
                }}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface shadow-sm active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section 4: Thermal Extraction */}
        <section className="w-full bg-surface-container rounded-[1.5rem] p-space-md shadow-sm flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-label-sm font-bold">
                4
              </span>
              <h3 className="text-title-md text-on-surface font-semibold">Thermal Extraction</h3>
            </div>
            <span className="text-label-sm text-on-surface-variant">Steaming profile</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {TEMP_OPTIONS.map((opt) => {
              const isSelected = temp === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTemp(opt.id)}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isSelected ? '' : 'text-on-surface-variant'
                    }`}
                  >
                    {opt.icon}
                  </span>
                  <span className="text-label-md font-bold">{opt.label}</span>
                  <span
                    className={`text-label-sm text-[10px] font-normal ${
                      isSelected ? 'opacity-90' : 'text-on-surface-variant'
                    }`}
                  >
                    {opt.sublabel}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 5: Barista Special Notes */}
        <section className="w-full bg-surface-container rounded-[1.5rem] p-space-md shadow-sm flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-label-sm font-bold">
                5
              </span>
              <h3 className="text-title-md text-on-surface font-semibold">
                Barista Special Notes
              </h3>
            </div>
            <span className="material-symbols-outlined text-primary text-[18px]">draw</span>
          </div>

          <div className="relative w-full">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-12 pl-3.5 pr-11 rounded-2xl bg-surface-container-high text-on-surface placeholder:text-on-surface-variant text-body-md focus:outline-none focus:bg-surface-container-highest transition-all"
              placeholder="e.g. Extra dry foam crown, dust cinnamon, separate cup"
            />
            <button
              type="button"
              aria-label="Voice dictation"
              onClick={handleVoiceSimulate}
              className={`absolute right-2 top-2 w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center shadow-sm transition-colors ${
                isListeningVoice
                  ? 'text-tertiary animate-pulse'
                  : 'text-primary hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">mic</span>
            </button>
          </div>

          {/* Quick Note Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {['+ Cinnamon dusting', '+ Extra hot steam', '+ Split shot'].map((pill) => {
              const clean = pill.replace('+', '').trim();
              const isIncluded = notes.toLowerCase().includes(clean.toLowerCase());
              return (
                <button
                  key={pill}
                  type="button"
                  onClick={() => handleQuickPill(pill)}
                  className={`px-2.5 py-1 rounded-full text-label-sm transition-all ${
                    isIncluded
                      ? 'bg-primary/20 text-primary font-bold'
                      : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-variant'
                  }`}
                >
                  {pill}
                </button>
              );
            })}
          </div>
        </section>
      </form>

      {/* Sticky Bottom Summary & CTA Dock */}
      <div className="sticky bottom-20 z-40 w-full mt-2">
        <div className="w-full bg-surface-container/95 backdrop-blur-xl rounded-2xl p-space-md shadow-[0_16px_36px_rgba(15,23,42,0.15)] flex items-center justify-between gap-space-md">
          <div className="flex flex-col min-w-0">
            <span className="text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Total Order Spec
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-headline-lg-mobile text-on-surface font-bold tracking-tight tabular-nums">
                ${totalSpecPrice.toFixed(2)}
              </span>
              <span className="text-label-sm text-on-surface-variant font-normal">Tax incl.</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmitOrder}
            className={`flex-1 max-w-[210px] h-12 px-4 rounded-full text-label-lg font-bold flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(217,119,6,0.35)] active:scale-95 transition-all ${
              addedSuccess ? 'bg-tertiary text-on-tertiary' : 'bg-primary text-on-primary'
            }`}
          >
            {addedSuccess ? (
              <>
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Added to Spec</span>
              </>
            ) : (
              <>
                <span>Add to Order</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
