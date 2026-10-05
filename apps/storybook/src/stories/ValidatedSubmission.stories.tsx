import React, { useState, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  Input,
  Select,
  Banner,
  Badge,
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  ToastProvider,
  useToast,
} from '@ds/react';

const meta: Meta = {
  title: 'Interaction Patterns/01 Validated Submission',
  decorators: [
    (Story) => (
      <ToastProvider position="top-right">
        <div style={{ padding: '32px', backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          '**Validated Submission Pattern (§01–§20)**\n\n' +
          'Governs one coherent snapshot evaluated by every rule, the scope and timing of independent vs. dependent validation, single-shot commitment guarded at the state transition, preservation of entered values through failure, retry against current intended values, and focus directed to the first actionable problem.\n\n' +
          '*Scenario:* Releasing a work order (`WO-8901`) to the press shop line at **Suryodaya Autocomp Ltd (PL-04 Chakan)**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

interface FormValues {
  workOrder: string;
  partNumber: string;
  productionLine: string;
  batchQuantity: string;
  shift: string;
  targetDate: string;
  priority: string;
}

const initialValues: FormValues = {
  workOrder: 'WO-8901',
  partNumber: 'BRK-4820-A (Bevel Pinion)',
  productionLine: 'PL04-LINE-02',
  batchQuantity: '450',
  shift: 'Shift A (06:00 - 14:30 IST)',
  targetDate: '2026-09-24',
  priority: 'High',
};

// 1. Happy Path Story
export const DefaultReleaseFlow: Story = {
  render: () => {
    const toast = useToast();
    const [values, setValues] = useState<FormValues>(initialValues);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isReleased, setIsReleased] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsReleased(true);
        toast.success('Work Order Released', `${values.workOrder} released to ${values.productionLine} for ${values.batchQuantity} units.`);
      }, 700);
    };

    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Suryodaya Autocomp · Shop Floor Dispatch
            </span>
            <Heading as="h2" size="xl" weight="bold">Release Work Order</Heading>
            <Text variant="caption" color="secondary">
              Commit a validated production order snapshot to the MES dispatch queue.
            </Text>
          </div>

          {isReleased ? (
            <Box p={5} isCard>
              <VStack gap={3} align="start">
                <Badge variant="success">DISPATCHED TO MES</Badge>
                <Heading as="h3" size="lg">Work Order {values.workOrder} Active</Heading>
                <Text color="secondary" size="sm">
                  Batch allocated to {values.productionLine} under {values.shift}. Supervisor Sandeep Kulkarni notified.
                </Text>
                <Button size="sm" variant="outline" onClick={() => setIsReleased(false)}>
                  Release Another Order
                </Button>
              </VStack>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Box p={5} isCard>
                <VStack gap={4} align="stretch">
                  <HStack justify="between">
                    <div>
                      <Text size="xs" color="secondary">WORK ORDER NUMBER</Text>
                      <Text weight="semibold">{values.workOrder}</Text>
                    </div>
                    <div>
                      <Text size="xs" color="secondary">PART NUMBER</Text>
                      <Text weight="semibold">{values.partNumber}</Text>
                    </div>
                  </HStack>

                  <div>
                    <span id="story-validatedsubmission-124" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                      Target Production Line
                    </span>
                    <Select aria-labelledby="story-validatedsubmission-124" aria-label="Select option"
                      items={[
                        { label: 'Line 01 · 800T Heavy Stamping Press', value: 'PL04-LINE-01' },
                        { label: 'Line 02 · 400T Progressive Die Press', value: 'PL04-LINE-02' },
                        { label: 'Line 03 · CNC Multi-Axis Turning', value: 'PL04-LINE-03' },
                      ]}
                      value={[values.productionLine]}
                      onValueChange={(d) => setValues({ ...values, productionLine: d.value[0] })}
                    />
                  </div>

                  <HStack gap={3} align="start">
                    <div style={{ flex: 1 }}>
                      <label htmlFor="story-validatedsubmission-140" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                        Batch Quantity (Units)
                      </label>
                      <Input id="story-validatedsubmission-140" aria-label="Min 50 units"
                        type="number"
                        value={values.batchQuantity}
                        onChange={(e) => setValues({ ...values, batchQuantity: e.target.value })}
                        placeholder="Min 50 units"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label htmlFor="story-validatedsubmission-151" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                        Production Date (IST)
                      </label>
                      <Input id="story-validatedsubmission-151" aria-label="Production Date (IST)"
                        type="date"
                        value={values.targetDate}
                        onChange={(e) => setValues({ ...values, targetDate: e.target.value })}
                      />
                    </div>
                  </HStack>

                  <HStack justify="end" gap={3} style={{ marginTop: '8px' }}>
                    <Button variant="outline" type="button" onClick={() => setValues(initialValues)}>
                      Reset Values
                    </Button>
                    <Button variant="primary" type="submit" isLoading={isSubmitting} loadingText="Releasing to MES...">
                      Release Work Order
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            </form>
          )}
        </VStack>
      </Box>
    );
  },
};

