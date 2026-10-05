import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  SidebarLayout,
  Button,
  Input,
  Badge,
  ToastProvider,
} from '@ds/react';

// NotebookLM-style Panel Toggle Icons (§01–§14)
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
  title: 'Layout Templates/02 Sidebar',
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
          '**Sidebar Layout Template (§01–§14)**\n\n' +
          'Keeps a narrower contextual region continuously beside a dominant flexible main workspace.\n' +
          'Enforces declared sidebar width, main region floor (`minmax(560px, 1fr)`), axis-aligned collapse, and independent scroll containment.\n\n' +
          '*Enterprise Scenario:* Incoming raw material inspection for Lot `LOT-2609-118` (Alloy Steel Billets 20MnCr5) at **Suryodaya Autocomp Ltd (PL-04 Chakan, Pune)** under Quality Engineer Anand Joshi.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// 1. Lot Inspection Default Split
export const LotInspectionDefaultSplit: Story = {
  render: () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
      <SidebarLayout
        sidebarPosition="start"
        sidebarWidth="320px"
        isCollapsed={isCollapsed}
        header={
          <div style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', background: '#FFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isCollapsed && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(false)}
                  aria-expanded={false}
                  aria-label="Expand lot specifications sidebar (Ctrl+B)"
                  title="Expand Sidebar (Ctrl+B)"
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
              <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#0F172A' }}>
                Incoming QA Station · Lot LOT-2609-118
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Badge variant="warning">Sample 5 of 30 Inspected</Badge>
              <Button variant="primary" size="sm">Accept Lot</Button>
            </div>
          </div>
        }
        sidebar={
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase' }}>
                  Supplier Dossier
                </span>
                <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '4px 0', color: '#0F172A' }}>
                  Kalyani Steels Ltd
                </h2>
                <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Chakan Vendor Code: V-KSL-09</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(true)}
                aria-label="Collapse sidebar panel"
                title="Collapse Sidebar"
                style={{ padding: '4px 6px', color: '#64748B' }}
              >
                <SidebarLeftCollapseIcon />
              </Button>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '4px 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#64748B', display: 'block' }}>Material Grade:</span>
                <strong style={{ color: '#0F172A' }}>20MnCr5 (IS 4432)</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block' }}>Heat Number:</span>
                <strong style={{ color: '#0F172A' }}>HT-89201-B</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block' }}>Total Invoiced Qty:</span>
                <strong style={{ color: '#0F172A' }}>14,500 kg (280 Billets)</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block' }}>AQL Standard:</span>
                <strong style={{ color: '#0F172A' }}>ISO 2859-1 Level II (1.0% AQL)</strong>
              </div>
            </div>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px', color: '#0F172A' }}>
              Dimensional & Hardness Inspection Matrix
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
              Verify outer diameter (Ø 65.0 ± 0.2 mm) and Rockwell hardness (HRC 22–26).
            </p>
          </div>

          <div style={{ background: '#FFF', borderRadius: '8px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <tr>
                  <th style={{ padding: '10px 14px' }}>SAMPLE #</th>
                  <th style={{ padding: '10px 14px' }}>DIA (MM)</th>
                  <th style={{ padding: '10px 14px' }}>LENGTH (MM)</th>
                  <th style={{ padding: '10px 14px' }}>HARDNESS (HRC)</th>
                  <th style={{ padding: '10px 14px' }}>SURFACE DEFECT</th>
                  <th style={{ padding: '10px 14px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { s: 'S-01', dia: '65.08 mm', len: '450.2 mm', hrc: '24.2 HRC', def: 'None (Clean)', pass: true },
                  { s: 'S-02', dia: '65.12 mm', len: '449.8 mm', hrc: '25.0 HRC', def: 'None (Clean)', pass: true },
                  { s: 'S-03', dia: '65.05 mm', len: '450.0 mm', hrc: '23.8 HRC', def: 'Minor scale mark', pass: true },
                  { s: 'S-04', dia: '65.35 mm', len: '450.1 mm', hrc: '24.5 HRC', def: 'Oversize ridge', pass: false },
                  { s: 'S-05', dia: '65.10 mm', len: '450.4 mm', hrc: '24.1 HRC', def: 'None (Clean)', pass: true },
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{row.s}</td>
                    <td style={{ padding: '10px 14px' }}>{row.dia}</td>
                    <td style={{ padding: '10px 14px' }}>{row.len}</td>
                    <td style={{ padding: '10px 14px' }}>{row.hrc}</td>
                    <td style={{ padding: '10px 14px' }}>{row.def}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <Badge variant={row.pass ? 'success' : 'danger'}>
                        {row.pass ? 'Conforming' : 'Out of Spec'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SidebarLayout>
    );
  },
};

// 2. Collapsed Sidebar State
export const CollapsedSidebarState: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(true);
    return (
      <SidebarLayout
        sidebarWidth="300px"
        isCollapsed={collapsed}
        header={
          <div style={{ padding: '12px 20px', background: '#FFF', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {collapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCollapsed(false)}
                aria-expanded={false}
                aria-label="Expand lot specification sidebar (Ctrl+B)"
                title="Expand Sidebar (Ctrl+B)"
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
            <span style={{ fontSize: '14px', fontWeight: 600 }}>PL-04 Full Width Inspection Canvas</span>
          </div>
        }
        sidebar={
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>Lot Specifications</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCollapsed(true)}
                aria-label="Collapse sidebar panel"
                style={{ padding: '4px 6px', color: '#64748B' }}
              >
                <SidebarLeftCollapseIcon />
              </Button>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Supplier Dossier and Technical Drawing specifications.</p>
          </div>
        }
      >
        <div style={{ background: '#FFF', padding: '24px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <h2 style={{ marginTop: 0 }}>Full-Width Data Workspace</h2>
          <p style={{ color: '#64748B' }}>When the sidebar collapses, the main region expands to utilize the full viewport width while respecting margins.</p>
        </div>
      </SidebarLayout>
    );
  },
};

// 3. Sidebar on Right Side (End Placement)
export const SidebarOnRightSide: Story = {
  render: () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    return (
      <SidebarLayout
        sidebarPosition="end"
        sidebarWidth="340px"
        isCollapsed={isCollapsed}
        header={
          <div style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', background: '#FFF' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#0F172A' }}>
              Final Inspection & Tolerance Audit (End Sidebar Placement)
            </h2>
            {isCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(false)}
                aria-expanded={false}
                aria-label="Expand audit checklist sidebar"
                title="Expand Checklist"
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
        }
        sidebar={
          <div style={{ padding: '16px 20px', background: '#FFF', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Audit Checklist</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(true)}
                aria-label="Collapse right sidebar"
                style={{ padding: '4px 6px', color: '#64748B' }}
              >
                <SidebarRightCollapseIcon />
              </Button>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Real-time inspector guidelines on the right side.</p>
          </div>
        }
      >
        <div style={{ background: '#FFF', padding: '24px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <h2>Primary Workspace (Left Side)</h2>
          <p style={{ color: '#64748B' }}>Main inspection data held on the left with contextual reference anchored on the right.</p>
        </div>
      </SidebarLayout>
    );
  },
};

// 4. Independent Scroll Panes
export const IndependentScrollPanes: Story = {
  render: () => (
    <SidebarLayout
      sidebarWidth="300px"
      sidebar={
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2>Long Spec List</h2>
          {[...Array(15)].map((_, i) => (
            <div key={i} style={{ padding: '8px', background: '#F8FAFC', borderRadius: '4px', fontSize: '12px' }}>
              Tolerance Parameter #{i + 1}: ± 0.05 mm
            </div>
          ))}
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2>High-Volume Inspection Log</h2>
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{ padding: '12px', background: '#FFF', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
            Sample Log Record #{i + 1} · Passed CMM Scan at 07:{10 + i} IST
          </div>
        ))}
      </div>
    </SidebarLayout>
  ),
};

// 5. Quality Audit Defect Entry
export const QualityAuditDefectEntry: Story = {
  render: () => (
    <SidebarLayout
      sidebarWidth="320px"
      sidebar={
        <div style={{ padding: '20px' }}>
          <h2 style={{ margin: '0 0 8px' }}>Drawing Reference: DRW-20MnCr5-04</h2>
          <div style={{ height: '140px', background: '#F1F5F9', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#475569' }}>
            [ Technical Drawing Blueprint Preview ]
          </div>
        </div>
      }
    >
      <div style={{ background: '#FFF', padding: '24px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
        <h2 style={{ marginTop: 0 }}>Log Defect Sample</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input aria-label="Enter defect description" placeholder="Enter defect description..." />
          <Button variant="primary">Record Defect</Button>
        </div>
      </div>
    </SidebarLayout>
  ),
};

// 6. Keyboard Toggle Flow
export const KeyboardToggleFlow: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    return (
      <SidebarLayout
        sidebarWidth="320px"
        isCollapsed={collapsed}
        sidebarAriaLabel="Inspection specifications panel"
        mainAriaLabel="Active sample recording canvas"
        header={
          <div style={{ padding: '12px 20px', background: '#FFF', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {collapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCollapsed(false)}
                aria-expanded={false}
                aria-label="Expand specifications sidebar (Ctrl+B or Enter)"
                title="Expand Sidebar (Ctrl+B)"
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
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#0F172A' }}>
              Specification Dossier Landmark
            </span>
            <span style={{ fontSize: '12px', color: '#64748B' }}>
              — Focus icon button and press Space/Enter to toggle
            </span>
          </div>
        }
        sidebar={
          <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Accessible Sidebar (Landmark: Complementary)</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(true)}
              aria-label="Collapse specifications sidebar"
              title="Collapse Sidebar"
              style={{ padding: '4px 6px', color: '#64748B' }}
            >
              <SidebarLeftCollapseIcon />
            </Button>
          </div>
        }
      >
        <div style={{ background: '#FFF', padding: '24px', borderRadius: '8px' }}>
          Accessible Main Landmark (Focus & Tab Sequence)
        </div>
      </SidebarLayout>
    );
  },
};
