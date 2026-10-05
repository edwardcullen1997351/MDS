import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  OptimisticDragReschedule,
  RescheduleOrderBlock,
  Button,
} from '@ds/react';

const meta: Meta<typeof OptimisticDragReschedule> = {
  title: 'Interaction Patterns/Optimistic Drag Reschedule',
  component: OptimisticDragReschedule,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Drag order block between shift columns with optimistic UI updates. Immediate state transition shows validating status while background API verifies line capacity and material transit lead times. If validation fails, order block smoothly bounces back with a spring animation and error indicator.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof OptimisticDragReschedule>;

export const Default: Story = {
  render: () => {
    const [eventFeed, setEventFeed] = useState<string[]>([
      'Ready. Drag any order card between Shift 1, Shift 2, or Shift 3, or use quick move buttons.',
    ]);

    const handleSuccess = (order: RescheduleOrderBlock, newShift: 1 | 2 | 3) => {
      setEventFeed((prev) => [
        `✅ SUCCESS: ${order.code} (${order.quantity} ${order.uom}) rescheduled to Shift ${newShift}. Capacity verified.`,
        ...prev.slice(0, 5),
      ]);
    };

    const handleFailure = (order: RescheduleOrderBlock, attemptedShift: 1 | 2 | 3, reason: string) => {
      setEventFeed((prev) => [
        `❌ REBOUND: ${order.code} failed Shift ${attemptedShift} validation: ${reason}. Bounced back.`,
        ...prev.slice(0, 5),
      ]);
    };

    return (
      <div style={{ padding: '32px', minHeight: '600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700 }}>
            Plant PL-04 Shift Dispatcher
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
            Try dragging <strong>ORD-2026-9042</strong> (1,400 L) into <strong>Shift 3</strong> (Capacity Limit: 1,200 L) to observe the spring bounce-back rebound and error indicator.
          </p>
        </div>

        <OptimisticDragReschedule
          onRescheduleSuccess={handleSuccess}
          onRescheduleFailure={handleFailure}
        />

        {/* Real-time Telemetry / Event Log */}
        <div
          style={{
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            background: '#F8FAFC',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#475569' }}>
              Dispatcher Live Telemetry
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEventFeed(['Log cleared.'])}
            >
              Clear Log
            </Button>
          </div>
          {eventFeed.map((evt, idx) => (
            <div
              key={idx}
              style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                color: evt.startsWith('✅') ? '#15803D' : evt.startsWith('❌') ? '#B91C1C' : '#334155',
                padding: '4px 0',
              }}
            >
              {evt}
            </div>
          ))}
        </div>
      </div>
    );
  },
};
