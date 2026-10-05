import {
Badge,
Button,
DashboardLayout,
DashboardWidget,
ToastProvider
} from '@ds/react';
import type { Meta,StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Layout Templates/06 Dashboard',
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
          '**Dashboard Layout Template (§01–§14)**\n\n' +
          'Simultaneous overview of several independently meaningful operational modules.\n' +
          'Scopes global controls via header, enforces strict document reflow order, and maintains per-module query failure isolation.\n\n' +
          '*Enterprise Scenario:* Shift-handover telemetry & operations command center at **Suryodaya Autocomp Ltd (PL-04 Chakan, Pune)** at 07:15 IST handover.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// 1. Shift Handover Command Center (Happy Path)
export const ShiftHandoverCommandCenter: Story = {
  render: () => {
    return (
      <DashboardLayout
        header={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase' }}>
                Plant PL-04 · Operations Command
              </span>
              <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '2px 0 0', color: '#0F172A' }}>
                Shift 1 Handover Dashboard (07:15 IST)
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button size="sm" variant="outline">Refresh Telemetry</Button>
              <Button size="sm" variant="primary">Generate Handover PDF</Button>
            </div>
          </div>
        }
        kpiRow={
          <>
            {[
              { title: 'Plant OEE (Shift 1)', val: '84.6%', change: '+2.1% vs target', color: '#15803D', bg: '#DCFCE7' },
              { title: 'Units Produced', val: '4,820 pcs', change: '96.4% plan', color: '#15803D', bg: '#DCFCE7' },
              { title: 'Downtime Minutes', val: '42 min', change: 'Line 2 pressure drop', color: '#B45309', bg: '#FEF3C7' },
              { title: 'PPM Defect Rate', val: '142 PPM', change: 'Below 200 limit', color: '#15803D', bg: '#DCFCE7' },
            ].map((kpi, idx) => (
              <div key={idx} style={{ background: '#FFF', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>{kpi.title}</span>
                <div style={{ fontSize: '24px', fontWeight: 700, margin: '4px 0', color: '#0F172A' }}>{kpi.val}</div>
                <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, color: kpi.color, background: kpi.bg }}>
                  {kpi.change}
                </span>
              </div>
            ))}
          </>
        }
      >
        {/* Main Production Chart Card (Span 8) */}
        <DashboardWidget
          colSpan={8}
          title="Line-by-Line Production vs Plan (Hourly)"
          actions={<Button size="sm" variant="outline">View Trend</Button>}
        >
          <div style={{ height: '220px', background: '#F8FAFC', borderRadius: '6px', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: '13px' }}>
            [ Hourly Output Bar Chart: Line P-1 (1,200), Line P-2 (950), Line P-3 (1,420), CNC Cell (1,250) ]
          </div>
        </DashboardWidget>

        {/* Live Line Status Feed (Span 4) */}
        <DashboardWidget
          colSpan={4}
          title="Active Press Line Status"
          actions={<Badge variant="success">All 4 Running</Badge>}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { line: 'Line P-1 (600T)', job: 'WO-8902 Pinion Flange', speed: '32 SPM', status: 'Optimal' },
              { line: 'Line P-2 (800T)', job: 'WO-8901 Bevel Pinion', speed: '26 SPM', status: 'Warning' },
              { line: 'Line P-3 (1200T)', job: 'WO-8903 Input Shaft', speed: '18 SPM', status: 'Optimal' },
              { line: 'Line P-4 (400T)', job: 'WO-8898 Bracket Plate', speed: '45 SPM', status: 'Optimal' },
            ].map((st, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#F8FAFC', borderRadius: '4px', fontSize: '12px' }}>
                <div>
                  <strong>{st.line}</strong>
                  <span style={{ display: 'block', color: '#64748B' }}>{st.job}</span>
                </div>
                <Badge variant={st.status === 'Optimal' ? 'success' : 'warning'}>{st.speed}</Badge>
              </div>
            ))}
          </div>
        </DashboardWidget>

        {/* Shift Quality Defect Pareto (Span 6) */}
        <DashboardWidget colSpan={6} title="Top Quality Rejection Reasons (Shift 1)">
          <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Blanking Burr / Flash (Line 2)</span>
              <strong>14 pcs (45%)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Surface Dent from Conveyor</span>
              <strong>9 pcs (29%)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Dimension Tolerance (Ø Oversize)</span>
              <strong>8 pcs (26%)</strong>
            </div>
          </div>
        </DashboardWidget>

        {/* Maintenance Telemetry (Span 6) */}
        <DashboardWidget colSpan={6} title="Tool Room Life Remaining">
          <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>DIE-800T-01 (Line 2 Bevel Pinion)</span>
              <strong style={{ color: '#15803D' }}>7,700 strokes left</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>DIE-400T-02 (Line 4 Piercing)</span>
              <strong style={{ color: '#b91c1c' }}>1,100 strokes (Regrind Due!)</strong>
            </div>
          </div>
        </DashboardWidget>
      </DashboardLayout>
    );
  },
};

