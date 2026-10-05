import {
Badge,
Button
} from '@ds/react';
import type { Meta,StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'Navigation Systems/06 Menu Navigation',
  parameters: {
    docs: {
      description: {
        component:
          '**Transient Popover Menu Navigation System (§01–§14)**\n\n' +
          'Provides on-demand popover destination menus for fast contextual jumping and secondary routing.\n' +
          'Owns disclosure semantics, focus entrapment & return, and grouped link destinations.\n\n' +
          '**Composition Contract:**\n' +
          '- **Required:** `Menu`, `MenuList`, `Link`\n' +
          '- **Optional:** `Button`, `IconButton`, `Icon`, `Divider`\n\n' +
          '*Scenario:* **Plant Operations Quick Jump Menu** at **Suryodaya Autocomp Ltd (PL-04 Chakan, Pune)**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// 1. Plant Context Jump Menu
export const PlantContextJumpMenu: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <div style={{ padding: '24px', minHeight: '320px' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Button variant="primary" onClick={() => setOpen(!open)}>
            Jump to Facility Destination ▾
          </Button>

          {open && (
            <div
              role="menu"
              style={{
                position: 'absolute',
                top: '44px',
                left: 0,
                width: '260px',
                background: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                padding: '6px',
                zIndex: 100,
              }}
            >
              <div style={{ padding: '6px 10px', fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                SURYODAYA SITES
              </div>
              <a
                href="#pl04"
                role="menuitem"
                style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', fontSize: '13px', color: '#1D4ED8', background: '#EFF6FF', borderRadius: '4px', textDecoration: 'none', fontWeight: 600 }}
              >
                <span>Chakan Press (PL-04)</span>
                <Badge variant="brand">Current</Badge>
              </a>
              <a
                href="#pl01"
                role="menuitem"
                style={{ display: 'block', padding: '8px 10px', fontSize: '13px', color: '#334155', textDecoration: 'none' }}
              >
                Pune Machine Bay (PL-01)
              </a>
              <a
                href="#pl07"
                role="menuitem"
                style={{ display: 'block', padding: '8px 10px', fontSize: '13px', color: '#334155', textDecoration: 'none' }}
              >
                Sanand Assembly Hub (PL-07)
              </a>
            </div>
          )}
        </div>
      </div>
    );
  },
};

// 2. Work Order Quick Destinations
export const WorkOrderQuickDestinations: Story = {
  render: () => (
    <div style={{ maxWidth: '260px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ padding: '6px 10px', fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
        WORK ORDER WO-99124 JUMPS
      </div>
      <a href="#routing" style={{ display: 'block', padding: '8px 10px', fontSize: '13px', color: '#0F172A', textDecoration: 'none' }}>
        📋 Routing Sheet (Op 10–Op 40)
      </a>
      <a href="#nc-escalate" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', fontSize: '13px', color: '#0F172A', textDecoration: 'none' }}>
        <span>⚠️ NC Escalation Log</span>
        <Badge variant="danger">1 Open</Badge>
      </a>
      <a href="#supplier" style={{ display: 'block', padding: '8px 10px', fontSize: '13px', color: '#0F172A', textDecoration: 'none' }}>
        🏭 Supplier Dossier (Kalyani)
      </a>
    </div>
  ),
};

// 3. With Group Dividers And Icons
export const WithGroupDividersAndIcons: Story = {
  render: () => (
    <div style={{ maxWidth: '260px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '6px' }}>
      <div style={{ padding: '6px 10px', fontSize: '11px', color: '#64748B', fontWeight: 600 }}>OPERATOR SHORTCUTS</div>
      <a href="#log" style={{ display: 'block', padding: '7px 10px', fontSize: '13px', color: '#0F172A', textDecoration: 'none' }}>⏱️ Record Shift Log</a>
      <a href="#scrap" style={{ display: 'block', padding: '7px 10px', fontSize: '13px', color: '#0F172A', textDecoration: 'none' }}>📦 Log Scrap Count</a>

      <div style={{ height: '1px', background: '#E2E8F0', margin: '4px 0' }} />

      <div style={{ padding: '6px 10px', fontSize: '11px', color: '#64748B', fontWeight: 600 }}>QUALITY AUDIT</div>
      <a href="#cmm" style={{ display: 'block', padding: '7px 10px', fontSize: '13px', color: '#0F172A', textDecoration: 'none' }}>🔬 CMM Inspection Portal</a>
    </div>
  ),
};

// 4. Danger Zone Navigation
export const DangerZoneNavigation: Story = {
  render: () => (
    <div style={{ maxWidth: '260px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '6px' }}>
      <a href="#reassign" style={{ display: 'block', padding: '8px 10px', fontSize: '13px', color: '#0F172A', textDecoration: 'none' }}>Reassign Shift Team</a>
      <div style={{ height: '1px', background: '#E2E8F0', margin: '4px 0' }} />
      <a href="#halt" style={{ display: 'block', padding: '8px 10px', fontSize: '13px', color: '#b91c1c', fontWeight: 600, textDecoration: 'none' }}>
        🛑 Emergency Halt Line 2
      </a>
    </div>
  ),
};
