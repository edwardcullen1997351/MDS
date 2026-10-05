import {
Badge,
Button,
SplitViewLayout,
ToastProvider
} from '@ds/react';
import type { Meta,StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'Layout Templates/04 Split View',
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
          '**Split View Layout Template (§01–§14)**\n\n' +
          'Two substantial work surfaces held side-by-side in one workspace.\n' +
          'Enforces declared ratios (50/50, 60/40, 70/30), independent per-pane scroll containment, and responsive conversion to sequential tabs.\n\n' +
          '*Enterprise Scenario:* Engineering Change Notice `ECN-2026-0412` comparing Released Routing Rev C vs Proposed Draft Rev D for Gear Housing `HSG-3360-B` at **Suryodaya Autocomp Ltd (PL-04 Chakan, Pune)** under Methods Engineer Rajesh Shinde.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// 1. Equal Split 50/50 (Released vs Draft Routing)
export const EqualSplit5050: Story = {
  render: () => {
    const [activePane, setActivePane] = useState<'primary' | 'secondary'>('primary');

    return (
      <SplitViewLayout
        ratio="50/50"
        activePane={activePane}
        onActivePaneChange={setActivePane}
        primaryLabel="Released Baseline (Rev C)"
        secondaryLabel="Draft Proposed (Rev D)"
        workspaceHeader={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase' }}>
                Process Engineering · ECN-2026-0412
              </span>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '2px 0 0', color: '#0F172A' }}>
                Routing Comparison: Gear Housing HSG-3360-B
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button size="sm" variant="outline">Discard Draft</Button>
              <Button size="sm" variant="primary">Approve ECN Changes</Button>
            </div>
          </div>
        }
        primaryPane={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Released Operations Sequence (Rev C)</h2>
                <span style={{ fontSize: '12px', color: '#475569' }}>Frozen since 12-Jan-2026 · Cycle Time: 8.4 min</span>
              </div>
              <Badge variant="success">Active Production</Badge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { op: 'Op 10', name: 'Rough Face Milling (HMC-01)', time: '2.5 min', tool: 'Face Mill Ø 80' },
                { op: 'Op 20', name: 'Drill & Tap M10 Flange (VMC-03)', time: '3.2 min', tool: 'Carbide Drill Ø 8.5' },
                { op: 'Op 30', name: 'Bore Bearing Seat Ø 62H7', time: '2.7 min', tool: 'Fine Boring Head' },
              ].map((step, idx) => (
                <div key={idx} style={{ padding: '12px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '13px' }}>
                    <span>{step.op}: {step.name}</span>
                    <span style={{ color: '#475569' }}>{step.time}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#475569', display: 'block', marginTop: '4px' }}>Tooling: {step.tool}</span>
                </div>
              ))}
            </div>
          </div>
        }
        secondaryPane={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: '#1D4ED8' }}>Proposed Draft Sequence (Rev D)</h2>
                <span style={{ fontSize: '12px', color: '#475569' }}>Target Cycle Time: 6.8 min (-1.6 min savings)</span>
              </div>
              <Badge variant="warning">Draft In Review</Badge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { op: 'Op 10', name: 'Combined Rough & Finish Face Mill', time: '1.9 min', tool: 'High-Feed PCD Cutter', change: 'Modified Tooling' },
                { op: 'Op 20', name: 'High-Speed Rigid Tapping (VMC-04)', time: '2.4 min', tool: 'Synchro Tap Holder', change: 'Machine Transfer' },
                { op: 'Op 30', name: 'Bore Bearing Seat Ø 62H7', time: '2.5 min', tool: 'Fine Boring Head', change: 'Feed Optimized' },
              ].map((step, idx) => (
                <div key={idx} style={{ padding: '12px', background: '#EFF6FF', borderRadius: '6px', border: '1px solid #BFDBFE' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '13px' }}>
                    <span>{step.op}: {step.name}</span>
                    <span style={{ color: '#1D4ED8' }}>{step.time}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '12px' }}>
                    <span style={{ color: '#475569' }}>Tooling: {step.tool}</span>
                    <Badge variant="info">{step.change}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      />
    );
  },
};

