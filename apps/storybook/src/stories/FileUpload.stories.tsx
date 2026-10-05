import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FileUpload, UploadedFile, VStack, HStack, Button, Text, Badge, Box } from '@ds/react';

const meta: Meta<typeof FileUpload> = {
  title: 'Composites/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  argTypes: {
    maxSizeMB: {
      control: 'number',
      description: 'Maximum allowable file size in megabytes',
    },
    multiple: {
      control: 'boolean',
      description: 'Permit multiple concurrent file selections',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables drag and file picker triggers',
    },
    label: {
      control: 'text',
      description: 'Dropzone title text',
    },
    hint: {
      control: 'text',
      description: 'Help text with format and size limits',
    },
  },
  args: {
    maxSizeMB: 15,
    multiple: true,
    disabled: false,
    label: 'Upload Inspection Reports & Calibration Certificates',
    hint: 'PDF, CSV, or PNG up to 15MB',
  },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

/**
 * Interactive default playground for FileUpload.
 */
export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: '640px', padding: '24px' }}>
      <FileUpload {...args} />
    </div>
  ),
};

/**
 * Pre-populated Attachment Vault with realistic Suryodaya Autocomp Ltd plant documents.
 */
export const PreloadedAttachmentVault: Story = {
  render: () => {
    const [files, setFiles] = useState<UploadedFile[]>([
      {
        id: '1',
        name: 'BRK-4820-A_CAD_Machining_Drawing_Rev3.pdf',
        size: 4820100,
        status: 'complete',
      },
      {
        id: '2',
        name: 'CMM_Coordinate_Measurement_Report_ShiftA.csv',
        size: 142800,
        status: 'complete',
      },
      {
        id: '3',
        name: 'Spectrometry_Alloy_Test_Certificate.pdf',
        size: 820400,
        status: 'complete',
      },
    ]);

    return (
      <VStack gap={4} align="start" style={{ maxWidth: '640px', padding: '24px' }}>
        <Box p={3} isCard style={{ width: '100%' }}>
          <VStack gap={1}>
            <Text size="xs" color="secondary" weight="semibold">
              PART BRK-4820-A · QUALITY CONFORMANCE DOSSIER
            </Text>
            <HStack gap={2} align="center">
              <Text size="sm" weight="medium">Attached Documents:</Text>
              <Badge variant="brand">{files.length} Files</Badge>
            </HStack>
          </VStack>
        </Box>

        <FileUpload
          label="Equipment Maintenance Attachment Vault"
          hint="Engineering CAD schematics, vibration logs (max 25MB)"
          maxSizeMB={25}
          files={files}
          onFilesChange={setFiles}
        />
      </VStack>
    );
  },
};

/**
 * File rejection and error handling: Demonstrates oversized file rejection and failure alerts.
 */
export const FileRejectionAndErrors: Story = {
  render: () => {
    const [files, setFiles] = useState<UploadedFile[]>([
      {
        id: '1',
        name: 'Hydraulic_Press_Parameters.csv',
        size: 120000,
        status: 'complete',
      },
      {
        id: '2',
        name: 'HighSpeed_4K_Video_Dump.mp4',
        size: 48500000,
        status: 'error',
        errorMessage: 'File exceeds 10MB limit (size: 48.5 MB)',
      },
    ]);

    return (
      <VStack gap={4} align="start" style={{ maxWidth: '640px', padding: '24px' }}>
        <FileUpload
          label="Quality Non-Conformance Evidence"
          hint="PDF, PNG, CSV up to 10MB"
          maxSizeMB={10}
          files={files}
          onFilesChange={setFiles}
        />
      </VStack>
    );
  },
};

/**
 * Single File Attachment mode (e.g. replacing firmware binary or master BOM file).
 */
export const SingleFileMode: Story = {
  render: () => {
    const [files, setFiles] = useState<UploadedFile[]>([
      {
        id: 'bom-1',
        name: 'BOM_Hierarchy_Master_RevB.xlsx',
        size: 340000,
        status: 'complete',
      },
    ]);

    return (
      <VStack gap={4} align="start" style={{ maxWidth: '640px', padding: '24px' }}>
        <FileUpload
          label="Single Master Routing Document"
          hint="Single Excel or CSV spreadsheet (replaces previous file)"
          multiple={false}
          files={files}
          onFilesChange={setFiles}
        />
      </VStack>
    );
  },
};

