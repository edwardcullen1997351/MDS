import React,{ forwardRef,useCallback,useId,useState } from 'react';
import './SortableCollection.css';

export interface SortableItemState {
  index: number;
  position: number;
  total: number;
  grabbed: boolean;
  proposedIndex: number | null;
  immovable: string | null;
}

export interface SortableCollectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style' | 'children'> {
  /** Committed order, as stable unique string identities */
  items: string[];
  /** Accessible name for the collection (e.g. "Work Order Routing Steps") */
  label: string;
  /** Human readable name function for each item */
  itemName: (id: string) => string;
  /** Callback fired when a valid drop commits */
  onMove?: (id: string, fromIndex: number, toIndex: number) => void;
  /** Legality check for candidate drop positions */
  canDrop?: (id: string, toIndex: number, nextOrder: string[]) => true | string | false;
  /** Check whether item is immovable */
  canMove?: (id: string) => true | string | false;
  /** Child nodes mapped to items */
  children?: React.ReactNode;
  /** Alternatively provide renderItem function */
  renderItem?: (id: string, state: SortableItemState) => React.ReactNode;
  /** Move controls: handle with Earlier/Later buttons, or handle only */
  moveControls?: 'handle-and-steppers' | 'handle' | 'none';
  /** Scope of live region announcement */
  announcementScope?: 'position-and-neighbours' | 'position-only';
  /** External announcement listener */
  onAnnounce?: (text: string) => void;
  /** Enable built-in ARIA live region */
  liveRegion?: boolean;
  /** Callback when grab state changes */
  onGrabChange?: (grab: { id: string; originIndex: number; proposedIndex: number } | null) => void;
  /** Disable reordering entirely */
  disabled?: boolean;
  /** Reason for disablement */
  disabledReason?: string;
  /** Size tier for controls */
  size?: 'sm' | 'md' | 'lg';
  /** HTML container element tag */
  as?: 'ul' | 'ol' | 'div';
  className?: string;
  style?: React.CSSProperties;
}

interface GrabState {
  id: string;
  originIndex: number;
  proposedIndex: number;
  mode: 'pointer' | 'keyboard';
}

