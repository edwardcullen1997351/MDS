import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Container } from '@ds/react';

const meta: Meta<typeof Container> = {
  title: 'Primitives/Container',
  component: Container,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Container centers and constrains content horizontally within standardized layout breakpoint max-widths.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Container>;

export const DefaultFixed: Story = {
  render: () => (
    <div style={{ padding: '24px', backgroundColor: '#F8FAFC' }}>
      <Container size="lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', padding: '24px', borderRadius: '8px' }}>
        <div style={{ fontWeight: 600, fontSize: '16px' }}>Container (size="lg" / max-width 1024px)</div>
        <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>Standard desktop layout boundary with automatic margin centering.</div>
      </Container>
    </div>
  ),
};

export const MaxWidthPresets: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#F8FAFC' }}>
      {(['sm', 'md', 'lg', 'xl', 'full'] as const).map(s => (
        <Container key={s} size={s} style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', padding: '16px', borderRadius: '6px' }}>
          <strong style={{ textTransform: 'uppercase', fontSize: '12px' }}>Size: {s}</strong>
        </Container>
      ))}
    </div>
  ),
};

export const CenteredWithGutters: Story = {
  render: () => (
    <div style={{ padding: '24px', backgroundColor: '#EFF6FF' }}>
      <Container size="md" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
        <div style={{ fontWeight: 600 }}>Centered Layout Viewport (size="md")</div>
        <div style={{ fontSize: '13px', color: '#64748B' }}>Contains standard forms, modal dialogs, and report summaries.</div>
      </Container>
    </div>
  ),
};

export const Fluid100Width: Story = {
  render: () => (
    <div style={{ padding: '24px', backgroundColor: '#F8FAFC' }}>
      <Container size="full" style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', padding: '16px', borderRadius: '6px' }}>
        <strong>Fluid Full-Width Container (100% width)</strong>
      </Container>
    </div>
  ),
};

export const ResponsiveNestedContent: Story = {
  render: () => (
    <div style={{ padding: '24px', backgroundColor: '#F1F5F9' }}>
      <Container size="xl" style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0 }}>Plant Operations Dashboard</h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>Austin Facility · Q3 Continuous Monitoring</p>
          </div>
          <button style={{ padding: '8px 16px', backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: 600 }}>Export</button>
        </div>
      </Container>
    </div>
  ),
};
