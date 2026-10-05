import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TreeGridCell,
  Badge,
} from '@ds/react';

const meta: Meta = {
  title: 'Components/Data/Table',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

const sampleData = [
  { id: 'ST-01', name: 'Hydraulic Stamping Ram', status: 'Optimal', temp: '44.2°C', oee: '98.5%' },
  { id: 'ST-02', name: '5-Axis Spindle Motor', status: 'Warning', temp: '78.1°C', oee: '91.2%' },
  { id: 'ST-03', name: 'Robotic Weld Cell Alpha', status: 'Optimal', temp: '52.0°C', oee: '99.1%' },
  { id: 'ST-04', name: 'Optical CMM Inspection', status: 'Fault', temp: '22.0°C', oee: '0.0%' },
];

export const Default: Story = {
  render: () => (
    <div style={{ padding: '24px', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
            <th style={{ padding: '10px 12px' }}>STATION ID</th>
            <th style={{ padding: '10px 12px' }}>EQUIPMENT NAME</th>
            <th style={{ padding: '10px 12px' }}>STATUS</th>
            <th style={{ padding: '10px 12px' }}>TEMP</th>
            <th style={{ padding: '10px 12px' }}>OEE</th>
          </tr>
        </thead>
        <tbody>
          {sampleData.map(r => (
            <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '10px 12px', fontWeight: 600 }}>{r.id}</td>
              <td style={{ padding: '10px 12px' }}>{r.name}</td>
              <td style={{ padding: '10px 12px' }}>
                <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, backgroundColor: r.status === 'Optimal' ? '#DCFCE7' : r.status === 'Warning' ? '#FEF3C7' : '#FEE2E2', color: r.status === 'Optimal' ? '#15803D' : r.status === 'Warning' ? '#B45309' : '#B91C1C' }}>
                  {r.status}
                </span>
              </td>
              <td style={{ padding: '10px 12px' }}>{r.temp}</td>
              <td style={{ padding: '10px 12px', fontWeight: 600 }}>{r.oee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

export const StripedRows: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #CBD5E1' }}>
            <th style={{ padding: '8px 12px', textAlign: 'left' }}>Asset</th>
            <th style={{ padding: '8px 12px', textAlign: 'left' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {sampleData.map((r, i) => (
            <tr key={r.id} style={{ backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
              <td style={{ padding: '8px 12px' }}>{r.name}</td>
              <td style={{ padding: '8px 12px' }}>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

export const CompactDensity: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
        <tbody>
          {sampleData.map(r => (
            <tr key={r.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
              <td style={{ padding: '4px 8px', fontWeight: 600 }}>{r.id}</td>
              <td style={{ padding: '4px 8px' }}>{r.name}</td>
              <td style={{ padding: '4px 8px' }}>{r.oee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

export const SelectableRows: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <tbody>
          {sampleData.map((r, i) => (
            <tr key={r.id} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: i === 0 ? '#EFF6FF' : 'transparent' }}>
              <td style={{ padding: '10px 12px' }}><input type="checkbox" aria-label={`Select ${r.id}`} defaultChecked={i === 0} /></td>
              <td style={{ padding: '10px 12px', fontWeight: 600 }}>{r.id}</td>
              <td style={{ padding: '10px 12px' }}>{r.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

export const EmptyStateTable: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #CBD5E1' }}>
            <th style={{ padding: '8px 12px', textAlign: 'left' }}>Work Order</th>
            <th style={{ padding: '8px 12px', textAlign: 'left' }}>Lead</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={2} style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>
              No active work orders for current filter criteria.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

interface BomNode {
  id: string;
  name: string;
  sku: string;
  level: number;
  qty: string;
  uom: string;
  facility: string;
  type: 'finished' | 'bulk' | 'active-rm' | 'raw' | 'packaging';
  children?: BomNode[];
}

const mockBomData: BomNode[] = [
  {
    id: 'bom-0',
    name: 'Immunity Booster Nutritional Syrup (500ml Bottle)',
    sku: 'FG-SYR-500-IMM',
    level: 0,
    qty: '3,000',
    uom: 'Packs',
    facility: 'Plant Food F-119',
    type: 'finished',
    children: [
      {
        id: 'bom-1-1',
        name: 'Bulk Herbal Formulation Blend (Batch B-901)',
        sku: 'BLK-FRM-HERB-901',
        level: 1,
        qty: '900.00',
        uom: 'Liters',
        facility: 'Plant Food F-119',
        type: 'bulk',
        children: [
          {
            id: 'bom-2-1',
            name: 'Withania Somnifera (Ashwagandha) Root Extract 5% Withanolides (HPLC)',
            sku: 'RAW-EXT-ASH-05-9921',
            level: 2,
            qty: '150.00',
            uom: 'KG',
            facility: 'RM Warehouse H-9',
            type: 'active-rm',
            children: [
              {
                id: 'bom-3-1',
                name: 'Crude Ashwagandha Dried Roots (Grade A Organic)',
                sku: 'RM-ROOT-ASH-CRD',
                level: 3,
                qty: '3,000.00',
                uom: 'KG',
                facility: 'RM Warehouse H-9',
                type: 'raw',
              },
              {
                id: 'bom-3-2',
                name: 'Aqueous Extraction Solvent (Food Grade 70%)',
                sku: 'SOL-ETH-70-FD',
                level: 3,
                qty: '1,200.00',
                uom: 'Liters',
                facility: 'RM Warehouse F-25',
                type: 'raw',
              },
            ],
          },
          {
            id: 'bom-2-2',
            name: 'Purified Aqueous Carrier & Certified Natural Syrup Base',
            sku: 'RAW-CARRIER-AQ-01',
            level: 2,
            qty: '750.00',
            uom: 'Liters',
            facility: 'Plant Food F-119',
            type: 'bulk',
          },
        ],
      },
      {
        id: 'bom-1-2',
        name: 'HDPE Amber Bottle 500ml with Tamper Seal Dropper Cap',
        sku: 'PKG-BOT-500-AMB',
        level: 1,
        qty: '3,050',
        uom: 'Units',
        facility: 'Plant Food F-119',
        type: 'packaging',
      },
    ],
  },
];

/**
 * TreeGridBillOfMaterials: Multi-level nested BOM pegging tree with WAI-ARIA keyboard navigation.
 */
export const TreeGridBillOfMaterials: Story = {
  render: () => {
    const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
      'bom-0': true,
      'bom-1-1': true,
      'bom-2-1': true,
    });

    const toggleNode = (id: string, expanded: boolean) => {
      setExpandedNodes((prev) => ({ ...prev, [id]: expanded }));
    };

    const renderRows = (nodes: BomNode[]): React.ReactNode => {
      return nodes.map((node) => {
        const isExpanded = !!expandedNodes[node.id];
        const hasChildren = !!node.children && node.children.length > 0;

        return (
          <React.Fragment key={node.id}>
            <TableRow>
              <TreeGridCell
                level={node.level}
                expanded={isExpanded}
                hasChildren={hasChildren}
                onToggle={(exp) => toggleNode(node.id, exp)}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{node.name}</span>
                  <span style={{ fontSize: '11px', color: '#64748B', fontFamily: 'monospace' }}>
                    {node.sku}
                  </span>
                </div>
              </TreeGridCell>
              <TableCell align="right" style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                {node.qty} {node.uom}
              </TableCell>
              <TableCell>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    background: node.facility.includes('Warehouse') ? '#FEF3C7' : '#E0F2FE',
                    color: node.facility.includes('Warehouse') ? '#92400E' : '#0369A1',
                  }}
                >
                  {node.facility}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    node.type === 'finished'
                      ? 'brand'
                      : node.type === 'active-rm'
                      ? 'warning'
                      : 'neutral'
                  }
                >
                  {node.type.toUpperCase()}
                </Badge>
              </TableCell>
            </TableRow>
            {hasChildren && isExpanded && renderRows(node.children!)}
          </React.Fragment>
        );
      });
    };

    return (
      <div style={{ padding: '24px', maxWidth: '1000px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
            Hierarchical Bill-of-Materials (BOM) Requirements Pegging
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>
            Multi-tier supply chain traceability between Asclepius (Food F-119) and Anantshriveda (RM Warehouse H-9).
            Use arrow keys (<kbd>→</kbd> expand, <kbd>←</kbd> collapse) on chevrons.
          </p>
        </div>

        <Table density="compact" bordered hoverable>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: '55%' }}>MATERIAL / SUB-ASSEMBLY</TableHead>
              <TableHead align="right" style={{ width: '15%' }}>PEGGED QTY</TableHead>
              <TableHead style={{ width: '20%' }}>OPERATING FACILITY</TableHead>
              <TableHead style={{ width: '10%' }}>TIER</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderRows(mockBomData)}</TableBody>
        </Table>
      </div>
    );
  },
};
