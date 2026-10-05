import { LeadTimeTransferGlyph,LeadTimeTransferGlyphProps } from '@ds/react';
import type { Meta,StoryObj } from '@storybook/react';

const meta: Meta<typeof LeadTimeTransferGlyph> = {
  title: 'Data Visualization/Lead Time Transfer Glyph',
  component: LeadTimeTransferGlyph,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Road-transfer indicator glyph (e.g. H-9 ➔ F-119 [4h]) designed for dense ERP schedules and multi-facility inventory tracking. Features transport truck icon, origin/destination route, lead time duration, status badges (IN_TRANSIT, DELAYED, SCHEDULED, COMPLETED), and an interactive hover tooltip with STO manifest details.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LeadTimeTransferGlyph>;

export const Default: Story = {
  args: {
    origin: 'H-9',
    destination: 'F-119',
    transitHours: 4,
    status: 'IN_TRANSIT',
    transferId: 'STO-2026-8812',
    materialName: 'Ashwagandha Root Extract 2.5%',
    quantity: '500 KG',
    carrier: 'Deccan Road Freight #MH-14-GH-9012',
    eta: '+4h (14:30 IST)',
  },
};

export const AllStatuses: Story = {
  render: () => {
    const statuses: Array<{
      status: LeadTimeTransferGlyphProps['status'];
      origin: string;
      destination: string;
      hours: number;
      eta: string;
      carrier: string;
      label: string;
    }> = [
      {
        status: 'IN_TRANSIT',
        origin: 'H-9',
        destination: 'F-119',
        hours: 4,
        eta: '+4h (14:30 IST)',
        carrier: 'Deccan Road Freight #MH-14-GH-9012',
        label: 'Active Road Transit (Standard 4h lead time)',
      },
      {
        status: 'DELAYED',
        origin: 'Nashik-WH',
        destination: 'F-119',
        hours: 8,
        eta: '+12h (22:00 IST) — Monsoon Traffic Delay',
        carrier: 'Sahyadri Logistics #MH-15-BT-4410',
        label: 'Delayed Shipment (Weather / Highway Alert)',
      },
      {
        status: 'SCHEDULED',
        origin: 'Pune-Hub',
        destination: 'F-119',
        hours: 2,
        eta: 'Tomorrow 08:00 IST',
        carrier: 'Express Route Line #MH-12-PQ-8871',
        label: 'Scheduled Dispatch (Tomorrow Morning Shift)',
      },
      {
        status: 'COMPLETED',
        origin: 'H-9',
        destination: 'F-119',
        hours: 4,
        eta: 'Received Today 09:15 IST (Dock Gate 3)',
        carrier: 'Deccan Road Freight #MH-14-GH-9012',
        label: 'Completed Gate Receipt (Unloaded & Inspected)',
      },
    ];

    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 700 }}>
            LeadTimeTransferGlyph Status Variants
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
            Hover over any road-transfer glyph to inspect the popover manifest with carrier, ETA, and transfer order details.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {statuses.map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
              }}
            >
              <span style={{ fontSize: '12px', color: '#475569', fontWeight: 500 }}>{item.label}</span>
              <LeadTimeTransferGlyph
                origin={item.origin}
                destination={item.destination}
                transitHours={item.hours}
                status={item.status}
                carrier={item.carrier}
                eta={item.eta}
              />
            </div>
          ))}
        </div>
      </div>
    );
  },
};
