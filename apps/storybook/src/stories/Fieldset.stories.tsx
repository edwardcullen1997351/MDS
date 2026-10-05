import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Core/Fieldset',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '480px', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
      <fieldset style={{ border: '1px solid #CBD5E1', borderRadius: '8px', padding: '16px' }}>
        <legend style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', padding: '0 8px' }}>
          Spindle Speed Tolerances
        </legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
          <div>
            <label htmlFor="story-fieldset-20" style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '4px' }}>Nominal Operating RPM</label>
            <input id="story-fieldset-20" type="number" defaultValue="12000" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '4px' }} />
          </div>
          <div>
            <label htmlFor="story-fieldset-24" style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '4px' }}>Peak Allowable Surge (RPM)</label>
            <input id="story-fieldset-24" type="number" defaultValue="14500" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '4px' }} />
          </div>
        </div>
      </fieldset>
    </div>
  ),
};

export const WithHelpText: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '480px', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
      <fieldset style={{ border: '1px solid #CBD5E1', borderRadius: '8px', padding: '16px' }}>
        <legend style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', padding: '0 8px' }}>
          Network Gateway Protocol
        </legend>
        <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 12px 0' }}>
          Specify OPC-UA industrial bus broker endpoints and polling frequencies.
        </p>
        <input type="text" aria-label="OPC-UA broker endpoint" defaultValue="opc.tcp://192.168.1.104:4840" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '4px' }} />
      </fieldset>
    </div>
  ),
};

export const HorizontalFields: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '520px', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
      <fieldset style={{ border: '1px solid #CBD5E1', borderRadius: '8px', padding: '16px' }}>
        <legend style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', padding: '0 8px' }}>X-Y Calibration Offsets</legend>
        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="story-fieldset-56" style={{ fontSize: '12px', color: '#475569' }}>X Offset (mm)</label>
            <input id="story-fieldset-56" type="number" defaultValue="0.002" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '4px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="story-fieldset-60" style={{ fontSize: '12px', color: '#475569' }}>Y Offset (mm)</label>
            <input id="story-fieldset-60" type="number" defaultValue="-0.001" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '4px' }} />
          </div>
        </div>
      </fieldset>
    </div>
  ),
};

export const RequiredGroup: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '480px', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
      <fieldset style={{ border: '1px solid #CBD5E1', borderRadius: '8px', padding: '16px' }}>
        <legend style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', padding: '0 8px' }}>
          Mandatory Safety Interlocks <span style={{ color: '#b91c1c' }}>*</span>
        </legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <input type="checkbox" defaultChecked /> <span>Enclosure light curtain armed</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <input type="checkbox" defaultChecked /> <span>High-voltage isolator switch engaged</span>
          </label>
        </div>
      </fieldset>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '480px', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
      <fieldset disabled style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', backgroundColor: '#F8FAFC' }}>
        <legend style={{ fontSize: '14px', fontWeight: 600, color: '#64748B', padding: '0 8px' }}>Factory Calibration (Locked by Metrologist)</legend>
        <div style={{ marginTop: '8px' }}>
          <input type="text" aria-label="Factory calibration certificate" defaultValue="CAL-CERT-2026-X99" disabled style={{ width: '100%', padding: '8px', border: '1px solid #E2E8F0', borderRadius: '4px', backgroundColor: '#F1F5F9', color: '#64748B' }} />
        </div>
      </fieldset>
    </div>
  ),
};
