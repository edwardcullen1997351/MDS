import {
Badge,
Button,
Text
} from '@ds/react';
import type { Meta,StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'Navigation Systems/08 Sequential Navigation',
  parameters: {
    docs: {
      description: {
        component:
          '**Ordered Sequence Navigation System (§01–§14)**\n\n' +
          'Provides deterministic adjacent record traversal (previous/next) across ordered work queues.\n' +
          'Owns boundary termination, adjacent record title previews, and progress percentage feedback.\n\n' +
          '**Composition Contract:**\n' +
          '- **Required:** `ButtonGroup`, `Button`\n' +
          '- **Optional:** `Icon`, `Text`, `Progress`\n\n' +
          '*Scenario:* **Lot LOT-2609-118 Sample Hardness & Dimensional Inspection** (Samples S-01 to S-30) at **Suryodaya Autocomp Ltd (PL-04 Chakan, Pune)** under QA Engineer Anand Joshi.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const SAMPLES = [
  { id: 'S-01', dia: '65.08 mm', hrc: '24.2 HRC', status: 'Conforming' },
  { id: 'S-02', dia: '65.12 mm', hrc: '25.0 HRC', status: 'Conforming' },
  { id: 'S-03', dia: '65.05 mm', hrc: '23.8 HRC', status: 'Conforming' },
  { id: 'S-04', dia: '65.35 mm', hrc: '24.5 HRC', status: 'Out of Spec (Oversize)' },
  { id: 'S-05', dia: '65.10 mm', hrc: '24.1 HRC', status: 'Conforming' },
];

// 1. Sample Inspection Sequential Nav
export const SampleInspectionSequentialNav: Story = {
  render: () => {
    const [index, setIndex] = useState(2); // Sample 3 (0-indexed)
    const current = SAMPLES[index];

    return (
      <div style={{ padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <Text size="xs" color="secondary" weight="semibold">INSPECTION SAMPLE QUEUE (LOT-2609-118)</Text>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '4px 0 0' }}>
              Sample {current.id} ({index + 1} of {SAMPLES.length})
            </h2>
          </div>
          <Badge variant={current.status.includes('Conforming') ? 'success' : 'danger'}>
            {current.status}
          </Badge>
        </div>

        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '6px', marginBottom: '20px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
            <div>Outer Diameter: <strong>{current.dia}</strong></div>
            <div>Rockwell Hardness: <strong>{current.hrc}</strong></div>
          </div>
        </div>

        {/* Sequential Navigation Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outline"
            size="sm"
            disabled={index === 0}
            onClick={() => setIndex(i => i - 1)}
          >
            ← Previous: {index > 0 ? SAMPLES[index - 1].id : 'None'}
          </Button>

          <Text size="xs" color="secondary">
            Use <kbd>←</kbd> / <kbd>→</kbd> Arrow keys
          </Text>

          <Button
            variant="primary"
            size="sm"
            disabled={index === SAMPLES.length - 1}
            onClick={() => setIndex(i => i + 1)}
          >
            Next: {index < SAMPLES.length - 1 ? SAMPLES[index + 1].id : 'End'} →
          </Button>
        </div>
      </div>
    );
  },
};

// 2. With Preview Titles
export const WithPreviewTitles: Story = {
  render: () => (
    <div style={{ padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ textAlign: 'left' }}>
        <Text size="xs" color="secondary">PREVIOUS RECORD</Text>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1D4ED8' }}>← WO-99123: Stamping Flange</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <Text size="xs" color="secondary">NEXT RECORD</Text>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1D4ED8' }}>WO-99125: Hub Rotor Housing →</div>
      </div>
    </div>
  ),
};

// 3. Progress Integrated Sequential
export const ProgressIntegratedSequential: Story = {
  render: () => (
    <div style={{ padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <Text size="xs" weight="semibold">Inspection Batch Progress</Text>
        <Text size="xs" color="brand" weight="bold">18 of 30 Samples (60%)</Text>
      </div>
      <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
        <div style={{ width: '60%', height: '100%', background: '#1D4ED8' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button size="sm" variant="outline">← Prev Sample</Button>
        <Button size="sm" variant="primary">Next Sample →</Button>
      </div>
    </div>
  ),
};

// 4. Boundary Termination
export const BoundaryTermination: Story = {
  render: () => (
    <div style={{ padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
      <Button size="sm" variant="outline" disabled>← Previous (At Start of Lot: Sample 1)</Button>
      <Button size="sm" variant="primary">Next Sample (Sample 2) →</Button>
    </div>
  ),
};
