import React, { useState } from 'react';
import { CartItem, ScreenId, TableSession } from '../types';

interface CartScreenProps {
  cartItems: CartItem[];
  onUpdateCartQty: (cartItemId: string, delta: number) => void;
  onRemoveCartItem: (cartItemId: string) => void;
  onPlaceOrder: (paymentMethod: 'apple-pay' | 'table-pos', totalPaid: number) => void;
  onNavigate: (screen: ScreenId) => void;
  activeTable: TableSession;
  tables: TableSession[];
  onSelectTable: (table: TableSession) => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  cartItems,
  onUpdateCartQty,
  onRemoveCartItem,
  onPlaceOrder,
  onNavigate,
  activeTable,
  tables,
  onSelectTable,
}) => {
  const [tipRate, setTipRate] = useState<number>(0.18);
  const [isCustomTip, setIsCustomTip] = useState<boolean>(false);
  const [customTipAmount, setCustomTipAmount] = useState<string>('6.00');
  const [isSplitActive, setIsSplitActive] = useState<boolean>(false);
  const [showTablePicker, setShowTablePicker] = useState<boolean>(false);
  const [orderSuccessReceipt, setOrderSuccessReceipt] = useState<{
    method: string;
    total: number;
    ticketNumber: string;
  } | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.08875;
  const tax = +(subtotal * taxRate).toFixed(2);
  const gratuity = isCustomTip
    ? Math.max(0, parseFloat(customTipAmount) || 0)
    : +(subtotal * tipRate).toFixed(2);
  const totalDue = +(subtotal + tax + gratuity).toFixed(2);
  const guestCount = activeTable.guests || 2;
  const perGuestAmount = +(totalDue / guestCount).toFixed(2);

  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = (method: 'apple-pay' | 'table-pos') => {
    if (cartItems.length === 0) return;
    onPlaceOrder(method, totalDue);
    setOrderSuccessReceipt({
      method: method === 'apple-pay' ? 'Apple Pay NFC' : 'Table Server POS',
      total: isSplitActive ? perGuestAmount : totalDue,
      ticketNumber: `#${Math.floor(851 + Math.random() * 48)}`,
    });
  };

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* Table Session Context Bar */}
      <div className="relative overflow-hidden rounded-DEFAULT bg-surface-container-low p-space-md shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary-container/60 flex items-center justify-center flex-shrink-0 text-on-primary-container">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                table_restaurant
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-title-md text-on-surface font-semibold tracking-tight">
                  {activeTable.tableName}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-label-sm font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                  Active
                </span>
              </div>
              <span className="text-body-md text-on-surface-variant truncate">
                {activeTable.solariumZone} • {activeTable.guests} Guest
                {activeTable.guests > 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Change active table"
            onClick={() => setShowTablePicker(!showTablePicker)}
            className="flex-shrink-0 h-8 px-3 rounded-full bg-surface-variant hover:bg-surface-container-highest active:scale-95 text-on-surface text-label-md transition-all"
          >
            {showTablePicker ? 'Done' : 'Change'}
          </button>
        </div>

        {showTablePicker && (
          <div className="mt-3 pt-3 border-t border-outline-variant/40 grid grid-cols-3 gap-2">
            {tables.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onSelectTable(t);
                  setShowTablePicker(false);
                }}
                className={`p-2 rounded-xl text-left transition-all ${
                  t.id === activeTable.id
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-variant text-on-surface hover:bg-surface-container-highest'
                }`}
              >
                <div className="text-label-md font-bold">{t.tableName}</div>
                <div className="text-[10px] opacity-80 truncate">{t.solariumZone}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Prep Forecast Card */}
      <div className="rounded-DEFAULT bg-surface-container-low p-space-md shadow-[0_8px_24px_rgba(15,23,42,0.04)] flex items-start gap-space-sm">
        <div className="w-9 h-9 rounded-2xl bg-secondary-fixed flex items-center justify-center flex-shrink-0 text-on-secondary-fixed">
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            timer
          </span>
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center justify-between gap-space-xs">
            <span className="text-title-md text-on-surface font-semibold">
              Kitchen Pace ~11 mins
            </span>
            <span className="text-label-sm uppercase tracking-wider text-primary font-bold">
              Synchronized
            </span>
          </div>
          <p className="text-body-md text-on-surface-variant mt-0.5">
            Paced to table • Brioche hearth roast controls delivery order
          </p>
          <div className="w-full bg-surface-variant h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: '42%' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Banner if Checkout Just Completed */}
      {orderSuccessReceipt && (
        <div className="rounded-DEFAULT bg-tertiary-fixed/40 border border-tertiary/30 p-space-md flex flex-col gap-2 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-[22px]">
                check_circle
              </span>
              <span className="text-title-md font-bold text-on-surface">
                Order Dispatched to Kitchen ({orderSuccessReceipt.ticketNumber})
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOrderSuccessReceipt(null)}
              className="text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
          <p className="text-body-md text-on-surface-variant">
            Paid <strong>${orderSuccessReceipt.total.toFixed(2)}</strong> via{' '}
            {orderSuccessReceipt.method}. Your ticket is now live on the Kitchen Display Board.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onNavigate('kitchen')}
              className="px-4 py-2 rounded-full bg-tertiary text-on-tertiary text-label-md font-bold flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">countertops</span>
              <span>Track on Kitchen Board</span>
            </button>
          </div>
        </div>
      )}

      {/* Artisan Order Tray */}
      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between px-space-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-title-md text-on-surface font-semibold">Artisan Order Tray</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-label-sm font-bold tabular-nums">
              {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('menu')}
            className="text-on-surface-variant hover:text-primary text-label-md flex items-center gap-0.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add more</span>
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-DEFAULT bg-surface-container-low p-space-xl text-center flex flex-col items-center gap-2 shadow-xs">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant">
              shopping_bag
            </span>
            <p className="text-title-md text-on-surface font-semibold">Your Table Tray is Empty</p>
            <p className="text-body-md text-on-surface-variant">
              Explore our single-origin reserve coffees and warm kitchen signatures.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('menu')}
              className="mt-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-label-md font-bold shadow-sm"
            >
              Browse Curated Menu
            </button>
          </div>
        ) : (
          cartItems.map((item) => {
            const stationBadgeClass =
              item.stationColor === 'secondary'
                ? 'bg-secondary-fixed-dim/30 text-on-secondary-container'
                : item.stationColor === 'primary'
                ? 'bg-primary-fixed text-on-primary-fixed-variant'
                : 'bg-tertiary-fixed text-on-tertiary-fixed-variant';

            return (
              <div
                key={item.id}
                className="group rounded-DEFAULT bg-surface-container-low p-space-md shadow-[0_6px_20px_rgba(15,23,42,0.03)] flex flex-col gap-space-sm transition-all hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
              >
                <div className="flex items-start gap-space-sm">
                  <img
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl object-cover bg-surface-variant flex-shrink-0"
                    alt={item.name}
                    src={item.image}
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-space-xs">
                      <h2 className="text-title-md text-on-surface font-semibold tracking-tight truncate">
                        {item.name}
                      </h2>
                      <span className="text-title-md text-on-surface font-bold flex-shrink-0 tabular-nums">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <span className="text-body-md text-on-surface-variant truncate">
                      {item.subtitle}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-label-sm font-medium ${stationBadgeClass}`}
                      >
                        {item.stationBadge}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant text-label-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">
                          {item.isReadyNow ? 'bolt' : 'schedule'}
                        </span>
                        <span>{item.prepBadge}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => onRemoveCartItem(item.id)}
                    className="w-8 h-8 rounded-full bg-surface-variant/80 hover:bg-error-container hover:text-on-error-container text-on-surface-variant flex items-center justify-center transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                  <div className="flex items-center gap-2 bg-surface-container-high rounded-full p-1">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => onUpdateCartQty(item.id, -1)}
                      className="w-7 h-7 rounded-full bg-surface-container hover:bg-surface-container-highest active:scale-95 text-on-surface flex items-center justify-center font-bold transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">remove</span>
                    </button>
                    <span className="text-label-lg font-bold text-on-surface px-1 min-w-[1.25rem] text-center tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => onUpdateCartQty(item.id, 1)}
                      className="w-7 h-7 rounded-full bg-surface-container hover:bg-surface-container-highest active:scale-95 text-on-surface flex items-center justify-center font-bold transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Artisan Gratuity & Bill Section */}
      <div className="rounded-DEFAULT bg-surface-container-low p-space-md shadow-[0_8px_24px_rgba(15,23,42,0.04)] flex flex-col gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <span className="text-title-md text-on-surface font-semibold">Artisan Gratuity</span>
            <span className="text-label-sm text-primary font-bold">
              {isCustomTip ? `$${gratuity.toFixed(2)} Custom` : `${Math.round(tipRate * 100)}% Selected`}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-space-xs mt-1">
            {[0.15, 0.18, 0.2].map((rate) => {
              const active = !isCustomTip && Math.abs(tipRate - rate) < 0.001;
              const amount = (subtotal * rate).toFixed(2);
              return (
                <button
                  key={rate}
                  type="button"
                  onClick={() => {
                    setIsCustomTip(false);
                    setTipRate(rate);
                  }}
                  className={`h-11 rounded-2xl text-label-lg active:scale-95 transition-all flex flex-col items-center justify-center ${
                    active
                      ? 'bg-primary text-on-primary font-bold shadow-[0_4px_16px_rgba(217,119,6,0.35)]'
                      : 'bg-surface-variant text-on-surface font-semibold'
                  }`}
                >
                  <span>{Math.round(rate * 100)}%</span>
                  <span
                    className={`text-[10px] leading-none mt-0.5 tabular-nums ${
                      active ? 'opacity-90' : 'opacity-70'
                    }`}
                  >
                    ${amount}
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setIsCustomTip(true)}
              className={`h-11 rounded-2xl text-label-lg active:scale-95 transition-all flex flex-col items-center justify-center ${
                isCustomTip
                  ? 'bg-primary text-on-primary font-bold shadow-[0_4px_16px_rgba(217,119,6,0.35)]'
                  : 'bg-surface-variant text-on-surface font-semibold'
              }`}
            >
              <span>Custom</span>
              <span className="text-[10px] opacity-75 leading-none mt-0.5">Edit</span>
            </button>
          </div>

          {isCustomTip && (
            <div className="flex items-center justify-between bg-surface-variant rounded-xl px-3 py-2 mt-1">
              <span className="text-label-md text-on-surface font-semibold">
                Custom Gratuity ($)
              </span>
              <input
                type="number"
                step="0.50"
                min="0"
                value={customTipAmount}
                onChange={(e) => setCustomTipAmount(e.target.value)}
                className="w-24 text-right bg-surface-container-low rounded-lg px-2 py-1 text-title-md font-bold text-primary focus:outline-none"
              />
            </div>
          )}

          <p className="text-label-sm text-on-surface-variant flex items-center gap-1 mt-1 font-normal">
            <span
              className="material-symbols-outlined text-[14px] text-tertiary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
            <span>100% shared directly with kitchen hearth and barista artisans</span>
          </p>
        </div>

        {/* Equitable Split Bill Interactive Toggle */}
        <div
          onClick={() => setIsSplitActive(!isSplitActive)}
          className="p-space-sm rounded-2xl bg-surface-variant/60 flex items-center justify-between gap-space-sm cursor-pointer select-none"
        >
          <div className="flex items-center gap-space-xs min-w-0">
            <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-primary flex-shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">group</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-label-lg text-on-surface font-semibold">
                Split Bill Equitably
              </span>
              <span className="text-label-sm text-on-surface-variant font-normal">
                Divide balance across {guestCount} guests (${perGuestAmount.toFixed(2)} each)
              </span>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isSplitActive}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
              isSplitActive ? 'bg-primary' : 'bg-outline-variant'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-surface-container shadow-md ring-0 transition duration-200 ease-in-out ${
                isSplitActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            ></span>
          </button>
        </div>

        {/* Bill Breakdown Summary */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center justify-between text-body-md text-on-surface-variant">
            <span>Subtotal</span>
            <span className="font-semibold text-on-surface tabular-nums">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-body-md text-on-surface-variant">
            <span>City Hospitality Tax (8.875%)</span>
            <span className="font-semibold text-on-surface tabular-nums">${tax.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-body-md text-on-surface-variant">
            <span>
              Artisan Gratuity ({isCustomTip ? 'Custom' : `${Math.round(tipRate * 100)}%`})
            </span>
            <span className="font-semibold text-on-surface tabular-nums">
              ${gratuity.toFixed(2)}
            </span>
          </div>
          <div className="w-full h-px bg-surface-variant my-1"></div>
          <div className="flex items-baseline justify-between pt-0.5">
            <div className="flex flex-col">
              <span className="text-title-lg text-on-surface font-bold tracking-tight">
                {isSplitActive ? `Your Share (1/${guestCount})` : 'Total Due'}
              </span>
              <span className="text-label-sm text-on-surface-variant font-normal">
                {isSplitActive
                  ? `Full table total: $${totalDue.toFixed(2)}`
                  : 'All taxes & gratuity inclusive'}
              </span>
            </div>
            <span className="text-headline-lg-mobile font-bold tracking-tight text-primary tabular-nums">
              ${(isSplitActive ? perGuestAmount : totalDue).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Execution Actions */}
      <div className="flex flex-col gap-space-sm pt-space-xs">
        {/* Apple Pay Button */}
        <button
          type="button"
          aria-label="Pay with Apple Pay"
          onClick={() => handleCheckout('apple-pay')}
          className="w-full h-14 rounded-2xl bg-black hover:bg-neutral-900 active:scale-[0.99] text-white flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-all"
        >
          <svg aria-hidden="true" className="h-6 w-auto fill-current" viewBox="0 0 170 85">
            <path d="M45.2 38.6c-.1-7.8 6.4-11.6 6.7-11.8-3.7-5.4-9.3-6.1-11.3-6.2-4.8-.5-9.4 2.8-11.9 2.8-2.4 0-6.2-2.7-10.2-2.7-5.2.1-10.1 3-12.7 7.7-5.4 9.4-1.4 23.3 3.8 30.9 2.6 3.7 5.6 7.8 9.6 7.7 3.9-.2 5.3-2.5 10-2.5 4.7 0 6.1 2.5 10.1 2.4 4.2-.1 6.8-3.7 9.4-7.4 3-4.3 4.2-8.5 4.3-8.7-.1-.1-8.3-3.2-8.4-12.6zM37.3 16.5c2.1-2.6 3.6-6.2 3.2-9.8-3.1.1-6.9 2.1-9.1 4.7-1.9 2.2-3.6 5.9-3.2 9.4 3.5.3 7-1.7 9.1-4.3z"></path>
            <path d="M79.5 56.4V26.2h9.5c6.8 0 11.5 4.5 11.5 11.1 0 6.7-4.8 11.2-11.6 11.2h-4.3v7.9H79.5zm5.1-12.5h4.1c4.2 0 6.6-2.4 6.6-6.6 0-4.1-2.4-6.5-6.6-6.5h-4.1v13.1zm21.3 12.5V34.5h4.8v3.3h.2c1.4-2.4 3.9-3.7 6.6-3.7 4.9 0 8.1 3.4 8.1 8.8v13.5h-5.1V43.4c0-3.3-1.7-5.1-4.4-5.1-2.5 0-4.6 1.8-5.1 4.3v13.8h-5.1zm25.9-27h5.1v4.8h-5.1v14.4c0 1.8.8 2.6 2.5 2.6.9 0 1.7-.1 2.4-.3v4.4c-1.3.4-2.8.6-4.5.6-4.3 0-5.5-2.2-5.5-6.7V39h-3.6v-4.5h3.6v-7.1h5.1v7z"></path>
          </svg>
          <span className="text-headline-md-mobile font-semibold tracking-tight">Pay</span>
        </button>

        {/* Pay at Table Secondary */}
        <button
          type="button"
          onClick={() => handleCheckout('table-pos')}
          className="w-full h-12 rounded-2xl bg-surface-container-low hover:bg-surface-variant active:scale-[0.99] text-on-surface text-label-lg font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <span className="material-symbols-outlined text-[20px] text-primary">point_of_sale</span>
          <span>Pay at Table (Card or Cash to Server)</span>
        </button>

        {/* Table NFC Security Indicator */}
        <div className="flex items-center justify-center gap-1.5 pt-1 text-center">
          <span
            className="material-symbols-outlined text-[16px] text-tertiary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            nfc
          </span>
          <span className="text-label-sm text-on-surface-variant font-normal">
            NFC Paired with {activeTable.tableName} Solarium Terminal
          </span>
        </div>
      </div>
    </div>
  );
};
