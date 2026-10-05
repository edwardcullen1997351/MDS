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
  Input,
  ToastProvider,
} from '@ds/react';

const meta: Meta = {
  title: 'Interaction Patterns/12 Recoverable Failure',
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
          '**Recoverable Failure Pattern (§01–§20)**\n\n' +
          'Governs failure held as state with necessary retry context, strict separation of validation vs operational failures, preservation of all inputs through retries, exponential backoff, and fatal routing for non-recoverable cases.\n\n' +
          '*Scenario:* Posting Shift A production yield confirmations at **Suryodaya Autocomp Ltd (PL-04 Chakan)**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// 1. Network Disconnection Recovery (Happy Path)
export const NetworkDisconnectionRecovery: Story = {
  render: () => {
    const [isRetrying, setIsRetrying] = useState(false);
    const [isRecovered, setIsRecovered] = useState(false);

    const handleRetry = () => {
      setIsRetrying(true);
      setTimeout(() => {
        setIsRetrying(false);
        setIsRecovered(true);
      }, 1000);
    };

    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Shift Confirmation · Shift A (Line 01)
            </span>
            <Heading as="h2" size="xl" weight="bold">Production Confirmation Post</Heading>
            <Text variant="caption" color="secondary">
              Operational network interruption handled with contextual retry without data loss.
            </Text>
          </div>

          {isRecovered ? (
            <Banner status="success" title="450 Units Successfully Confirmed" isDismissible={false}>
              Production yield written to SAP inventory ledger. Shift A logged as completed.
            </Banner>
          ) : (
            <>
              <Banner status="error" title="Plant Gateway Offline (Socket Connection Dropped)" isDismissible={false}>
                Could not connect to PL-04 central MES cluster. All entered shift quantities (450 pcs good, 12 pcs scrap) remain safely preserved in local memory.
              </Banner>

              <Box p={5} isCard>
                <VStack gap={3} align="stretch">
                  <HStack justify="between">
                    <Text size="sm" color="secondary">Line 01 Good Yield:</Text>
                    <Text size="sm" weight="bold">450 Units</Text>
                  </HStack>
                  <HStack justify="between">
                    <Text size="sm" color="secondary">Line 01 Scrap Count:</Text>
                    <Text size="sm" weight="bold">12 Units (Forging Flash)</Text>
                  </HStack>

                  <HStack justify="end" gap={3} style={{ marginTop: '12px' }}>
                    <Button variant="outline" onClick={() => alert('Saved to local offline queue.')}>
                      Save Offline Queue
                    </Button>
                    <Button variant="danger" isLoading={isRetrying} loadingText="Reconnecting to MES..." onClick={handleRetry}>
                      Retry Confirmation Post
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            </>
          )}
        </VStack>
      </Box>
    );
  },
};

// 2. Validation vs Operational Error Separation
export const ValidationVsOperationalSplit: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="warning">Contract Distinction §09 vs §10</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Validation vs Network Separation
          </Heading>
          <Text variant="caption" color="secondary">
            Never phrase an operational gateway crash as user form input error.
          </Text>
        </div>

        <Banner status="error" title="Gateway Timeout (Error 504)" isDismissible={false}>
          Your input values are 100% valid, but the shop-floor database server did not acknowledge the write.
        </Banner>
      </VStack>
    </Box>
  ),
};

// 3. Exponential Backoff Retry Countdown
export const ExponentialBackoffRetry: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Automated Backoff</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Exponential Backoff Polling
          </Heading>
        </div>

        <Box p={4} isCard>
          <VStack gap={2} align="start">
            <Text size="sm" weight="semibold">Attempt 3 of 5 Failed</Text>
            <Text size="xs" color="secondary">Next automated reconnection attempt in <strong>8 seconds</strong>...</Text>
            <Button size="sm" variant="primary" style={{ marginTop: '6px' }}>
              Retry Now (Skip Timer)
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 4. Partial Data Preservation
export const PartialDataPreservation: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">State Preservation</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Preservation of Entered Quantities
          </Heading>
        </div>

        <Box p={4} isCard>
          <VStack gap={3}>
            <Input aria-label="Recoverable Failure field" value="450" readOnly style={{ backgroundColor: '#F8FAFC' }} />
            <Text size="xs" color="secondary">Entered data preserved across all failed retry attempts.</Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 5. Fatal Non-Recoverable Error
export const TerminalNonRecoverableError: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="danger">Terminal Failure</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Non-Recoverable Database Constraint
          </Heading>
        </div>

        <Banner status="error" title="Fiscal Period Closed for Audit (Lockout)" isDismissible={false}>
          Shift confirmations for Month 08 are locked by Corporate Finance. Retrying will not succeed. Contact IT Helpdesk.
        </Banner>

        <HStack gap={3}>
          <Button variant="outline">Contact ERP Support</Button>
          <Button variant="primary">Return to Dashboard</Button>
        </HStack>
      </VStack>
    </Box>
  ),
};

// 6. Empty Dataset Fallback
export const EmptyDatasetFallback: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Heading as="h2" size="xl" weight="bold">Shift Confirmation Register</Heading>
        </div>

        <Box p={6} isCard style={{ textAlign: 'center' }}>
          <Text size="sm" color="secondary">No unconfirmed production runs pending for Shift A.</Text>
        </Box>
      </VStack>
    </Box>
  ),
};

// 7. Screen Reader Error Alert
export const ScreenReaderErrorAlert: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">A11y Assertive Alert</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Assertive Screen Reader Alert
          </Heading>
        </div>

        <Box p={4} isCard>
          <div role="alert" aria-live="assertive" style={{ fontSize: '13px', color: '#991B1B' }}>
            "Error: Production post failed due to network timeout. Entered yield numbers preserved."
          </div>
        </Box>
      </VStack>
    </Box>
  ),
};