// 2. Validation Errors & First-Invalid Focus
export const FieldAndFormValidation: Story = {
  render: () => {
    const qtyInputRef = useRef<HTMLInputElement>(null);
    const [batchQuantity, setBatchQuantity] = useState('15');
    const [errors, setErrors] = useState<Record<string, string>>({
      batchQuantity: 'Batch quantity must be at least 50 units (minimum economic lot size for Line 02).',
    });
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(true);

    const handleValidateAndSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setHasAttemptedSubmit(true);
      const num = parseInt(batchQuantity, 10);
      if (isNaN(num) || num < 50) {
        setErrors({ batchQuantity: 'Batch quantity must be at least 50 units (minimum economic lot size for Line 02).' });
        qtyInputRef.current?.focus();
      } else {
        setErrors({});
        alert('Validation passed! Dispatching to shop floor.');
      }
    };

    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <Badge variant="warning">Validation Rejection</Badge>
            <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
              Snapshot Validation Rule Enforcement
            </Heading>
            <Text variant="caption" color="secondary">
              Demonstrates independent vs dependent validation and automated focus redirection to the first actionable error.
            </Text>
          </div>

          {hasAttemptedSubmit && Object.keys(errors).length > 0 && (
            <Banner status="error" title="1 issue prevents release to MES" isDismissible={false}>
              Please resolve the highlighted field error below before dispatching this work order.
            </Banner>
          )}

          <form onSubmit={handleValidateAndSubmit}>
            <Box p={5} isCard>
              <VStack gap={4} align="stretch">
                <div>
                  <label htmlFor="qty-field" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                    Batch Quantity (Units) *
                  </label>
                  <Input aria-label="Batch Quantity (Units) *"
                    id="qty-field"
                    ref={qtyInputRef}
                    type="number"
                    value={batchQuantity}
                    onChange={(e) => {
                      setBatchQuantity(e.target.value);
                      if (parseInt(e.target.value, 10) >= 50) {
                        setErrors({});
                      }
                    }}
                    isInvalid={Boolean(errors.batchQuantity)}
                    aria-describedby="qty-error"
                  />
                  {errors.batchQuantity && (
                    <span id="qty-error" style={{ display: 'block', marginTop: '4px', fontSize: '12px', color: '#b91c1c' }}>
                      {errors.batchQuantity}
                    </span>
                  )}
                </div>

                <HStack justify="end" gap={3}>
                  <Button variant="primary" type="submit">
                    Validate & Release
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </form>
        </VStack>
      </Box>
    );
  },
};

// 3. Operational Failure / MES Outage (Preserved Entries)
export const MESNetworkOutage: Story = {
  render: () => {
    const [isRetrying, setIsRetrying] = useState(false);
    const [hasFailed, setHasFailed] = useState(true);

    const handleRetry = () => {
      setIsRetrying(true);
      setTimeout(() => {
        setIsRetrying(false);
        setHasFailed(false);
      }, 1000);
    };

    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <Badge variant="danger">ERP Service Outage</Badge>
            <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
              Operational Failure with Preserved State
            </Heading>
            <Text variant="caption" color="secondary">
              Input entries were valid, but the shop floor MES controller timed out. All typed values survive unchanged.
            </Text>
          </div>

          {hasFailed && (
            <Banner status="error" title="MES Controller Unreachable (Error 503)" isDismissible={false}>
              The Line 02 cell gateway at Chakan PL-04 did not respond. Your entered order parameters have been preserved. You can safely retry.
            </Banner>
          )}

          <Box p={5} isCard>
            <VStack gap={3} align="stretch">
              <HStack justify="between">
                <Text size="sm" color="secondary">Work Order:</Text>
                <Text size="sm" weight="semibold">WO-8901</Text>
              </HStack>
              <HStack justify="between">
                <Text size="sm" color="secondary">Part SKU:</Text>
                <Text size="sm" weight="semibold">BRK-4820-A (Bevel Pinion)</Text>
              </HStack>
              <HStack justify="between">
                <Text size="sm" color="secondary">Assigned Quantity:</Text>
                <Text size="sm" weight="semibold">450 Units</Text>
              </HStack>

              <HStack justify="end" gap={3} style={{ marginTop: '12px' }}>
                <Button variant="outline" onClick={() => alert('Order saved to local offline drafts.')}>
                  Save Offline Draft
                </Button>
                <Button variant="danger" isLoading={isRetrying} loadingText="Retrying MES Gateway..." onClick={handleRetry}>
                  Retry Release (WO-8901)
                </Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  },
};

