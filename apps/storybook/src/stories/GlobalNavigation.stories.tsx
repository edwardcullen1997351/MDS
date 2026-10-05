import {
Badge,
Box,
Button,
Drawer,
DrawerBody,
DrawerHeader,
DrawerTitle,
Text,
VStack
} from '@ds/react';
import type { Meta,StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'Navigation Systems/01 Global Navigation',
  parameters: {
    docs: {
      description: {
        component:
          '**L1 Global Navigation System (§01–§14)**\n\n' +
          'Provides persistent access to the highest-level operational domains across the enterprise suite.\n' +
          'Owns L1 information architecture, active tenant/plant identity, badge rollup, and responsive drawer folding.\n\n' +
          '**Composition Contract:**\n' +
          '- **Required:** `Link`, `List`, `ListItem`\n' +
          '- **Optional:** `Icon`, `Badge`, `Menu`, `MenuList`, `Divider`, `Drawer`\n\n' +
          '*Scenario:* **Suryodaya Autocomp Ltd (PL-04 Chakan, Pune)** plant operations suite.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const PLANT_MODULES = [
  { id: 'planning', label: 'Shift Planning', icon: 'calendar', badge: '3', href: '#planning' },
  { id: 'work-orders', label: 'Work Orders', icon: 'file-text', badge: '14', href: '#work-orders' },
  { id: 'quality', label: 'Quality & NCs', icon: 'check-circle', badge: '2', href: '#quality' },
  { id: 'maintenance', label: 'Maintenance', icon: 'tool', badge: undefined, href: '#maintenance' },
  { id: 'stores', label: 'Stores & BOM', icon: 'archive', badge: undefined, href: '#stores' },
  { id: 'plant-assets', label: 'Plant Assets', icon: 'layers', badge: undefined, href: '#assets', disabled: true, reason: 'Requires Shop Floor Manager role' },
];

// 1. Plant Suite Shell
export const PlantSuiteShell: Story = {
  render: () => {
    const [active, setActive] = useState('work-orders');

    return (
      <div style={{ display: 'flex', height: '620px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
        <nav
          aria-label="Primary Global Navigation"
          style={{ width: '260px', background: '#FFFFFF', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}
        >
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', background: '#1D4ED8', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 700, fontSize: '13px' }}>
                SA
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Suryodaya ERP</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>PL-04 Chakan, Pune</div>
              </div>
            </div>
          </div>

          {/* List Navigation (Required: List, ListItem, Link) */}
          <ul style={{ listStyle: 'none', margin: 0, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            {PLANT_MODULES.map((item) => {
              const isCurrent = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    aria-current={isCurrent ? 'page' : undefined}
                    aria-disabled={item.disabled}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!item.disabled) setActive(item.id);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '9px 12px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: isCurrent ? 600 : 500,
                      color: item.disabled ? '#64748B' : isCurrent ? '#1D4ED8' : '#334155',
                      background: isCurrent ? '#EFF6FF' : 'transparent',
                      textDecoration: 'none',
                      cursor: item.disabled ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isCurrent ? '#1D4ED8' : 'transparent', border: isCurrent ? 'none' : '1px solid #CBD5E1' }} />
                      {item.label}
                    </span>
                    {item.badge && <Badge variant={isCurrent ? 'brand' : 'neutral'}>{item.badge}</Badge>}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* User Profile Footer */}
          <div style={{ padding: '14px 16px', borderTop: '1px solid #E2E8F0', background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>Anjali Deshmukh</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Shift Planner · Shift A (IST)</div>
            </div>
          </div>
        </nav>

        {/* Main Content Workspace */}
        <main id="main-content" style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 8px' }}>Active Module: {PLANT_MODULES.find(m => m.id === active)?.label}</h2>
          <p style={{ color: '#64748B', fontSize: '14px' }}>
            Routing synchronized to L1 path <code>/{active}</code> at Suryodaya Autocomp Ltd (PL-04 Chakan).
          </p>
        </main>
      </div>
    );
  },
};

// 2. Collapsed Icon Rail
export const CollapsedIconRail: Story = {
  render: () => {
    const [active, setActive] = useState('quality');

    return (
      <div style={{ display: 'flex', height: '480px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
        <nav
          aria-label="Collapsed Icon Rail Navigation"
          style={{ width: '64px', background: '#FFFFFF', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0' }}
        >
          <div style={{ width: '32px', height: '32px', background: '#1D4ED8', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 700, fontSize: '14px', marginBottom: '16px' }}>
            SA
          </div>

          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', alignItems: 'center' }}>
            {PLANT_MODULES.slice(0, 5).map((item) => {
              const isCurrent = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    aria-current={isCurrent ? 'page' : undefined}
                    title={item.label}
                    onClick={(e) => {
                      e.preventDefault();
                      setActive(item.id);
                    }}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isCurrent ? '#EFF6FF' : 'transparent',
                      color: isCurrent ? '#1D4ED8' : '#64748B',
                      border: isCurrent ? '1px solid #BFDBFE' : '1px solid transparent',
                      textDecoration: 'none',
                      fontSize: '16px',
                      fontWeight: 700,
                    }}
                  >
                    {item.label[0]}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <div style={{ flex: 1, padding: '24px' }}>
          <h2>Compact Icon-Rail Workspace</h2>
          <p style={{ color: '#64748B', fontSize: '13px' }}>Maximizes horizontal canvas for high-density production shop-floor displays.</p>
        </div>
      </div>
    );
  },
};

// 3. Horizontal Topbar Nav
export const HorizontalTopbarNav: Story = {
  render: () => {
    const [active, setActive] = useState('planning');

    return (
      <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden', background: '#F8FAFC' }}>
        <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <span style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>Suryodaya MES · PL-04</span>
            <nav aria-label="Horizontal Topbar Navigation">
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '8px' }}>
                {PLANT_MODULES.slice(0, 4).map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      aria-current={active === item.id ? 'page' : undefined}
                      onClick={(e) => { e.preventDefault(); setActive(item.id); }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: active === item.id ? 600 : 500,
                        color: active === item.id ? '#1D4ED8' : '#475569',
                        background: active === item.id ? '#EFF6FF' : 'transparent',
                        textDecoration: 'none',
                      }}
                    >
                      {item.label}
                      {item.badge && <Badge variant="neutral">{item.badge}</Badge>}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <span style={{ fontSize: '12px', color: '#64748B' }}>Meera Nair (Quality Mgr)</span>
        </header>
        <div style={{ padding: '24px', minHeight: '200px' }}>
          <Text size="sm">Active Topbar View: <strong>{active}</strong></Text>
        </div>
      </div>
    );
  },
};

// 4. With User And Scope Drawer
export const WithUserAndScopeDrawer: Story = {
  render: () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
      <div style={{ padding: '24px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#FFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text weight="semibold">Global Nav with Plant Context Drawer</Text>
            <Text size="xs" color="secondary">Toggle the off-canvas drawer for multi-tenant and facility switching</Text>
          </div>
          <Button variant="outline" size="sm" onClick={() => setDrawerOpen(true)}>
            Switch Facility / Scope
          </Button>
        </div>

        <Drawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          placement="left"
        >
          <DrawerHeader>
            <DrawerTitle>Switch Enterprise Plant Facility</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <VStack gap={3}>
              <Text size="xs" color="secondary">Select manufacturing site to re-scope L1 Global Navigation:</Text>
              {[
                { id: 'PL-04', name: 'Chakan Press Shop (PL-04, Pune)', active: true },
                { id: 'PL-01', name: 'Pune Machine Bay HQ (PL-01, Pune)', active: false },
                { id: 'PL-07', name: 'Sanand Assembly Hub (PL-07, Gujarat)', active: false },
              ].map((plant) => (
                <Box
                  key={plant.id}
                  p={3}
                  isCard
                  style={{
                    border: plant.active ? '1px solid #2563EB' : '1px solid #E2E8F0',
                    background: plant.active ? '#EFF6FF' : '#FFF',
                    cursor: 'pointer',
                  }}
                  onClick={() => setDrawerOpen(false)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text size="sm" weight="semibold">{plant.name}</Text>
                    {plant.active && <Badge variant="brand">Current Site</Badge>}
                  </div>
                </Box>
              ))}
            </VStack>
          </DrawerBody>
        </Drawer>
      </div>
    );
  },
};

// 5. Role Restricted Access
export const RoleRestrictedAccess: Story = {
  render: () => (
    <div style={{ maxWidth: '280px', padding: '16px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
      <Text size="xs" color="secondary" weight="semibold" style={{ marginBottom: '8px', display: 'block' }}>
        ROLE-BASED PERMISSION GATE
      </Text>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <li>
          <a href="#unrestricted" style={{ display: 'block', padding: '8px 12px', fontSize: '13px', color: '#0F172A', textDecoration: 'none' }}>
            ✓ Shift Planning (Granted)
          </a>
        </li>
        <li>
          <div
            title="Requires Shop Floor Manager role (Vikram Bhosale / Shalini Rao approval)"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', fontSize: '13px', color: '#64748B', cursor: 'not-allowed', background: '#F8FAFC', borderRadius: '4px' }}
          >
            <span>🔒 Plant Assets / Master BOM</span>
            <Badge variant="neutral">Restricted</Badge>
          </div>
        </li>
      </ul>
    </div>
  ),
};

// 6. Keyboard And Skip Nav
export const KeyboardAndSkipNav: Story = {
  render: () => (
    <div style={{ padding: '24px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#FFF' }}>
      <a
        href="#main-workspace"
        style={{
          display: 'inline-block',
          marginBottom: '16px',
          padding: '6px 12px',
          background: '#1D4ED8',
          color: '#FFF',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Skip to main content (Alt+F6 / Tab)
      </a>
      <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
        Follows WCAG 2.4.1: Skip link targets <code>#main-workspace</code> directly, bypassing persistent navigation landmarks.
      </p>
    </div>
  ),
};
