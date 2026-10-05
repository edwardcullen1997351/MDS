import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  Select,
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
  title: 'Interaction Patterns/15 Bulk Data Import',
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
          '**Bulk Data Import Pattern (§01–§20)**\n\n' +
          'Governs file transactions, explicit column mapping gating dry runs, dry-run simulation without database mutation, mapping staleness signatures, partial acceptance with downloadable error artifacts, and transactional batch commits.\n\n' +
          '*Scenario:* Importing supplier catalogue pricelist (`supplier_catalog_nashik_q3.csv`) into the Item Master at **Suryodaya Autocomp Ltd (PL-04 Chakan)**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// 1. Full 4-Step Import Flow (Happy Path)
export const FullFourStepImportFlow: Story = {
  render: () => {
    const toast = useToast();
    const [step, setStep] = useState(1);
    const [isDryRunning, setIsDryRunning] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleRunDryRun = () => {
      setIsDryRunning(true);
      setTimeout(() => {
        setIsDryRunning(false);
        setStep(3);
      }, 700);
    };

    const handleFinalCommit = () => {
      setIsImporting(true);
      setTimeout(() => {
        setIsImporting(false);
        setIsDone(true);
        toast.success('Import Successful', '28 SKU pricelist records imported into Item Master.');
      }, 800);
    };

    return (
      <Box style={{ maxWidth: '780px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Item Master · Catalog Import Engine
            </span>
            <Heading as="h2" size="xl" weight="bold">Bulk Catalog Import</Heading>
            <Text variant="caption" color="secondary">
              Multi-phase ingestion with column mapping, dry-run validation preview, and rejected row export.
            </Text>
          </div>

          {/* Stepper */}
          <HStack justify="between" style={{ padding: '10px 16px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            {['1. Upload File', '2. Map Columns', '3. Dry-Run Verdict', '4. Complete'].map((label, idx) => (
              <Text key={label} size="xs" weight={step === idx + 1 ? 'bold' : 'regular'} color={step === idx + 1 ? 'primary' : 'secondary'}>
                {label}
              </Text>
            ))}
          </HStack>

          {isDone ? (
            <Box p={5} isCard>
              <VStack gap={3} align="start">
                <Badge variant="success">IMPORT COMMITTED</Badge>
                <Heading as="h3" size="lg">28 Parts Successfully Ingested</Heading>
                <Text size="sm" color="secondary">
                  Supplier pricelist for Nashik Forge & Machine Works active across all PL-04 purchasing desks.
                </Text>
                <Button size="sm" variant="outline" onClick={() => { setIsDone(false); setStep(1); }}>
                  Import Another File
                </Button>
              </VStack>
            </Box>
          ) : (
            <Box p={5} isCard>
              <VStack gap={4} align="stretch">
                {step === 1 && (
                  <>
                    <Heading as="h3" size="lg">Step 1: Select Catalog File</Heading>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      style={{
                        width: '100%', font: 'inherit',
                        padding: '32px',
                        border: '2px dashed #CBD5E1',
                        borderRadius: '8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: '#F8FAFC',
                      }}
                    >
                      <span style={{ display: 'block', fontWeight: 600 }}>supplier_catalog_nashik_q3.csv (48 KB)</span>
                      <span style={{ display: 'block', fontSize: '12px', color: '#475569' }}>Proceed to column mapping</span>
                    </button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <Heading as="h3" size="lg">Step 2: Target Field to Column Mapping</Heading>
                    <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
                          <th style={{ padding: '8px 0' }}>TARGET FIELD (ERP)</th>
                          <th style={{ padding: '8px 0' }}>CSV COLUMN HEADER</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '8px 0', fontWeight: 600 }}>Part Number SKU *</td>
                          <td><Select aria-label="Select option" items={[{ label: 'Col 1: part_code', value: 'c1' }]} value={['c1']} /></td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '8px 0', fontWeight: 600 }}>Unit Price (INR ₹) *</td>
                          <td><Select aria-label="Select option" items={[{ label: 'Col 2: rate_inr', value: 'c2' }]} value={['c2']} /></td>
                        </tr>
                      </tbody>
                    </table>

                    <HStack justify="between" style={{ marginTop: '12px' }}>
                      <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
                      <Button variant="primary" isLoading={isDryRunning} onClick={handleRunDryRun}>
                        Execute Dry-Run Preview →
                      </Button>
                    </HStack>
                  </>
                )}

                {step === 3 && (
                  <>
                    <Heading as="h3" size="lg">Step 3: Dry-Run Simulation Verdict</Heading>
                    <Banner status="success" title="Dry Run Result: 28 of 28 Rows Valid" isDismissible={false}>
                      Simulation verified SKU formats, positive currency values, and vendor authorizations. Zero database changes made.
                    </Banner>

                    <HStack justify="between" style={{ marginTop: '12px' }}>
                      <Button variant="outline" onClick={() => setStep(2)}>← Edit Mapping</Button>
                      <Button variant="primary" isLoading={isImporting} onClick={handleFinalCommit}>
                        Commit Import (28 SKUs)
                      </Button>
                    </HStack>
                  </>
                )}
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>
    );
  },
};

