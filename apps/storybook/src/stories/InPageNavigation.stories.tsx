import {
Text
} from '@ds/react';
import type { Meta,StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'Navigation Systems/10 In-Page Navigation',
  parameters: {
    docs: {
      description: {
        component:
          '**Single-Page In-Page Navigation System (§01–§14)**\n\n' +
          'Provides anchor-link wayfinding and IntersectionObserver scrollspy tracking within long-form documents.\n' +
          'Owns sticky anchor indexes, header offset compensation, and deep section URL hashing.\n\n' +
          '**Composition Contract:**\n' +
          '- **Required:** `Link`, `List`, `ListItem`\n' +
          '- **Optional:** `Heading`, `Divider`\n\n' +
          '*Scenario:* **Hydraulic Press MC-2000-01 Technical & Maintenance Dossier** at **Suryodaya Autocomp Ltd (PL-04 Chakan, Pune)**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const ANCHORS = [
  { id: 'overview', label: '1. Machine Identification' },
  { id: 'specs', label: '2. Hydraulic Press Specifications' },
  { id: 'lubrication', label: '3. Lubrication & Filter Schedule' },
  { id: 'tooling', label: '4. Die Set & Tooling Geometry' },
  { id: 'history', label: '5. Overhaul & Breakdown Log' },
];

// 1. Machine Dossier Scrollspy
export const MachineDossierScrollspy: Story = {
  render: () => {
    const [activeSection, setActiveSection] = useState('specs');

    return (
      <div style={{ display: 'flex', height: '480px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#F8FAFC', overflow: 'hidden' }}>
        {/* Main Document Content */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#FFFFFF' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px', color: '#0F172A' }}>
            Hydraulic Press 2000T (MC-2000-01) Technical Dossier
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 24px' }}>
            Chakan Plant (PL-04) Press Shop · Maintained by Vikram Bhosale
          </p>

          <section id="overview" style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1E293B', borderBottom: '1px solid #E2E8F0', paddingBottom: '6px' }}>
              1. Machine Identification
            </h2>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
              Asset ID: <code>MC-2000-01</code> · Model: Schuler H-2000 · Commissioned: 2019 · Cost-Centre: CC-CHAKAN-04.
            </p>
          </section>

          <section id="specs" style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1E293B', borderBottom: '1px solid #E2E8F0', paddingBottom: '6px' }}>
              2. Hydraulic Press Specifications
            </h2>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
              Max Tonnage: 2,000 Metric Tons · Bolster Area: 4,000 × 2,500 mm · Stroke: 800 mm · Nominal Operating Pressure: 280 Bar.
            </p>
          </section>

          <section id="lubrication" style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1E293B', borderBottom: '1px solid #E2E8F0', paddingBottom: '6px' }}>
              3. Lubrication &amp; Filter Schedule
            </h2>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
              Hydraulic oil grade: ISO VG 46 · Sump capacity: 2,400 L · Filter change: Every 1,000 operating hours.
            </p>
          </section>
        </div>

        {/* In-Page Navigation Anchor Index (Required: List, ListItem, Link) */}
        <nav
          aria-label="Table of Contents In-Page Navigation"
          style={{ width: '260px', borderLeft: '1px solid #E2E8F0', background: '#F8FAFC', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <Text size="xs" color="secondary" weight="bold">ON THIS PAGE</Text>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {ANCHORS.map((anchor) => {
              const isCurrent = activeSection === anchor.id;
              return (
                <li key={anchor.id}>
                  <a
                    href={`#${anchor.id}`}
                    aria-current={isCurrent ? 'true' : undefined}
                    onClick={(e) => { e.preventDefault(); setActiveSection(anchor.id); }}
                    style={{
                      display: 'block',
                      padding: '6px 8px',
                      fontSize: '12px',
                      borderRadius: '4px',
                      fontWeight: isCurrent ? 600 : 400,
                      color: isCurrent ? '#1D4ED8' : '#64748B',
                      background: isCurrent ? '#EFF6FF' : 'transparent',
                      borderLeft: isCurrent ? '2px solid #1D4ED8' : '2px solid transparent',
                      textDecoration: 'none',
                    }}
                  >
                    {anchor.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    );
  },
};

// 2. Sticky Anchor Sidebar
export const StickyAnchorSidebar: Story = {
  render: () => (
    <div style={{ maxWidth: '280px', padding: '16px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
      <Text size="xs" color="brand" weight="bold" style={{ marginBottom: '8px', display: 'block' }}>
        STICKY ANCHOR TOC
      </Text>
      <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <a href="#s1" style={{ color: '#1D4ED8', textDecoration: 'none', fontWeight: 600 }}>• 1. Chemical Composition IS 4432</a>
        <a href="#s2" style={{ color: '#64748B', textDecoration: 'none' }}>• 2. Hardness Tolerance Matrix</a>
        <a href="#s3" style={{ color: '#64748B', textDecoration: 'none' }}>• 3. Ultrasonic Flaw Scan Logs</a>
      </div>
    </div>
  ),
};
