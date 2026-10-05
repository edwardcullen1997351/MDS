import React,{
createContext,
forwardRef,
useContext,
useId,
useRef,
useState
} from 'react';
import './Tabs.css';

export type TabsVariant = 'line' | 'pill';
export type TabsSize = 'sm' | 'md' | 'lg';

interface TabsContextValue {
  value: string;
  onChange: (value: string) => void;
  baseId: string;
  variant: TabsVariant;
  size: TabsSize;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within a <Tabs>');
  }
  return context;
};

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
  size?: TabsSize;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      value: controlledValue,
      defaultValue = '',
      onValueChange,
      variant = 'line',
      size = 'md',
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const currentValue = isControlled ? controlledValue : uncontrolledValue;
    const baseId = useId();

    const handleValueChange = (val: string) => {
      if (!isControlled) {
        setUncontrolledValue(val);
      }
      onValueChange?.(val);
    };

    const classNames = [
      'ds-tabs',
      `ds-tabs--variant-${variant}`,
      `ds-tabs--size-${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <TabsContext.Provider
        value={{
          value: currentValue,
          onChange: handleValueChange,
          baseId,
          variant,
          size,
        }}
      >
        <div ref={ref} className={classNames} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = 'Tabs';

export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
  'aria-label'?: string;
}

export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ 'aria-label': ariaLabel = 'Tab options', children, className = '', ...props }, ref) => {
    const listRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const container = listRef.current;
      if (!container) return;

      const tabs = Array.from(
        container.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])')
      );
      const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = tabs.length - 1;
      }

      if (nextIndex !== currentIndex) {
        tabs[nextIndex]?.focus();
        tabs[nextIndex]?.click();
      }
    };

    return (
      <div
        ref={(node) => {
          (listRef as any).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as any).current = node;
        }}
        role="tablist"
        tabIndex={0}
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        className={`ds-tab-list ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabList.displayName = 'TabList';

export interface TabTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabTrigger = forwardRef<HTMLButtonElement, TabTriggerProps>(
  ({ value, children, disabled = false, className = '', ...props }, ref) => {
    const { value: selectedValue, onChange, baseId } = useTabsContext();
    const isSelected = selectedValue === value;
    const tabId = `${baseId}-tab-${value}`;
    const panelId = `${baseId}-panel-${value}`;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={tabId}
        aria-selected={isSelected}
        aria-controls={panelId}
        aria-disabled={disabled}
        disabled={disabled}
        tabIndex={isSelected ? 0 : -1}
        onClick={() => !disabled && onChange(value)}
        className={`ds-tab-trigger ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabTrigger.displayName = 'TabTrigger';

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ value, children, className = '', ...props }, ref) => {
    const { value: selectedValue, baseId } = useTabsContext();
    const isSelected = selectedValue === value;
    const tabId = `${baseId}-tab-${value}`;
    const panelId = `${baseId}-panel-${value}`;

    if (!isSelected) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId}
        className={`ds-tab-panel ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabPanel.displayName = 'TabPanel';
