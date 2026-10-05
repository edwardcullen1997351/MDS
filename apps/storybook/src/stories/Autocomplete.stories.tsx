import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Forms/Autocomplete',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

const partsCatalog = [
  { sku: 'PN-4401-A', name: 'Flange Bearing 25mm ISO-68', stock: 142 },
  { sku: 'PN-4401-B', name: 'Flange Bearing 30mm Heavy Duty', stock: 89 },
  { sku: 'PN-8820-C', name: 'Carbide End Mill 12mm 4-Flute', stock: 12 },
  { sku: 'PN-9104-E', name: 'High-Temp Silicone O-Ring Pack', stock: 520 },
  { sku: 'PN-1029-X', name: 'Servo Motor Encoder Cable 5m', stock: 35 },
];

export const Default: Story = {
  render: () => {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const filtered = partsCatalog.filter(p => p.sku.toLowerCase().includes(query.toLowerCase()) || p.name.toLowerCase().includes(query.toLowerCase()));

    return (
      <div style={{ padding: '24px', maxWidth: '400px', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
        <label htmlFor="story-autocomplete-27" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Part SKU Lookup</label>
        <div style={{ position: 'relative' }}>
          <input id="story-autocomplete-27"
            type="text"
            placeholder="Type 'PN' or part name..."
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
          />
          {open && query && (
            <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '6px', margin: '4px 0 0 0', padding: 0, listStyle: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', maxHeight: '180px', overflowY: 'auto', zIndex: 10 }}>
              {filtered.map(item => (
                <li key={item.sku} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <button type="button" onClick={() => { setQuery(item.sku + ' - ' + item.name); setOpen(false); }} style={{ display: 'block', width: '100%', padding: '8px 12px', border: 0, background: 'transparent', textAlign: 'left', cursor: 'pointer', fontSize: '13px' }}>
                    <span style={{ display: 'block', fontWeight: 600 }}>{item.sku}</span>
                    <span style={{ display: 'block', color: '#64748B', fontSize: '12px' }}>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  },
};

export const WithPreselectedQuery: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '400px' }}>
      <label htmlFor="story-autocomplete-56" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Assigned Workstation</label>
      <input id="story-autocomplete-56" type="text" defaultValue="WS-04 (Robotic Welder Line 2)" style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }} />
    </div>
  ),
};

export const AsyncLoadingState: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '400px' }}>
      <label htmlFor="story-autocomplete-65" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Querying MES Remote Catalog...</label>
      <div style={{ position: 'relative' }}>
        <input id="story-autocomplete-65" type="text" defaultValue="Bearing" style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #3B82F6', fontSize: '14px', boxSizing: 'border-box' }} />
        <div style={{ position: 'absolute', right: '12px', top: '12px', fontSize: '12px', color: '#3B82F6' }}>⏳ Loading...</div>
      </div>
    </div>
  ),
};

export const EmptyNoResults: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '400px' }}>
      <label htmlFor="story-autocomplete-77" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Search Results</label>
      <input id="story-autocomplete-77" type="text" defaultValue="XYZ-Unknown-Part" style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }} />
      <div style={{ marginTop: '4px', padding: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '12px', color: '#64748B', textAlign: 'center' }}>
        No matching components found in active tooling inventory.
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '400px' }}>
      <label htmlFor="story-autocomplete-89" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: '#64748B' }}>Locked Assembly Part</label>
      <input id="story-autocomplete-89" type="text" disabled defaultValue="PN-4401-A (Locked by Shift Lead)" style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: '#F1F5F9', color: '#64748B', fontSize: '14px', cursor: 'not-allowed', boxSizing: 'border-box' }} />
    </div>
  ),
};