// 4. In-Flight Double Submit Guard
export const InFlightDoubleSubmitGuard: Story = {
  render: () => {
    const [inFlight, setInFlight] = useState(true);

    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <Badge variant="info">Single-Shot Guard</Badge>
            <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
              In-Flight Transition Lock
            </Heading>
            <Text variant="caption" color="secondary">
              The commit trigger is disabled and guarded at the state transition machine level to eliminate duplicate records.
            </Text>
          </div>

          <Box p={5} isCard>
            <VStack gap={3} align="start">
              <Text size="sm">
                Transaction <code>TXN-MES-8901-A</code> is currently writing to the production schedule ledger.
              </Text>
              <Button variant="primary" isLoading={inFlight} loadingText="Committing to Ledger (Single-Shot Lock)...">
                Release Work Order
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setInFlight(!inFlight)}>
                Toggle In-Flight Lock
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  },
};

// 5. Disabled / Unauthorized Role State
export const DisabledUnauthorizedRole: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="neutral">Role Restriction</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Restricted Release Authorization
          </Heading>
          <Text variant="caption" color="secondary">
            User logged in as Trainee Operator (S. Pawar). Releasing work orders requires Line Supervisor or Shift Planner privilege.
          </Text>
        </div>

        <Box p={5} isCard>
          <VStack gap={4} align="stretch">
            <Banner status="info" title="Read-Only Dispatch Inspection" isDismissible={false}>
              You have view-only access to this work order. Contact Line Supervisor Sandeep Kulkarni for release approval.
            </Banner>

            <div>
              <label htmlFor="story-validatedsubmission-387" style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748B', marginBottom: '6px' }}>
                Assigned Production Line
              </label>
              <Input id="story-validatedsubmission-387" aria-label="Assigned Production Line" value="Line 02 · 400T Progressive Die Press" disabled />
            </div>

            <HStack justify="end">
              <Button variant="primary" disabled title="Requires Supervisor Role">
                Release Work Order (Locked)
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 6. Initial Empty Draft
export const InitialEmptyDraft: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Heading as="h2" size="xl" weight="bold">Initialize New Production Order</Heading>
          <Text variant="caption" color="secondary">
            Clean form ready for initial parameter capture.
          </Text>
        </div>

        <Box p={5} isCard>
          <VStack gap={4} align="stretch">
            <div>
              <label htmlFor="story-validatedsubmission-420" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                Work Order Code *
              </label>
              <Input id="story-validatedsubmission-420" aria-label="e.g. WO-9042" placeholder="e.g. WO-9042" />
            </div>

            <div>
              <label htmlFor="story-validatedsubmission-427" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                Part Number / Item Master *
              </label>
              <Input id="story-validatedsubmission-427" aria-label="Search item master SKU" placeholder="Search item master SKU..." />
            </div>

            <HStack justify="end">
              <Button variant="primary">Create & Stage Order</Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 7. Full Keyboard Navigation Flow
export const KeyboardNavigation: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Accessibility & Keyboard</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Full Tab-Order & Key Execution
          </Heading>
          <Text variant="caption" color="secondary">
            Supports seamless <kbd>Tab</kbd> traversal, native form <kbd>Enter</kbd> submission, and automated error landing.
          </Text>
        </div>

        <Box p={5} isCard>
          <VStack gap={3} align="stretch">
            <Input aria-label="1. Work order (Tab)" placeholder="1. Work order (Tab)" />
            <Input aria-label="2. Quantity (Tab)" placeholder="2. Quantity (Tab)" />
            <Input aria-label="3. Line location (Tab)" placeholder="3. Line location (Tab)" />
            <Button variant="primary" type="button" onClick={() => alert('Submitted via keyboard shortcut')}>
              4. Submit (Enter / Space)
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  ),
};
