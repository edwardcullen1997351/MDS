import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ScopePicker,
  ScopeSelection,
  Badge,
  Button,
  VStack,
  HStack,
  Text,
  Box,
} from '@ds/react';

const meta: Meta = {
  title: 'Navigation Systems/11 Scope Navigation',
  parameters: {
    docs: {
      description: {
        component:
          '**Contextual Scope Navigation System (§01–§14)**\n\n' +
          'Provides enterprise site, plant, bay, and machine-unit contextual switching.\n' +
          'Owns context re-hydration, route compatibility preservation, and cross-facility scope synchronization.\n\n' +
          '**Composition Contract:**\n' +
          '- **Required:** `ScopePicker`\n' +
          '- **Optional:** `Icon`, `Avatar`, `Badge`\n\n' +
          '*Scenario:* **Multi-Site Operational Context Switching** across **Suryodaya Autocomp Ltd (PL-04 Chakan, PL-01 Pune, PL-07 Sanand)**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// 1. Multi Plant Enterprise Scope
export const MultiPlantEnterpriseScope: Story = {
  render: () => {
    const [scope, setScope] = useState<ScopeSelection>({
      plant: 'plant-04',
      area: 'stamping-4',
      unit: 'press-2000',
    });

    const plantLabels: Record<string, string> = {
      'plant-01': 'Plant 01 - Pune HQ',
      'plant-04': 'Plant 04 - Chakan Press Shop',
      'plant-07': 'Plant 07 - Sanand Assembly',
    };

    const areaLabels: Record<string, string> = {
      'bay-1': 'Turbine Hall Bay 1',
      'stamping-4': 'Heavy Stamping Line 4',
      'boiler-house': 'Auxiliary Boiler House',
      'cnc-bay': 'CNC Machining Bay',
      'cleanroom': 'Inspection Cleanroom',
      'robotics': 'Final Robotic Chassis Line',
      'battery-cell': 'Battery Pack Testing Cell',
    };

    const unitLabels: Record<string, string> = {
      'tg-401': 'Turbine Generator TG-401',
      'v-12': 'Steam Manifold Valve V-12',
      'press-2000': 'Hydraulic Press 2000T',
      'feeder-08': 'Blank Feeder F-08',
      'boiler-01': 'High-Pressure Steam Boiler B-01',
      'pump-03': 'Feedwater Pump Set P-03',
      'cnc-01': '5-Axis CNC Milling Center MC-01',
      'lathe-04': 'Precision CNC Lathe L-04',
      'boring-02': 'Horizontal Boring Mill HB-02',
      'cmm-01': 'Coordinate Measuring Machine CMM-01',
      'opp-02': 'Optical Profile Projector OPP-02',
      'srt-01': 'Surface Roughness Tester SRT-01',
      'robot-101': 'Spot Welding Robot Arm R-101',
      'agv-04': 'Automated Guided Vehicle AGV-04',
      'conveyor-02': 'Chassis Transfer Conveyor TC-02',
      'cycler-01': 'High-Voltage Discharge Cycler DC-01',
      'thermal-80': 'Thermal Chamber TC-80',
      'tester-02': 'Pack Insulation Tester IT-02',
    };

    const pText = scope.plant ? plantLabels[scope.plant] || scope.plant : 'No Plant Selected';
    const aText = scope.area ? areaLabels[scope.area] || scope.area : 'All Areas';
    const uText = scope.unit ? unitLabels[scope.unit] || scope.unit : 'All Units';

    return (
      <VStack gap={4} align="start" style={{ maxWidth: '800px', padding: '24px' }}>
        <Box p={3} isCard style={{ width: '100%', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <VStack gap={1}>
            <Text size="xs" color="secondary" weight="semibold">
              ACTIVE ENTERPRISE SCOPE (DYNAMIC CONTEXT RE-HYDRATION)
            </Text>
            <HStack gap={2} align="center">
              <Text size="sm" weight="medium">
                {pText} → {aText} → {uText}
              </Text>
              <Badge variant={scope.unit ? 'brand' : 'neutral'}>
                {scope.unit ? 'Unit Scoped' : scope.area ? 'Area Scoped' : 'Site Scoped'}
              </Badge>
            </HStack>
          </VStack>
        </Box>

        <ScopePicker
          value={scope}
          onChange={setScope}
          onClear={() => setScope({})}
        />
      </VStack>
    );
  },
};

// 2. Partial Scope Selection
export const PartialScopeSelection: Story = {
  render: () => {
    const [scope, setScope] = useState<ScopeSelection>({
      plant: 'plant-01',
      area: undefined,
      unit: undefined,
    });

    return (
      <VStack gap={4} align="start" style={{ maxWidth: '800px', padding: '24px' }}>
        <Box p={3} isCard style={{ width: '100%', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <Text size="xs" color="brand" weight="semibold">
            BROAD SITE-LEVEL QUERY (PLANT 01 PUNE HQ)
          </Text>
          <Text size="xs" color="secondary">
            Viewing site-wide operational capacity across all bays. Narrow down by selecting an area below.
          </Text>
        </Box>

        <ScopePicker
          value={scope}
          onChange={setScope}
          onClear={() => setScope({})}
        />
      </VStack>
    );
  },
};

// 3. Multi Site Switching
export const MultiSiteSwitching: Story = {
  render: () => {
    const [scope, setScope] = useState<ScopeSelection>({
      plant: 'plant-04',
      area: 'stamping-4',
      unit: 'press-2000',
    });

    return (
      <VStack gap={4} align="start" style={{ maxWidth: '800px', padding: '24px' }}>
        <HStack gap={2}>
          <Button
            size="sm"
            variant={scope.plant === 'plant-01' ? 'primary' : 'outline'}
            onClick={() => setScope({ plant: 'plant-01', area: 'cleanroom' })}
          >
            Switch to Pune HQ (PL-01)
          </Button>
          <Button
            size="sm"
            variant={scope.plant === 'plant-04' ? 'primary' : 'outline'}
            onClick={() => setScope({ plant: 'plant-04', area: 'stamping-4', unit: 'press-2000' })}
          >
            Switch to Chakan (PL-04)
          </Button>
          <Button
            size="sm"
            variant={scope.plant === 'plant-07' ? 'primary' : 'outline'}
            onClick={() => setScope({ plant: 'plant-07', area: 'robotics' })}
          >
            Switch to Sanand (PL-07)
          </Button>
        </HStack>

        <ScopePicker
          value={scope}
          onChange={setScope}
          onClear={() => setScope({})}
        />
      </VStack>
    );
  },
};

// 4. With Avatar And User Badge
export const WithAvatarAndUserBadge: Story = {
  render: () => {
    const [scope, setScope] = useState<ScopeSelection>({
      plant: 'plant-04',
      area: 'bay-1',
    });

    return (
      <div style={{ maxWidth: '800px', padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1D4ED8', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px' }}>
              MN
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>Meera Nair</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Plant Quality Manager (PL-04 Authorized)</div>
            </div>
          </div>
          <Badge variant="brand">Level 3 Sign-Off Scope</Badge>
        </div>

        <ScopePicker
          value={scope}
          onChange={setScope}
          onClear={() => setScope({})}
        />
      </div>
    );
  },
};
