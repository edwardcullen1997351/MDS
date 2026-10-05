import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  HolyGrailLayout,
  Button,
  Badge,
  ToastProvider,
} from '@ds/react';

// Directional Panel Toggle Icons (§01–§14)
const SidebarLeftCollapseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="18" x="3" y="3" rx="3" />
    <path d="M9 3v18" />
    <path d="m14 9-3 3 3 3" />
  </svg>
);

const SidebarLeftExpandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="18" x="3" y="3" rx="3" />
    <path d="M9 3v18" />
    <path d="m11 9 3 3-3 3" />
  </svg>
);

const SidebarRightCollapseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="18" x="3" y="3" rx="3" />
    <path d="M15 3v18" />
    <path d="m10 9 3 3-3 3" />
  </svg>
);

const SidebarRightExpandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="18" x="3" y="3" rx="3" />
    <path d="M15 3v18" />
    <path d="m14 9-3 3 3 3" />
  </svg>
);

const meta: Meta = {
  title: 'Layout Templates/03 Holy Grail',
  decorators: [
    (Story) => (
      <ToastProvider position="top-right">
        <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          '**Holy Grail Layout Template (§01–§14)**\n\n' +
          'A dominant center region between two lateral regions with independent purposes (Nav & Utility), optionally under a header and over a footer.\n' +
          'Enforces declared usable-width floor (`minmax(540px, 1fr)`), cascading semantic displacement, accessible skip bypass link, and independent scroll tracks.\n\n' +
          '*Enterprise Scenario:* Press-shop work order release scheduling for week `2026-W37` at **Suryodaya Autocomp Ltd (PL-04 Chakan, Pune)** under Production Planner Meera Nambiar.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// 1. Full Operations Shell
export const FullOperationsShell: Story = {
  render: () => {
    const [navCollapsed, setNavCollapsed] = useState(false);
    const [utilCollapsed, setUtilCollapsed] = useState(false);

    return (
      <HolyGrailLayout
        navWidth="240px"
        utilityWidth="320px"
        isNavCollapsed={navCollapsed}
        isUtilityCollapsed={utilCollapsed}
        header={
          <div style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', background: '#FFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {navCollapsed && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ds-workbench-header-expand-btn ds-workbench-header-expand-btn--nav"
                  onClick={() => setNavCollapsed(false)}
                  aria-expanded={false}
                  aria-label="Expand plant sections navigation (Ctrl+B)"
                  title="Expand Navigation (Ctrl+B)"
                  style={{
                    padding: '6px',
                    color: '#2563EB',
                    backgroundColor: '#EFF6FF',
                    borderRadius: '6px',
                  }}
                >
                  <SidebarLeftExpandIcon />
                </Button>
              )}
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#0F172A' }}>
                Suryodaya MES · PL-04 Chakan Work Order Release
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Button size="sm" variant="primary">Batch Release (4)</Button>
              {utilCollapsed && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ds-workbench-header-expand-btn ds-workbench-header-expand-btn--inspector"
                  onClick={() => setUtilCollapsed(false)}
                  aria-expanded={false}
                  aria-label="Expand release constraints panel"
                  title="Expand Release Constraints"
                  style={{
                    padding: '6px',
                    color: '#2563EB',
                    backgroundColor: '#EFF6FF',
                    borderRadius: '6px',
                  }}
                >
                  <SidebarRightExpandIcon />
                </Button>
              )}
            </div>
          </div>
        }
        navigation={
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>
                Plant Sections
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNavCollapsed(true)}
                aria-label="Collapse navigation panel"
                title="Collapse Navigation"
                style={{ padding: '4px 6px', color: '#64748B' }}
              >
                <SidebarLeftCollapseIcon />
              </Button>
            </div>
            {['Press Shop (PL-04)', 'CNC Gear Cell', 'Heat Treatment Bay', 'Assembly & Pack', 'Dispatches & Logistics'].map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: idx === 0 ? 600 : 400,
                  background: idx === 0 ? '#EFF6FF' : 'transparent',
                  color: idx === 0 ? '#1D4ED8' : '#475569',
                  cursor: 'pointer',
                }}
              >
                {item}
              </div>
            ))}
          </div>
        }
        utility={
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#15803D', textTransform: 'uppercase' }}>
                  Release Feasibility Checks
                </span>
                <h2 style={{ fontSize: '15px', fontWeight: 600, margin: '4px 0', color: '#0F172A' }}>
                  Week 2026-W37 Constraints
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUtilCollapsed(true)}
                aria-label="Collapse release constraints panel"
                title="Collapse Constraints"
                style={{ padding: '4px 6px', color: '#64748B' }}
              >
                <SidebarRightCollapseIcon />
              </Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>Die Readiness:</span>
                <p style={{ margin: '4px 0 0', color: '#64748B' }}>DIE-800T-01 inspected & mounted on Line 2.</p>
              </div>
              <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>Billet Stock Available:</span>
                <p style={{ margin: '4px 0 0', color: '#64748B' }}>28,400 kg 20MnCr5 in Raw Bay 2.</p>
              </div>
              <div style={{ background: '#FEF3C7', padding: '10px', borderRadius: '6px', border: '1px solid #FDE68A' }}>
                <span style={{ fontWeight: 600, color: '#B45309' }}>Power Tariff Constraint:</span>
                <p style={{ margin: '4px 0 0', color: '#B45309' }}>Peak tariff 18:00–22:00 IST (Shift 2 throttle).</p>
              </div>
            </div>
          </div>
        }
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B' }}>
            <span>Suryodaya MES Core v4.8 · Live Plant PL-04 Database</span>
            <span>All times Indian Standard Time (IST)</span>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px', color: '#0F172A' }}>
              Press Shop Release Queue (Week W37)
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
              4 work orders ready for stamping line dispatch.
            </p>
          </div>

          <div style={{ background: '#FFF', borderRadius: '8px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <tr>
                  <th style={{ padding: '10px 14px' }}>WO NUMBER</th>
                  <th style={{ padding: '10px 14px' }}>PART NAME</th>
                  <th style={{ padding: '10px 14px' }}>TARGET QTY</th>
                  <th style={{ padding: '10px 14px' }}>PLANNED LINE</th>
                  <th style={{ padding: '10px 14px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { wo: 'WO-8901', part: 'Bevel Pinion Blank', qty: '450 pcs', line: 'Line P-2 (800T)', status: 'Approved' },
                  { wo: 'WO-8902', part: 'Flange Housing Ring', qty: '800 pcs', line: 'Line P-1 (600T)', status: 'Approved' },
                  { wo: 'WO-8903', part: 'Input Shaft Forging', qty: '300 pcs', line: 'Line P-3 (1200T)', status: 'Approved' },
                  { wo: 'WO-8904', part: 'Differential Crown Gear', qty: '650 pcs', line: 'Line P-2 (800T)', status: 'Pending Tool' },
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{row.wo}</td>
                    <td style={{ padding: '10px 14px' }}>{row.part}</td>
                    <td style={{ padding: '10px 14px' }}>{row.qty}</td>
                    <td style={{ padding: '10px 14px' }}>{row.line}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <Badge variant={row.status === 'Approved' ? 'success' : 'warning'}>{row.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </HolyGrailLayout>
    );
  },
};

// 2. Left Navigation Collapsed
export const LeftNavigationCollapsed: Story = {
  render: () => {
    const [navCollapsed, setNavCollapsed] = useState(true);
    return (
      <HolyGrailLayout
        isNavCollapsed={navCollapsed}
        header={
          <div style={{ padding: '12px 20px', background: '#FFF', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {navCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                className="ds-workbench-header-expand-btn ds-workbench-header-expand-btn--nav"
                onClick={() => setNavCollapsed(false)}
                aria-expanded={false}
                aria-label="Expand plant navigation (Ctrl+B)"
                title="Expand Navigation (Ctrl+B)"
                style={{ padding: '6px', color: '#2563EB', backgroundColor: '#EFF6FF', borderRadius: '6px' }}
              >
                <SidebarLeftExpandIcon />
              </Button>
            )}
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Navigation Collapsed Mode</h2>
          </div>
        }
        navigation={
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Navigation Links</span>
              <Button variant="ghost" size="sm" onClick={() => setNavCollapsed(true)} aria-label="Collapse navigation" style={{ padding: '4px 6px', color: '#64748B' }}>
                <SidebarLeftCollapseIcon />
              </Button>
            </div>
            <div>Navigation Active</div>
          </div>
        }
        utility={<div style={{ padding: '20px' }}>Utility Active</div>}
      >
        <div style={{ background: '#FFF', padding: '24px', borderRadius: '8px' }}>
          <h2>Center Work Area with Nav Collapsed</h2>
          <p style={{ color: '#64748B' }}>Primary canvas gains 240px width while contextual utility remains visible on the right.</p>
        </div>
      </HolyGrailLayout>
    );
  },
};

// 3. Right Utility Collapsed
export const RightUtilityCollapsed: Story = {
  render: () => {
    const [utilCollapsed, setUtilCollapsed] = useState(true);
    return (
      <HolyGrailLayout
        isUtilityCollapsed={utilCollapsed}
        navigation={<div style={{ padding: '20px' }}>Navigation Links Active</div>}
        header={
          <div style={{ padding: '12px 20px', background: '#FFF', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Utility Collapsed Mode</h2>
            {utilCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                className="ds-workbench-header-expand-btn ds-workbench-header-expand-btn--inspector"
                onClick={() => setUtilCollapsed(false)}
                aria-expanded={false}
                aria-label="Expand utility panel"
                title="Expand Utility"
                style={{ padding: '6px', color: '#2563EB', backgroundColor: '#EFF6FF', borderRadius: '6px' }}
              >
                <SidebarRightExpandIcon />
              </Button>
            )}
          </div>
        }
        utility={
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#15803D', textTransform: 'uppercase' }}>Utility Drawer</span>
              <Button variant="ghost" size="sm" onClick={() => setUtilCollapsed(true)} aria-label="Collapse utility" style={{ padding: '4px 6px', color: '#64748B' }}>
                <SidebarRightCollapseIcon />
              </Button>
            </div>
            <div>Utility Content</div>
          </div>
        }
      >
        <div style={{ background: '#FFF', padding: '24px', borderRadius: '8px' }}>
          <h2>Center Work Area with Utility Collapsed</h2>
          <p style={{ color: '#64748B' }}>Primary canvas expands on the right while left navigation hierarchy remains intact.</p>
        </div>
      </HolyGrailLayout>
    );
  },
};

// 4. Both Sidebars Collapsed
export const BothSidebarsCollapsed: Story = {
  render: () => {
    const [navCollapsed, setNavCollapsed] = useState(true);
    const [utilCollapsed, setUtilCollapsed] = useState(true);
    return (
      <HolyGrailLayout
        isNavCollapsed={navCollapsed}
        isUtilityCollapsed={utilCollapsed}
        header={
          <div style={{ padding: '12px 20px', background: '#FFF', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {navCollapsed && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ds-workbench-header-expand-btn ds-workbench-header-expand-btn--nav"
                  onClick={() => setNavCollapsed(false)}
                  aria-expanded={false}
                  aria-label="Expand navigation panel"
                  title="Expand Navigation (Ctrl+B)"
                  style={{ padding: '6px', color: '#2563EB', backgroundColor: '#EFF6FF', borderRadius: '6px' }}
                >
                  <SidebarLeftExpandIcon />
                </Button>
              )}
              <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Full-Width Production Canvas Mode</h2>
            </div>
            {utilCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                className="ds-workbench-header-expand-btn ds-workbench-header-expand-btn--inspector"
                onClick={() => setUtilCollapsed(false)}
                aria-expanded={false}
                aria-label="Expand utility panel"
                title="Expand Utility"
                style={{ padding: '6px', color: '#2563EB', backgroundColor: '#EFF6FF', borderRadius: '6px' }}
              >
                <SidebarRightExpandIcon />
              </Button>
            )}
          </div>
        }
        navigation={
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Plant Navigation</span>
              <Button variant="ghost" size="sm" onClick={() => setNavCollapsed(true)} aria-label="Collapse navigation" style={{ padding: '4px 6px', color: '#64748B' }}>
                <SidebarLeftCollapseIcon />
              </Button>
            </div>
            <div>Navigation Active</div>
          </div>
        }
        utility={
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#15803D', textTransform: 'uppercase' }}>Utility Drawer</span>
              <Button variant="ghost" size="sm" onClick={() => setUtilCollapsed(true)} aria-label="Collapse utility" style={{ padding: '4px 6px', color: '#64748B' }}>
                <SidebarRightCollapseIcon />
              </Button>
            </div>
            <div>Utility Active</div>
          </div>
        }
      >
        <div style={{ background: '#FFF', padding: '24px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <h2>Maximized Central Canvas</h2>
          <p style={{ color: '#64748B' }}>When both Nav and Utility sidebars are collapsed, the center work canvas occupies the entire screen width with zero clutter.</p>
        </div>
      </HolyGrailLayout>
    );
  },
};

// 5. Release Constraints Review Mode
export const ReleaseConstraintsReview: Story = {
  render: () => (
    <HolyGrailLayout
      utilityWidth="380px"
      utility={
        <div style={{ padding: '20px', background: '#FFF', height: '100%' }}>
          <h2>Deep Feasibility Checks</h2>
          <p style={{ color: '#64748B', fontSize: '13px' }}>Energy quota, tooling wear, and furnace availability telemetry.</p>
        </div>
      }
    >
      <div style={{ padding: '20px', background: '#FFF', borderRadius: '8px' }}>
        <h2>Work Order Staging</h2>
      </div>
    </HolyGrailLayout>
  ),
};

// 6. Bypass Landmark Navigation
export const BypassLandmarkNavigation: Story = {
  render: () => (
    <HolyGrailLayout
      skipLinkText="Skip directly to press shop schedule (Enter)"
      navigation={<div style={{ padding: '20px' }}>Tab 1: Navigation Landmark</div>}
      utility={<div style={{ padding: '20px' }}>Tab 3: Complementary Landmark</div>}
    >
      <div style={{ background: '#FFF', padding: '24px', borderRadius: '8px' }}>
        <h2>Main Content Landmark (ID: #ds-main-content)</h2>
        <p style={{ color: '#64748B' }}>Focus moves directly here when pressing Enter on the initial skip link.</p>
      </div>
    </HolyGrailLayout>
  ),
};
