import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  Banner,
  Badge,
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Input,
  ToastProvider,
  useToast,
} from '@ds/react';

const meta: Meta = {
  title: 'Interaction Patterns/09 Confirmed Action',
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
          '**Confirmed Action Pattern (§01–§20)**\n\n' +
          'Governs the separation of initiation from commitment, capturing figures and consequences in the plant\'s own units, revalidating live targets before dispatch, safe non-destructive dismissals, and single-shot guards.\n\n' +
          '*Scenario:* Cancelling released work order `WO-8901` mid-run at **Suryodaya Autocomp Ltd (PL-04 Chakan)**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// 1. Destructive Action Modal (Happy Path)
export const DestructiveActionModal: Story = {
  render: () => {
    const toast = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);

    const handleConfirmCancel = () => {
      setIsOpen(false);
      setIsCancelled(true);
      toast.error('Work Order Cancelled', 'WO-8901 cancelled. Machine Line 02 halted and WIP raw forgings quarantined.');
    };

    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Press Shop · Live Run Interruption
            </span>
            <Heading as="h2" size="xl" weight="bold">Cancel Active Production Order</Heading>
            <Text variant="caption" color="secondary">
              High-consequence decision modal explicitly stating scrap and downtime impact in plant terms.
            </Text>
          </div>

          <Box p={5} isCard>
            <VStack gap={4} align="stretch">
              <HStack justify="between" align="center">
                <div>
                  <Text weight="bold">Work Order WO-8901 (Bevel Pinion)</Text>
                  <Text size="xs" color="secondary">Running on Line 02 · 180 of 450 units pressed</Text>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={isCancelled}
                  onClick={() => setIsOpen(true)}
                >
                  {isCancelled ? 'Order Cancelled' : 'Cancel Production Run'}
                </Button>
              </HStack>

              {isCancelled && (
                <Banner status="error" title="WO-8901 Terminated Mid-Run" isDismissible={false}>
                  Stamping press Line 02 stopped. 180 pressed units routed to hold staging for metallurgical review.
                </Banner>
              )}
            </VStack>
          </Box>

          <Dialog open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
            {(api) => (
              <DialogContent api={api} size="md">
                <DialogHeader>
                  <DialogTitle api={api}>Cancel Work Order WO-8901 Mid-Run?</DialogTitle>
                  <DialogDescription api={api}>
                    This action immediately halts Line 02 and requires physical die clearance.
                  </DialogDescription>
                </DialogHeader>
                <DialogBody>
                  <Banner status="warning" title="Shop-Floor & Financial Consequence" isDismissible={false}>
                    Cancelling now scraps ₹64,800 of in-process EN36C raw forgings and incurs 45 minutes of line downtime.
                  </Banner>
                </DialogBody>
                <DialogFooter>
                  <HStack justify="end" gap={3}>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                      Resume Production
                    </Button>
                    <Button variant="danger" onClick={handleConfirmCancel}>
                      Cancel Run & Quarantine WIP
                    </Button>
                  </HStack>
                </DialogFooter>
              </DialogContent>
            )}
          </Dialog>
        </VStack>
      </Box>
    );
  },
};

// 2. Supervisor Authorization Override
export const SupervisorAuthOverride: Story = {
  render: () => {
    const [code, setCode] = useState('');
    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <Badge variant="warning">Authorization Guard</Badge>
            <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
              Supervisor PIN Verification
            </Heading>
            <Text variant="caption" color="secondary">
              High-value scrapping requires supervisor authentication PIN to enable confirmation button.
            </Text>
          </div>

          <Box p={5} isCard>
            <VStack gap={3} align="stretch">
              <Text size="sm">Enter Supervisor Sandeep Kulkarni PIN to cancel WO-8901:</Text>
              <Input aria-label="4-digit PIN"
                type="password"
                placeholder="4-digit PIN..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <Button variant="danger" disabled={code.length < 4} onClick={() => alert('Authorized!')}>
                Authorize Scrap & Halt Line
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  },
};

// 3. Network Failure on Confirm
export const NetworkFailureOnConfirm: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="danger">Transaction Failure</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Confirmation Failure Preserves Context
          </Heading>
        </div>

        <Banner status="error" title="Line Controller Failed to Acknowledge Stop" isDismissible={false}>
          The MES PLC controller did not respond. Work order WO-8901 remains un-cancelled.
        </Banner>

        <Button variant="danger">Retry Stop Signal</Button>
      </VStack>
    </Box>
  ),
};

// 4. Safe Dismissal Routes
export const SafeDismissalRoutes: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Side-Effect Free Dismissal</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Zero Side-Effect Dismissal
          </Heading>
          <Text variant="caption" color="secondary">
            Dismissing via <kbd>Escape</kbd>, clicking the backdrop scrim, or the Cancel button guarantees zero state mutation.
          </Text>
        </div>

        <Box p={4} isCard>
          <Text size="sm">Active operation safely continues unaffected.</Text>
        </Box>
      </VStack>
    </Box>
  ),
};

// 5. Disabled Trigger When Running
export const DisabledTriggerWhenRunning: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="neutral">Disabled Action</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Trigger Barrier
          </Heading>
        </div>

        <Box p={4} isCard>
          <Button variant="danger" disabled title="Cannot cancel: Work order is in final heat treatment cycle">
            Cancel Work Order (Locked)
          </Button>
        </Box>
      </VStack>
    </Box>
  ),
};

// 6. Keyboard Focus Trap
export const KeyboardFocusTrap: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Keyboard Ergonomics</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Initial Focus on Safe Control
          </Heading>
          <Text variant="caption" color="secondary">
            Focus automatically lands on "Cancel" (safe action) rather than the destructive confirmation trigger.
          </Text>
        </div>

        <Box p={4} isCard>
          <HStack gap={3}>
            <Button variant="outline">Cancel (Safe Default)</Button>
            <Button variant="danger">Confirm Scrap</Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  ),
};
