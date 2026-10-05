import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Core/Link',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const DefaultInline: Story = {
  render: () => (
    <div style={{ padding: '24px', fontSize: '14px', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
      Operator telemetry stream is bound to <a href="#ws4" style={{ color: '#2563EB', textDecoration: 'underline' }}>Workstation 4 Registry</a> for active shift logging.
    </div>
  ),
};

export const PrimaryVariant: Story = {
  render: () => (
    <div style={{ padding: '24px', fontSize: '14px' }}>
      <a href="#export" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Export Machine Diagnostics (.CSV) →</a>
    </div>
  ),
};

export const SubtleSecondary: Story = {
  render: () => (
    <div style={{ padding: '24px', fontSize: '14px' }}>
      <a href="#dismiss" style={{ color: '#64748B', textDecoration: 'underline' }}>Dismiss advisory notice</a>
    </div>
  ),
};

export const DestructiveAction: Story = {
  render: () => (
    <div style={{ padding: '24px', fontSize: '14px' }}>
      <a href="#purge" style={{ color: '#b91c1c', fontWeight: 600, textDecoration: 'none' }}>Purge Calibration Cache ✕</a>
    </div>
  ),
};

export const WithExternalIcon: Story = {
  render: () => (
    <div style={{ padding: '24px', fontSize: '14px' }}>
      <a href="https://iso.org" target="_blank" rel="noreferrer" style={{ color: '#2563EB', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <span>ISO-9001 Metrology Standards Documentation</span> <span>↗</span>
      </a>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ padding: '24px', fontSize: '14px' }}>
      <span style={{ color: '#64748B', cursor: 'not-allowed', textDecoration: 'none' }}>Archive Telemetry (Locked by Supervisor)</span>
    </div>
  ),
};