/**
 * Controlled Submission Gatekeeper:
 * Demonstrates the aggregate status contract where the form Submit/Save action
 * is strictly gated by whether any file is failing or still uploading.
 */
export const ControlledSubmissionGate: Story = {
  render: () => {
    const [files, setFiles] = useState<UploadedFile[]>([
      {
        id: '1',
        name: 'Hardness_Testing_Log.pdf',
        size: 940000,
        status: 'complete',
      },
      {
        id: '2',
        name: 'Corrupted_Telemetry_Stream.bin',
        size: 1200000,
        status: 'error',
        errorMessage: 'File validation failed: checksum mismatch',
      },
    ]);

    const hasErrors = files.some((f) => f.status === 'error');
    const isReady = files.length > 0 && !hasErrors;

    return (
      <VStack gap={4} align="start" style={{ maxWidth: '640px', padding: '24px' }}>
        <Box p={3} isCard style={{ width: '100%', background: 'var(--surface-raised, #F8FAFC)' }}>
          <VStack gap={1}>
            <Text size="xs" color={hasErrors ? 'danger' : 'brand'} weight="semibold">
              {hasErrors ? 'SUBMISSION BLOCKED: RESOLVE FAILED FILES' : 'ALL ATTACHMENTS VERIFIED'}
            </Text>
            <Text size="xs" color="muted">
              {hasErrors
                ? 'Remove or replace invalid files before saving the purchase requisition.'
                : 'All documents valid. You may proceed with releasing the work order.'}
            </Text>
          </VStack>
        </Box>

        <FileUpload
          label="Purchase Requisition Supporting Invoices"
          hint="Upload verified vendor invoices from Nashik Forge & Machine Works"
          files={files}
          onFilesChange={setFiles}
        />

        <HStack gap={3} justify="end" style={{ width: '100%' }}>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button variant="primary" size="sm" disabled={!isReady}>
            Release Requisition (₹2,50,000)
          </Button>
        </HStack>
      </VStack>
    );
  },
};

/**
 * Disabled State: Read-only attachment view for archived work order dossiers.
 */
export const DisabledState: Story = {
  render: () => (
    <VStack gap={4} align="start" style={{ maxWidth: '640px', padding: '24px' }}>
      <FileUpload
        label="Archived Work Order WO-2026-0814 (Signed)"
        hint="Historical attachments locked against modification"
        disabled={true}
        files={[
          {
            id: '1',
            name: 'Final_Inspection_Signoff_Meera_Nair.pdf',
            size: 1200000,
            status: 'complete',
          },
        ]}
      />
    </VStack>
  ),
};

/**
 * Empty Initial Dropzone: Clean empty state awaiting user interaction.
 */
export const EmptyInitialState: Story = {
  render: () => (
    <div style={{ maxWidth: '640px', padding: '24px' }}>
      <FileUpload
        label="Drop calibration log files here"
        hint="Accepts .pdf, .csv, .png (Max 10MB per file)"
        files={[]}
      />
    </div>
  ),
};

/**
 * With Upload Errors: Showcases WCAG 3.3.1 error identification on failed files
 * with role="alert" announcements and clear remediation guidance.
 */
export const WithUploadErrors: Story = {
  render: (args) => {
    const [files, setFiles] = useState<UploadedFile[]>([
      {
        id: 'err-1',
        name: 'Schuler_Press_Firmware_v4.exe',
        size: 38400000,
        status: 'error',
        errorMessage: 'Executable files (.exe) prohibited by plant cybersecurity policy SEC-04.',
      },
      {
        id: 'err-2',
        name: 'Vibration_Telemetry_Raw_Stream.dat',
        size: 24200000,
        status: 'error',
        errorMessage: 'File size (24.2 MB) exceeds the 15 MB upload limit.',
      },
      {
        id: 'ok-1',
        name: 'ISO_9001_Audit_Checklist_Signed.pdf',
        size: 1420000,
        status: 'complete',
      },
    ]);

    return (
      <VStack gap={4} align="start" style={{ maxWidth: '640px', padding: '24px' }}>
        <FileUpload
          {...args}
          label="Quality Audit Evidence Vault"
          hint="PDF, CSV, or PNG up to 15MB"
          files={files}
          onFilesChange={setFiles}
        />
      </VStack>
    );
  },
};
