import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Badge,
  Button,
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Skeleton,
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  ToastProvider,
} from '@ds/react';

const meta: Meta = {
  title: 'Interaction Patterns/07 Selection Driven Detail',
  decorators: [
    (Story) => (
      <ToastProvider position="top-right">
        <div style={{ padding: '32px', backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          '**Selection-Driven Detail Pattern (§01–§20)**\n\n' +
          'Governs exactly one current selection held as a stable identity, detail regions that always correspond to and name the selection, retained content labelled during loading, and request identities stopping stale data overwriting newer picks.\n\n' +
          '*Scenario:* Reading press-shop stamping die tool life and stroke telemetry at **Suryodaya Autocomp Ltd (PL-04 Chakan)** under Tool Room Head Priya Iyer.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

interface ToolDie {
  id: string;
  code: string;
  name: string;
  strokes: number;
  maxStrokes: number;
  lastGrind: string;
  location: string;
  status: 'In Press' | 'In Tool Crib' | 'Maintenance Due';
}

const diesData: ToolDie[] = [
  { id: '1', code: 'DIE-800T-01', name: 'Bevel Pinion Blanking Die', strokes: 42300, maxStrokes: 50000, lastGrind: '2026-09-12', location: 'Line 01 (800T Press)', status: 'In Press' },
  { id: '2', code: 'DIE-400T-02', name: 'Progressive Piercing Tool D2', strokes: 48900, maxStrokes: 50000, lastGrind: '2026-08-28', location: 'Tool Crib Bay 4', status: 'Maintenance Due' },
  { id: '3', code: 'DIE-CNC-04', name: 'Hobbing Arbor Fixture #3', strokes: 12400, maxStrokes: 60000, lastGrind: '2026-09-18', location: 'Line 03 (CNC Cell)', status: 'In Press' },
  { id: '4', code: 'DIE-250T-09', name: 'Flange Trimming Die Set', strokes: 8500, maxStrokes: 40000, lastGrind: '2026-09-02', location: 'Tool Crib Bay 2', status: 'In Tool Crib' },
];

// 1. Master-Detail Split View (Happy Path)
export const MasterDetailSplitView: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState<string>('1');
    const selectedDie = diesData.find((d) => d.id === selectedId) || diesData[0];

    return (
      <Box style={{ maxWidth: '940px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tool Room Crib · Chakan PL-04 Tool Life Tracker
            </span>
            <Heading as="h2" size="xl" weight="bold">Press Die Tool Life Inspector</Heading>
            <Text variant="caption" color="secondary">
              Select a stamping die from the register to inspect stroke counter telemetry and regrind intervals.
            </Text>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '16px' }}>
            {/* Master Table */}
            <Box isCard style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>DIE CODE</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>NAME</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {diesData.map((d) => {
                    const isSelected = d.id === selectedId;
                    return (
                      <tr
                        key={d.id}
                        onClick={() => setSelectedId(d.id)}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: isSelected ? '#EFF6FF' : 'transparent',
                          borderLeft: isSelected ? '3px solid #2563EB' : '3px solid transparent',
                          borderBottom: '1px solid #F1F5F9',
                        }}
                      >
                        <td style={{ padding: '10px 12px', fontWeight: 600, color: isSelected ? '#1D4ED8' : '#0F172A' }}>
                          {d.code}
                        </td>
                        <td style={{ padding: '10px 12px' }}>{d.name}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <Badge variant={d.status === 'Maintenance Due' ? 'danger' : 'neutral'}>
                            {d.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Box>

            {/* Detail Pane */}
            <Box p={4} isCard style={{ backgroundColor: '#FFFFFF' }}>
              <VStack gap={3} align="stretch">
                <HStack justify="between" align="start">
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B', fontFamily: 'monospace' }}>{selectedDie.code}</span>
                    <Heading as="h3" size="lg">{selectedDie.name}</Heading>
                  </div>
                  <Badge variant={selectedDie.status === 'Maintenance Due' ? 'danger' : 'success'}>
                    {selectedDie.status}
                  </Badge>
                </HStack>

                <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '4px 0' }} />

                <div>
                  <Text size="xs" color="secondary">STROKE LIFE CONSUMPTION</Text>
                  <HStack justify="between" style={{ marginTop: '4px' }}>
                    <Text size="sm" weight="bold">{selectedDie.strokes.toLocaleString()} strokes</Text>
                    <Text size="xs" color="secondary">Max: {selectedDie.maxStrokes.toLocaleString()}</Text>
                  </HStack>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', marginTop: '6px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${(selectedDie.strokes / selectedDie.maxStrokes) * 100}%`,
                        height: '100%',
                        backgroundColor: (selectedDie.strokes / selectedDie.maxStrokes) > 0.9 ? '#b91c1c' : '#2563EB',
                      }}
                    />
                  </div>
                </div>

                <HStack justify="between">
                  <Text size="xs" color="secondary">Current Location:</Text>
                  <Text size="xs" weight="semibold">{selectedDie.location}</Text>
                </HStack>
                <HStack justify="between">
                  <Text size="xs" color="secondary">Last Regrind Date:</Text>
                  <Text size="xs" weight="semibold">{selectedDie.lastGrind}</Text>
                </HStack>

                <HStack justify="end" gap={2} style={{ marginTop: '12px' }}>
                  <Button size="sm" variant="outline">Log Inspection</Button>
                  <Button size="sm" variant="primary">Send to Tool Room</Button>
                </HStack>
              </VStack>
            </Box>
          </div>
        </VStack>
      </Box>
    );
  },
};

// 2. Async Detail Loading (Skeleton Placeholder)
export const AsyncDetailLoading: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Async Telemetry</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Detail Panel Telemetry Fetch
          </Heading>
          <Text variant="caption" color="secondary">
            Master table remains responsive while detail pane loads stroke sensor telemetry.
          </Text>
        </div>

        <Box p={5} isCard>
          <VStack gap={3} align="stretch">
            <Skeleton width="40%" height="20px" />
            <Skeleton width="70%" height="16px" />
            <Skeleton width="100%" height="32px" />
            <Skeleton width="100%" height="100px" />
          </VStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 3. Detail Fetch Failure
export const DetailFetchFailure: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="danger">Sensor Unreachable</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Detail Pane Telemetry Failure
          </Heading>
        </div>

        <Box p={5} isCard style={{ textAlign: 'center' }}>
          <VStack gap={3} align="center">
            <Heading as="h3" size="lg">Could Not Connect to Die Sensor IoT Gateway</Heading>
            <Text size="sm" color="secondary">
              Stroke sensor on Press Line 01 did not respond within 3000ms.
            </Text>
            <Button size="sm" variant="danger" onClick={() => alert('Retrying sensor handshake')}>
              Retry Sensor Poll
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 4. Deleted or Decommissioned Item Selection
export const DeletedOrRemovedItem: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="warning">Stale Selection</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Decommissioned Item Selected
          </Heading>
        </div>

        <Box p={5} isCard>
          <Text size="sm" color="secondary">
            Die <code>DIE-OLD-99</code> was scrapped and removed from active inventory on 2026-09-20. Select another tool from the list.
          </Text>
        </Box>
      </VStack>
    </Box>
  ),
};

// 5. Initial Unselected State
export const InitialUnselectedState: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Heading as="h2" size="xl" weight="bold">Tool Life Register</Heading>
        </div>

        <Box p={8} isCard style={{ textAlign: 'center', backgroundColor: '#F8FAFC', border: '1px dashed #CBD5E1' }}>
          <Text size="sm" color="secondary">
            👈 Select a press die from the inventory table to view real-time stroke counter and maintenance history.
          </Text>
        </Box>
      </VStack>
    </Box>
  ),
};

// 6. Responsive Mobile Drawer Presentation
export const ResponsiveMobileDrawer: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <Badge variant="info">Mobile Responsive §15</Badge>
            <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
              Detail Drawer on Mobile Viewport
            </Heading>
            <Text variant="caption" color="secondary">
              On narrow screens, the detail pane transitions into a slide-over modal Drawer.
            </Text>
          </div>

          <Box p={4} isCard>
            <Button variant="primary" onClick={() => setIsOpen(true)}>
              Open DIE-800T-01 Detail Sheet
            </Button>
          </Box>

          <Drawer open={isOpen} onOpenChange={setIsOpen} placement="right" size="md">
            <DrawerHeader>
              <DrawerTitle>DIE-800T-01 Details</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <VStack gap={3} align="stretch">
                <Text size="sm">Strokes: 42,300 / 50,000</Text>
                <Text size="sm">Location: Line 01 (800T Press)</Text>
                <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
                  Close Sheet
                </Button>
              </VStack>
            </DrawerBody>
          </Drawer>
        </VStack>
      </Box>
    );
  },
};

// 7. Keyboard Master Detail Navigation
export const KeyboardMasterDetailSync: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Keyboard Traversal</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Arrow Key Master Navigation
          </Heading>
          <Text variant="caption" color="secondary">
            Use <kbd>Up</kbd> / <kbd>Down</kbd> arrow keys to browse table items and update the detail pane in place.
          </Text>
        </div>

        <Box p={4} isCard>
          <Text size="sm">Focused: <strong>DIE-400T-02 (Progressive Piercing Tool)</strong></Text>
        </Box>
      </VStack>
    </Box>
  ),
};
