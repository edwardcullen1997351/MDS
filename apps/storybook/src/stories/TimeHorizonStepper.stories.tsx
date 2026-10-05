import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  TimeHorizonStepper,
  TimeHorizonBucket,
} from '@ds/react';

const meta: Meta<typeof TimeHorizonStepper> = {
  title: 'Navigation Systems/Time Horizon Stepper',
  component: TimeHorizonStepper,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Segmented controller with dynamic bucket sizing (Shift, Day, Week, Month), directional step traversal, and quick jump to "Today / Shift 1". Designed for manufacturing ERP planners operating across multi-shift production horizons.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof TimeHorizonStepper>;

const horizonSamples: Record<TimeHorizonBucket, string[]> = {
  shift: [
    '14-Oct-2026 · Shift 1 (06:00 - 14:00)',
    '14-Oct-2026 · Shift 2 (14:00 - 22:00)',
    '14-Oct-2026 · Shift 3 (22:00 - 06:00)',
    '15-Oct-2026 · Shift 1 (06:00 - 14:00)',
  ],
  day: ['14-Oct-2026', '15-Oct-2026', '16-Oct-2026', '17-Oct-2026'],
  week: ['W42 · 12–18 Oct 2026', 'W43 · 19–25 Oct 2026', 'W44 · 26 Oct–01 Nov 2026'],
  month: ['October 2026', 'November 2026', 'December 2026'],
};

export const InteractiveController: Story = {
  render: () => {
    const [bucket, setBucket] = useState<TimeHorizonBucket>('shift');
    const [horizonIndex, setHorizonIndex] = useState(0);

    const horizons = horizonSamples[bucket];

    return (
      <div style={{ padding: '32px', background: '#F8FAFC', minHeight: '200px' }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600, color: '#334155' }}>
          Interactive Horizon Controller (Shift / Day / Week / Month)
        </h2>
        <TimeHorizonStepper
          bucketSize={bucket}
          onBucketSizeChange={(nextBucket) => { setBucket(nextBucket); setHorizonIndex(0); }}
          currentHorizonLabel={horizons[horizonIndex]}
          onPrev={() => setHorizonIndex((idx) => Math.max(0, idx - 1))}
          onNext={() => setHorizonIndex((idx) => Math.min(horizons.length - 1, idx + 1))}
          prevDisabled={horizonIndex === 0}
          nextDisabled={horizonIndex === horizons.length - 1}
          onJumpToday={() => { setBucket('shift'); setHorizonIndex(0); }}
          jumpTodayLabel="Reset horizon"
        />
        <div style={{ marginTop: '16px', fontSize: '13px', color: '#64748B' }}>
          Active Bucket Granularity: <strong>{bucket.toUpperCase()}</strong> · Focus Index: <strong>{horizonIndex}</strong>
        </div>
      </div>
    );
  },
};

export const ShiftGranularity: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <TimeHorizonStepper
        bucketSize="shift"
        currentHorizonLabel="14-Oct-2026 · Shift 2 (Evening)"
        onPrev={() => {}}
        onNext={() => {}}
        onJumpToday={() => {}}
      />
    </div>
  ),
};

export const DayGranularity: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <TimeHorizonStepper
        bucketSize="day"
        currentHorizonLabel="Wednesday, 14-Oct-2026"
        onPrev={() => {}}
        onNext={() => {}}
        onJumpToday={() => {}}
      />
    </div>
  ),
};

export const WeekGranularity: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <TimeHorizonStepper
        bucketSize="week"
        currentHorizonLabel="Week 42 (12-Oct - 18-Oct-2026)"
        onPrev={() => {}}
        onNext={() => {}}
        onJumpToday={() => {}}
      />
    </div>
  ),
};

export const MonthGranularity: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <TimeHorizonStepper
        bucketSize="month"
        currentHorizonLabel="October 2026 (MPS Master Horizon)"
        onPrev={() => {}}
        onNext={() => {}}
        onJumpToday={() => {}}
      />
    </div>
  ),
};

export const WithoutJumpButton: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <TimeHorizonStepper
        bucketSize="day"
        currentHorizonLabel="14-Oct-2026"
        onPrev={() => {}}
        onNext={() => {}}
      />
    </div>
  ),
};
