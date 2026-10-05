import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from '@ds/react';

const meta: Meta<typeof Grid> = {
  title: 'Primitives/Grid',
  component: Grid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Grid provides 2-dimensional multi-column layouts with deterministic column templates and token gap spacings.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Grid>;

export const DefaultResponsiveColumns: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Grid columns={3} gap={4}>
        <div style={{ padding: '20px', background: '#F1F5F9', borderRadius: '8px', textAlign: 'center' }}>Column 1</div>
        <div style={{ padding: '20px', background: '#F1F5F9', borderRadius: '8px', textAlign: 'center' }}>Column 2</div>
        <div style={{ padding: '20px', background: '#F1F5F9', borderRadius: '8px', textAlign: 'center' }}>Column 3</div>
      </Grid>
    </div>
  ),
};

export const ColumnScaleMatrix: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {([1, 2, 4, 6] as const).map(c => (
        <div key={c}>
          <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '6px' }}>columns={c}</div>
          <Grid columns={c} gap={2}>
            {Array.from({ length: c }, (_, i) => (
              <div key={i} style={{ padding: '10px', backgroundColor: '#EFF6FF', color: '#1E40AF', borderRadius: '4px', textAlign: 'center', fontSize: '12px', fontWeight: 600 }}>
                Col {i + 1}
              </div>
            ))}
          </Grid>
        </div>
      ))}
    </div>
  ),
};

export const GapTokenScale: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {[2, 4, 6].map(g => (
        <div key={g}>
          <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>gap={g} ({g * 4}px)</div>
          <Grid columns={3} gap={g as any}>
            <div style={{ padding: '12px', background: '#F8FAFC', border: '1px solid #64748B' }}>1</div>
            <div style={{ padding: '12px', background: '#F8FAFC', border: '1px solid #64748B' }}>2</div>
            <div style={{ padding: '12px', background: '#F8FAFC', border: '1px solid #64748B' }}>3</div>
          </Grid>
        </div>
      ))}
    </div>
  ),
};

export const AutoFitMetricsGrid: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Grid columns={4} gap={4}>
        {[
          { title: 'OEE Total', val: '94.2%' },
          { title: 'Availability', val: '98.5%' },
          { title: 'Performance', val: '96.1%' },
          { title: 'Quality Rate', val: '99.4%' },
        ].map(m => (
          <div key={m.title} style={{ padding: '16px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '12px', color: '#64748B' }}>{m.title}</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>{m.val}</div>
          </div>
        ))}
      </Grid>
    </div>
  ),
};

export const DenseTelemetryMatrix: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Grid columns={6} gap={2}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{ padding: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', textAlign: 'center', fontSize: '11px', fontWeight: 600 }}>
            CH-0{i + 1}
          </div>
        ))}
      </Grid>
    </div>
  ),
};

export const SCADAPlantDashboardLayout: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Grid columns={12} gap={4}>
        <div style={{ gridColumn: 'span 8', padding: '24px', background: '#0F172A', color: '#FFF', borderRadius: '8px' }}>
          <h2>Main 3D CAD Toolpath Simulation</h2>
          <p style={{ color: '#CBD5E1', fontSize: '13px' }}>Real-time 5-axis collision detection engine active.</p>
        </div>
        <div style={{ gridColumn: 'span 4', padding: '24px', background: '#F8FAFC', border: '1px solid #64748B', borderRadius: '8px' }}>
          <h2>Spindle Telemetry</h2>
          <p style={{ fontSize: '13px', color: '#64748B' }}>12,000 RPM · 74°C</p>
        </div>
      </Grid>
    </div>
  ),
};
