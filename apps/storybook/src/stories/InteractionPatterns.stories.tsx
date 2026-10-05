import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Interaction Patterns/Overview',
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Pattern Catalog**\n\n' +
          'Complete directory of the 15 enterprise interaction patterns in the Meridian Design System. Each pattern specifies the behavioural composition contract across existing components with zero lorem-ipsum filler, grounded in manufacturing ERP operations at **Suryodaya Autocomp Ltd (PL-04 Chakan, Pune)**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const PatternCatalog: Story = {
  render: () => (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'var(--font-sans, system-ui, sans-serif)', color: '#0F172A' }}>
      <div style={{ marginBottom: '24px' }}>
        <span style={{ display: 'inline-block', padding: '4px 10px', background: '#EFF6FF', color: '#1D4ED8', borderRadius: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Meridian Design System · Interaction Architecture
        </span>
        <h1 style={{ marginTop: '12px', fontSize: '32px', fontWeight: 700, margin: '12px 0 8px' }}>
          Interaction Pattern Catalog (15 Enterprise Suites)
        </h1>
        <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
          Standardized behavioral contracts governing sequencing, coordination, commit/cancel semantics, single-shot execution, and error recovery across plant operations at Suryodaya Autocomp Ltd (PL-04 Chakan).
        </p>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '24px 0' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {[
          {
            num: '01',
            name: 'Validated Submission',
            scenario: 'Releasing a work order (WO-8901) to a production line',
            stories: '7 Enterprise Stories',
            desc: 'Snapshot validation, independent vs dependent checks, in-flight transition lock, and first-invalid focus redirection.',
          },
          {
            num: '02',
            name: 'Conditional Input',
            scenario: 'Dispositioning a nonconforming lot (LOT-402)',
            stories: '7 Enterprise Stories',
            desc: 'Value-derived dependency rules, conditional requiredness, and focus rescue upon dynamic field dismantling.',
          },
          {
            num: '03',
            name: 'Staged Input',
            scenario: 'Raising a purchase requisition (PR-2026-4401)',
            stories: '7 Enterprise Stories',
            desc: 'Step-by-step wizard progression with forward validation gating, backward state preservation, and downstream surgical invalidation.',
          },
          {
            num: '04',
            name: 'Search Results',
            scenario: 'Item master lookup for shortage materials',
            stories: '7 Enterprise Stories',
            desc: 'Live debounced typeahead, query-bound counts, zero-result recovery, and anti-flicker retained previous results.',
          },
          {
            num: '05',
            name: 'Collection Refinement',
            scenario: 'Triaging maintenance work requests backlog',
            stories: '7 Enterprise Stories',
            desc: 'Multi-faceted filtering, active chip token sync, unrefined base state recovery, and non-blocking background query latency.',
          },
          {
            num: '06',
            name: 'Bulk Selection and Action',
            scenario: 'Posting gate-inward goods receipts (GRNs)',
            stories: '8 Enterprise Stories',
            desc: 'Stable identity selection, honest indeterminate checkbox, single-shot commit guard, and partial batch failure recovery.',
          },
          {
            num: '07',
            name: 'Selection Driven Detail',
            scenario: 'Press die stroke life & tool crib inspector',
            stories: '7 Enterprise Stories',
            desc: 'Master-detail binding, skeleton loading, telemetry fetch failure retry, and mobile responsive drawer presentation.',
          },
          {
            num: '08',
            name: 'Collection Editing',
            scenario: 'Press-shop weekly shift capacity plan editing',
            stories: '7 Enterprise Stories',
            desc: 'Inline table row drafts, dirty vs committed state tracking, revision concurrency conflict detection, and cancel restoration.',
          },
          {
            num: '09',
            name: 'Confirmed Action',
            scenario: 'Cancelling a released production run mid-shift',
            stories: '6 Enterprise Stories',
            desc: 'Two-step destructive barrier, explicit consequence in INR (₹64,800), secondary supervisor PIN, and safe dismissal routes.',
          },
          {
            num: '10',
            name: 'Explicit Save',
            scenario: 'Changing parameters of routing step OP-20',
            scenarioShort: 'Routing parameter drawer',
            stories: '7 Enterprise Stories',
            desc: 'Drawer draft boundary, derived dirty state calculation, cancel with dirty guard alert, and Ctrl+S keyboard shortcut.',
          },
          {
            num: '11',
            name: 'Asynchronous Action',
            scenario: 'MRP batch calculation and gate label printing',
            stories: '7 Enterprise Stories',
            desc: 'Phased background polling, job cancellation, resuming from failed stage, and concurrent execution isolation.',
          },
          {
            num: '12',
            name: 'Recoverable Failure',
            scenario: 'Posting shift production yield confirmations',
            stories: '7 Enterprise Stories',
            desc: 'Separation of validation vs network failure, exponential backoff polling, and full preservation of user entered numbers.',
          },
          {
            num: '13',
            name: 'Evidence Attachment',
            scenario: 'Mitutoyo bore gauge calibration certification',
            stories: '7 Enterprise Stories',
            desc: 'Mandatory file upload gating record submission, per-file retry, multi-file inspection, and keyboard file picker launch.',
          },
          {
            num: '14',
            name: 'Direct Manipulation of Order',
            scenario: 'Routing sequence reordering for BRK-4820-A',
            stories: '7 Enterprise Stories',
            desc: 'Drag & keyboard SortableCollection reordering, metallurgical drop legality rules, and optimistic update with server rollback.',
          },
          {
            num: '15',
            name: 'Bulk Data Import',
            scenario: 'Supplier catalog pricelist CSV bulk ingestion',
            stories: '8 Enterprise Stories',
            desc: '4-stage ingestion wizard: file upload -> column mapping -> dry-run simulation verdict -> commit with reject CSV export.',
          },
        ].map((pat) => (
          <div
            key={pat.num}
            style={{
              background: '#FFFFFF',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#1D4ED8', fontWeight: 600 }}>
                  § PATTERN {pat.num}
                </span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: '#DCFCE7',
                  color: '#15803D',
                }}>
                  {pat.stories}
                </span>
              </div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 6px' }}>{pat.name}</h2>
              <p style={{ fontSize: '12px', color: '#1D4ED8', fontWeight: 500, margin: '0 0 8px' }}>
                📍 {pat.scenario}
              </p>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                {pat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
