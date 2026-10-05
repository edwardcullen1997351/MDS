import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Overview',
  parameters: {
    docs: {
      description: {
        component: 'Core visual foundations and design principles of the Meridian Design System.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const DesignPrinciples: Story = {
  render: () => (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'var(--font-sans, system-ui, sans-serif)', color: '#0F172A' }}>
      <div style={{ marginBottom: '24px' }}>
        <span style={{ display: 'inline-block', padding: '4px 10px', background: '#EFF6FF', color: '#1D4ED8', borderRadius: '4px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Foundations
        </span>
        <h1 style={{ marginTop: '12px', fontSize: '32px', fontWeight: 700, margin: '12px 0 8px' }}>Meridian Design System Foundations</h1>
        <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
          The visual and structural foundation that powers enterprise applications with consistent aesthetics, accessibility, and high information density.
        </p>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '24px 0' }} />

      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Guiding Principles</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '8px', border: '1px solid #E2E8F0', borderLeft: '4px solid #2563EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1E40AF', margin: '0 0 8px' }}>1. Systematic & Token-Driven</h2>
          <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
            Every color, dimension, font-size, elevation, and motion timing originates from a single source of truth token architecture.
          </p>
        </div>
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '8px', border: '1px solid #E2E8F0', borderLeft: '4px solid #15803D', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#15803D', margin: '0 0 8px' }}>2. Accessible by Default</h2>
          <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
            WCAG 2.1 AA compliant color contrasts, robust ARIA semantics, full keyboard navigability, and explicit focus rings.
          </p>
        </div>
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '8px', border: '1px solid #E2E8F0', borderLeft: '4px solid #8B5CF6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#6D28D9', margin: '0 0 8px' }}>3. Enterprise Density & Efficiency</h2>
          <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
            Engineered for data-intensive workflows, master-detail relationships, high-density grids, and clear visual hierarchy.
          </p>
        </div>
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Foundation Domains</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        {[
          { title: 'Color & Theming', desc: 'Neutral, brand, semantic status palettes with light/dark surface roles' },
          { title: 'Typography', desc: 'Type scale, font weight hierarchy, responsive prose and monospace styles' },
          { title: 'Spacing & Grid', desc: '4px baseline grid, spacing increments from 4px to 64px, container rules' },
          { title: 'Elevation & Depth', desc: 'Flat, raised, overlay, and sticky layers with disciplined drop shadows' },
          { title: 'Borders & Radii', desc: 'Hairline borders, subtle surface dividers, and standardized corner radii' },
          { title: 'Motion & Feedback', desc: 'Purposeful micro-interactions, spring curves, and state transitions' },
        ].map((item, idx) => (
          <div key={idx} style={{ background: '#FFFFFF', padding: '16px', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB' }}>0{idx + 1}</span>
            <h2 style={{ fontSize: '15px', fontWeight: 600, margin: '4px 0', color: '#0F172A' }}>{item.title}</h2>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.4, margin: 0 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const ColorSystem: Story = {
  render: () => {
    const swatches = [
      { name: 'Neutral 50', hex: '#F9FAFB' },
      { name: 'Neutral 100', hex: '#F3F4F6' },
      { name: 'Neutral 300', hex: '#D1D5DB' },
      { name: 'Neutral 500', hex: '#6B7280' },
      { name: 'Neutral 700', hex: '#374151' },
      { name: 'Neutral 900', hex: '#111827' },
    ];
    const semantic = [
      { role: 'Primary Action', hex: '#2563EB' },
      { role: 'Success / Positive', hex: '#15803D' },
      { role: 'Warning / Attention', hex: '#b45309' },
      { role: 'Danger / Destructive', hex: '#b91c1c' },
      { role: 'Info / Informative', hex: '#0284C7' },
    ];

    return (
      <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'var(--font-sans, system-ui, sans-serif)', color: '#0F172A' }}>
        <div style={{ marginBottom: '24px' }}>
          <span style={{ display: 'inline-block', padding: '4px 10px', background: '#EFF6FF', color: '#1D4ED8', borderRadius: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
            Foundations
          </span>
          <h1 style={{ marginTop: '12px', fontSize: '28px', fontWeight: 700, margin: '12px 0 8px' }}>Color Palette & Semantics</h1>
          <p style={{ fontSize: '15px', color: '#64748B', margin: 0 }}>Standardized color tokens ensuring consistent role attribution and WCAG AA contrast compliance.</p>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '24px 0' }} />

        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Neutrals Scale</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '28px' }}>
          {swatches.map((s, idx) => (
            <div key={idx} style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ height: '64px', backgroundColor: s.hex }} />
              <div style={{ padding: '8px', background: '#FFFFFF' }}>
                <span style={{ fontWeight: 600, fontSize: '13px', display: 'block' }}>{s.name}</span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>{s.hex}</span>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Semantic Status Roles</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
          {semantic.map((s, idx) => (
            <div key={idx} style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ height: '64px', backgroundColor: s.hex }} />
              <div style={{ padding: '8px', background: '#FFFFFF' }}>
                <span style={{ fontWeight: 600, fontSize: '13px', display: 'block' }}>{s.role}</span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>{s.hex}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
