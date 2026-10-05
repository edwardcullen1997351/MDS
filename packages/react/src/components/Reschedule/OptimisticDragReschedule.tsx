/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- drag-and-drop board and order cards expose keyboard state and drop targets */
import React, { useState, useCallback, useRef } from 'react';
import './OptimisticDragReschedule.css';

export interface RescheduleOrderBlock {
  id: string;
  code: string;
  name: string;
  shift: 1 | 2 | 3;
  lineId: string;
  lineName: string;
  quantity: number;
  uom: string;
  transitLeadTimeHours?: number;
  maxLineCapacity?: number;
  status?: 'idle' | 'validating' | 'confirmed' | 'error';
  errorMessage?: string;
}

export interface ShiftColumnDefinition {
  shiftNumber: 1 | 2 | 3;
  name: string;
  timeWindow: string;
  capacityLimit: number;
  uom: string;
}

export interface OptimisticDragRescheduleProps {
  /** Initial array of scheduled order blocks */
  orders?: RescheduleOrderBlock[];
  /** Definitions for the 3 shift columns */
  shifts?: ShiftColumnDefinition[];
  /** Async validation function returning whether capacity and lead time pass */
  onValidateReschedule?: (
    order: RescheduleOrderBlock,
    targetShift: 1 | 2 | 3
  ) => Promise<{ valid: boolean; reason?: string }>;
  /** Callback fired when an order successfully commits to a new shift */
  onRescheduleSuccess?: (order: RescheduleOrderBlock, newShift: 1 | 2 | 3) => void;
  /** Callback fired when validation fails and rebound animation triggers */
  onRescheduleFailure?: (order: RescheduleOrderBlock, attemptedShift: 1 | 2 | 3, reason: string) => void;
  /** Optional custom CSS class */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

const DEFAULT_SHIFTS: ShiftColumnDefinition[] = [
  { shiftNumber: 1, name: 'Shift 1 (Morning)', timeWindow: '06:00 – 14:00', capacityLimit: 2000, uom: 'L' },
  { shiftNumber: 2, name: 'Shift 2 (Evening)', timeWindow: '14:00 – 22:00', capacityLimit: 1500, uom: 'L' },
  { shiftNumber: 3, name: 'Shift 3 (Night)', timeWindow: '22:00 – 06:00', capacityLimit: 1200, uom: 'L' },
];

const DEFAULT_ORDERS: RescheduleOrderBlock[] = [
  {
    id: 'ord-101',
    code: 'ORD-2026-9041',
    name: 'Herbal Blend Master Liquid 901',
    shift: 1,
    lineId: 'line-01',
    lineName: 'Line 01 - Packaging (High Speed)',
    quantity: 1200,
    uom: 'L',
    maxLineCapacity: 2000,
  },
  {
    id: 'ord-102',
    code: 'ORD-2026-9042',
    name: 'Dibo-Doc Decoction Phase 2',
    shift: 2,
    lineId: 'line-02',
    lineName: 'Line 02 - Syrup Bottling',
    quantity: 1400,
    uom: 'L',
    transitLeadTimeHours: 4,
    maxLineCapacity: 1500,
  },
  {
    id: 'ord-103',
    code: 'ORD-2026-9043',
    name: 'Triphala Standardized Liquid Extract',
    shift: 2,
    lineId: 'line-02',
    lineName: 'Line 02 - Syrup Bottling',
    quantity: 600,
    uom: 'L',
    maxLineCapacity: 1500,
  },
];

/**
 * OptimisticDragReschedule (Wave 3 — Interaction Pattern)
 *
 * High-density manufacturing drag-and-drop reschedule pattern:
 * - Drag order block between shift columns → UI updates immediately with optimistic state.
 * - Background validation verifies line capacity and material transit lead time.
 * - If validation fails: order block smoothly bounces back with spring animation and error indicator.
 */
export const OptimisticDragReschedule: React.FC<OptimisticDragRescheduleProps> = ({
  orders: initialOrders = DEFAULT_ORDERS,
  shifts = DEFAULT_SHIFTS,
  onValidateReschedule,
  onRescheduleSuccess,
  onRescheduleFailure,
  className = '',
  style,
}) => {
  const [orders, setOrders] = useState<RescheduleOrderBlock[]>(initialOrders);
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);
  const [dragOverShift, setDragOverShift] = useState<number | null>(null);
  const [reboundingOrderId, setReboundingOrderId] = useState<string | null>(null);
  const originalShiftRef = useRef<Record<string, 1 | 2 | 3>>({});

