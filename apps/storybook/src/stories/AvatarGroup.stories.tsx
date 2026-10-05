import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Core/AvatarGroup',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', alignItems: 'center' }}>
      {['MV', 'ER', 'KS', 'SJ'].map((initials, i) => (
        <div
          key={initials}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: ['#2563EB', '#7C3AED', '#047857', '#b45309'][i],
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 600,
            border: '2px solid #FFFFFF',
            marginLeft: i > 0 ? '-10px' : 0,
            zIndex: 10 - i,
          }}
        >
          {initials}
        </div>
      ))}
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: '#E2E8F0',
        color: '#475569',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 600,
        border: '2px solid #FFFFFF',
        marginLeft: '-10px',
        zIndex: 5,
      }}>
        +6
      </div>
    </div>
  ),
};

export const SmallRoster: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', alignItems: 'center' }}>
      {['A1', 'A2', 'A3'].map((item, i) => (
        <div
          key={item}
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: '#334155',
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 600,
            border: '2px solid #FFF',
            marginLeft: i > 0 ? '-6px' : 0,
          }}
        >
          {item}
        </div>
      ))}
      <div style={{
        width: '26px',
        height: '26px',
        borderRadius: '50%',
        backgroundColor: '#F1F5F9',
        color: '#64748B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 600,
        border: '2px solid #FFF',
        marginLeft: '-6px',
      }}>
        +2
      </div>
    </div>
  ),
};

export const LargeRoster: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', alignItems: 'center' }}>
      {['ENG', 'QA', 'OPS', 'SUP'].map((role, i) => (
        <div
          key={role}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: ['#1E3A8A', '#065F46', '#9A3412', '#4C1D95'][i],
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 700,
            border: '3px solid #FFF',
            marginLeft: i > 0 ? '-14px' : 0,
          }}
        >
          {role}
        </div>
      ))}
    </div>
  ),
};

export const GridRoster: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap', maxWidth: '280px' }}>
      {['Op 1', 'Op 2', 'Op 3', 'Op 4', 'Op 5', 'Op 6'].map(op => (
        <div key={op} style={{ padding: '4px 10px', backgroundColor: '#F1F5F9', borderRadius: '16px', fontSize: '12px', fontWeight: 500, color: '#334155' }}>
          👤 {op}
        </div>
      ))}
    </div>
  ),
};

export const InteractiveTooltipDemo: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '8px' }}>
      <div title="Marcus Vance (Supervisor)" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#2563EB', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 600 }}>MV</div>
      <div title="Elena Rostova (Metrology)" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#7C3AED', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 600 }}>ER</div>
    </div>
  ),
};
