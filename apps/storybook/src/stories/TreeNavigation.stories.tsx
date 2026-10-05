import {
Badge,
Text
} from '@ds/react';
import type { Meta,StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'Navigation Systems/05 Tree Navigation',
  parameters: {
    docs: {
      description: {
        component:
          '**Recursive Hierarchy Tree Navigation System (§01–§14)**\n\n' +
          'Provides expandable tree-node wayfinding for deeply nested asset hierarchies and multi-level bills of materials (BOM).\n' +
          'Owns recursive branch expansion, keyboard arrow traversal, and deep entity selection.\n\n' +
          '**Composition Contract:**\n' +
          '- **Required:** `Tree`\n' +
          '- **Optional:** `Icon`, `Badge`\n\n' +
          '*Scenario:* **Plant Asset & Engineering BOM Hierarchy** at **Suryodaya Autocomp Ltd (PL-04 Chakan, Pune)**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// 1. Plant Asset Hierarchy Tree
export const PlantAssetHierarchyTree: Story = {
  render: () => {
    const [selected, setSelected] = useState('mc-2000-01');
    const [expanded, setExpanded] = useState<Record<string, boolean>>({
      pl04: true,
      stamping: true,
      bay2: true,
    });

    const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

    return (
      <div style={{ display: 'flex', height: '520px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#FFF', overflow: 'hidden' }}>
        <nav
          aria-label="Plant Asset Hierarchy Tree Navigation"
          style={{ width: '320px', borderRight: '1px solid #E2E8F0', padding: '16px', overflowY: 'auto' }}
        >
          <Text size="xs" color="secondary" weight="semibold" style={{ marginBottom: '12px', display: 'block' }}>
            PLANT ASSET MASTER (PL-04 CHAKAN)
          </Text>

          {/* Level 1 */}
          <div>
            <button
              type="button"
              aria-expanded={expanded.pl04}
              onClick={() => toggle('pl04')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', border: 0, padding: 0, background: 'transparent', textAlign: 'left' }}
            >
              <span>{expanded.pl04 ? '▼' : '▶'}</span>
              <span>🏭 Suryodaya Autocomp (PL-04)</span>
            </button>

            {expanded.pl04 && (
              <div style={{ paddingLeft: '18px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {/* Level 2: Stamping */}
                <div>
                  <button
                    type="button"
                    aria-expanded={expanded.stamping}
                    onClick={() => toggle('stamping')}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', color: '#1E293B', border: 0, padding: 0, background: 'transparent', textAlign: 'left' }}
                  >
                    <span>{expanded.stamping ? '▼' : '▶'}</span>
                    <span>📁 Press Shop Division</span>
                  </button>

                  {expanded.stamping && (
                    <div style={{ paddingLeft: '18px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {/* Level 3: Line 2 */}
                      <div>
                        <button
                          type="button"
                          aria-expanded={expanded.bay2}
                          onClick={() => toggle('bay2')}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', color: '#334155', border: 0, padding: 0, background: 'transparent', textAlign: 'left' }}
                        >
                          <span>{expanded.bay2 ? '▼' : '▶'}</span>
                          <span>📁 Stamping Line 2</span>
                        </button>

                        {expanded.bay2 && (
                          <div style={{ paddingLeft: '18px', marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {[
                              { id: 'mc-2000-01', label: 'Hydraulic Press 2000T', badge: 'Active' },
                              { id: 'mc-800-02', label: 'Tandem Press 800T', badge: 'Maint' },
                              { id: 'feed-line-01', label: 'Coil Feeder Line 2' },
                            ].map((machine) => (
                              <button
                                key={machine.id}
                                type="button"
                                aria-current={selected === machine.id ? 'true' : undefined}
                                onClick={() => setSelected(machine.id)}
                                style={{
                                  display: 'flex',
                                  width: '100%',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '6px 8px',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  background: selected === machine.id ? '#EFF6FF' : 'transparent',
                                  color: selected === machine.id ? '#1D4ED8' : '#475569',
                                  fontWeight: selected === machine.id ? 600 : 400,
                                  cursor: 'pointer',
                                  border: 0,
                                  textAlign: 'left',
                                }}
                              >
                                <span>⚙️ {machine.label}</span>
                                {machine.badge && (
                                  <Badge variant={machine.badge === 'Active' ? 'success' : 'warning'}>
                                    {machine.badge}
                                  </Badge>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

        <main style={{ flex: 1, padding: '24px' }}>
          <Text weight="semibold" size="lg">Selected Asset Node: {selected}</Text>
          <Text size="sm" color="secondary" style={{ marginTop: '4px' }}>
            Telemetry stream connected to Chakan press shop maintenance log.
          </Text>
        </main>
      </div>
    );
  },
};

// 2. Engineering BOM Tree
export const EngineeringBOMTree: Story = {
  render: () => (
    <div style={{ padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', maxWidth: '480px' }}>
      <Text size="xs" color="brand" weight="bold" style={{ marginBottom: '12px', display: 'block' }}>
        MULTI-LEVEL BILL OF MATERIALS (BRK-4820-A)
      </Text>
      <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div>📦 <strong>BRK-4820-A: Brake Caliper Assembly</strong></div>
        <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div>├─ 📄 BRK-4820-01: Forged Caliper Housing (Alloy 20MnCr5)</div>
          <div>├─ 📄 BRK-4820-02: Piston Cylinder Sleeve (EN-8D)</div>
          <div>├─ 📁 BRK-4820-SUB: Seal Kit Assembly</div>
          <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '2px', color: '#64748B' }}>
            <div>├─ 📄 SL-102: EPDM Dust Boot</div>
            <div>└─ 📄 SL-104: High-Pressure O-Ring</div>
          </div>
          <div>└─ 📄 HD-0820: High-Tensile Hex Flange Bolts (M10×1.5)</div>
        </div>
      </div>
    </div>
  ),
};

// 3. With Status Badges
export const WithStatusBadges: Story = {
  render: () => (
    <div style={{ padding: '16px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', maxWidth: '340px' }}>
      <Text size="xs" color="secondary" weight="semibold" style={{ marginBottom: '8px' }}>
        HEALTH STATUS OF TOOLING CELLS
      </Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Tool Room Bay 1</span>
          <Badge variant="success">Nominal</Badge>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>CNC Cell 04 (Spindle Warning)</span>
          <Badge variant="warning">Vibration</Badge>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Press 2000T Hydraulic Pack</span>
          <Badge variant="danger">NC-4081 Stoppage</Badge>
        </div>
      </div>
    </div>
  ),
};

// 4. Disabled Decommissioned Nodes
export const DisabledDecommissionedNodes: Story = {
  render: () => (
    <div style={{ padding: '16px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', maxWidth: '340px' }}>
      <Text size="xs" color="secondary" weight="semibold" style={{ marginBottom: '8px' }}>
        LEGACY CHAKAN ASSETS (DECOMMISSIONED)
      </Text>
      <div style={{ fontSize: '13px', color: '#64748B', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div>🔒 Bay 0: Old Mechanical Shearing Line (Scrapped 2024)</div>
        <div>🔒 Line 01 Manual Punch Press (Offline)</div>
      </div>
    </div>
  ),
};
