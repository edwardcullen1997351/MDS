import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  Badge,
  Banner,
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  ToastProvider,
  useToast,
} from '@ds/react';

const meta: Meta = {
  title: 'Interaction Patterns/11 Asynchronous Action',
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
          '**Asynchronous Action Pattern (§01–§20)**\n\n' +
          'Governs logical operation identities held outside component state, feedback bound to the job\'s subject, declared repeat-activation policies, progress tracking, cancellation, and retry resuming from failed stages.\n\n' +
          '*Scenario:* MRP batch calculation and gate barcode label generation at **Suryodaya Autocomp Ltd (PL-04 Chakan)**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// 1. Background Job Polling (Happy Path)
export const BackgroundJobPolling: Story = {
  render: () => {
    const toast = useToast();
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [stageText, setStageText] = useState('Idle');

    const handleStartMRP = () => {
      setIsRunning(true);
      setProgress(10);
      setStageText('Calculating BOM exploded requirements...');

      setTimeout(() => {
        setProgress(45);
        setStageText('Evaluating supplier lead times (Nashik Forge)...');
      }, 800);

      setTimeout(() => {
        setProgress(80);
        setStageText('Balancing press machine shop capacities...');
      }, 1600);

      setTimeout(() => {
        setProgress(100);
        setIsRunning(false);
        setStageText('MRP Run Complete. 14 Purchase Requisitions Generated.');
        toast.success('MRP Completed', 'Material Requirements Planning calculation finished for Week 40.');
      }, 2400);
    };

    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Production Planning · MRP Engine
            </span>
            <Heading as="h2" size="xl" weight="bold">Regenerative MRP Calculation</Heading>
            <Text variant="caption" color="secondary">
              Long-running batch job with phased progress polling and resilient state tracking.
            </Text>
          </div>

          <Box p={5} isCard>
            <VStack gap={4} align="stretch">
              <HStack justify="between" align="center">
                <div>
                  <Text weight="bold">Week 40 Capacity & Materials Run</Text>
                  <Text size="xs" color="secondary">Target: Chakan Plant 04 All Lines</Text>
                </div>
                <Badge variant={isRunning ? 'brand' : progress === 100 ? 'success' : 'neutral'}>
                  {isRunning ? 'Calculating...' : progress === 100 ? 'Completed' : 'Ready'}
                </Badge>
              </HStack>

              {progress > 0 && (
                <div>
                  <HStack justify="between" style={{ marginBottom: '6px' }}>
                    <Text size="xs" color="secondary">{stageText}</Text>
                    <Text size="xs" weight="bold">{progress}%</Text>
                  </HStack>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${progress}%`,
                        height: '100%',
                        backgroundColor: progress === 100 ? '#15803D' : '#2563EB',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              )}

              <HStack justify="end">
                <Button
                  variant="primary"
                  isLoading={isRunning}
                  loadingText="Executing MRP Run..."
                  onClick={handleStartMRP}
                  disabled={isRunning}
                >
                  {progress === 100 ? 'Re-Run MRP Calculation' : 'Start MRP Run'}
                </Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  },
};

// 2. Indeterminate Quick Task
export const IndeterminateQuickTask: Story = {
  render: () => {
    const [loading, setLoading] = useState(false);

    const handlePrint = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 1200);
    };

    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <Badge variant="info">Fast Async</Badge>
            <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
              Indeterminate Quick Dispatch
            </Heading>
            <Text variant="caption" color="secondary">
              Button loading spinner for short sub-3s tasks (e.g. barcode label printing).
            </Text>
          </div>

          <Box p={4} isCard>
            <HStack justify="between" align="center">
              <Text size="sm">Gate 02 Inward Barcode Zebra Printer</Text>
              <Button variant="primary" size="sm" isLoading={loading} onClick={handlePrint}>
                Print Gate Labels
              </Button>
            </HStack>
          </Box>
        </VStack>
      </Box>
    );
  },
};

// 3. Job Cancellation
export const JobCancellation: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="warning">Cancellation Contract</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Safe Job Abort
          </Heading>
          <Text variant="caption" color="secondary">
            User can abort in-progress calculation without corrupting already committed ledger items.
          </Text>
        </div>

        <Box p={4} isCard>
          <HStack justify="between" align="center">
            <div>
              <Text weight="semibold">MRP Run in Progress (45%)</Text>
              <Text size="xs" color="secondary">Job ID: JOB-MRP-9042</Text>
            </div>
            <Button variant="danger" size="sm" onClick={() => alert('Job safely cancelled.')}>
              Cancel Calculation
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 4. Job Failed with Resumption
export const JobFailedWithResumption: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="danger">Resilient Recovery</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Resume from Failed Stage
          </Heading>
        </div>

        <Banner status="error" title="MRP Interrupted at Step 3 of 4" isDismissible={false}>
          Step 1 (BOM Explode) and Step 2 (Lead Time) succeeded. Step 3 (Line Balance) timed out.
        </Banner>

        <Box p={4} isCard>
          <HStack justify="between" align="center">
            <Text size="sm">Resume calculation from Step 3 without repeating Steps 1-2?</Text>
            <Button variant="primary" size="sm">Resume MRP Run</Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 5. Multiple Concurrent Jobs
export const MultipleConcurrentJobs: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Concurrent Isolation</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Isolated Concurrent Jobs
          </Heading>
        </div>

        <VStack gap={3} align="stretch">
          <Box p={3} isCard>
            <HStack justify="between">
              <Text size="sm">Job #1: Weekly Dispatch Summary Export</Text>
              <Badge variant="brand">Running (60%)</Badge>
            </HStack>
          </Box>
          <Box p={3} isCard>
            <HStack justify="between">
              <Text size="sm">Job #2: SAP Ledger Nightly Sync</Text>
              <Badge variant="neutral">Queued</Badge>
            </HStack>
          </Box>
        </VStack>
      </VStack>
    </Box>
  ),
};

// 6. Disabled During Execution
export const DisabledDuringExecution: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="neutral">Locked Trigger</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Execution Lockout
          </Heading>
        </div>

        <Box p={4} isCard>
          <Button variant="primary" disabled title="MRP calculation is already executing on cluster node 2">
            Start MRP Run (Job In Progress)
          </Button>
        </Box>
      </VStack>
    </Box>
  ),
};

// 7. A11y Live Announcements
export const A11yLiveAnnouncements: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Accessibility</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Assistive Tech Announcements
          </Heading>
        </div>

        <Box p={4} isCard>
          <div role="status" aria-live="polite" style={{ fontSize: '13px', color: '#1E293B' }}>
            "MRP Batch job JOB-9042: Step 3 of 4 completed successfully."
          </div>
        </Box>
      </VStack>
    </Box>
  ),
};
