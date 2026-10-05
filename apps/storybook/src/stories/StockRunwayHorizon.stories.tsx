/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- horizontally scrollable data table region */
import {
IntercompanyStockRibbon,
LeadTimeTransferGlyph,
StockRunwayHorizon
} from '@ds/react';
import type { Meta,StoryObj } from '@storybook/react';
import { useState } from 'react';
import './StockRunwayHorizon.stories.css';

const meta: Meta<typeof StockRunwayHorizon> = {
  title: 'Data Visualization/Stock Runway Horizon',
  component: StockRunwayHorizon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '24px micro-horizontal SVG visualization bar rendered inline within matrix rows: Segment 1 (Green safe stock days), Segment 2 (Yellow reorder threshold zone), and Vertical Marker (Red zero-stockout event date). Accompanied by LeadTimeTransferGlyph and IntercompanyStockRibbon for multi-facility stock visibility.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof StockRunwayHorizon>;

export const Default: Story = {
  render: () => {
    const [stoNotice, setStoNotice] = useState<string | null>(null);

    const materials = [
      {
        code: 'RAW-EXT-ASH-05',
        name: 'Ashwagandha Root Extract 2.5%',
        plant: 'Asclepius F-119',
        safeDays: 12,
        reorderDays: 6,
        stockoutDay: 18,
        reorderDate: 'Oct 14',
        stockoutDate: 'Oct 20',
        qty: 350,
        uom: 'KG',
        burnRate: 20,
        glyphOrigin: 'H-9',
        glyphDest: 'F-119',
        transitHours: 4,
        transitStatus: 'IN_TRANSIT' as const,
      },
      {
        code: 'RAW-ING-AML-109',
        name: 'Organic Amla Pulp Concentrate',
        plant: 'Asclepius F-119',
        safeDays: 20,
        reorderDays: 6,
        stockoutDay: 26,
        reorderDate: 'Oct 22',
        stockoutDate: 'Oct 28',
        qty: 850,
        uom: 'KG',
        burnRate: 35,
        glyphOrigin: 'H-9',
        glyphDest: 'F-119',
        transitHours: 6,
        transitStatus: 'SCHEDULED' as const,
      },
      {
        code: 'RAW-BOT-1000ML',
        name: 'Amber Glass Bottles 1000ml Type III',
        plant: 'Asclepius F-119',
        safeDays: 4,
        reorderDays: 4,
        stockoutDay: 8,
        reorderDate: 'Oct 06',
        stockoutDate: 'Oct 10',
        qty: 1200,
        uom: 'Btl',
        burnRate: 200,
        glyphOrigin: 'Nashik-WH',
        glyphDest: 'F-119',
        transitHours: 8,
        transitStatus: 'DELAYED' as const,
      },
    ];

    return (
      <div style={{ padding: '32px', minHeight: '600px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div>
          <h2 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 700 }}>
            Intercompany Stock Runway & Transit Monitoring
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
            Consolidated 4-metric balance strip, road-transfer glyphs (H-9 ➔ F-119 [4h]), and inline 24px micro-SVG stock runway horizons.
          </p>
        </div>

        {/* 1. Intercompany Stock Ribbon (Top Balance Strip) */}
        <IntercompanyStockRibbon
          onRequestTransfer={() => setStoNotice('STO Transfer Request initiated: STO-2026-9901 dispatched to RM Warehouse H-9.')}
          onViewDetails={() => setStoNotice('Viewing Intercompany Transit Manifest for Asclepius F-119.')}
        />

        {stoNotice && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '6px',
              background: '#EFF6FF',
              border: '1px solid #3B82F6',
              color: '#1D4ED8',
              fontSize: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>ℹ️ {stoNotice}</span>
            <button
              onClick={() => setStoNotice(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1D4ED8', fontWeight: 'bold' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* 2. Inline Grid Table with 24px Micro-Horizontal SVG Bars and Transfer Glyphs */}
        <div
          style={{
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            overflow: 'hidden',
            background: '#FFFFFF',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              background: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0',
              fontWeight: 700,
              fontSize: '13px',
              color: '#1E293B',
            }}
          >
            Material Coverage & Replenishment Pipeline (30-Day Horizon)
          </div>

          <p className="ds-stock-story-scroll-hint">Scroll the table horizontally to view all material metrics.</p>
          <div className="ds-stock-story-table-scroll" role="region" aria-label="Material coverage table; scroll horizontally for all metrics" tabIndex={0}>
          <table className="ds-stock-story-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F1F5F9', color: '#475569', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 16px' }}>Material / SKU</th>
                <th style={{ padding: '10px 16px' }}>On-Hand Qty</th>
                <th style={{ padding: '10px 16px', width: '260px' }}>Stock Runway (24px SVG Horizon)</th>
                <th style={{ padding: '10px 16px' }}>Intercompany Transit</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m) => (
                <tr key={m.code} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, fontFamily: 'monospace', color: '#2563EB' }}>{m.code}</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>{m.name}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 600 }}>
                    {m.qty} {m.uom}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <StockRunwayHorizon
                      safeDays={m.safeDays}
                      reorderDays={m.reorderDays}
                      stockoutDay={m.stockoutDay}
                      reorderPointDateLabel={m.reorderDate}
                      stockoutDateLabel={m.stockoutDate}
                      currentStockQty={m.qty}
                      uom={m.uom}
                      dailyBurnRate={m.burnRate}
                      height={24}
                    />
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <LeadTimeTransferGlyph
                      origin={m.glyphOrigin}
                      destination={m.glyphDest}
                      transitHours={m.transitHours}
                      status={m.transitStatus}
                      materialName={m.name}
                      quantity={`${m.burnRate * 10} ${m.uom}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div className="ds-stock-story-mobile-list">
            {materials.map((m) => (
              <article className="ds-stock-story-mobile-row" key={m.code}>
                <div className="ds-stock-story-mobile-material">
                  <strong>{m.code}</strong>
                  <span>{m.name}</span>
                </div>
                <div className="ds-stock-story-mobile-field">
                  <span>On hand</span>
                  <strong>{m.qty} {m.uom}</strong>
                </div>
                <div className="ds-stock-story-mobile-field ds-stock-story-mobile-field--runway">
                  <span>Stock runway · 30 days</span>
                  <StockRunwayHorizon
                    safeDays={m.safeDays}
                    reorderDays={m.reorderDays}
                    stockoutDay={m.stockoutDay}
                    reorderPointDateLabel={m.reorderDate}
                    stockoutDateLabel={m.stockoutDate}
                    currentStockQty={m.qty}
                    uom={m.uom}
                    dailyBurnRate={m.burnRate}
                    height={24}
                  />
                </div>
                <div className="ds-stock-story-mobile-field">
                  <span>Intercompany transit</span>
                  <LeadTimeTransferGlyph
                    origin={m.glyphOrigin}
                    destination={m.glyphDest}
                    transitHours={m.transitHours}
                    status={m.transitStatus}
                    materialName={m.name}
                    quantity={`${m.burnRate * 10} ${m.uom}`}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
  },
};
