import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  SingleColumnLayout,
  Button,
  Input,
  Select,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  ToastProvider,
} from '@ds/react';

const meta: Meta = {
  title: 'Layout Templates/01 Single Column',
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
          '**Single Column Layout Template (§01–§14)**\n\n' +
          'The default frame for content whose hierarchy is a single vertical reading or task sequence.\n' +
          'Enforces 5 disciplined regions (Page, Header, Primary Stack, Actions, Supplementary), unified rhythm between sections, and explicit refusal of lateral clutter.\n\n' +
          '*Enterprise Scenario:* Raising maintenance work request `MWR-2026-0488` against Press Line P-2 at **Suryodaya Autocomp Ltd (PL-04 Chakan, Pune)** by Sandeep Kulkarni (Maintenance Lead).',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// 1. Standard Work Request Form (Default Bounded md Measure)
export const StandardWorkRequestForm: Story = {
  render: () => (
    <SingleColumnLayout
      contentWidth="md"
      alignment="centered"
      sectionSpacing="md"
      actionsPlacement="flow"
      header={
        <div>
          <Breadcrumb>
            <BreadcrumbItem><BreadcrumbLink href="#">Plant PL-04</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="#">Press Shop</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="#">Maintenance</BreadcrumbLink></BreadcrumbItem>
          </Breadcrumb>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '12px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Work Request · Line P-2
              </span>
              <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '4px 0 6px', color: '#0F172A' }}>
                Raise Maintenance Request: MWR-2026-0488
              </h1>
              <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
                Equipment: 800T Heavy Stamping Press (Asset #AST-P2-800) · Shift 1 (07:00–15:30 IST)
              </p>
            </div>
            <Badge variant="warning">Production Impact: Moderate</Badge>
          </div>
        </div>
      }
      actions={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button variant="outline">Save Draft</Button>
          <Button variant="primary">Submit Request to Tool Room</Button>
        </div>
      }
      supplementary={
        <div>
          <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
            Reference History (Subordinate)
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
            Prior request MWR-2026-0410 (Hydraulic seal replacement) completed on 14-Sep-2026 by Technicians Ganesh & Patil.
          </p>
        </div>
      }
    >
      <Card variant="outline">
        <CardHeader>
          <CardTitle>1. Equipment & Fault Classification</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label htmlFor="story-singlecolumn-104" style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Asset ID</label>
              <Input id="story-singlecolumn-104" aria-label="Asset ID" value="AST-P2-800 (Press Line 2)" readOnly />
            </div>
            <div>
              <span id="story-singlecolumn-108" style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Fault Category</span>
              <Select aria-labelledby="story-singlecolumn-108" aria-label="Select option"
                items={[
                  { value: 'hydraulic', label: 'Hydraulic Pressure Fluctuation' },
                  { value: 'mechanical', label: 'Die Clamping Jam' },
                  { value: 'electrical', label: 'Feeder Sensor Fault' },
                ]}
                defaultValue={['hydraulic']}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card variant="outline">
        <CardHeader>
          <CardTitle>2. Impact Assessment & Symptoms</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label htmlFor="story-singlecolumn-129" style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Observed Symptom</label>
              <Input id="story-singlecolumn-129" aria-label="Observed Symptom" defaultValue="Intermittent drop in ram tonnage from 800T to 680T during blanking stroke on bevel pinions." />
            </div>
            <div>
              <label htmlFor="story-singlecolumn-133" style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Estimated Downtime</label>
              <Input id="story-singlecolumn-133" aria-label="Estimated Downtime" defaultValue="45 mins (Die cooling allowed)" />
            </div>
          </div>
        </CardContent>
      </Card>
    </SingleColumnLayout>
  ),
};

// 2. Narrow Reading Procedure (sm 640px)
export const NarrowReadingProcedure: Story = {
  render: () => (
    <SingleColumnLayout
      contentWidth="sm"
      alignment="centered"
      sectionSpacing="sm"
      header={
        <div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#15803D', textTransform: 'uppercase' }}>
            Standard Operating Procedure · SOP-MWR-04
          </span>
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '4px 0', color: '#0F172A' }}>
            Emergency Hydraulic Depressurization
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B' }}>Plant Safety Guideline · Rev 3.2</p>
        </div>
      }
    >
      <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E2E8F0', lineHeight: 1.6, fontSize: '14px', color: '#334155' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A', marginTop: 0 }}>Step 1: Isolate Main Power</h2>
        <p>Switch Lockout-Tagout (LOTO) breaker #CB-04 on Press 2 main distribution panel to OFF. Verify zero energy state.</p>

        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A' }}>Step 2: Manual Bleed Valve Release</h2>
        <p>Rotate pressure relief valve HV-12 counter-clockwise by 2.5 turns. Observe analog gauge PG-02 until reading reaches 0 bar.</p>

        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A' }}>Step 3: Verification Notice</h2>
        <p>Attach physical orange tag with technician ID and time stamp (IST) before commencing mechanical inspections.</p>
      </div>
    </SingleColumnLayout>
  ),
};

