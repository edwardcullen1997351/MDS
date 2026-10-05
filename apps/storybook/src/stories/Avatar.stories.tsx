import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Core/Avatar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Avatar visualizes operator identities, technician badges, and shift personnel profiles.',
      },
    },
  },
};
export default meta;
type Story = StoryObj;

const operatorAvatar = "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2250%22%20fill%3D%22%234F46E5%22%2F%3E%0A%20%20%3Ccircle%20cx%3D%2250%22%20cy%3D%2240%22%20r%3D%2220%22%20fill%3D%22%23FBBF24%22%2F%3E%0A%20%20%3Cpath%20d%3D%22M%2020%2085%20C%2020%2065%2035%2055%2050%2055%20C%2065%2055%2080%2065%2080%2085%20Z%22%20fill%3D%22%23E0E7FF%22%2F%3E%0A%20%20%3Crect%20x%3D%2235%22%20y%3D%2218%22%20width%3D%2230%22%20height%3D%2212%22%20rx%3D%226%22%20fill%3D%22%23F59E0B%22%2F%3E%0A%3C%2Fsvg%3E";

export const Default: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#2563EB', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '14px' }}>
        MV
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: '14px', color: '#0F172A' }}>Marcus Vance</div>
        <div style={{ fontSize: '12px', color: '#64748B' }}>Lead Toolmaker · Shift A</div>
      </div>
    </div>
  ),
};

export const WithImage: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
      <img
        src={operatorAvatar}
        alt="Elena Rostova"
        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #E2E8F0' }}
      />
      <div>
        <div style={{ fontWeight: 600, fontSize: '14px' }}>Elena Rostova</div>
        <div style={{ fontSize: '12px', color: '#64748B' }}>Metrology Quality Specialist</div>
      </div>
    </div>
  ),
};

export const SizingScale: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
      <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#0369A1', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 600 }}>SM</div>
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#0369A1', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600 }}>MD</div>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#0369A1', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 600 }}>LG</div>
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#0369A1', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 600 }}>XL</div>
    </div>
  ),
};

export const StatusIndicators: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '24px', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: '40px', height: '40px' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#475569', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>KS</div>
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#15803D', border: '2px solid #FFF' }} title="Online" />
      </div>
      <div style={{ position: 'relative', width: '40px', height: '40px' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#475569', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>SJ</div>
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#b45309', border: '2px solid #FFF' }} title="On Break" />
      </div>
      <div style={{ position: 'relative', width: '40px', height: '40px' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#475569', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>CM</div>
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#b91c1c', border: '2px solid #FFF' }} title="In Critical Response" />
      </div>
    </div>
  ),
};

export const SquareRoundedShape: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '16px' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#4F46E5', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
        W1
      </div>
      <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#047857', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
        W2
      </div>
    </div>
  ),
};