  // Default validation rule (Line 2 / Shift 3 capacity checks)
  const defaultValidator = useCallback(
    async (order: RescheduleOrderBlock, targetShift: 1 | 2 | 3) => {
      // Simulate network / capacity check latency (400ms)
      await new Promise((r) => setTimeout(r, 450));

      const targetCol = shifts.find((s) => s.shiftNumber === targetShift);
      const capacityLimit = targetCol?.capacityLimit || 1500;

      // Fail condition 1: Exceeds capacity
      if (order.quantity > capacityLimit) {
        return {
          valid: false,
          reason: `Exceeds ${targetCol?.name} capacity (${order.quantity}/${capacityLimit} ${order.uom})`,
        };
      }

      // Fail condition 2: Transit lead time violation on Shift 1
      if (targetShift === 1 && order.transitLeadTimeHours && order.transitLeadTimeHours > 2) {
        return {
          valid: false,
          reason: `Transit lead time (+${order.transitLeadTimeHours}h) misses Shift 1 cutoff`,
        };
      }

      return { valid: true };
    },
    [shifts]
  );

  const executeReschedule = useCallback(
    async (orderId: string, targetShift: 1 | 2 | 3) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order || order.shift === targetShift) return;

      const previousShift = order.shift;
      originalShiftRef.current[orderId] = previousShift;

