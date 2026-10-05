import {
Badge,
Divider,
Text
} from '@ds/react';
import type { Meta,StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'Navigation Systems/02 Local Navigation',
  parameters: {
    docs: {
      description: {
        component:
          '**L2 Local Navigation System (§01–§14)**\n\n' +
          'Provides sectional and workspace wayfinding within a specific operational domain.\n' +
          'Owns L2 information architecture, category grouping, badge rollup, and deep-route parent activation.\n\n' +
          '**Composition Contract:**\n' +
          '- **Required:** `Link`, `List`, `ListItem`\n' +
          '- **Optional:** `Heading`, `Icon`, `Badge`, `Divider`, `Accordion`, `AccordionItem`, `Drawer`\n\n' +
          '*Scenario:* **Quality & Nonconformance (NC) Domain** at **Suryodaya Autocomp Ltd (PL-04 Chakan, Pune)** under Quality Manager Meera Nair.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const QUALITY_SECTIONS = [
  {
    group: 'INCOMING INSPECTION',
    items: [
      { id: 'raw-material', label: 'Raw Material Lots', count: 4, href: '#raw-material' },
      { id: 'vendor-dossiers', label: 'Supplier Dossiers (Kalyani)', href: '#dossiers' },
    ],
  },
  {
    group: 'IN-PROCESS QUALITY',
    items: [
      { id: 'press-shop-line2', label: 'Line 2 Press Stoppages', count: 2, alert: true, href: '#line2' },
      { id: 'cmm-scans', label: 'CMM Dimensional Scans', count: 18, href: '#cmm' },
      { id: 'hardness-tests', label: 'Rockwell Hardness Logs', href: '#hardness' },
    ],
  },
  {
    group: 'DISPOSITION & AUDIT',
    items: [
      { id: 'nc-records', label: 'Active Nonconformances', count: 7, alert: true, href: '#nc' },
      { id: 'capa-actions', label: 'CAPA Escalations', count: 1, href: '#capa' },
    ],
  },
];

// 1. Quality Module Workspace Nav
export const QualityModuleWorkspaceNav: Story = {
  render: () => {
    const [active, setActive] = useState('nc-records');

    return (
      <div style={{ display: 'flex', height: '540px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#F8FAFC', overflow: 'hidden' }}>
        <nav
          aria-label="Quality and NC Local Navigation"
          style={{ width: '280px', background: '#FFFFFF', borderRight: '1px solid #E2E8F0', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              OPERATIONAL DOMAIN
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '4px 0 0', color: '#0F172A' }}>
              Quality & NC Management
            </h2>
          </div>

          <Divider />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
            {QUALITY_SECTIONS.map((section) => (
              <div key={section.group}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', marginBottom: '6px' }}>
                  {section.group}
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {section.items.map((item) => {
                    const isCurrent = active === item.id;
                    return (
                      <li key={item.id}>
                        <a
                          href={item.href}
                          aria-current={isCurrent ? 'page' : undefined}
                          onClick={(e) => { e.preventDefault(); setActive(item.id); }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '7px 10px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: isCurrent ? 600 : 500,
                            color: isCurrent ? '#1D4ED8' : '#334155',
                            background: isCurrent ? '#EFF6FF' : 'transparent',
                            textDecoration: 'none',
                          }}
                        >
                          <span>{item.label}</span>
                          {item.count && (
                            <Badge variant={item.alert ? 'danger' : 'neutral'}>
                              {item.count}
                            </Badge>
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        <main style={{ flex: 1, padding: '24px' }}>
          <Text weight="semibold" size="lg">Section View: {active}</Text>
          <Text size="sm" color="secondary" style={{ marginTop: '4px' }}>
            Active L2 section route for Chakan Plant PL-04 quality inspection logs.
          </Text>
        </main>
      </div>
    );
  },
};

// 2. Collapsible Section Accordion
export const CollapsibleSectionAccordion: Story = {
  render: () => {
    const [openGroup, setOpenGroup] = useState<string>('IN-PROCESS QUALITY');

    return (
      <div style={{ maxWidth: '300px', padding: '16px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
        <Text size="xs" color="brand" weight="bold" style={{ marginBottom: '12px', display: 'block' }}>
          LOCAL ACCORDION FOLDING
        </Text>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {QUALITY_SECTIONS.map((sec) => {
            const isOpen = openGroup === sec.group;
            return (
              <div key={sec.group} style={{ border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setOpenGroup(isOpen ? '' : sec.group)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#F8FAFC',
                    border: 'none',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  <span>{sec.group}</span>
                  <span>{isOpen ? '▾' : '▸'}</span>
                </button>
                {isOpen && (
                  <ul style={{ listStyle: 'none', margin: 0, padding: '6px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {sec.items.map((item) => (
                      <li key={item.id}>
                        <a href={item.href} style={{ display: 'block', padding: '6px 8px', fontSize: '12px', color: '#334155', textDecoration: 'none' }}>
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
};

// 3. With Alert Badges
export const WithAlertBadges: Story = {
  render: () => (
    <div style={{ maxWidth: '280px', padding: '16px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
      <Text size="sm" weight="semibold" style={{ marginBottom: '8px' }}>Critical Shop-Floor Alerts</Text>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <li style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#FEF2F2', borderRadius: '6px', fontSize: '13px' }}>
          <span style={{ color: '#991B1B', fontWeight: 600 }}>Line 2 Hydraulic Stoppage</span>
          <Badge variant="danger">2 NCs</Badge>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#F8FAFC', borderRadius: '6px', fontSize: '13px' }}>
          <span>Tool Room Calibration</span>
          <Badge variant="neutral">Nominal</Badge>
        </li>
      </ul>
    </div>
  ),
};

// 4. Density Modes
export const DensityModes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px' }}>
      <div style={{ width: '220px', padding: '12px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
        <Text size="xs" color="secondary" weight="semibold">Compact Density (32px)</Text>
        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ padding: '6px 8px', background: '#EFF6FF', color: '#1D4ED8', fontSize: '12px', borderRadius: '4px', fontWeight: 600 }}>Work Orders</div>
          <div style={{ padding: '6px 8px', fontSize: '12px', color: '#475569' }}>Routing Revisions</div>
          <div style={{ padding: '6px 8px', fontSize: '12px', color: '#475569' }}>BOM Master</div>
        </div>
      </div>

      <div style={{ width: '240px', padding: '16px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
        <Text size="xs" color="secondary" weight="semibold">Comfortable Density (40px)</Text>
        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ padding: '10px 12px', background: '#EFF6FF', color: '#1D4ED8', fontSize: '13px', borderRadius: '6px', fontWeight: 600 }}>Work Orders</div>
          <div style={{ padding: '10px 12px', fontSize: '13px', color: '#475569' }}>Routing Revisions</div>
          <div style={{ padding: '10px 12px', fontSize: '13px', color: '#475569' }}>BOM Master</div>
        </div>
      </div>
    </div>
  ),
};

// 5. Deep Active Route Scoping
export const DeepActiveRouteScoping: Story = {
  render: () => (
    <div style={{ maxWidth: '320px', padding: '16px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
      <Text size="xs" color="secondary" weight="semibold" style={{ marginBottom: '8px' }}>
        ANCESTOR HIGHLIGHTING (/quality/nc/NC-4081)
      </Text>
      <div style={{ padding: '8px 12px', background: '#F1F5F9', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
        ▾ Quality &amp; NCs (Ancestor Active)
      </div>
      <div style={{ paddingLeft: '20px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ padding: '6px 10px', fontSize: '12px', color: '#64748B' }}>NC Queue Overview</div>
        <div style={{ padding: '6px 10px', fontSize: '12px', background: '#EFF6FF', color: '#1D4ED8', fontWeight: 600, borderRadius: '4px' }}>
          ▸ NC-4081: Alloy Steel Defect (Current Page)
        </div>
      </div>
    </div>
  ),
};
