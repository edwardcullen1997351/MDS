import React, { useState } from 'react';
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
  title: 'Interaction Patterns/03 Staged Input',
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
          '**Staged Input Pattern (§01–§20)**\n\n' +
          'Governs exactly one current stage, forward gates that validate current stage alone, backward movement validating nothing, surgical invalidation of downstream dependents, single-shot final completion, and preserved stage data upon backend failure.\n\n' +
          '*Scenario:* Raising a purchase requisition (`PR-2026-4401`) for forged blanks at **Suryodaya Autocomp Ltd (PL-04 Chakan)**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

interface PRData {
  itemSku: string;
  quantity: string;
  vendor: string;
  costCenter: string;
  deliveryDate: string;
  deliveryBay: string;
}

const initialPR: PRData = {
  itemSku: 'BRK-4820-A (Forged Ring Blanks)',
  quantity: '500',
  vendor: 'Nashik Forge & Machine Works',
  costCenter: 'CC-PL04-PRESS (Press Shop)',
  deliveryDate: '2026-10-02',
  deliveryBay: 'Gate 02 · Inward Staging Bay',
};

// 1. Full Requisition Wizard (Happy Path)
export const FullRequisitionWizard: Story = {
  render: () => {
    const toast = useToast();
    const [step, setStep] = useState(1);
    const [data, setData] = useState<PRData>(initialPR);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleNext = () => setStep((s) => Math.min(s + 1, 4));
    const handleBack = () => setStep((s) => Math.max(s - 1, 1));

    const handleSubmit = () => {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        toast.success('Requisition Submitted', `PR-2026-4401 for ₹2,40,000 sent to Priya Iyer for sign-off.`);
      }, 700);
    };

    return (
      <Box style={{ maxWidth: '680px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Procurement & Item Master · PR-2026-4401
            </span>
            <Heading as="h2" size="xl" weight="bold">Create Purchase Requisition</Heading>
            <Text variant="caption" color="secondary">
              Stage-by-stage capture with forward validation gating and preserved data.
            </Text>
          </div>

          {/* Stepper Progress Indicator */}
          <HStack justify="between" style={{ padding: '12px 16px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            {[
              { num: 1, label: 'Item & Quantity' },
              { num: 2, label: 'Vendor & Budget' },
              { num: 3, label: 'Delivery Terms' },
              { num: 4, label: 'Review & Submit' },
            ].map((st) => (
              <HStack key={st.num} gap={2} align="center">
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: step === st.num ? '#2563EB' : step > st.num ? '#15803D' : '#E2E8F0',
                  color: step >= st.num ? '#FFFFFF' : '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 600,
                }}>
                  {step > st.num ? '✓' : st.num}
                </div>
                <Text size="xs" weight={step === st.num ? 'bold' : 'regular'} color={step === st.num ? 'primary' : 'secondary'}>
                  {st.label}
                </Text>
              </HStack>
            ))}
          </HStack>

          {isSubmitted ? (
            <Box p={5} isCard>
              <VStack gap={3} align="start">
                <Badge variant="success">PR-2026-4401 COMMITTED</Badge>
                <Heading as="h3" size="lg">Requisition Successfully Logged</Heading>
                <Text size="sm" color="secondary">
                  500 Units of BRK-4820-A routed to Nashik Forge & Machine Works. Total value: ₹2,40,000 (ex-works).
                </Text>
                <Button size="sm" variant="outline" onClick={() => { setIsSubmitted(false); setStep(1); }}>
                  Create Another PR
                </Button>
              </VStack>
            </Box>
          ) : (
            <Box p={5} isCard>
              <VStack gap={4} align="stretch">
                {step === 1 && (
                  <>
                    <Heading as="h3" size="lg">Step 1: Item Details & Quantity</Heading>
                    <div>
                      <label htmlFor="story-stagedinput-146" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                        Item Master SKU *
                      </label>
                      <Input id="story-stagedinput-146" aria-label="Item Master SKU *" value={data.itemSku} onChange={(e) => setData({ ...data, itemSku: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="story-stagedinput-152" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                        Requisition Quantity (Units) *
                      </label>
                      <Input id="story-stagedinput-152" aria-label="Requisition Quantity (Units) *" type="number" value={data.quantity} onChange={(e) => setData({ ...data, quantity: e.target.value })} />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <Heading as="h3" size="lg">Step 2: Approved Vendor & Cost Allocation</Heading>
                    <div>
                      <span id="story-stagedinput-164" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                        Supplier / Vendor *
                      </span>
                      <Select aria-labelledby="story-stagedinput-164" aria-label="Select option"
                        items={[
                          { label: 'Nashik Forge & Machine Works', value: 'Nashik Forge & Machine Works' },
                          { label: 'Sahyadri Bearings Pvt Ltd', value: 'Sahyadri Bearings Pvt Ltd' },
                          { label: 'Deccan Machine Supply', value: 'Deccan Machine Supply' },
                        ]}
                        value={[data.vendor]}
                        onValueChange={(d) => setData({ ...data, vendor: d.value[0] })}
                      />
                    </div>
                    <div>
                      <label htmlFor="story-stagedinput-178" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                        Charging Cost Center *
                      </label>
                      <Input id="story-stagedinput-178" aria-label="Charging Cost Center *" value={data.costCenter} onChange={(e) => setData({ ...data, costCenter: e.target.value })} />
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <Heading as="h3" size="lg">Step 3: Inward Staging & Schedule</Heading>
                    <div>
                      <label htmlFor="story-stagedinput-190" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                        Target Delivery Date (IST) *
                      </label>
                      <Input id="story-stagedinput-190" aria-label="Target Delivery Date (IST) *" type="date" value={data.deliveryDate} onChange={(e) => setData({ ...data, deliveryDate: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="story-stagedinput-196" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                        Inward Plant Gate / Bay *
                      </label>
                      <Input id="story-stagedinput-196" aria-label="Inward Plant Gate / Bay *" value={data.deliveryBay} onChange={(e) => setData({ ...data, deliveryBay: e.target.value })} />
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <Heading as="h3" size="lg">Step 4: Audit Review & Sign-Off</Heading>
                    <Box p={3} style={{ backgroundColor: '#F8FAFC', borderRadius: '6px' }}>
                      <VStack gap={2} align="stretch">
                        <HStack justify="between">
                          <Text size="xs" color="secondary">Item:</Text>
                          <Text size="xs" weight="semibold">{data.itemSku}</Text>
                        </HStack>
                        <HStack justify="between">
                          <Text size="xs" color="secondary">Quantity:</Text>
                          <Text size="xs" weight="semibold">{data.quantity} units</Text>
                        </HStack>
                        <HStack justify="between">
                          <Text size="xs" color="secondary">Vendor:</Text>
                          <Text size="xs" weight="semibold">{data.vendor}</Text>
                        </HStack>
                        <HStack justify="between">
                          <Text size="xs" color="secondary">Cost Center:</Text>
                          <Text size="xs" weight="semibold">{data.costCenter}</Text>
                        </HStack>
                        <HStack justify="between">
                          <Text size="xs" color="secondary">Est. Spend:</Text>
                          <Text size="xs" weight="semibold" style={{ color: '#15803D' }}>₹2,40,000</Text>
                        </HStack>
                      </VStack>
                    </Box>
                  </>
                )}

                <HStack justify="between" style={{ marginTop: '16px' }}>
                  {step > 1 ? (
                    <Button variant="outline" type="button" onClick={handleBack}>
                      ← Previous Step
                    </Button>
                  ) : <div />}

                  {step < 4 ? (
                    <Button variant="primary" type="button" onClick={handleNext}>
                      Next Step →
                    </Button>
                  ) : (
                    <Button variant="primary" type="button" isLoading={isSubmitting} onClick={handleSubmit}>
                      Submit Requisition (PR-4401)
                    </Button>
                  )}
                </HStack>
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>
    );
  },
};

// 2. Stage-Local Validation Gate
export const StageLocalValidation: Story = {
  render: () => {
    const [qty, setQty] = useState('');
    const [error, setError] = useState('');

    const handleTryNext = () => {
      if (!qty || parseInt(qty, 10) <= 0) {
        setError('Please enter a valid requisition quantity before advancing to Step 2.');
      } else {
        setError('');
        alert('Advancing to Step 2');
      }
    };

    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <Badge variant="warning">Gate Enforcement</Badge>
            <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
              Forward Validation Barrier
            </Heading>
            <Text variant="caption" color="secondary">
              Users cannot advance past the current stage until stage-local requirements are satisfied.
            </Text>
          </div>

          <Box p={5} isCard>
            <VStack gap={4} align="stretch">
              <div>
                <label htmlFor="story-stagedinput-291" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Batch Units Required *
                </label>
                <Input id="story-stagedinput-291" aria-label="Enter required quantity"
                  type="number"
                  placeholder="Enter required quantity..."
                  value={qty}
                  onChange={(e) => {
                    setQty(e.target.value);
                    if (e.target.value) setError('');
                  }}
                  isInvalid={Boolean(error)}
                />
                {error && <span style={{ fontSize: '12px', color: '#b91c1c', marginTop: '4px', display: 'block' }}>{error}</span>}
              </div>

              <HStack justify="end">
                <Button variant="primary" onClick={handleTryNext}>Next Step →</Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  },
};

// 3. Backward Navigation Preserved
export const BackwardNavigationPreserved: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">State Preservation</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Backward Movement Without Validation
          </Heading>
          <Text variant="caption" color="secondary">
            Moving backward does not validate current uncompleted fields and preserves previously typed answers.
          </Text>
        </div>

        <Box p={5} isCard>
          <VStack gap={3} align="start">
            <Banner status="info" title="Step 2 Active · Step 1 Preserved" isDismissible={false}>
              Navigating back to Step 1 will retain your selected vendor & cost center selections without triggering errors.
            </Banner>
            <HStack gap={3}>
              <Button variant="outline" onClick={() => alert('Navigated back to Step 1 without validation errors.')}>
                ← Back to Step 1
              </Button>
              <Button variant="primary">Proceed to Step 3</Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 4. Downstream Surgical Invalidation
export const DownstreamSurgicalInvalidation: Story = {
  render: () => {
    const [materialType, setMaterialType] = useState('raw');
    const [grade, setGrade] = useState('EN36C (Forging Steel)');

    const handleMaterialChange = (newType: string) => {
      setMaterialType(newType);
      // Surgical invalidation: Only reset downstream grade if category changed
      setGrade(newType === 'raw' ? 'EN36C (Forging Steel)' : 'Tooling Grade D2');
    };

    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <Badge variant="info">Surgical Reset</Badge>
            <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
              Surgical Downstream Invalidation
            </Heading>
            <Text variant="caption" color="secondary">
              Changing upstream category invalidates only genuinely dependent sub-fields, preserving unrelated downstream inputs.
            </Text>
          </div>

          <Box p={5} isCard>
            <VStack gap={3} align="stretch">
              <div>
                <span id="story-material-class" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Material Class
                </span>
                <HStack gap={3} role="group" aria-labelledby="story-material-class">
                  <Button
                    size="sm"
                    variant={materialType === 'raw' ? 'primary' : 'outline'}
                    aria-pressed={materialType === 'raw'}
                    onClick={() => handleMaterialChange('raw')}
                  >
                    Raw Forgings
                  </Button>
                  <Button
                    size="sm"
                    variant={materialType === 'tooling' ? 'primary' : 'outline'}
                    aria-pressed={materialType === 'tooling'}
                    onClick={() => handleMaterialChange('tooling')}
                  >
                    Die Tooling
                  </Button>
                </HStack>
              </div>

              <div>
                <label htmlFor="story-stagedinput-401" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Dependent Steel Grade
                </label>
                <Input id="story-stagedinput-401" aria-label="Dependent Steel Grade" value={grade} readOnly style={{ backgroundColor: '#F8FAFC' }} />
              </div>
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  },
};

// 5. Backend Submission Failure (Preserved Wizard)
export const BackendSubmissionFailure: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="danger">ERP Submission Outage</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Final Stage Failure State
          </Heading>
          <Text variant="caption" color="secondary">
            ERP ledger rejected submission due to timeout. All 4 stages remain intact for single-click retry.
          </Text>
        </div>

        <Banner status="error" title="Purchase Requisition Commit Failed (SAP Gateway 504)" isDismissible={false}>
          The SAP procurement service at Chakan PL-04 did not respond. No stages were cleared. Click Retry below.
        </Banner>

        <Box p={5} isCard>
          <HStack justify="between" align="center">
            <div>
              <Text weight="semibold">PR-2026-4401 Ready for Resubmission</Text>
              <Text size="xs" color="secondary">All 4 steps preserved in memory</Text>
            </div>
            <Button variant="danger" onClick={() => alert('Retrying submission against SAP gateway...')}>
              Retry Submit
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 6. Read-Only Summary Review
export const ReadOnlySummaryReview: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="neutral">Audit Summary</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Requisition Audit Summary
          </Heading>
        </div>

        <Box p={5} isCard>
          <VStack gap={3} align="stretch">
            <HStack justify="between">
              <Text size="sm" color="secondary">Total Value:</Text>
              <Text size="sm" weight="bold">₹2,40,000</Text>
            </HStack>
            <HStack justify="between">
              <Text size="sm" color="secondary">Authorizing Planner:</Text>
              <Text size="sm" weight="semibold">Anjali Deshmukh (@suryodaya.co.in)</Text>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 7. Keyboard Step Progression
export const KeyboardStepProgression: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Keyboard Navigation</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Wizard Keyboard Ergonomics
          </Heading>
          <Text variant="caption" color="secondary">
            Use <kbd>Tab</kbd> to focus through inputs and <kbd>Enter</kbd> on the Next button to advance.
          </Text>
        </div>

        <Box p={5} isCard>
          <VStack gap={3} align="stretch">
            <Input aria-label="Requisition Title (Tab)" placeholder="Requisition Title (Tab)" />
            <Input aria-label="Department Code (Tab)" placeholder="Department Code (Tab)" />
            <Button variant="primary">Next Step (Enter)</Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  ),
};