// 2. Asymmetric Split 60/40
export const AsymmetricSplit6040: Story = {
  render: () => (
    <SplitViewLayout
      ratio="60/40"
      primaryLabel="Main Design Canvas (60%)"
      secondaryLabel="Reference Tolerance Matrix (40%)"
      primaryPane={
        <div style={{ padding: '20px' }}>
          <h2>Major Canvas (60% Width)</h2>
          <p style={{ color: '#475569' }}>Main drawing and operation editor has generous workspace.</p>
        </div>
      }
      secondaryPane={
        <div style={{ padding: '20px' }}>
          <h2>Reference Column (40% Width)</h2>
          <p style={{ color: '#475569' }}>Secondary inspection parameter notes.</p>
        </div>
      }
    />
  ),
};

// 3. Draft Comparison Mode (70/30 Ratio)
export const DraftComparisonMode: Story = {
  render: () => (
    <SplitViewLayout
      ratio="70/30"
      primaryLabel="Detailed CNC Program Block (70%)"
      secondaryLabel="Tool Offset Register (30%)"
      primaryPane={
        <div style={{ padding: '20px', fontFamily: 'monospace', fontSize: '13px' }}>
          <strong>G-Code Block: HSG-3360-B.NC</strong>
          <pre style={{ background: '#F8FAFC', padding: '12px', borderRadius: '6px' }}>
            N100 G90 G54 G00 X0 Y0 Z50.{'\n'}
            N110 T01 M06 (PCD FACE MILL){'\n'}
            N120 S3200 M03 F1800{'\n'}
            N130 G43 H01 Z5. M08
          </pre>
        </div>
      }
      secondaryPane={
        <div style={{ padding: '20px' }}>
          <h2>Offsets (T01–T08)</h2>
          <p style={{ color: '#475569', fontSize: '12px' }}>H01: +142.305 mm · D01: 80.00 mm</p>
        </div>
      }
    />
  ),
};

// 4. Sequential Tab Fallback
export const SequentialTabFallback: Story = {
  render: () => {
    const [tab, setTab] = useState<'primary' | 'secondary'>('secondary');
    return (
      <SplitViewLayout
        activePane={tab}
        onActivePaneChange={setTab}
        primaryLabel="Op List"
        secondaryLabel="Tooling Details"
        primaryPane={<div style={{ padding: '20px' }}>Primary Op Sequence Tab Active</div>}
        secondaryPane={<div style={{ padding: '20px' }}>Secondary Tooling Details Tab Active</div>}
      />
    );
  },
};

// 5. Independent Scroll Boundary
export const IndependentScrollBoundary: Story = {
  render: () => (
    <SplitViewLayout
      ratio="50/50"
      primaryPane={
        <div style={{ height: '400px', overflowY: 'auto', padding: '20px' }}>
          <h2>Left Pane (Independent Scroll)</h2>
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{ padding: '8px', borderBottom: '1px solid #E2E8F0' }}>
              Operation Step #{i + 1}
            </div>
          ))}
        </div>
      }
      secondaryPane={
        <div style={{ height: '400px', overflowY: 'auto', padding: '20px' }}>
          <h2>Right Pane (Independent Scroll)</h2>
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{ padding: '8px', borderBottom: '1px solid #E2E8F0' }}>
              Quality Checkpoint #{i + 1}
            </div>
          ))}
        </div>
      }
    />
  ),
};

// 6. Active Pane Focus Sync
export const ActivePaneFocusSync: Story = {
  render: () => (
    <SplitViewLayout
      ratio="50/50"
      primaryPane={
        <div style={{ padding: '20px' }}>
          <Button variant="primary">Focusable Control in Left Pane</Button>
        </div>
      }
      secondaryPane={
        <div style={{ padding: '20px' }}>
          <Button variant="outline">Focusable Control in Right Pane</Button>
        </div>
      }
    />
  ),
};