// 2. Column Mapping Validation
export const ColumnMappingValidation: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="warning">Mapping Enforcement</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Unmapped Mandatory Field Blocks Dry Run
          </Heading>
        </div>

        <Banner status="error" title="Missing Required Mapping: Unit Price (₹)" isDismissible={false}>
          Every catalog item must have a mapped price column before dry-run execution can start.
        </Banner>
      </VStack>
    </Box>
  ),
};

// 3. Dry Run Validation Errors
export const DryRunValidationErrors: Story = {
  render: () => (
    <Box style={{ maxWidth: '680px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="danger">Dry-Run Findings</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            25 Valid Rows · 3 Invalid Rows
          </Heading>
        </div>

        <Banner status="warning" title="3 Rows Failed Validation" isDismissible={false}>
          Row 12: Price is negative (-₹400). Row 18: SKU BRK-INVALID not in plant item master.
        </Banner>

        <Box p={4} isCard>
          <HStack justify="between" align="center">
            <Text size="sm">Import 25 valid records and export 3 rejects to CSV?</Text>
            <Button variant="primary" size="sm">Import 25 Valid Records</Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 4. Partial Commit with Reject Export
export const PartialCommitWithRejectExport: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Reject Artifact §14</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Download Rejected Rows CSV
          </Heading>
        </div>

        <Box p={4} isCard>
          <VStack gap={3} align="start">
            <Text size="sm">25 records committed. Download the annotated rejection CSV for vendor correction:</Text>
            <Button size="sm" variant="outline">
              📥 Download Rejections (3_rejected_rows.csv)
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 5. Import Commit Failure (Preserved Preview)
export const ImportCommitFailure: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="danger">Database Deadlock</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Commit Failure Retains Preview
          </Heading>
        </div>

        <Banner status="error" title="Database Transaction Timed Out" isDismissible={false}>
          SAP Item Master ledger did not complete write. Dry-run verdict and parsed dataset preserved for retry.
        </Banner>

        <Button variant="danger">Retry Ingestion Commit</Button>
      </VStack>
    </Box>
  ),
};

// 6. Large Volume Progress Simulation
export const LargeVolumeProgress: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Heading as="h2" size="xl" weight="bold">10,000 Row Ingestion</Heading>
          <Text variant="caption" color="secondary">Phased progress bar across parse, evaluate, and commit.</Text>
        </div>

        <Box p={4} isCard>
          <VStack gap={2}>
            <HStack justify="between">
              <Text size="xs" color="secondary">Evaluating row 6,400 of 10,000...</Text>
              <Text size="xs" weight="bold">64%</Text>
            </HStack>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '64%', height: '100%', backgroundColor: '#2563EB' }} />
            </div>
          </VStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 7. Empty Template Download
export const EmptyTemplateDownload: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Heading as="h2" size="xl" weight="bold">Sample Import Templates</Heading>
        </div>

        <Box p={4} isCard>
          <HStack justify="between" align="center">
            <Text size="sm">Download official Suryodaya Item Master CSV template with required headers.</Text>
            <Button size="sm" variant="outline">Download .CSV Template</Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 8. Keyboard Wizard Navigation
export const KeyboardWizardNavigation: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Keyboard Accessibility</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Wizard Keyboard Navigation
          </Heading>
        </div>

        <Box p={4} isCard>
          <Button variant="primary">
            Execute Dry-Run Preview (Enter)
          </Button>
        </Box>
      </VStack>
    </Box>
  ),
};
