import React from 'react';
import { Box } from '../Layout/Box.js';
import { HStack } from '../Layout/Stack.js';
import { Text } from '../Typography/Text.js';
import { Button } from '../Button/Button.js';
import './Toolbar.css';

export interface ToolbarProps extends React.HTMLAttributes<HTMLElement> {
  search?: React.ReactNode;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  selectedCount?: number;
  bulkActions?: React.ReactNode;
  onClearSelection?: () => void;
  className?: string;
  'aria-label'?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  search,
  filters,
  actions,
  selectedCount = 0,
  bulkActions,
  onClearSelection,
  className = '',
  'aria-label': ariaLabel = 'Toolbar',
  ...props
}) => {
  const isBulkActive = selectedCount > 0;

  return (
    <Box
      role="toolbar"
      aria-label={ariaLabel}
      p={3}
      isCard
      className={`ds-toolbar ${isBulkActive ? 'ds-toolbar--bulk-active' : ''} ${className}`}
      {...props}
    >
      {isBulkActive ? (
        <HStack
          justify="between"
          align="center"
          wrap
          gap={3}
          className="ds-toolbar__bulk-row"
          style={{ width: '100%' }}
        >
          <HStack align="center" gap={3} className="ds-toolbar__bulk-info">
            <span className="ds-toolbar-selection-pill ds-toolbar__selection-pill">
              <Text as="span" size="sm" weight="semibold">
                {selectedCount} selected
              </Text>
            </span>
            {onClearSelection && (
              <Button
                variant="ghost"
                size="sm"
                className="ds-toolbar__deselect-btn"
                onClick={onClearSelection}
              >
                Deselect all
              </Button>
            )}
          </HStack>
          <HStack align="center" gap={2} wrap className="ds-toolbar__bulk-actions">
            {bulkActions}
          </HStack>
        </HStack>
      ) : (
        <HStack
          justify="between"
          align="center"
          wrap
          gap={4}
          className="ds-toolbar__standard-row"
          style={{ width: '100%' }}
        >
          <HStack
            align="center"
            gap={3}
            wrap
            className="ds-toolbar__leading"
            style={{ flex: '1 1 auto', minWidth: 'var(--layout-toolbar-leading-min-w)' }}
          >
            {search && (
              <div className="ds-toolbar-search-slot ds-toolbar__search-slot">{search}</div>
            )}
            {filters && (
              <div className="ds-toolbar-filters-slot ds-toolbar__filters-slot">{filters}</div>
            )}
          </HStack>
          {actions && (
            <div className="ds-toolbar-actions-slot ds-toolbar__trailing">{actions}</div>
          )}
        </HStack>
      )}
    </Box>
  );
};
