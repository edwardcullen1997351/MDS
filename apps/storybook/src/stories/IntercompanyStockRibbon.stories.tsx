import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { IntercompanyStockRibbon } from '@ds/react';

const meta: Meta<typeof IntercompanyStockRibbon> = {
  title: 'Composites/Intercompany Stock Ribbon',
  component: IntercompanyStockRibbon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Consolidated 4-metric intercompany balance strip designed for enterprise supply chain visibility. Displays Plant Stock (On-Hand), Warehouse Stock (Staged), In-Transit STO (En Route), and Net Intercompany Balance with status indicators, tabular numerals, and quick STO transfer action buttons.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof IntercompanyStockRibbon>;

export const Default: Story = {
  render: () => {
    const [actionLog, setActionLog] = useState<string>('Ready. Click STO actions to simulate transfer workflow.');

    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 700 }}>
            Standard Balance Strip (Asclepius Plant F-119 ↔ RM Warehouse H-9)
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
            Multi-facility inventory consolidation across staging and road transit pipeline.
          </p>
        </div>

        <IntercompanyStockRibbon
          onRequestTransfer={() => setActionLog('🚛 Stock Transfer Order (STO-2026-9901) submitted for 500 KG dispatch.')}
          onViewDetails={() => setActionLog('📋 Opened STO Manifest: Viewing active trucks on NH-48 corridor.')}
        />

        <div
          style={{
            padding: '10px 14px',
            borderRadius: '6px',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#1E293B',
          }}
        >
          {actionLog}
        </div>
      </div>
    );
  },
};

export const CriticalDeficitRisk: Story = {
  render: () => {
    const [actionLog, setActionLog] = useState<string>('ALERT: Plant stock below 24h safety limit.');

    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 700, color: '#B91C1C' }}>
            Critical Stockout Risk Scenario
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
            Plant stock at 120 KG (critical deficit), but 1,800 KG staged in central RM Warehouse ready for immediate expedited dispatch.
          </p>
        </div>

        <IntercompanyStockRibbon
          plantStock={{
            label: 'Plant Stock On-Hand',
            facility: 'Food Plant F-119',
            quantity: 120,
            uom: 'KG',
            status: 'danger',
            statusLabel: 'CRITICAL (<1d)',
            subtext: 'Stockout in 18 Hours',
          }}
          warehouseStock={{
            label: 'Central RM Staged',
            facility: 'RM Warehouse H-9',
            quantity: 1800,
            uom: 'KG',
            status: 'safe',
            statusLabel: 'Available',
            subtext: 'Inspection Complete',
          }}
          inTransitStock={{
            label: 'Expedited In-Transit',
            facility: 'En Route (H-9 ➔ F-119)',
            quantity: 400,
            uom: 'KG',
            status: 'warning',
            statusLabel: 'ETA 2h (Priority)',
            subtext: 'Express Truck #MH-14-EX-101',
          }}
          netBalance={{
            label: 'Net Supply Balance',
            facility: 'Total Network',
            quantity: 2320,
            uom: 'KG',
            status: 'safe',
            statusLabel: 'Covered',
            subtext: 'Network Buffer Healthy',
          }}
          onRequestTransfer={() => setActionLog('🚨 PRIORITY OVERRIDE: Emergency STO dispatched with 2h ETA.')}
          onViewDetails={() => setActionLog('📋 Tracking Express Truck #MH-14-EX-101 live GPS location.')}
        />

        <div
          style={{
            padding: '10px 14px',
            borderRadius: '6px',
            background: '#FEF2F2',
            border: '1px solid #EF4444',
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#B91C1C',
          }}
        >
          {actionLog}
        </div>
      </div>
    );
  },
};
