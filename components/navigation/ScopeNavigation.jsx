import React from 'react';
import { Icon } from '../core/Icon.jsx';

/**
 * Scope Navigation — Contextual Scope / Plant / Tenant Navigation System.
 * Changes the active organizational or contextual scope in which surrounding application navigation
 * and content are interpreted.
 */

export function ScopeNavigation({
  scopes = [],
  currentScopeId = '',
  onScopeChange,
  variant = 'standard-dropdown', // 'standard-dropdown' | 'hierarchical-grouped' | 'banner-mode'
  size = 'md', // 'sm' | 'md' | 'lg'
  showSearch = true,
  searchPlaceholder = 'Search plant or workspace...',
  label = 'Organizational scope selector',
  className = '',
  style,
  ...rest
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const containerRef = React.useRef(null);
  const searchInputRef = React.useRef(null);

  const activeScope = scopes.find(s => s.id === currentScopeId) || scopes[0] || null;

  // Click outside to dismiss
  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus search input on open
  React.useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredScopes = scopes.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.region && s.region.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelect = (scope) => {
    if (scope.accessible === false) return;
    if (onScopeChange) {
      onScopeChange(scope.id, scope);
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  const sizeStyles = {
    sm: { triggerPad: '4px 8px', avatarSize: 22, font: '11px', titleFont: '12px' },
    md: { triggerPad: '8px 12px', avatarSize: 28, font: '12px', titleFont: '13px' },
    lg: { triggerPad: '12px 16px', avatarSize: 34, font: '13px', titleFont: '15px' }
  }[size] || { triggerPad: '8px 12px', avatarSize: 28, font: '12px', titleFont: '13px' };

  if (!activeScope) return null;

  return (
    <div
      ref={containerRef}
      className={`mds-scope-navigation-root mds-scope-${variant} ${className}`}
      style={{ position: 'relative', display: 'inline-block', ...style }}
      {...rest}
    >
      {/* Banner Mode Trigger */}
      {variant === 'banner-mode' ? (
        <div
          style={{
            background: activeScope.env === 'SANDBOX' ? 'var(--status-warning-soft)' : 'var(--status-info-soft)',
            border: '1px solid var(--border-subtle)',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            width: '100%'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-bold)', fontSize: sizeStyles.font }}>
              SCOPE: {activeScope.name}
            </span>
            {activeScope.gst && (
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                GSTIN: {activeScope.gst}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            style={{
              background: 'var(--surface-card)',
              border: 'var(--border-hairline)',
              borderRadius: 'var(--radius-sm)',
              padding: '4px 10px',
              fontFamily: 'var(--font-sans)',
              fontSize: sizeStyles.font,
              cursor: 'pointer'
            }}
          >
            Switch Scope ▾
          </button>
        </div>
      ) : (
        /* Standard / Grouped Dropdown Trigger */
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label={`Current plant scope: ${activeScope.name}. Click to change organizational scope.`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: sizeStyles.triggerPad,
            background: 'var(--surface-card)',
            border: 'var(--border-hairline)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            textAlign: 'left',
            minWidth: '260px',
            transition: 'border-color 0.15s ease, background 0.15s ease'
          }}
        >
          <div
            style={{
              width: `${sizeStyles.avatarSize}px`,
              height: `${sizeStyles.avatarSize}px`,
              borderRadius: 'var(--radius-xs)',
              background: 'var(--action-solid)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 'var(--weight-bold)',
              flexShrink: 0
            }}
          >
            {activeScope.avatarText || activeScope.id.slice(0, 2)}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: sizeStyles.titleFont, fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeScope.name}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>
                {activeScope.id}
              </span>
            </div>
            {activeScope.region && (
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeScope.region}
              </span>
            )}
          </div>

          <span style={{ color: 'var(--text-tertiary)', fontSize: '10px', marginLeft: '4px' }}>▾</span>
        </button>
      )}

      {/* Floating Popover Picker */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={label}
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            width: '340px',
            background: 'var(--surface-card)',
            border: 'var(--border-hairline)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            zIndex: 1000,
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          {showSearch && (
            <input
              ref={searchInputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-xs)',
                border: 'var(--border-hairline)',
                background: 'var(--background-page)',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '260px', overflowY: 'auto' }}>
            {filteredScopes.map((scope) => {
              const isSelected = scope.id === activeScope.id;
              const isLocked = scope.accessible === false;

              return (
                <button
                  key={scope.id}
                  type="button"
                  disabled={isLocked}
                  onClick={() => handleSelect(scope)}
                  aria-selected={isSelected}
                  aria-disabled={isLocked ? 'true' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: isSelected ? 'var(--status-info-soft)' : 'transparent',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    opacity: isLocked ? 0.45 : 1,
                    textAlign: 'left',
                    width: '100%',
                    transition: 'background 0.12s ease'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, paddingRight: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: isSelected ? 'var(--weight-semibold)' : 'var(--weight-medium)', color: isSelected ? 'var(--action-solid)' : 'var(--text-primary)' }}>
                        {scope.name}
                      </span>
                      {scope.env === 'SANDBOX' && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '1px 4px', borderRadius: 'var(--radius-xs)', background: 'var(--status-warning-soft)', color: 'var(--status-warning-solid)' }}>
                          SANDBOX
                        </span>
                      )}
                    </div>
                    {scope.region && (
                      <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                        {scope.region} {scope.type ? `· ${scope.type}` : ''}
                      </span>
                    )}
                    {isLocked && scope.lockReason && (
                      <span style={{ fontSize: '10px', color: 'var(--status-critical-solid)' }}>
                        🔒 {scope.lockReason}
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <span style={{ color: 'var(--action-solid)', fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
