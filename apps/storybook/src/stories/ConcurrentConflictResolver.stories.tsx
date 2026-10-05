import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ConcurrentConflictResolver,
  Button,
} from '@ds/react';

const meta: Meta<typeof ConcurrentConflictResolver> = {
  title: 'Interaction Patterns/Concurrent Conflict Resolver',
  component: ConcurrentConflictResolver,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Non-destructive side-by-side comparison drawer for concurrent allocation conflicts. Triggered when an allocation attempt returns an HTTP 409 / ETag version mismatch. Displays the local planned change against the current remote system state, offering 3 one-click resolution actions without clearing the user form.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ConcurrentConflictResolver>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [lastAction, setLastAction] = useState<string | null>(null);
    const [currentQty, setCurrentQty] = useState(150);
    const [auditLog, setAuditLog] = useState<string[]>([
      '11:15:02 — Planner drafted allocation: 150 KG to Line 02 (Syrup Bottling)',
      '11:16:45 — Remote ETag committed by Anantshriveda: 100 KG reserved for QC holding',
      '11:17:10 — HTTP 409 ETag mismatch triggered; drawer opened non-destructively',
    ]);

    const handleAcceptRemote = () => {
      setCurrentQty(100);
      setLastAction('Accepted Remote (100 KG committed to QC Holding; schedule re-calculated)');
      setAuditLog((prev) => [
        ...prev,
        '11:18:00 — RESOLUTION: Accepted remote version 2a (100 KG). Matrix recalculated.',
      ]);
      setIsOpen(false);
    };

    const handleAllocateDelta = () => {
      setCurrentQty(50);
      setLastAction('Allocated Remaining Delta (50 KG successfully assigned to Line 02)');
      setAuditLog((prev) => [
        ...prev,
        '11:18:00 — RESOLUTION: Allocated remaining delta of 50 KG to Line 02. No conflict generated.',
      ]);
      setIsOpen(false);
    };

    const handleForceOverride = () => {
      setCurrentQty(150);
      setLastAction('Force Override Executed (Admin privileges used to enforce 150 KG on Line 02)');
      setAuditLog((prev) => [
        ...prev,
        '11:18:00 — RESOLUTION: ADMIN FORCE OVERRIDE committed (150 KG). Remote reservation superseded.',
      ]);
      setIsOpen(false);
    };

    return (
      <div style={{ padding: '32px', minHeight: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700 }}>
            Manufacturing Allocation Workspace
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
            Simulate concurrent user collision on material <strong>RAW-EXT-ASH-05</strong> (Ashwagandha Extract).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button
            variant="primary"
            onClick={() => setIsOpen(true)}
          >
            ⚠️ Open Conflict Resolver (Simulate 409)
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setCurrentQty(150);
              setLastAction(null);
              setIsOpen(true);
            }}
          >
            Reset Simulation
          </Button>
        </div>

        {lastAction && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '6px',
              background: '#F0FDF4',
              border: '1px solid #22C55E',
              color: '#15803D',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            ✅ Resolution Applied: {lastAction}
          </div>
        )}

        <div
          style={{
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            background: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B' }}>
            Active Allocation Ledger Status
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'monospace' }}>
            {currentQty} KG <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748B' }}>Allocated</span>
          </div>
          <div style={{ fontSize: '12px', color: '#475569' }}>
            Material: <strong>RAW-EXT-ASH-05</strong> · Destination: <strong>Asclepius Plant F-119</strong>
          </div>
        </div>

        <div
          style={{
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            background: '#F8FAFC',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B' }}>
            Concurrency Audit Trail
          </span>
          {auditLog.map((entry, idx) => (
            <div key={idx} style={{ fontFamily: 'monospace', fontSize: '12px', color: '#334155' }}>
              {entry}
            </div>
          ))}
        </div>

        <ConcurrentConflictResolver
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          recordCode="RAW-EXT-ASH-05"
          recordName="Ashwagandha Root Extract 2.5% Withanolides"
          proposedQuantity={150}
          remoteQuantity={100}
          deltaQuantity={50}
          uom="KG"
          onAcceptRemote={handleAcceptRemote}
          onAllocateDelta={handleAllocateDelta}
          onForceOverride={handleForceOverride}
          isAdmin={true}
        />
      </div>
    );
  },
};
