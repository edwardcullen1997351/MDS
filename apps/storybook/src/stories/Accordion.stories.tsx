import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Core/Accordion',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Accordion displays vertically stacked expandable panels for organizing complex inspection data, telemetry logs, and machine parameters.',
      },
    },
  },
};
export default meta;
type Story = StoryObj;

const items = [
  { id: '1', title: 'Work Cell 1: Hydraulic Press Parameters', content: 'Continuous tonnage rating: 250T. Ram velocity: 45 mm/s. Return velocity: 90 mm/s. Hydraulic fluid temperature: 48°C (Nominal).' },
  { id: '2', title: 'Work Cell 2: CNC 5-Axis Milling Spindle', content: 'Spindle speed: 12,000 RPM. Tool holder: HSK-A63. Coolant pressure: 70 Bar through-spindle. Axis vibration: 0.12 mm/s.' },
  { id: '3', title: 'Work Cell 3: Robotic Laser Welder Safety', content: 'Fiber laser power: 4.0 kW. Shield gas: 100% Argon @ 18 L/min. Enclosure optical interlocks active and nominal.' },
];

export const SingleExpandDefault: Story = {
  render: () => {
    const [openId, setOpenId] = useState<string | null>('1');
    return (
      <div style={{ padding: '24px', maxWidth: '600px', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
        <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
          {items.map(item => (
            <div key={item.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
              <button
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: openId === item.id ? '#F8FAFC' : '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#0F172A',
                  textAlign: 'left',
                }}
              >
                <span>{item.title}</span>
                <span style={{ transform: openId === item.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>▼</span>
              </button>
              {openId === item.id && (
                <div style={{ padding: '16px', backgroundColor: '#FFFFFF', fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
};

export const MultipleExpandable: Story = {
  render: () => {
    const [openIds, setOpenIds] = useState<string[]>(['1', '2']);
    const toggle = (id: string) => setOpenIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    return (
      <div style={{ padding: '24px', maxWidth: '600px', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
        <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
          {items.map(item => (
            <div key={item.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
              <button
                onClick={() => toggle(item.id)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  background: openIds.includes(item.id) ? '#F8FAFC' : '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                <span>{item.title}</span>
                <span style={{ transform: openIds.includes(item.id) ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>▼</span>
              </button>
              {openIds.includes(item.id) && (
                <div style={{ padding: '16px', backgroundColor: '#FFFFFF', fontSize: '13px', color: '#475569' }}>
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
};

export const CompactDensity: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '500px', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
      <div style={{ border: '1px solid #CBD5E1', borderRadius: '6px', overflow: 'hidden' }}>
        <div style={{ padding: '8px 12px', background: '#F1F5F9', fontWeight: 600, fontSize: '12px', color: '#334155' }}>
          Compact Diagnostics View
        </div>
        <div style={{ padding: '10px 12px', borderBottom: '1px solid #E2E8F0', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
          <span>Sensor Bus #1</span> <span style={{ color: '#15803D', fontWeight: 600 }}>Active (48/48)</span>
        </div>
        <div style={{ padding: '10px 12px', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
          <span>Sensor Bus #2</span> <span style={{ color: '#15803D', fontWeight: 600 }}>Active (32/32)</span>
        </div>
      </div>
    </div>
  ),
};

export const WithStatusBadges: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '600px', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
      <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0' }}>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>Tandem Press Line 1</span>
          <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>RUNNING</span>
        </div>
        <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>Stamping Cell 4</span>
          <span style={{ backgroundColor: '#FEF3C7', color: '#B45309', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>MAINTENANCE</span>
        </div>
      </div>
    </div>
  ),
};

export const DisabledItem: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '600px', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
      <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden', opacity: 0.6 }}>
        <div style={{ padding: '14px 16px', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>Sub-Station 9 (Decommissioned)</span>
          <span>🔒 Locked</span>
        </div>
      </div>
    </div>
  ),
};
