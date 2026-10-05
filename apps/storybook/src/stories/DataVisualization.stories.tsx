import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Data Visualization/Overview',
  parameters: {
    docs: {
      description: {
        component: 'Data visualization infrastructure, categorical/sequential palettes, and chart taxonomy.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const VisualizationInfrastructure: Story = {
  render: () => (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'var(--font-sans, system-ui, sans-serif)', color: '#0F172A' }}>
      <div style={{ marginBottom: '24px' }}>
        <span style={{ display: 'inline-block', padding: '4px 10px', background: '#EFF6FF', color: '#1D4ED8', borderRadius: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
          Data Visualization
        </span>
        <h1 style={{ marginTop: '12px', fontSize: '30px', fontWeight: 700, margin: '12px 0 8px' }}>Data Visualization Infrastructure</h1>
        <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
          High-performance, accessible, and colorblind-safe visualization standards for complex operational and analytic data.
        </p>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '24px 0' }} />

      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Chart Taxonomy</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { name: 'Comparison & Trends', types: 'Bar Chart, Line Chart, Area Chart', use: 'Tracking changes across continuous timelines or discrete categories.' },
          { name: 'Part-to-Whole & Hierarchy', types: 'Donut Chart, Treemap, Sunburst', use: 'Displaying compositional share, sub-category allocations, and nested trees.' },
          { name: 'Correlation & Distribution', types: 'Scatter Plot, Histogram, Box Plot', use: 'Identifying statistical outliers, cluster densities, and multivariable correlations.' },
          { name: 'Spatial & Matrix Flows', types: 'Heatmap, Geo Map, Sankey Diagram', use: 'Multi-axis density grids, regional allocations, and multi-stage volume transfers.' },
        ].map((cat, idx) => (
          <div key={idx} style={{ background: '#FFFFFF', padding: '20px', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1E40AF', margin: '0 0 4px' }}>{cat.name}</h2>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>
              {cat.types}
            </span>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.4, margin: 0 }}>{cat.use}</p>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Visualization Color Palettes</h2>

      {/* Categorical Palette */}
      <div style={{ marginBottom: '24px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
          CATEGORICAL PALETTE (10-COLOR ACCESSIBLE QUALITATIVE SCALE)
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '6px' }}>
          {[
            { hex: '#2563EB', name: 'Blue 600' },
            { hex: '#15803D', name: 'Green 600' },
            { hex: '#b45309', name: 'Amber 600' },
            { hex: '#9333EA', name: 'Purple 600' },
            { hex: '#0D9488', name: 'Teal 600' },
            { hex: '#E11D48', name: 'Rose 600' },
            { hex: '#4F46E5', name: 'Indigo 600' },
            { hex: '#EA580C', name: 'Orange 600' },
            { hex: '#0284C7', name: 'Sky 600' },
            { hex: '#4B5563', name: 'Gray 600' },
          ].map((col, idx) => (
            <div key={idx} style={{ borderRadius: '6px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
              <div style={{ height: '44px', backgroundColor: col.hex }} />
              <div style={{ padding: '4px', textAlign: 'center', background: '#FFF', fontSize: '11px', color: '#64748B' }}>
                {idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sequential Palette */}
      <div>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
          SEQUENTIAL PALETTE (INTENSITY & DENSITY SCALE)
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '6px' }}>
          {[
            { hex: '#EFF6FF', label: '10%' },
            { hex: '#BFDBFE', label: '25%' },
            { hex: '#60A5FA', label: '50%' },
            { hex: '#2563EB', label: '75%' },
            { hex: '#1D4ED8', label: '90%' },
            { hex: '#1E3A8A', label: '100%' },
          ].map((col, idx) => (
            <div key={idx} style={{ borderRadius: '6px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
              <div style={{ height: '44px', backgroundColor: col.hex }} />
              <div style={{ padding: '4px', textAlign: 'center', background: '#FFF', fontSize: '11px', color: '#64748B' }}>
                {col.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
