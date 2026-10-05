import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Forms/Combobox',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

const workCells = [
  'WC-101 (Stamping Press Alpha)',
  'WC-102 (Stamping Press Beta)',
  'WC-201 (Robotic Welding Arm A)',
  'WC-202 (Robotic Welding Arm B)',
  'WC-301 (5-Axis CNC Mill 1)',
  'WC-302 (5-Axis CNC Mill 2)',
  'WC-401 (Automated Paint Line)',
];

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState(workCells[0]);
    return (
      <div style={{ padding: '24px', maxWidth: '380px' }}>
        <label htmlFor="story-combobox-26" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Select Work Cell</label>
        <select id="story-combobox-26" value={selected} onChange={e => setSelected(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px', backgroundColor: '#FFF' }}>
          {workCells.map(wc => <option key={wc} value={wc}>{wc}</option>)}
        </select>
      </div>
    );
  },
};

export const GroupedSections: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '380px' }}>
      <label htmlFor="story-combobox-38" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Plant Area & Station</label>
      <select id="story-combobox-38" style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px', backgroundColor: '#FFF' }}>
        <optgroup label="Fabrication Hall 1">
          <option>Station 1A - Heavy Blanking</option>
          <option>Station 1B - Progressive Stamping</option>
        </optgroup>
        <optgroup label="Machining Bay 2">
          <option>Station 2A - 5-Axis Milling</option>
          <option>Station 2B - High-Precision Lathe</option>
        </optgroup>
      </select>
    </div>
  ),
};

export const WithStatusIndicators: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '380px' }}>
      <label htmlFor="story-combobox-56" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Target Line (Operational Status)</label>
      <select id="story-combobox-56" style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px' }}>
        <option>🟢 Line 1 - Active (99.4% OEE)</option>
        <option>🟡 Line 2 - Warning (Bearing Temp Drift)</option>
        <option>🔴 Line 3 - Offline (E-Stop Engaged)</option>
      </select>
    </div>
  ),
};

export const SmallSize: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '240px' }}>
      <label htmlFor="story-combobox-69" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Filter Scale</label>
      <select id="story-combobox-69" style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '12px' }}>
        <option>Linear Scale</option>
        <option>Logarithmic (dB)</option>
      </select>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '380px', opacity: 0.6 }}>
      <label htmlFor="story-combobox-81" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: '#64748B' }}>Locked Recipe</label>
      <select id="story-combobox-81" disabled style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: '#F1F5F9', color: '#64748B', cursor: 'not-allowed' }}>
        <option>Recipe #991 (Automotive Spec)</option>
      </select>
    </div>
  ),
};
