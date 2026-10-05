import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import './ScopePicker.css';

export interface Facility {
  id: string;
  entityId: string;
  name: string;
  code: string;
  type: 'plant' | 'warehouse';
  status?: 'active' | 'maintenance' | 'restricted';
}

export interface LegalEntity {
  id: string;
  name: string;
  code: string;
  facilities: Facility[];
}

export interface EntityFacilitySelection {
  entityId: string;
  facilityId: string;
}

export interface EntityFacilitySelectorProps {
  /** Configured entities and child facilities */
  entities?: LegalEntity[];
  /** Current selected value */
  value?: EntityFacilitySelection;
  /** Initial selected value */
  defaultValue?: EntityFacilitySelection;
  /** Selection change callback */
  onChange?: (selection: EntityFacilitySelection) => void;
  /** Optional class name */
  className?: string;
  /** Accessible label */
  ariaLabel?: string;
  /** Disabled state */
  disabled?: boolean;
}

export const defaultEnterpriseEntities: LegalEntity[] = [
  {
    id: 'ent-asclepius',
    name: 'Asclepius Wellness Private Limited',
    code: 'AWPL',
    facilities: [
      { id: 'fac-f119', entityId: 'ent-asclepius', name: 'Food Plant F-119', code: 'F-119', type: 'plant', status: 'active' },
      { id: 'fac-h1-2213', entityId: 'ent-asclepius', name: 'Food Plant H1-2213', code: 'H1-2213', type: 'plant', status: 'active' },
      { id: 'fac-h1-2193', entityId: 'ent-asclepius', name: 'Food Plant H1-2193', code: 'H1-2193', type: 'plant', status: 'active' },
    ],
  },
  {
    id: 'ent-anantshriveda',
    name: 'Anantshriveda Private Limited',
    code: 'APL',
    facilities: [
      { id: 'fac-h9', entityId: 'ent-anantshriveda', name: 'RM Warehouse H-9', code: 'H-9', type: 'warehouse', status: 'active' },
      { id: 'fac-f25', entityId: 'ent-anantshriveda', name: 'RM Warehouse F-25', code: 'F-25', type: 'warehouse', status: 'active' },
    ],
  },
];

/**
 * EntityFacilitySelector (§01–§14)
 * Two-tier hierarchical scope selector for multi-company manufacturing ERP solutions.
 * Coordinates legal corporate entities (Asclepius, Anantshriveda) with operating
 * facilities (Processing Plants and Raw Material Warehouses).
 */
export const EntityFacilitySelector = forwardRef<HTMLDivElement, EntityFacilitySelectorProps>(
  (
    {
      entities = defaultEnterpriseEntities,
      value,
      defaultValue = { entityId: 'ent-asclepius', facilityId: 'fac-f119' },
      onChange,
      className = '',
      ariaLabel = 'Select Operating Entity and Facility',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [selected, setSelected] = useState<EntityFacilitySelection>(value || defaultValue);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    const currentSelection = value !== undefined ? value : selected;

    const currentEntity = entities.find((e) => e.id === currentSelection.entityId) || entities[0];
    const currentFacility =
      currentEntity?.facilities.find((f) => f.id === currentSelection.facilityId) ||
      currentEntity?.facilities[0];

    useEffect(() => {
      const handleOutsideClick = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      if (isOpen) {
        document.addEventListener('mousedown', handleOutsideClick);
      }
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isOpen]);

    const handleSelect = (entityId: string, facilityId: string) => {
      const newSelection = { entityId, facilityId };
      if (value === undefined) {
        setSelected(newSelection);
      }
      onChange?.(newSelection);
      setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    return (
      <div
        ref={containerRef}
        className={`ds-entity-facility-selector ${className}`}
        {...props}
      >
        <button
          type="button"
          className="ds-entity-facility-selector__trigger"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={ariaLabel}
          disabled={disabled}
        >
          <div className="ds-entity-facility-selector__content">
            <span
              className="ds-entity-facility-selector__entity-label"
              title={currentEntity?.name}
            >
              {currentEntity?.name}
            </span>
            <span
              className="ds-entity-facility-selector__facility-label"
              title={currentFacility?.name}
            >
              <span
                className={`ds-entity-facility-selector__type-tag ds-entity-facility-selector__type-tag--${currentFacility?.type}`}
              >
                {currentFacility?.type === 'plant' ? 'Plant' : 'Warehouse'}
              </span>
              {currentFacility?.name}
            </span>
          </div>
          <span aria-hidden="true" className="ds-entity-facility-selector__chevron">
            {isOpen ? '▲' : '▼'}
          </span>
        </button>

        {isOpen && (
          <div
            className="ds-entity-facility-selector__dropdown"
            role="listbox"
            aria-label={ariaLabel}
          >
            {entities.map((entity) => (
              <div
                key={entity.id}
                className="ds-entity-facility-selector__group"
                role="group"
                aria-label={entity.name}
              >
                <div className="ds-entity-facility-selector__group-header">
                  <span>{entity.name}</span>
                  <span className="ds-entity-facility-selector__code-badge">[{entity.code}]</span>
                </div>
                {entity.facilities.map((fac) => {
                  const isSelected =
                    entity.id === currentSelection.entityId &&
                    fac.id === currentSelection.facilityId;
                  return (
                    <button
                      key={fac.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={`ds-entity-facility-selector__item ${
                        isSelected ? 'ds-entity-facility-selector__item--selected' : ''
                      }`}
                      onClick={() => handleSelect(entity.id, fac.id)}
                    >
                      <span className="ds-entity-facility-selector__facility-label">
                        <span
                          className={`ds-entity-facility-selector__type-tag ds-entity-facility-selector__type-tag--${fac.type}`}
                        >
                          {fac.type === 'plant' ? 'Plant' : 'Warehouse'}
                        </span>
                        {fac.name}
                      </span>
                      {isSelected && (
                        <span aria-hidden="true" className="ds-entity-facility-selector__check">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

EntityFacilitySelector.displayName = 'EntityFacilitySelector';