      // 1. Optimistic Update: Move block immediately
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, shift: targetShift, status: 'validating', errorMessage: undefined }
            : o
        )
      );

      // 2. Validate asynchronously
      const validator = onValidateReschedule || defaultValidator;
      const result = await validator(order, targetShift);

      if (result.valid) {
        // Success: Transition to confirmed
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: 'confirmed' } : o))
        );
        onRescheduleSuccess?.(order, targetShift);

        // Clear confirmed badge after 2 seconds
        setTimeout(() => {
          setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, status: 'idle' } : o))
          );
        }, 2000);
      } else {
        // Failure: Trigger smooth bounce back
        setReboundingOrderId(orderId);
        onRescheduleFailure?.(order, targetShift, result.reason || 'Validation failed');

        // Allow bounce animation to run then revert shift
        setTimeout(() => {
          setOrders((prev) =>
            prev.map((o) =>
              o.id === orderId
                ? {
                    ...o,
                    shift: previousShift,
                    status: 'error',
                    errorMessage: result.reason,
                  }
                : o
            )
          );
          setReboundingOrderId(null);
        }, 400);
      }
    },
    [orders, onValidateReschedule, defaultValidator, onRescheduleSuccess, onRescheduleFailure]
  );

  // HTML5 Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, order: RescheduleOrderBlock) => {
    e.dataTransfer.setData('text/plain', order.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedOrderId(order.id);
  };

  const handleDragOver = (e: React.DragEvent, shiftNum: 1 | 2 | 3) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverShift !== shiftNum) {
      setDragOverShift(shiftNum);
    }
  };

  const handleDragLeave = () => {
    setDragOverShift(null);
  };

  const handleDrop = (e: React.DragEvent, targetShift: 1 | 2 | 3) => {
    e.preventDefault();
    setDragOverShift(null);
    const orderId = e.dataTransfer.getData('text/plain') || draggedOrderId;
    setDraggedOrderId(null);
    if (orderId) {
      executeReschedule(orderId, targetShift);
    }
  };

  const handleDismissError = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'idle', errorMessage: undefined } : o))
    );
  };

  return (
    <div className={`ds-drag-reschedule ${className}`} style={style}>
      <div className="ds-drag-reschedule__header">
        <div>
          <h3 className="ds-drag-reschedule__title">Shift Dispatch Board</h3>
          <p className="ds-drag-reschedule__subtitle">
            Drag order cards across shift columns to reschedule. Validates line capacity & transit lead times in real time.
          </p>
        </div>
      </div>

      <div className="ds-drag-reschedule__board" role="region" aria-label="Shift Dispatch Board">
        {shifts.map((col) => {
          const colOrders = orders.filter((o) => o.shift === col.shiftNumber);
          const totalQty = colOrders.reduce((sum, o) => sum + o.quantity, 0);
          const isOverCapacity = totalQty > col.capacityLimit;
          const isDragTarget = dragOverShift === col.shiftNumber;

          return (
            <div
              key={col.shiftNumber}
              className={`ds-drag-reschedule__col ${isDragTarget ? 'ds-drag-reschedule__col--dragover' : ''}`}
              onDragOver={(e) => handleDragOver(e, col.shiftNumber)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.shiftNumber)}
              role="group"
              aria-label={`${col.name}, ${colOrders.length} orders scheduled`}
            >
              <div className="ds-drag-reschedule__col-header">
                <div className="ds-drag-reschedule__col-title-group">
                  <span className="ds-drag-reschedule__col-name">{col.name}</span>
                  <span className="ds-drag-reschedule__col-time">{col.timeWindow}</span>
                </div>
                <div
                  className={`ds-drag-reschedule__col-capacity ${
                    isOverCapacity ? 'ds-drag-reschedule__col-capacity--exceeded' : ''
                  }`}
                >
                  {totalQty} / {col.capacityLimit} {col.uom}
                </div>
              </div>

              <div className="ds-drag-reschedule__order-list">
                {colOrders.length === 0 ? (
                  <div className="ds-drag-reschedule__empty-slot">
                    <span>Drop order here to assign {col.name}</span>
                  </div>
                ) : (
                  colOrders.map((order) => {
                    const isDragging = draggedOrderId === order.id;
                    const isRebounding = reboundingOrderId === order.id;
                    const isValidating = order.status === 'validating';
                    const isConfirmed = order.status === 'confirmed';
                    const isError = order.status === 'error';

                    return (
                      <div
                        key={order.id}
                        draggable={!isValidating}
                        onDragStart={(e) => handleDragStart(e, order)}
                        className={`ds-drag-order-card ${isDragging ? 'ds-drag-order-card--dragging' : ''} ${
                          isRebounding ? 'ds-drag-order-card--rebounding' : ''
                        } ${isValidating ? 'ds-drag-order-card--validating' : ''} ${
                          isConfirmed ? 'ds-drag-order-card--confirmed' : ''
                        } ${isError ? 'ds-drag-order-card--error' : ''}`}
                        tabIndex={0}
                        role="article"
                        aria-grabbed={isDragging}
                        aria-label={`Order ${order.code}, Quantity: ${order.quantity} ${order.uom}, ${order.status || 'idle'}`}
                      >
                        <div className="ds-drag-order-card__header">
                          <span className="ds-drag-order-card__code">{order.code}</span>
                          <span className="ds-drag-order-card__qty">
                            {order.quantity} {order.uom}
                          </span>
                        </div>

                        <div className="ds-drag-order-card__name">{order.name}</div>
                        <div className="ds-drag-order-card__line">{order.lineName}</div>

                        {/* Optimistic Status Feedback */}
                        {isValidating && (
                          <div className="ds-drag-order-card__status ds-drag-order-card__status--validating">
                            <span className="ds-drag-order-card__spinner" aria-hidden="true" />
                            <span>Validating line capacity & transit...</span>
                          </div>
                        )}

                        {isConfirmed && (
                          <div className="ds-drag-order-card__status ds-drag-order-card__status--confirmed">
                            <span aria-hidden="true">✓</span>
                            <span>Rescheduled to Shift {order.shift}</span>
                          </div>
                        )}

                        {/* Validation Rebound Error Banner */}
                        {isError && order.errorMessage && (
                          <div className="ds-drag-order-card__error-banner">
                            <div className="ds-drag-order-card__error-text">
                              <span aria-hidden="true">⚠️</span>
                              <span>{order.errorMessage}</span>
                            </div>
                            <button
                              type="button"
                              className="ds-drag-order-card__dismiss-btn"
                              onClick={() => handleDismissError(order.id)}
                              title="Dismiss error"
                            >
                              ✕
                            </button>
                          </div>
                        )}

                        {/* Shift Quick Jump Buttons for Touch/Keyboard */}
                        <div className="ds-drag-order-card__shift-pills" aria-label="Quick reschedule to shift">
                          <span className="ds-drag-order-card__shift-label">Move:</span>
                          {([1, 2, 3] as const).map((s) => (
                            <button
                              key={s}
                              type="button"
                              disabled={order.shift === s || isValidating}
                              className={`ds-drag-order-card__shift-btn ${
                                order.shift === s ? 'ds-drag-order-card__shift-btn--active' : ''
                              }`}
                              onClick={() => executeReschedule(order.id, s)}
                            >
                              S{s}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
