import {
Button
} from '@ds/react';
import type { Meta,StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'Navigation Systems/Overview',
  parameters: {
    docs: {
      description: {
        component:
          '**Navigation Architecture & Wayfinding Systems (§01–§14)**\n\n' +
          'A comprehensive wayfinding and routing taxonomy for complex multi-facility enterprise applications.\n' +
          'Classifies navigation into 11 distinct systems across L1 global, L2 domain, L3 workspace, ancestor lineage, recursive trees, contextual scopes, and linear process wizards.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const ALL_11_NAVIGATION_SYSTEMS = [
  {
    num: '01',
    name: 'Global Navigation',
    tier: 'L1 Macro Suite Shell',
    desc: 'Persistent topbar or sidebar icon-rail providing highest-level operational domain switching and tenant identity.',
    composition: 'Required: Link, List, ListItem | Optional: Icon, Badge, Menu, MenuList, Divider, Drawer',
  },
  {
    num: '02',
    name: 'Local Navigation',
    tier: 'L2 Operational Domain',
    desc: 'Sectional grouping, collapsible accordions, and workspace wayfinding within a specific plant module.',
    composition: 'Required: Link, List, ListItem | Optional: Heading, Icon, Badge, Divider, Accordion, Drawer',
  },
  {
    num: '03',
    name: 'Breadcrumb Navigation',
    tier: 'Ancestor Lineage Trail',
    desc: 'Parent entity hierarchy traversal with dynamic middle-crumb truncation and current-page landmark contracts.',
    composition: 'Required: Breadcrumb | Optional: Link',
  },
  {
    num: '04',
    name: 'Tab Navigation',
    tier: 'L3 Peer View Switcher',
    desc: 'In-page workspace view partitioning, underline/segmented tablists, badge rollups, and route-backed panels.',
    composition: 'Required: Tabs, TabPanel | Optional: Icon, Badge',
  },
  {
    num: '05',
    name: 'Tree Navigation',
    tier: 'Recursive Hierarchy',
    desc: 'Expandable branch-and-leaf traversal for deep asset master registers and multi-level Bills of Materials (BOM).',
    composition: 'Required: Tree | Optional: Icon, Badge',
  },
  {
    num: '06',
    name: 'Menu Navigation',
    tier: 'Transient Popover',
    desc: 'On-demand contextual destination menus, disclosure semantics, and keyboard focus return.',
    composition: 'Required: Menu, MenuList, Link | Optional: Button, IconButton, Icon, Divider',
  },
  {
    num: '07',
    name: 'Pagination',
    tier: 'Collection Partitioning',
    desc: 'Deterministic page boundaries, jump-to-page indexing, and URL query parameter synchronization.',
    composition: 'Required: Pagination | Optional: None',
  },
  {
    num: '08',
    name: 'Sequential Navigation',
    tier: 'Ordered Queue Traversal',
    desc: 'Adjacent record step-through (previous/next) with destination preview titles and progress metrics.',
    composition: 'Required: ButtonGroup, Button | Optional: Icon, Text, Progress',
  },
  {
    num: '09',
    name: 'Step Navigation',
    tier: 'Multi-Stage Wizard',
    desc: 'Multi-phase transactional progressions with linear validation gates and completed step revisit.',
    composition: 'Required: Progress, Button | Optional: Text, Link, Stack, Divider',
  },
  {
    num: '10',
    name: 'In-Page Navigation',
    tier: 'Single-Page Scrollspy',
    desc: 'Anchor link table of contents with IntersectionObserver active section tracking and fixed header offsets.',
    composition: 'Required: Link, List, ListItem | Optional: Heading, Divider',
  },
  {
    num: '11',
    name: 'Scope Navigation',
    tier: 'Contextual Scope',
    desc: 'Enterprise multi-site facility switcher (Plant → Area → Machine Unit) preserving active route context.',
    composition: 'Required: ScopePicker | Optional: Icon, Avatar, Badge',
  },
];

export const NavigationHierarchy: Story = {
  render: () => (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'var(--font-sans, system-ui, sans-serif)', color: '#0F172A' }}>
      <div style={{ marginBottom: '24px' }}>
        <span style={{ display: 'inline-block', padding: '4px 10px', background: '#EFF6FF', color: '#1D4ED8', borderRadius: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
          Wayfinding Architecture
        </span>
        <h1 style={{ marginTop: '12px', fontSize: '30px', fontWeight: 700, margin: '12px 0 8px' }}>
          The 11 Enterprise Navigation Systems
        </h1>
        <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
          A full-spectrum information architecture framework spanning global tenant routing, plant scoping, domain sectioning, recursive trees, ancestor trails, and wizard progressions.
        </p>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '24px 0' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {ALL_11_NAVIGATION_SYSTEMS.map((system) => (
          <div
            key={system.num}
            style={{
              background: '#FFFFFF',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '2px 6px', borderRadius: '4px' }}>
                  §{system.num}
                </span>
                <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>{system.name}</h2>
              </div>
              <span style={{ padding: '2px 8px', background: '#F1F5F9', color: '#475569', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                {system.tier}
              </span>
            </div>

            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
              {system.desc}
            </p>

            <div style={{ marginTop: 'auto', background: '#F8FAFC', padding: '10px 12px', borderRadius: '6px', fontSize: '11px', fontFamily: 'monospace', color: '#475569', border: '1px solid #F1F5F9' }}>
              {system.composition}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const NavigationSuiteShowcase: Story = {
  render: () => {
    const [activeL1, setActiveL1] = useState('quality');
    const [activeTab, setActiveTab] = useState('routing');
    const [page, setPage] = useState(1);
    const [step, setStep] = useState(2);

    return (
      <main aria-label="Navigation suite showcase" style={{ padding: '32px', maxWidth: '1080px', margin: '0 auto', fontFamily: 'var(--font-sans, system-ui, sans-serif)', color: '#0F172A' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
          Multi-Tier Wayfinding Live Simulation
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>
          Interactive orchestration of L1 Global Shell, L2 Local Navigation, Breadcrumb Wayfinding, L3 Workspace Tabs, Stepper, and Pagination in <strong>Suryodaya Autocomp Ltd (PL-04 Chakan)</strong>.
        </p>

        <div style={{ border: '1px solid #CBD5E1', borderRadius: '12px', overflow: 'hidden', background: '#F8FAFC' }}>
          {/* 1. L1 Global Header */}
          <header style={{ background: '#1E293B', color: '#FFF', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontWeight: 700, letterSpacing: '0.05em', color: '#60A5FA' }}>SURYODAYA ERP · PL-04</span>
              <nav aria-label="Global Suite Nav">
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '6px' }}>
                  {[
                    { id: 'planning', label: 'Shift Planning' },
                    { id: 'orders', label: 'Work Orders' },
                    { id: 'quality', label: 'Quality & NCs', badge: '2' },
                    { id: 'stores', label: 'Stores & BOM' },
                  ].map((m) => (
                    <li key={m.id}>
                      <button
                        type="button"
                        onClick={() => setActiveL1(m.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '4px',
                          border: 'none',
                          background: activeL1 === m.id ? '#334155' : 'transparent',
                          color: activeL1 === m.id ? '#FFF' : '#CBD5E1',
                          fontWeight: activeL1 === m.id ? 600 : 400,
                          cursor: 'pointer',
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>{m.label}</span>
                        {m.badge && <span style={{ background: '#b91c1c', color: '#FFF', fontSize: '10px', padding: '1px 5px', borderRadius: '10px' }}>{m.badge}</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <span style={{ fontSize: '12px', color: '#CBD5E1' }}>Anjali Deshmukh (Shift A IST)</span>
          </header>

          <div style={{ display: 'flex', minHeight: '440px' }}>
            {/* 2. L2 Local Sidebar */}
            <aside style={{ width: '220px', background: '#FFFFFF', borderRight: '1px solid #E2E8F0', padding: '16px 12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', marginBottom: '8px' }}>PL-04 QUALITY SECTIONS</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <li style={{ padding: '6px 8px', borderRadius: '4px', background: '#EFF6FF', color: '#1D4ED8', fontWeight: 600, fontSize: '13px' }}>
                  Line 2 Press NCs
                </li>
                <li style={{ padding: '6px 8px', color: '#475569', fontSize: '13px' }}>CMM Dimensional Scans</li>
                <li style={{ padding: '6px 8px', color: '#475569', fontSize: '13px' }}>Supplier Dossiers (Kalyani)</li>
                <li style={{ padding: '6px 8px', color: '#475569', fontSize: '13px' }}>CAPA Audit Actions</li>
              </ul>
            </aside>

            {/* Main Content Workspace */}
            <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#FFF' }}>
              {/* 3. Ancestor Breadcrumb */}
              <nav aria-label="Breadcrumb Trail" style={{ fontSize: '12px', display: 'flex', gap: '6px', color: '#64748B' }}>
                <span style={{ color: '#2563EB' }}>Chakan PL-04</span>
                <span>/</span>
                <span style={{ color: '#2563EB' }}>Quality &amp; NCs</span>
                <span>/</span>
                <span style={{ color: '#2563EB' }}>Work Order WO-99124</span>
                <span>/</span>
                <span style={{ color: '#0F172A', fontWeight: 600 }}>NC-4081 Disposition</span>
              </nav>

              {/* 4. L3 Workspace Tabs */}
              <div style={{ borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '20px' }}>
                {[
                  { id: 'routing', label: 'Op 30 CNC Inspection' },
                  { id: 'telemetry', label: 'CMM Coordinates' },
                  { id: 'disposition', label: 'Rework Sign-off' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    style={{
                      padding: '8px 0',
                      background: 'none',
                      border: 'none',
                      borderBottom: activeTab === t.id ? '2px solid #2563EB' : '2px solid transparent',
                      color: activeTab === t.id ? '#2563EB' : '#64748B',
                      fontWeight: activeTab === t.id ? 600 : 400,
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* 5. Stepper Process & Pagination Row */}
              <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>DISPOSITION WIZARD (STEP {step} OF 3)</div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>1. Inspect (✓) → 2. Root Cause (Active) → 3. Close NC</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button size="sm" variant="outline" disabled={step <= 1} onClick={() => setStep(s => Math.max(1, s - 1))}>
                    Prev Stage
                  </Button>
                  <Button size="sm" variant="primary" disabled={step >= 3} onClick={() => setStep(s => Math.min(3, s + 1))}>
                    Next Stage
                  </Button>
                </div>
              </div>

              {/* 6. Pagination Footer */}
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Showing sample <strong>{page}</strong> of <strong>30</strong> (Lot LOT-2609-118)</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                  <Button size="sm" variant="outline" disabled={page >= 30} onClick={() => setPage(p => p + 1)}>Next</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  },
};
