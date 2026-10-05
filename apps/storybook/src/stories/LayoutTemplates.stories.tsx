import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Layout Templates/Overview',
  parameters: {
    docs: {
      description: {
        component:
          '**Layout Templates Specification & Architecture Overview (§01–§14)**\n\n' +
          'Standardized page and shell macro layout templates for responsive enterprise applications. ' +
          'Every template is engineered against the 14-section Layout Template specification standard, ships a reference implementation set in the Suryodaya Autocomp Ltd (PL-04 Chakan) scenario, and exposes dedicated React and Angular components.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const LayoutCatalog: Story = {
  render: () => (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'var(--font-sans, system-ui, sans-serif)', color: '#0F172A' }}>
      <div style={{ marginBottom: '24px' }}>
        <span style={{ display: 'inline-block', padding: '4px 10px', background: '#EFF6FF', color: '#1D4ED8', borderRadius: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
          Design System · Layout Archetypes
        </span>
        <h1 style={{ fontSize: '30px', fontWeight: 700, margin: '12px 0 8px' }}>The 7 Accepted Layout Templates</h1>
        <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
          Production-tested macro layout patterns designed to structure complex enterprise workflows with high responsiveness, strict scroll containment, and consistent spatial hierarchy.
        </p>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '24px 0' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {[
          {
            num: '01',
            name: 'Single Column',
            badge: 'Linear Tasks / Reading',
            desc: 'The default frame for content whose hierarchy is a single vertical reading or task sequence, with unified rhythm and optional anchored actions.',
            structure: 'Header → Vertical Section Stack (sm/md/lg/full) → Actions (Flow/Anchored) → Supplementary',
          },
          {
            num: '02',
            name: 'Sidebar',
            badge: 'Contextual Split / Inspection',
            desc: 'Keeps a narrower contextual region continuously beside a dominant flexible main workspace, with usable floor minmax and axis-aligned collapse.',
            structure: 'Top Header → Context Sidebar (280–360px) + Main Workspace (minmax floor)',
          },
          {
            num: '03',
            name: 'Holy Grail',
            badge: 'Full Platform Shell',
            desc: 'Dominant center region between two lateral regions with independent purposes (Nav & Utility), cascading drawer displacement, and skip links.',
            structure: 'Top Header → Left Nav (240px) + Center Work Canvas (minmax floor) + Right Utility Drawer (300px) → Footer',
          },
          {
            num: '04',
            name: 'Split View',
            badge: 'Co-Equal Dual Panes / Comparison',
            desc: 'Two substantial work surfaces held side-by-side in one workspace with fixed ratios (50/50, 60/40, 70/30) and sequential tab mobile fallback.',
            structure: 'Workspace Header → Primary Pane (50/60/70%) | Secondary Pane (50/40/30%) [Tabs on Mobile]',
          },
          {
            num: '05',
            name: 'Master-Detail',
            badge: 'Collections / Inspection',
            desc: 'Collection or work queue held beside the specific member being worked, with one-directional selection dependency and 4 distinct layout states.',
            structure: 'Header → Left Master Queue (360–440px) | Right Member Detail Inspector [Empty/Selected/Loading/Error]',
          },
          {
            num: '06',
            name: 'Dashboard',
            badge: 'Analytics / Operations',
            desc: 'Simultaneous overview of several independently meaningful modules with global header scoping, KPI summary row, and isolated error fallbacks.',
            structure: 'Global Scoped Header → KPI Row (4 cols) → 12-Column Responsive Multi-Span Widget Grid',
          },
          {
            num: '07',
            name: 'Collection Workspace',
            badge: 'Data Grid Management',
            desc: 'Full-screen workspace framing a single large collection with 3-tiered action/filter toolbar, non-displacing batch selection bar, and sticky footer.',
            structure: 'Scope Header → 3-Tier Toolbar → Virtualized Table Grid + Floating Batch Bar → Sticky Pagination Footer',
          },
        ].map((item) => (
          <div key={item.num} style={{ background: '#FFFFFF', padding: '20px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '2px 6px', borderRadius: '4px' }}>
                  §{item.num}
                </span>
                <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>{item.name}</h2>
              </div>
              <span style={{ padding: '2px 8px', background: '#F1F5F9', color: '#475569', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>{item.badge}</span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
            <div style={{ marginTop: 'auto', background: '#F8FAFC', padding: '10px 12px', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace', color: '#475569', border: '1px solid #F1F5F9' }}>
              {item.structure}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const DashboardTemplateWireframe: Story = {
  render: () => (
    <div style={{ padding: '24px', background: '#F1F5F9', minHeight: '550px', borderRadius: '12px', border: '1px solid #CBD5E1', fontFamily: 'var(--font-sans, system-ui, sans-serif)', color: '#0F172A' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Header */}
        <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Operations Command Center</h2>
            <span style={{ fontSize: '12px', color: '#64748B' }}>Live system telemetry and work queue</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Export CSV</button>
            <button type="button" style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#2563EB', color: '#FFF', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Create Dispatch</button>
          </div>
        </div>

        {/* KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[
            { label: 'Active Facilities', val: '42', change: '+2 vs last mo', color: '#15803D', bg: '#DCFCE7' },
            { label: 'Daily Throughput', val: '1,280 tons', change: '+12.4%', color: '#15803D', bg: '#DCFCE7' },
            { label: 'Pending Inspections', val: '18', change: '3 urgent', color: '#B45309', bg: '#FEF3C7' },
            { label: 'System SLA', val: '99.94%', change: 'Normal', color: '#15803D', bg: '#DCFCE7' },
          ].map((kpi, idx) => (
            <div key={idx} style={{ padding: '16px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>{kpi.label}</span>
              <div style={{ fontSize: '24px', fontWeight: 700, margin: '6px 0', color: '#0F172A' }}>{kpi.val}</div>
              <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, color: kpi.color, background: kpi.bg }}>{kpi.change}</span>
            </div>
          ))}
        </div>

        {/* Main Content Split */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
          <div style={{ padding: '20px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', minHeight: '240px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 12px' }}>Throughput Trend (Past 30 Days)</h2>
            <div style={{ height: '170px', background: '#F8FAFC', borderRadius: '6px', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: '13px' }}>
              [ Interactive Area & Line Chart Visualization Component ]
            </div>
          </div>

          <div style={{ padding: '20px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 12px' }}>Real-time Audit Log</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { time: '10:42 AM', text: 'Batch #89201 QA passed' },
                { time: '10:38 AM', text: 'Valve calibration completed' },
                { time: '10:15 AM', text: 'New route manifest assigned' },
              ].map((log, idx) => (
                <div key={idx} style={{ padding: '8px', background: '#F8FAFC', borderRadius: '4px', fontSize: '12px' }}>
                  <span style={{ fontWeight: 600, color: '#2563EB' }}>{log.time}</span> · {log.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
