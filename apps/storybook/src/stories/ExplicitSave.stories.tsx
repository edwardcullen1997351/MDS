import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
  Input,
  Button,
  Badge,
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Banner,
  ToastProvider,
  useToast,
} from '@ds/react';

const meta: Meta = {
  title: 'Interaction Patterns/10 Explicit Save',
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
          '**Explicit Save Pattern (§01–§20)**\n\n' +
          'Governs a draft boundary opened and closed deliberately, drafts seeded from committed state, explicit Save/Discard commitments, derived dirty tracking, and guards against closing with uncommitted dirty changes.\n\n' +
          '*Scenario:* Changing parameters of routing step OP-20 (CNC Pinion Turning) at **Suryodaya Autocomp Ltd (PL-04 Chakan)** under Process Planner Anjali Deshmukh.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// 1. Drawer Explicit Save (Happy Path)
export const DrawerExplicitSave: Story = {
  render: () => {
    const toast = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [cycleTime, setCycleTime] = useState('42');
    const [spindleRpm, setSpindleRpm] = useState('1800');
    const [feedRate, setFeedRate] = useState('0.25');
    const isDirty = cycleTime !== '42' || spindleRpm !== '1800' || feedRate !== '0.25';

    const handleSave = () => {
      setIsOpen(false);
      toast.success('Routing Updated', `OP-20 parameters updated: Cycle time ${cycleTime}s, ${spindleRpm} RPM.`);
    };

    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Process Engineering · BRK-4820-A Master Routing
            </span>
            <Heading as="h2" size="xl" weight="bold">Routing Operation Parameters</Heading>
            <Text variant="caption" color="secondary">
              Drawer editor with explicit Save/Discard footer and dirty draft tracking.
            </Text>
          </div>

          <Box p={5} isCard>
            <HStack justify="between" align="center">
              <div>
                <Text weight="bold">OP-20: CNC Rough & Finish Turning</Text>
                <Text size="xs" color="secondary">Cycle Time: {cycleTime}s · Speed: {spindleRpm} RPM · Feed: {feedRate} mm/rev</Text>
              </div>
              <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}>
                Edit OP-20 Parameters
              </Button>
            </HStack>
          </Box>

          <Drawer open={isOpen} onOpenChange={setIsOpen} placement="right" size="md">
            <DrawerHeader>
              <DrawerTitle>Edit OP-20 Parameters</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <VStack gap={4} align="stretch">
                {isDirty && <Badge variant="warning">Unsaved Changes (Dirty Draft)</Badge>}

                <div>
                  <label htmlFor="story-explicitsave-97" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                    Target Cycle Time (Seconds) *
                  </label>
                  <Input id="story-explicitsave-97" aria-label="Target Cycle Time (Seconds) *" value={cycleTime} onChange={(e) => setCycleTime(e.target.value)} type="number" />
                </div>

                <div>
                  <label htmlFor="story-explicitsave-104" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                    Spindle Speed (RPM) *
                  </label>
                  <Input id="story-explicitsave-104" aria-label="Spindle Speed (RPM) *" value={spindleRpm} onChange={(e) => setSpindleRpm(e.target.value)} type="number" />
                </div>

                <div>
                  <label htmlFor="story-explicitsave-111" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                    Tool Feed Rate (mm/rev) *
                  </label>
                  <Input id="story-explicitsave-111" aria-label="Tool Feed Rate (mm/rev) *" value={feedRate} onChange={(e) => setFeedRate(e.target.value)} />
                </div>
              </VStack>
            </DrawerBody>
            <DrawerFooter>
              <HStack justify="end" gap={3}>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Discard Changes
                </Button>
                <Button variant="primary" disabled={!isDirty} onClick={handleSave}>
                  Save Parameters
                </Button>
              </HStack>
            </DrawerFooter>
          </Drawer>
        </VStack>
      </Box>
    );
  },
};

// 2. Dirty State Indicator
export const DirtyStateIndicator: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="warning">Derived Dirty State</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Dirty State Calculation
          </Heading>
          <Text variant="caption" color="secondary">
            Save button is enabled only when input differs from committed base values.
          </Text>
        </div>

        <Box p={4} isCard>
          <HStack justify="between">
            <Text size="sm">Cycle Time: 48s (Original was 42s)</Text>
            <Button variant="primary" size="sm">Save (1 Change)</Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 3. Cancel with Dirty Guard
export const CancelWithDirtyGuard: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="danger">Dirty Dismissal Guard</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Discard Confirmation Barrier
          </Heading>
        </div>

        <Banner status="warning" title="Discard Unsaved OP-20 Parameters?" isDismissible={false}>
          You modified spindle speed from 1800 to 2200 RPM. Discarding will lose these changes.
        </Banner>

        <HStack gap={3}>
          <Button variant="outline">Keep Editing</Button>
          <Button variant="danger">Discard Changes & Close</Button>
        </HStack>
      </VStack>
    </Box>
  ),
};

// 4. Validation Error in Drawer
export const ValidationErrorInDrawer: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="danger">Field Validation</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Validation Prevents Save
          </Heading>
        </div>

        <Box p={4} isCard>
          <VStack gap={2} align="start">
            <Text size="sm" weight="semibold">Spindle Speed (RPM)</Text>
            <Input aria-label="Spindle Speed (RPM)" value="6000" isInvalid />
            <Text size="xs" color="danger">Speed exceeds CNC Chuck safety limit of 3,500 RPM.</Text>
            <Button variant="primary" disabled style={{ marginTop: '8px' }}>Save Parameters</Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 5. Save Failure Preservation
export const SaveFailurePreservation: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="danger">Save Error</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Backend Failure Keeps Drawer Open
          </Heading>
        </div>

        <Banner status="error" title="Routing Master Database Locked (Error 500)" isDismissible={false}>
          Database write timed out. Drawer was kept open with your typed parameter values intact.
        </Banner>

        <Button variant="danger">Retry Save</Button>
      </VStack>
    </Box>
  ),
};

// 6. Clean Dismissal Without Guard
export const CleanDismissalWithoutGuard: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Instant Close</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Clean Close (Zero Friction)
          </Heading>
          <Text variant="caption" color="secondary">
            If no fields have been modified, drawer dismisses immediately with zero confirmation friction.
          </Text>
        </div>

        <Box p={4} isCard>
          <Text size="sm">Drawer closed cleanly.</Text>
        </Box>
      </VStack>
    </Box>
  ),
};

// 7. Keyboard Shortcuts (Ctrl+S / Esc)
export const KeyboardShortcuts: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Keyboard Ergonomics</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Shortcut Support
          </Heading>
          <Text variant="caption" color="secondary">
            Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save immediately, <kbd>Escape</kbd> to close.
          </Text>
        </div>

        <Box p={4} isCard>
          <Text size="sm">Focused in editing context. Shortcuts active.</Text>
        </Box>
      </VStack>
    </Box>
  ),
};
