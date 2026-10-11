import React, { useEffect, useState } from 'react';
import { KitchenItemStatus, KitchenTicket } from '../types';

interface KitchenScreenProps {
  tickets: KitchenTicket[];
  onCycleItemStatus: (ticketId: string, itemId: string) => void;
  onBumpTicket: (ticketId: string) => void;
  onRecallTicket: (ticketId: string) => void;
}

const STATUS_META: Record<
  KitchenItemStatus,
  { label: string; icon: string; className: string }
> = {
  extracting: {
    label: 'Extracting',
    icon: 'coffee_maker',
    className: 'bg-primary/20 text-primary',
  },
  cooking: {
    label: 'Hearth Prep',
    icon: 'Outdoor_grill',
    className: 'bg-secondary-container text-on-secondary-container',
  },
  ready: {
    label: 'Ready',
    icon: 'check_circle',
    className: 'bg-tertiary-container/25 text-tertiary',
  },
  urgent: {
    label: 'Urgent SLA',
    icon: 'warning',
    className: 'bg-error-container text-error',
  },
};

export const KitchenScreen: React.FC<KitchenScreenProps> = ({
  tickets,
  onCycleItemStatus,
  onBumpTicket,
  onRecallTicket,
}) => {
  const [selectedLane, setSelectedLane] = useState<
    'All' | 'Espresso Bar' | 'Warm Kitchen' | 'Pastry Atelier' | 'Completed'
  >('All');
  const [tickOffset, setTickOffset] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickOffset((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2200);
  };

  const activeTickets = tickets.filter((t) => t.status === 'active');
  const completedTickets = tickets.filter((t) => t.status === 'completed');

  const displayedTickets =
    selectedLane === 'Completed'
      ? completedTickets
      : activeTickets.filter((ticket) => {
          if (selectedLane === 'All') return true;
          return ticket.items.some((i) => i.station === selectedLane);
        });

  const formatTimer = (baseSeconds: number) => {
    const total = baseSeconds + tickOffset;
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="p-3 rounded-2xl bg-primary/20 text-on-surface flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              notifications_active
            </span>
            <span className="text-label-md font-bold">{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* 1. Top KPI Metrics Grid */}
      <section className="grid grid-cols-2 gap-space-sm">
        <div className="p-space-md rounded-DEFAULT bg-surface-container-low shadow-sm flex items-center gap-space-sm">
          <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
          </div>
          <div className="flex flex-col">
            <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">
              Active Line
            </span>
            <span className="text-headline-md text-on-surface font-bold tabular-nums">
              {activeTickets.length} Tickets
            </span>
          </div>
        </div>

        <div className="p-space-md rounded-DEFAULT bg-surface-container-low shadow-sm flex items-center gap-space-sm">
          <div className="w-10 h-10 rounded-full bg-tertiary/15 text-tertiary flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">speed</span>
          </div>
          <div className="flex flex-col">
            <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">
              Avg Extraction
            </span>
            <span className="text-headline-md text-on-surface font-bold tabular-nums">
              04m 12s
            </span>
          </div>
        </div>
      </section>

      {/* 2. Pulsing Status Ribbon */}
      <section className="flex items-center justify-between px-space-md py-2.5 rounded-DEFAULT bg-surface-container-low shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary"></span>
          </span>
          <span className="text-label-md text-on-surface font-semibold truncate">
            KDS Live Floor Sync • Tap status pills to advance prep
          </span>
        </div>
        <span className="text-label-sm text-tertiary font-bold uppercase tracking-wider flex-shrink-0">
          98% On-Time
        </span>
      </section>

      {/* 3. Filter Lane Navigation */}
      <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {(
          [
            { id: 'All', label: `All Lanes (${activeTickets.length})` },
            { id: 'Espresso Bar', label: 'Espresso Bar' },
            { id: 'Warm Kitchen', label: 'Warm Kitchen' },
            { id: 'Pastry Atelier', label: 'Pastry Atelier' },
            { id: 'Completed', label: `Bumped (${completedTickets.length})` },
          ] as const
        ).map((lane) => {
          const isActive = selectedLane === lane.id;
          return (
            <button
              key={lane.id}
              type="button"
              onClick={() => setSelectedLane(lane.id)}
              className={`px-3.5 py-2 rounded-full text-label-sm font-bold whitespace-nowrap flex-shrink-0 transition-all ${
                isActive
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface shadow-xs'
              }`}
            >
              {lane.label}
            </button>
          );
        })}
      </nav>

      {/* 4. Live Order Ticket Stack */}
      <div className="flex flex-col gap-space-md">
        {displayedTickets.length === 0 ? (
          <div className="rounded-DEFAULT bg-surface-container-low p-space-xl text-center flex flex-col items-center gap-2 shadow-xs">
            <span className="material-symbols-outlined text-[32px] text-tertiary">
              check_circle
            </span>
            <p className="text-title-md text-on-surface font-semibold">
              {selectedLane === 'Completed'
                ? 'No Bumped Tickets Yet'
                : 'All Station Tickets Cleared'}
            </p>
            <p className="text-body-md text-on-surface-variant">
              New orders placed from the Table Cart will appear here automatically.
            </p>
          </div>
        ) : (
          displayedTickets.map((ticket) => {
            const readyCount = ticket.items.filter((i) => i.status === 'ready').length;
            const allReady = readyCount === ticket.items.length;

            return (
              <article
                key={ticket.id}
                className="rounded-DEFAULT bg-surface-container-low p-space-md shadow-md flex flex-col gap-space-sm"
              >
                {/* Ticket Header */}
                <div className="flex items-center justify-between gap-2 pb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <h2 className="text-headline-md text-on-surface font-bold tracking-tight">
                      {ticket.tableNumber}
                    </h2>
                    <span className="px-2.5 py-1 rounded-full bg-surface-variant text-on-surface-variant text-label-sm font-semibold truncate">
                      {ticket.zone} • {ticket.guests}G
                    </span>
                  </div>

                  <div
                    className={`px-3 py-1 rounded-full text-label-md font-bold flex items-center gap-1 tabular-nums ${
                      ticket.isUrgent
                        ? 'bg-error-container text-error'
                        : allReady
                        ? 'bg-tertiary-container/25 text-tertiary'
                        : 'bg-primary/15 text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">timer</span>
                    <span>{formatTimer(ticket.elapsedSeconds)}</span>
                  </div>
                </div>

                {/* Recessed Item Tray */}
                <div className="flex flex-col gap-2 p-2 rounded-2xl bg-surface-variant/60">
                  {ticket.items.map((item) => {
                    const meta = STATUS_META[item.status];
                    return (
                      <div
                        key={item.id}
                        onClick={() =>
                          ticket.status === 'active' && onCycleItemStatus(ticket.id, item.id)
                        }
                        className="p-2.5 rounded-DEFAULT bg-surface-container-lowest flex items-center justify-between gap-2.5 shadow-2xs cursor-pointer hover:opacity-95 active:scale-[0.99] transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            referrerPolicy="no-referrer"
                            src={item.image}
                            alt={item.name}
                            className="w-11 h-11 rounded-DEFAULT object-cover flex-shrink-0 bg-surface-variant"
                          />
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-label-lg font-bold text-primary tabular-nums">
                                {item.quantity}×
                              </span>
                              <span className="text-title-md text-on-surface font-semibold truncate">
                                {item.name}
                              </span>
                            </div>
                            <span className="text-label-sm text-on-surface-variant truncate font-normal">
                              {item.modifiers}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Status Chip */}
                        <button
                          type="button"
                          className={`px-3 py-1.5 rounded-full text-label-sm font-bold flex items-center gap-1 flex-shrink-0 transition-all ${meta.className}`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {item.status === 'cooking' ? 'skillet' : meta.icon}
                          </span>
                          <span>{meta.label}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Dual-Button Action Footer */}
                <div className="grid grid-cols-2 gap-space-sm pt-1">
                  {ticket.status === 'active' ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          showToast(`Runner paged for ${ticket.tableNumber} (${ticket.zone})`)
                        }
                        className="h-11 rounded-xl bg-surface-variant hover:bg-surface-container-highest text-on-surface text-label-md font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                      >
                        <span className="material-symbols-outlined text-[18px] text-secondary">
                          notifications_active
                        </span>
                        <span>Page Runner</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onBumpTicket(ticket.id);
                          showToast(`${ticket.tableNumber} ticket bumped to floor pass`);
                        }}
                        className="h-11 rounded-xl bg-primary text-on-primary text-label-md font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <span className="material-symbols-outlined text-[18px]">done_all</span>
                        <span>Bump Ticket ({readyCount}/{ticket.items.length})</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onRecallTicket(ticket.id)}
                      className="col-span-2 h-10 rounded-xl bg-surface-variant text-on-surface text-label-md font-bold flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">undo</span>
                      <span>Recall Ticket to Active Line</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
