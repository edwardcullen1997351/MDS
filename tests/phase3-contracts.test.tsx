import type { ReactElement } from 'react';
import type { ButtonProps } from '../packages/react/src/components/Button/Button.js';
import type { IconButtonProps } from '../packages/react/src/components/Button/IconButton.js';
import type { SearchFieldProps } from '../packages/react/src/components/SearchField/SearchField.js';
import type { InputProps } from '../packages/react/src/components/Input/Input.js';
import type { SelectProps } from '../packages/react/src/components/Select/Select.js';
import type { CheckboxProps } from '../packages/react/src/components/Checkbox/Checkbox.js';
import type { SwitchProps } from '../packages/react/src/components/Switch/Switch.js';

declare const icon: ReactElement;

const textButton: ButtonProps = { children: 'Save' };
const namedIconButton: IconButtonProps = { icon, 'aria-label': 'Close' };
const namedSearch: SearchFieldProps = { 'aria-label': 'Search records' };
const labelledInput: InputProps = { label: 'Email' };
const labelledSelect: SelectProps = { label: 'Status', items: [] };
const labelledCheckbox: CheckboxProps = { label: 'Accept' };
const labelledSwitch: SwitchProps = { label: 'Notifications' };

// @ts-expect-error Icon-only children require an accessible name.
const unnamedButton: ButtonProps = { children: icon };
// @ts-expect-error IconButton always requires an accessible name.
const unnamedIconButton: IconButtonProps = { icon };
// @ts-expect-error Placeholder text is not a search field label.
const unnamedSearch: SearchFieldProps = { placeholder: 'Search' };
// @ts-expect-error Input requires a visible or ARIA label.
const unnamedInput: InputProps = { placeholder: 'Email' };
// @ts-expect-error Select requires a visible or ARIA label.
const unnamedSelect: SelectProps = { items: [] };
// @ts-expect-error Checkbox requires a visible or ARIA label.
const unnamedCheckbox: CheckboxProps = {};
// @ts-expect-error Switch requires a visible or ARIA label.
const unnamedSwitch: SwitchProps = {};

void [textButton, namedIconButton, namedSearch, labelledInput, labelledSelect, labelledCheckbox, labelledSwitch,
  unnamedButton, unnamedIconButton, unnamedSearch, unnamedInput, unnamedSelect, unnamedCheckbox, unnamedSwitch];
