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
  title: 'Interaction Patterns/02 Conditional Input',
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
          '**Conditional Input Pattern (§01–§20)**\n\n' +
          'Governs the dependency between a controlling value and its dependents as a deterministic rule over values rather than on-screen visibility, declared unavailability/retention/requiredness policies, exclusion of inapplicable values on submit, and focus rescue when fields disappear.\n\n' +
          '*Scenario:* Nonconformance dispositioning for lot `LOT-402` (EN36C Forgings) at **Suryodaya Autocomp Ltd (PL-04 Chakan)**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// 1. Happy Path - Rework Disposition Flow
export const ReworkDispositionFlow: Story = {
  render: () => {
    const toast = useToast();
    const [disposition, setDisposition] = useState<string[]>(['rework']);
    const [reworkLine, setReworkLine] = useState('RW-CELL-01');
    const [reworkPasses, setReworkPasses] = useState('2');

    const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      toast.success('NC Dispositioned', `LOT-402 routed to ${reworkLine} for ${reworkPasses} rework passes.`);
    };

    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quality Assurance · Nonconformance Report NC-904
            </span>
            <Heading as="h2" size="xl" weight="bold">Quality Disposition</Heading>
            <Text variant="caption" color="secondary">
              Select disposition for 120 units of LOT-402 (Hardness variation HRC 42 vs 58).
            </Text>
          </div>

          <form onSubmit={handleSave}>
            <Box p={5} isCard>
              <VStack gap={4} align="stretch">
                <div>
                  <span id="story-conditionalinput-74" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                    Disposition Verdict *
                  </span>
                  <Select aria-labelledby="story-conditionalinput-74" aria-label="Select option"
                    items={[
                      { label: 'Rework In-House (Secondary Heat Treatment)', value: 'rework' },
                      { label: 'Scrap & Decommission Lot', value: 'scrap' },
                      { label: 'Concession / Customer Deviation', value: 'deviation' },
                      { label: 'Return to Forging Vendor (Nashik Forge)', value: 'rtv' },
                    ]}
                    value={disposition}
                    onValueChange={(d) => setDisposition(d.value)}
                  />
                </div>

                {disposition[0] === 'rework' && (
                  <Box p={4} style={{ backgroundColor: '#F1F5F9', borderRadius: '8px', borderLeft: '3px solid #2563EB' }}>
                    <VStack gap={3} align="stretch">
                      <Text size="xs" weight="bold" color="secondary">REWORK SPECIFICATIONS</Text>
                      <div>
                        <label htmlFor="story-conditionalinput-94" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                          Target Rework Cell *
                        </label>
                        <Input id="story-conditionalinput-94" aria-label="e.g. RW-CELL-01"
                          value={reworkLine}
                          onChange={(e) => setReworkLine(e.target.value)}
                          placeholder="e.g. RW-CELL-01"
                        />
                      </div>
                      <div>
                        <label htmlFor="story-conditionalinput-104" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                          Estimated Hardening Passes *
                        </label>
                        <Input id="story-conditionalinput-104" aria-label="Estimated Hardening Passes *"
                          type="number"
                          value={reworkPasses}
                          onChange={(e) => setReworkPasses(e.target.value)}
                        />
                      </div>
                    </VStack>
                  </Box>
                )}

                <HStack justify="end" gap={3}>
                  <Button variant="primary" type="submit">
                    Commit Disposition
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

// 2. Scrap Disposition Flow
export const ScrapDispositionFlow: Story = {
  render: () => {
    const toast = useToast();
    const [disposition, setDisposition] = useState<string[]>(['scrap']);
    const [scrapReason, setScrapReason] = useState('Sub-surface quench cracking');
    const [authCode, setAuthCode] = useState('QA-AUTH-8821');

    const handleCommitScrap = (e: React.FormEvent) => {
      e.preventDefault();
      toast.error('Lot Scrapped', `LOT-402 written off to scrap ledger under auth ${authCode}.`);
    };

    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <Badge variant="danger">High Impact Action</Badge>
            <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
              Scrap Material Disposition
            </Heading>
            <Text variant="caption" color="secondary">
              Reveals required supervisor authorization and scrap reason code.
            </Text>
          </div>

          <form onSubmit={handleCommitScrap}>
            <Box p={5} isCard>
              <VStack gap={4} align="stretch">
                <div>
                  <span id="story-conditionalinput-161" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                    Disposition Verdict
                  </span>
                  <Select aria-labelledby="story-conditionalinput-161" aria-label="Select option"
                    items={[
                      { label: 'Scrap & Decommission Lot', value: 'scrap' },
                      { label: 'Rework In-House', value: 'rework' },
                    ]}
                    value={disposition}
                    onValueChange={(d) => setDisposition(d.value)}
                  />
                </div>

                <Box p={4} style={{ backgroundColor: '#FEF2F2', borderRadius: '8px', borderLeft: '3px solid #b91c1c' }}>
                  <VStack gap={3} align="stretch">
                    <Text size="xs" weight="bold" style={{ color: '#991B1B' }}>MANDATORY SCRAP DISCLOSURE</Text>
                    <div>
                      <label htmlFor="story-conditionalinput-178" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                        Defect Root Cause *
                      </label>
                      <Input id="story-conditionalinput-178" aria-label="Defect Root Cause *"
                        value={scrapReason}
                        onChange={(e) => setScrapReason(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="story-conditionalinput-187" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                        Quality Manager Auth Code *
                      </label>
                      <Input id="story-conditionalinput-187" aria-label="e.g. QA-AUTH-XXXX"
                        value={authCode}
                        onChange={(e) => setAuthCode(e.target.value)}
                        placeholder="e.g. QA-AUTH-XXXX"
                      />
                    </div>
                  </VStack>
                </Box>

                <HStack justify="end">
                  <Button variant="danger" type="submit">
                    Authorize Scrap (₹1,44,000 Write-off)
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

// 3. Customer Deviation Approval Flow
export const DeviationApprovalFlow: Story = {
  render: () => {
    const [concessionRef, setConcessionRef] = useState('CONC-TATA-2026-09');
    const [customerContact, setCustomerContact] = useState('Rahul Sen (Tata Motors QC)');

    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <Badge variant="warning">Concession Flow</Badge>
            <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
              Customer Concession & Deviation
            </Heading>
            <Text variant="caption" color="secondary">
              Reveals customer approval fields when parts are accepted with deviation.
            </Text>
          </div>

          <Box p={5} isCard>
            <VStack gap={4} align="stretch">
              <div>
                <label htmlFor="story-conditionalinput-235" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Customer Concession Reference *
                </label>
                <Input id="story-conditionalinput-235" aria-label="Customer Concession Reference *" value={concessionRef} onChange={(e) => setConcessionRef(e.target.value)} />
              </div>
              <div>
                <label htmlFor="story-conditionalinput-241" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Customer Authorization Signatory *
                </label>
                <Input id="story-conditionalinput-241" aria-label="Customer Authorization Signatory *" value={customerContact} onChange={(e) => setCustomerContact(e.target.value)} />
              </div>
              <HStack justify="end">
                <Button variant="primary">Approve with Concession</Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  },
};

// 4. Focus Rescue on Deselect
export const FocusRescueOnDeselect: Story = {
  render: () => {
    const verdictRef = useRef<HTMLButtonElement>(null);
    const [showOptions, setShowOptions] = useState(true);

    const handleToggle = () => {
      if (showOptions) {
        setShowOptions(false);
        // Rescuing focus to safe parent selector
        setTimeout(() => verdictRef.current?.focus(), 50);
      } else {
        setShowOptions(true);
      }
    };

    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <Badge variant="info">Focus Management</Badge>
            <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
              Focus Rescue on Dependency Destruction
            </Heading>
            <Text variant="caption" color="secondary">
              When a controlling selection removes child fields from DOM, focus is rescued gracefully to the controlling parent.
            </Text>
          </div>

          <Box p={5} isCard>
            <VStack gap={4} align="stretch">
              <Button ref={verdictRef} variant="outline" onClick={handleToggle}>
                {showOptions ? 'Switch to No Special Action' : 'Switch to Conditional Detail'}
              </Button>

              {showOptions ? (
                <Box p={3} style={{ backgroundColor: '#F8FAFC', border: '1px dashed #CBD5E1' }}>
                  <Text size="sm" weight="semibold">Active Conditional Field</Text>
                  <Input aria-label="Currently focused dependent field" placeholder="Currently focused dependent field" style={{ marginTop: '8px' }} />
                </Box>
              ) : (
                <Text size="sm" color="secondary">
                  Conditional inputs dismantled. Focus successfully rescued to parent button.
                </Text>
              )}
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  },
};

// 5. Validation on Conditional Fields
export const ValidationOnDependentFields: Story = {
  render: () => {
    const [authCode, setAuthCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!authCode.trim()) {
        setError('Authorization code is required when disposition is set to Scrap.');
      } else {
        setError('');
        alert('Validation Passed!');
      }
    };

    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <Badge variant="danger">Conditional Validation</Badge>
            <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
              Dependent Requiredness Enforcement
            </Heading>
            <Text variant="caption" color="secondary">
              Dependent fields inherit required validation only when their controlling condition is met.
            </Text>
          </div>

          <form onSubmit={handleSubmit}>
            <Box p={5} isCard>
              <VStack gap={4} align="stretch">
                <div>
                  <label htmlFor="story-conditionalinput-343" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                    Manager Authorization Code *
                  </label>
                  <Input id="story-conditionalinput-343" aria-label="Manager Authorization Code *"
                    value={authCode}
                    onChange={(e) => {
                      setAuthCode(e.target.value);
                      if (e.target.value.trim()) setError('');
                    }}
                    isInvalid={Boolean(error)}
                  />
                  {error && <span style={{ fontSize: '12px', color: '#b91c1c', marginTop: '4px', display: 'block' }}>{error}</span>}
                </div>

                <HStack justify="end">
                  <Button variant="primary" type="submit">Verify & Submit</Button>
                </HStack>
              </VStack>
            </Box>
          </form>
        </VStack>
      </Box>
    );
  },
};

// 6. Locked Frozen Historical Record
export const LockedFrozenRecord: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="neutral">Audit Trail · Closed</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Closed Historical Nonconformance
          </Heading>
          <Text variant="caption" color="secondary">
            Read-only rendering of conditionally captured parameters for past inspection NC-812.
          </Text>
        </div>

        <Box p={5} isCard>
          <VStack gap={3} align="stretch">
            <Banner status="info" title="Record Frozen on 2026-08-15" isDismissible={false}>
              Disposition finalized by Quality Head Meera Nair. No further edits permitted.
            </Banner>

            <div>
              <Text size="xs" color="secondary">DISPOSITION TYPE</Text>
              <Text weight="semibold">Customer Concession (Tata Motors)</Text>
            </div>
            <div>
              <Text size="xs" color="secondary">CONCESSION SIGN OFF</Text>
              <Text weight="semibold">CONC-2026-TATA-082</Text>
            </div>
          </VStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 7. Keyboard Traversal
export const KeyboardTraversal: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Keyboard Ergonomics</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Sequential Keyboard Traversal
          </Heading>
          <Text variant="caption" color="secondary">
            Ensure revealed dependent fields sit directly in standard tab order immediately following their trigger.
          </Text>
        </div>

        <Box p={5} isCard>
          <VStack gap={3} align="stretch">
            <Input aria-label="1. Quality Inspector ID (Tab)" placeholder="1. Quality Inspector ID (Tab)" />
            <Input aria-label="2. Conditional Defect Note (Tab)" placeholder="2. Conditional Defect Note (Tab)" />
            <Button variant="primary" onClick={() => alert('Proceeding to disposition')}>
              3. Next Stage (Enter / Space)
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  ),
};