// 2. Compact High Density Mode
export const CompactHighDensityMode: Story = {
  render: () => (
    <DashboardLayout compactMode={true}>
      <DashboardWidget colSpan={4} title="Compressed Air Header">
        <strong>6.85 bar</strong>
      </DashboardWidget>
      <DashboardWidget colSpan={4} title="Chiller Supply Temp">
        <strong>14.2 °C</strong>
      </DashboardWidget>
      <DashboardWidget colSpan={4} title="Main Bus Voltage">
        <strong>415 V</strong>
      </DashboardWidget>
    </DashboardLayout>
  ),
};

// 3. Per-Module Loading Skeletons
export const PerModuleLoadingSkeletons: Story = {
  render: () => (
    <DashboardLayout>
      <DashboardWidget colSpan={6} title="Live Power Demand (MW)" isLoading={true} />
      <DashboardWidget colSpan={6} title="Compressed Air Header Pressure">
        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '4px' }}>
          <strong>6.85 bar (Normal)</strong>
        </div>
      </DashboardWidget>
    </DashboardLayout>
  ),
};

// 4. Isolated Module Failure
export const IsolatedModuleQueryFailure: Story = {
  render: () => (
    <DashboardLayout>
      <DashboardWidget
        colSpan={6}
        title="Automated Optical Inspection (AOI Feed)"
        isError={true}
        errorMessage="AOI Camera Station #3 offline (Ethernet link down)"
      />
      <DashboardWidget colSpan={6} title="Robotic Palletizer Status">
        <div style={{ padding: '16px', background: '#F0FDF4', borderRadius: '4px', color: '#166534' }}>
          ✓ Palletizer #1 Active · Pallet 14 of 20 loaded
        </div>
      </DashboardWidget>
    </DashboardLayout>
  ),
};

// 5. Reflow Grid Breakpoints
export const ReflowGridBreakpoints: Story = {
  render: () => (
    <DashboardLayout>
      <DashboardWidget colSpan={12} title="Full Width Machine Telemetry Log">
        <p style={{ margin: 0, color: '#64748B' }}>
          This card spans full 12 columns at desktop and gracefully reflows on mobile/tablet screens.
        </p>
      </DashboardWidget>
    </DashboardLayout>
  ),
};

// 6. Header Scoped Global Filters
export const HeaderScopedGlobalFilters: Story = {
  render: () => (
    <DashboardLayout
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <h2>PL-04 Plant Scoped View</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button size="sm" variant="primary">Filter Applied: Shift 1</Button>
          </div>
        </div>
      }
    >
      <DashboardWidget colSpan={6} title="Scoped Metric 1">
        <p style={{ margin: 0, color: '#64748B' }}>Values constrained by global header shift selection.</p>
      </DashboardWidget>
      <DashboardWidget colSpan={6} title="Scoped Metric 2">
        <p style={{ margin: 0, color: '#64748B' }}>Values constrained by global header shift selection.</p>
      </DashboardWidget>
    </DashboardLayout>
  ),
};
