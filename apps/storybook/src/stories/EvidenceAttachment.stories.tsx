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
  title: 'Interaction Patterns/13 Evidence Attachment',
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
          '**Evidence Attachment Pattern (§01–§20)**\n\n' +
          'Governs the relationship between an attachment set and the commit it gates, required-evidence gating with clear messaging, file reference IDs rather than repeated uploads, and distinct handling of file vs form submission failures.\n\n' +
          '*Scenario:* Returning a calibrated Mitutoyo bore gauge (`GAUGE-BG-104`) to plant service at **Suryodaya Autocomp Ltd (PL-04 Chakan)**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// 1. Mandatory Certificate Upload (Happy Path)
export const MandatoryCertificateUpload: Story = {
  render: () => {
    const toast = useToast();
    const [fileUploaded, setFileUploaded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isReturned, setIsReturned] = useState(false);

    const handleReturnToService = () => {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsReturned(true);
        toast.success('Gauge Returned to Service', 'GAUGE-BG-104 calibrated and active on Press Line 02.');
      }, 700);
    };

    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Metrology Lab · Calibration Return
            </span>
            <Heading as="h2" size="xl" weight="bold">Return Gauge to Service</Heading>
            <Text variant="caption" color="secondary">
              Upload mandatory ISO/IEC 17025 calibration certificate to unblock shop-floor release.
            </Text>
          </div>

          {isReturned ? (
            <Box p={5} isCard>
              <VStack gap={3} align="start">
                <Badge variant="success">CALIBRATION VERIFIED</Badge>
                <Heading as="h3" size="lg">GAUGE-BG-104 Active in Line 02</Heading>
                <Text size="sm" color="secondary">
                  Calibration valid until 2027-09-23. Quality Manager Meera Nair notified.
                </Text>
                <Button size="sm" variant="outline" onClick={() => { setIsReturned(false); setFileUploaded(false); }}>
                  Calibrate Another Gauge
                </Button>
              </VStack>
            </Box>
          ) : (
            <Box p={5} isCard>
              <VStack gap={4} align="stretch">
                <HStack justify="between">
                  <div>
                    <Text size="xs" color="secondary">EQUIPMENT CODE</Text>
                    <Text weight="semibold">GAUGE-BG-104</Text>
                  </div>
                  <div>
                    <Text size="xs" color="secondary">MODEL</Text>
                    <Text weight="semibold">Mitutoyo 511-711 (18-35mm)</Text>
                  </div>
                </HStack>

                <div>
                  <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                    Mandatory Calibration Certificate (PDF / Image) *
                  </span>

                  {fileUploaded ? (
                    <Box p={3} style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '6px' }}>
                      <HStack justify="between" align="center">
                        <HStack gap={2} align="center">
                          <Text size="xs" weight="bold" style={{ color: '#166534' }}>📄 CAL-CERT-2026-9901.pdf</Text>
                          <Badge variant="success">Uploaded (420 KB)</Badge>
                        </HStack>
                        <Button size="sm" variant="ghost" onClick={() => setFileUploaded(false)}>
                          Remove
                        </Button>
                      </HStack>
                    </Box>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setFileUploaded(true)}
                      style={{
                        width: '100%', font: 'inherit',
                        padding: '24px',
                        border: '2px dashed #CBD5E1',
                        borderRadius: '8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: '#F8FAFC',
                      }}
                    >
                      <span style={{ display: 'block', fontWeight: 600 }}>Upload calibration report PDF</span>
                      <span style={{ display: 'block', fontSize: '12px', color: '#475569' }}>NABL accredited lab certificate required</span>
                    </button>
                  )}
                </div>

                {!fileUploaded && (
                  <Text size="xs" color="secondary">
                    ℹ️ "Return to Service" button remains disabled until certificate file upload is complete.
                  </Text>
                )}

                <HStack justify="end">
                  <Button
                    variant="primary"
                    disabled={!fileUploaded}
                    isLoading={isSubmitting}
                    onClick={handleReturnToService}
                  >
                    Return Gauge to Service
                  </Button>
                </HStack>
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>
    );
  },
};

// 2. File Validation Errors (Size / Format)
export const FileValidationErrors: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="danger">File Rejection</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Unsupported File Format
          </Heading>
        </div>

        <Banner status="error" title="Invalid File: certificate_scan.exe (Rejected)" isDismissible={false}>
          Only PDF, PNG, and JPG calibration certificates under 10 MB are permitted by Suryodaya IT policy.
        </Banner>
      </VStack>
    </Box>
  ),
};

// 3. Upload Failure & Retry
export const UploadFailureAndRetry: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="warning">Upload Interrupted</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Certificate Upload Timed Out
          </Heading>
        </div>

        <Box p={4} isCard>
          <HStack justify="between" align="center">
            <div>
              <Text weight="semibold">cal_report_bg104.pdf (Failed at 75%)</Text>
              <Text size="xs" color="secondary">Storage gateway disconnect</Text>
            </div>
            <Button size="sm" variant="danger">Retry Upload</Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 4. Multi-File Attachment
export const MultiFileAttachment: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Heading as="h2" size="xl" weight="bold">Multi-File Evidence Set</Heading>
        </div>

        <Box p={4} isCard>
          <VStack gap={2} align="stretch">
            <HStack justify="between">
              <Text size="sm">1. NABL_Certificate_2026.pdf (420 KB)</Text>
              <Badge variant="success">Ready</Badge>
            </HStack>
            <HStack justify="between">
              <Text size="sm">2. Master_Ring_Inspection_Log.xlsx (120 KB)</Text>
              <Badge variant="success">Ready</Badge>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 5. Read-Only Attached Evidence
export const ReadOnlyAttachedEvidence: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="neutral">Verified Evidence</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Verified Calibration Record
          </Heading>
        </div>

        <Box p={4} isCard>
          <HStack justify="between" align="center">
            <div>
              <Text weight="semibold">CAL-2026-NABL-094.pdf</Text>
              <Text size="xs" color="secondary">Verified by Meera Nair on 2026-09-23</Text>
            </div>
            <Button size="sm" variant="outline">View PDF Document</Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 6. Initial Empty Upload Zone
export const InitialEmptyUploadZone: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Heading as="h2" size="xl" weight="bold">Attach Evidence Document</Heading>
        </div>

        <div style={{ padding: '32px', border: '2px dashed #CBD5E1', textAlign: 'center', borderRadius: '8px' }}>
          <Text size="sm">Drag calibration certificate PDF here or click to browse</Text>
        </div>
      </VStack>
    </Box>
  ),
};

// 7. Keyboard Upload Trigger
export const KeyboardUploadTrigger: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Keyboard Accessibility</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Keyboard File Picker Trigger
          </Heading>
        </div>

        <Box p={4} isCard>
          <Button variant="outline">
            Browse Certificate Files (Space / Enter)
          </Button>
        </Box>
      </VStack>
    </Box>
  ),
};