// 3. Wide Grid Measure (lg 1240px)
export const WideGridMeasure: Story = {
  render: () => (
    <SingleColumnLayout
      contentWidth="lg"
      alignment="centered"
      sectionSpacing="md"
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Weekly Stamping Press Calibration Log</h1>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>PL-04 Chakan Plant · Week 38, 2026</p>
          </div>
          <Button variant="outline" size="sm">Export CSV</Button>
        </div>
      }
    >
      <div style={{ background: '#FFF', borderRadius: '8px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
            <tr>
              <th style={{ padding: '12px' }}>PRESS LINE</th>
              <th style={{ padding: '12px' }}>RATED TONNAGE</th>
              <th style={{ padding: '12px' }}>ACTUAL TONNAGE</th>
              <th style={{ padding: '12px' }}>STROKE RATE (SPM)</th>
              <th style={{ padding: '12px' }}>LAST CALIBRATION</th>
              <th style={{ padding: '12px' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {[
              { line: 'Line P-1 (Godrej 600T)', rated: '600 T', actual: '598 T', spm: '32 spm', cal: '18-Sep-2026', status: 'Passed' },
              { line: 'Line P-2 (Aida 800T)', rated: '800 T', actual: '680 T', spm: '26 spm', cal: '12-Sep-2026', status: 'Attention Due' },
              { line: 'Line P-3 (Schuler 1200T)', rated: '1200 T', actual: '1195 T', spm: '18 spm', cal: '20-Sep-2026', status: 'Passed' },
              { line: 'Line P-4 (ISGEC 400T)', rated: '400 T', actual: '402 T', spm: '45 spm', cal: '15-Sep-2026', status: 'Passed' },
            ].map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '12px', fontWeight: 600 }}>{r.line}</td>
                <td style={{ padding: '12px' }}>{r.rated}</td>
                <td style={{ padding: '12px' }}>{r.actual}</td>
                <td style={{ padding: '12px' }}>{r.spm}</td>
                <td style={{ padding: '12px' }}>{r.cal}</td>
                <td style={{ padding: '12px' }}>
                  <Badge variant={r.status === 'Passed' ? 'success' : 'warning'}>{r.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SingleColumnLayout>
  ),
};

// 4. Anchored Footer Actions
export const AnchoredFooterActions: Story = {
  render: () => (
    <SingleColumnLayout
      contentWidth="md"
      actionsPlacement="anchored"
      header={
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Shift End Handover Checklist</h1>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>Supervisor: Sandeep Kulkarni · Shift 1</p>
        </div>
      }
      actions={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#64748B' }}>3 of 3 sections completed</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="outline">Hold Handover</Button>
            <Button variant="primary">Sign & Transfer Shift</Button>
          </div>
        </div>
      }
    >
      {[1, 2, 3].map((sec) => (
        <Card key={sec} variant="outline">
          <CardHeader><CardTitle>Checklist Area {sec}: Line Readiness & Housekeeping</CardTitle></CardHeader>
          <CardContent>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
              All scrap bins cleared, scrap conveyor running without blockage, and die lubricators refilled to 85% capacity.
            </p>
          </CardContent>
        </Card>
      ))}
    </SingleColumnLayout>
  ),
};

// 5. Terminal Actions In Flow
export const TerminalActionsInFlow: Story = {
  render: () => (
    <SingleColumnLayout
      contentWidth="md"
      actionsPlacement="flow"
      header={
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Tool Room Work Order Signoff</h1>
          <p style={{ fontSize: '13px', color: '#64748B' }}>Confirm completed grinding and die polishing</p>
        </div>
      }
      actions={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button variant="outline">Reject Rework</Button>
          <Button variant="primary">Authorize Die for Production</Button>
        </div>
      }
    >
      <Card variant="outline">
        <CardHeader><CardTitle>Signoff Metrics</CardTitle></CardHeader>
        <CardContent>
          <p style={{ margin: 0, fontSize: '13px', color: '#334155' }}>
            Die DIE-800T-01 surface roughness Ra 0.4 µm verified on Taylor Hobson surface profilometer.
          </p>
        </CardContent>
      </Card>
    </SingleColumnLayout>
  ),
};

// 6. Supplementary In Flow (Subordinate Notes)
export const SupplementaryInFlow: Story = {
  render: () => (
    <SingleColumnLayout
      contentWidth="md"
      header={
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Quick Part Specification Lookup</h1>
          <p style={{ fontSize: '13px', color: '#64748B' }}>Search internal part drawing revisions</p>
        </div>
      }
      supplementary={
        <div style={{ background: '#FFF', padding: '16px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
          <strong style={{ fontSize: '13px', color: '#0F172A' }}>Regulatory Standard Note:</strong>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0' }}>
            All bevel gear blanks conform to AIS-037 automotive safety regulations and Tata Motors TS-16949 specs.
          </p>
        </div>
      }
    >
      <div style={{ display: 'flex', gap: '8px' }}>
        <Input aria-label="Enter part number (e.g. BRK-4820-A)" placeholder="Enter part number (e.g. BRK-4820-A)..." />
        <Button variant="primary">Search</Button>
      </div>
    </SingleColumnLayout>
  ),
};
