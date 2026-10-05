import * as React from 'react';

export interface StepItem {
  /** Unique stage identifier (e.g. 'STG-01', 'BOM-VERIF'). */
  id?: string;
  /** Human-readable stage title (e.g. 'Material Requisition', 'QA Clearance'). */
  title: string;
  /** Optional subtitle or description. */
  subtitle?: string;
  /** Whether the stage is optional and can be skipped without blocking progress. */
  optional?: boolean;
  /** Whether this stage is explicitly disabled. */
  disabled?: boolean;
}

/**
 * Step Navigation — Multi-Stage Process Navigation System.
 * @startingPoint section="Navigation" subtitle="Multi-stage process navigation and progress controls" viewport="800x240"
 */
export interface StepNavigationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  /** Ordered list of process stages. */
  steps: StepItem[];
  /** 0-based active step index. */
  currentStep: number;
  /** Array of completed step indices. */
  completedSteps?: number[];
  /** Optional index of step currently exhibiting a validation error. */
  errorStep?: number | null;
  /** Whether progression enforces linear sequence or allows free jumping. Default: true. */
  isLinear?: boolean;
  /** Presentation variant: 'horizontal' (default), 'vertical', 'compact-pill'. */
  variant?: 'horizontal' | 'vertical' | 'compact-pill';
  /** Node scale and density: 'sm' | 'md' | 'lg'. Default: 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** Callback fired when a step node is clicked. */
  onStepClick?: (stepIndex: number, step: StepItem) => void;
  /** Callback fired when the next action button is clicked. */
  onNext?: () => void;
  /** Callback fired when the back action button is clicked. */
  onBack?: () => void;
  /** Callback fired when an optional step is skipped. */
  onSkip?: () => void;
  /** Whether to render integrated forward/back/skip action buttons below the stepper. Default: false. */
  showActionControls?: boolean;
  /** Label for the next button. Default: "Save & Continue". */
  nextLabel?: string;
  /** Label for the back button. Default: "Back". */
  backLabel?: string;
  /** Label for the skip button. Default: "Skip Step". */
  skipLabel?: string;
  /** Accessible landmark label. Default: "Workflow step navigation". */
  label?: string;
  /** Custom CSS style object. */
  style?: React.CSSProperties;
}

export declare function StepNavigation(props: StepNavigationProps): JSX.Element;