export const SortableCollection = forwardRef<HTMLElement, SortableCollectionProps>(
  (
    {
      items = [],
      label,
      itemName,
      onMove,
      canDrop,
      canMove,
      children,
      renderItem,
      moveControls = 'handle-and-steppers',
      announcementScope: _announcementScope = 'position-and-neighbours',
      onAnnounce,
      liveRegion = true,
      onGrabChange,
      disabled = false,
      disabledReason: _disabledReason,
      size = 'md',
      as: ComponentTag = 'ul',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    const [grab, setGrab] = useState<GrabState | null>(null);
    const [announcement, setAnnouncement] = useState<string>('');
    const instrId = useId();
    const liveRegionId = useId();

    const announce = useCallback(
      (text: string) => {
        setAnnouncement(text);
        onAnnounce?.(text);
      },
      [onAnnounce]
    );

    const getItemName = useCallback(
      (id: string) => (itemName ? itemName(id) : id),
      [itemName]
    );

    const updateGrab = useCallback(
      (nextGrab: GrabState | null) => {
        setGrab(nextGrab);
        onGrabChange?.(
          nextGrab
            ? {
                id: nextGrab.id,
                originIndex: nextGrab.originIndex,
                proposedIndex: nextGrab.proposedIndex,
              }
            : null
        );
      },
      [onGrabChange]
    );

    const checkLegality = useCallback(
      (id: string, targetIndex: number) => {
        if (!canDrop) return { allowed: true };
        const nextOrder = items.filter((x) => x !== id);
        nextOrder.splice(targetIndex, 0, id);
        const res = canDrop(id, targetIndex, nextOrder);
        if (res === true) return { allowed: true };
        if (typeof res === 'string') return { allowed: false, reason: res };
        return { allowed: false, reason: 'Drop not permitted at this position.' };
      },
      [canDrop, items]
    );

    const handleStartGrab = (id: string, index: number, mode: 'pointer' | 'keyboard') => {
      if (disabled) return;
      if (canMove) {
        const moveRes = canMove(id);
        if (moveRes !== true) {
          announce(`Cannot move ${getItemName(id)}: ${typeof moveRes === 'string' ? moveRes : 'Item is locked.'}`);
          return;
        }
      }

      const initialGrab: GrabState = {
        id,
        originIndex: index,
        proposedIndex: index,
        mode,
      };
      updateGrab(initialGrab);
      announce(
        `Grabbed ${getItemName(id)}, position ${index + 1} of ${items.length} in ${label}. Use up and down arrow keys to reorder, Space or Enter to drop, Escape to cancel.`
      );
    };

    const handleDrop = (targetIdx?: number) => {
      if (!grab) return;
      const { id, originIndex } = grab;
      const destinationIndex = typeof targetIdx === 'number' ? targetIdx : grab.proposedIndex;
      const legality = checkLegality(id, destinationIndex);

      if (!legality.allowed) {
        announce(`Cannot drop ${getItemName(id)} at position ${destinationIndex + 1}: ${legality.reason}`);
        updateGrab(null);
        return;
      }

      updateGrab(null);
      if (originIndex !== destinationIndex) {
        announce(`Moved ${getItemName(id)} from position ${originIndex + 1} to position ${destinationIndex + 1} in ${label}.`);
        onMove?.(id, originIndex, destinationIndex);
      } else {
        announce(`Released ${getItemName(id)} without moving.`);
      }
    };

    const handleCancel = () => {
      if (!grab) return;
      const { id } = grab;
      updateGrab(null);
      announce(`Cancelled moving ${getItemName(id)}. Reverted to original position.`);
    };

    const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
      if (disabled) return;
      if (grab?.id === id) {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (grab.proposedIndex > 0) {
            const nextIdx = grab.proposedIndex - 1;
            const legality = checkLegality(id, nextIdx);
            updateGrab({ ...grab, proposedIndex: nextIdx });
            announce(
              `Proposed position ${nextIdx + 1} of ${items.length}${
                !legality.allowed ? ` (Refused: ${legality.reason})` : ''
              }.`
            );
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (grab.proposedIndex < items.length - 1) {
            const nextIdx = grab.proposedIndex + 1;
            const legality = checkLegality(id, nextIdx);
            updateGrab({ ...grab, proposedIndex: nextIdx });
            announce(
              `Proposed position ${nextIdx + 1} of ${items.length}${
                !legality.allowed ? ` (Refused: ${legality.reason})` : ''
              }.`
            );
          }
        } else if (e.key === 'Escape') {
          e.preventDefault();
          handleCancel();
        }
      }
    };

    const handleStep = (id: string, currentIndex: number, direction: 'up' | 'down') => {
      if (disabled) return;
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= items.length) return;

      const legality = checkLegality(id, targetIndex);
      if (!legality.allowed) {
        announce(`Cannot move ${getItemName(id)} ${direction === 'up' ? 'earlier' : 'later'}: ${legality.reason}`);
        return;
      }

      onMove?.(id, currentIndex, targetIndex);
      announce(`Moved ${getItemName(id)} to position ${targetIndex + 1} of ${items.length} in ${label}.`);
    };

    const handleDragStart = (e: React.DragEvent, id: string, index: number) => {
      if (disabled) return;
      if (canMove) {
        const moveRes = canMove(id);
        if (moveRes !== true) {
          e.preventDefault();
          announce(`Cannot move ${getItemName(id)}: ${typeof moveRes === 'string' ? moveRes : 'Item is locked.'}`);
          return;
        }
      }
      e.dataTransfer.setData('text/plain', id);
      e.dataTransfer.effectAllowed = 'move';
      handleStartGrab(id, index, 'pointer');
    };

    const handleDragOver = (e: React.DragEvent, id: string, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (!grab) return;

      if (grab.proposedIndex !== index) {
        const legality = checkLegality(grab.id, index);
        updateGrab({ ...grab, proposedIndex: index });
        if (!legality.allowed) {
          announce(`Proposed position ${index + 1} of ${items.length} (Refused: ${legality.reason}).`);
        }
      }
    };

    const handleDropOnItem = (e: React.DragEvent, index: number) => {
      e.preventDefault();
      handleDrop(index);
    };

    const handleDragEnd = (e: React.DragEvent) => {
      e.preventDefault();
      if (grab) {
        handleDrop();
      }
    };

    const childrenArray = React.Children.toArray(children);

    return (
      <div className={`ds-sortable-collection-wrapper ${className}`} style={style}>
        {liveRegion && (
          <div
            id={liveRegionId}
            role="status"
            aria-live="assertive"
            aria-atomic="true"
            className="ds-sortable-sr-only"
          >
            {announcement}
          </div>
        )}

        <span id={instrId} className="ds-sortable-sr-only">
          Press Space or Enter to grab item, Arrow keys to move candidate position, Enter or Space to commit drop, Escape to cancel.
        </span>

        <ComponentTag
          ref={ref as any}
          role="list"
          aria-label={label}
          className={`ds-sortable-collection ds-sortable-collection--size-${size} ${
            disabled ? 'ds-sortable-collection--disabled' : ''
          }`}
          {...rest}
        >
          {items.map((id, index) => {
            const isGrabbed = grab?.id === id;
            const isProposedDrop = grab !== null && grab.proposedIndex === index && !isGrabbed;
            const immovableReason = canMove ? (canMove(id) === true ? null : (canMove(id) as string)) : null;
            const isImmovable = Boolean(immovableReason);

            const itemState: SortableItemState = {
              index,
              position: index + 1,
              total: items.length,
              grabbed: isGrabbed,
              proposedIndex: isGrabbed ? grab.proposedIndex : null,
              immovable: immovableReason,
            };

            const content = renderItem
              ? renderItem(id, itemState)
              : childrenArray[index] || <span className="ds-sortable-item-fallback">{getItemName(id)}</span>;

            return (
              <React.Fragment key={id}>
                {isProposedDrop && grab.proposedIndex <= index && (
                  <li className="ds-sortable-drop-indicator" aria-hidden="true">
                    <span className="ds-sortable-drop-pill" />
                  </li>
                )}

                <li
                  aria-roledescription="sortable item"
                  aria-grabbed={isGrabbed}
                  aria-describedby={instrId}
                  className={`ds-sortable-item ${isGrabbed ? 'ds-sortable-item--grabbed' : ''} ${
                    isImmovable ? 'ds-sortable-item--immovable' : ''
                  }`}
                >
                  {/* HTML drag events use this row as a drop target; keyboard interaction lives on the handle button. */}
                  {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                  <div
                    className="ds-sortable-item-row"
                    draggable={!disabled && !isImmovable}
                    onDragStart={(e) => handleDragStart(e, id, index)}
                    onDragOver={(e) => handleDragOver(e, id, index)}
                    onDrop={(e) => handleDropOnItem(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    {moveControls !== 'none' && (
                      <button
                        type="button"
                        disabled={disabled || isImmovable}
                        aria-disabled={disabled || isImmovable}
                        aria-label={`Reorder ${getItemName(id)}, position ${index + 1} of ${items.length}`}
                        title={isImmovable ? immovableReason || 'Pinned' : `Grab and drag ${getItemName(id)}`}
                        className="ds-sortable-handle"
                        draggable={!disabled && !isImmovable}
                        onDragStart={(e) => {
                          e.stopPropagation();
                          handleDragStart(e, id, index);
                        }}
                        onKeyDown={(e) => handleKeyDown(e, id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (grab?.id === id) {
                            handleDrop();
                          } else {
                            handleStartGrab(id, index, 'keyboard');
                          }
                        }}
                      >
                        <span className="ds-sortable-handle-icon" aria-hidden="true">
                          ⠿
                        </span>
                      </button>
                    )}

                    <div className="ds-sortable-item-content">{content}</div>

                    {moveControls === 'handle-and-steppers' && (
                      <div className="ds-sortable-steppers">
                        <button
                          type="button"
                          disabled={disabled || isImmovable || index === 0}
                          aria-label={`Move ${getItemName(id)} earlier`}
                          title="Move earlier"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStep(id, index, 'up');
                          }}
                          className="ds-sortable-stepper-btn"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          disabled={disabled || isImmovable || index === items.length - 1}
                          aria-label={`Move ${getItemName(id)} later`}
                          title="Move later"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStep(id, index, 'down');
                          }}
                          className="ds-sortable-stepper-btn"
                        >
                          ▼
                        </button>
                      </div>
                    )}
                  </div>
                </li>

                {isProposedDrop && grab.proposedIndex > index && (
                  <li className="ds-sortable-drop-indicator" aria-hidden="true">
                    <span className="ds-sortable-drop-pill" />
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ComponentTag>
      </div>
    );
  }
);

SortableCollection.displayName = 'SortableCollection';
