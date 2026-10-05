import React, { useState, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  TimePhasedMatrix,
  TimePhasedMatrixRow,
  TimePhasedPeriod,
  TimeHorizonStepper,
  TimeHorizonBucket,
  StaleDataPill,
  Badge,
} from '@ds/react';

const meta: Meta<typeof TimePhasedMatrix> = {
  title: 'Composites/TimePhasedMatrix',
  component: TimePhasedMatrix,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;
type Story = StoryObj<typeof TimePhasedMatrix>;

// Sample periods with 3 shifts per day (Morning, Evening, Night)
const createPeriods = (days = 7, mode: TimeHorizonBucket = 'shift', baseOffsetDays = 0): TimePhasedPeriod[] => {
  const result: TimePhasedPeriod[] = [];
  const baseDate = new Date(2026, 9, 14); // Oct 14, 2026
  baseDate.setDate(baseDate.getDate() + baseOffsetDays);

  for (let i = 0; i < days; i++) {
    const cur = new Date(baseDate);
    cur.setDate(baseDate.getDate() + i);
    const dateStr = cur.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (mode === 'shift') {
      result.push({
        id: `d-${baseOffsetDays + i}`,
        label: `${dateStr} (${cur.toLocaleDateString('en-US', { weekday: 'short' })})`,
        shifts: [
          { id: `s1`, label: 'S1 (06-14)', key: `d${baseOffsetDays + i}_s1` },
          { id: `s2`, label: 'S2 (14-22)', key: `d${baseOffsetDays + i}_s2` },
          { id: `s3`, label: 'S3 (22-06)', key: `d${baseOffsetDays + i}_s3` },
        ],
      });
    } else if (mode === 'day') {
      result.push({
        id: `d-${baseOffsetDays + i}`,
        label: dateStr,
        shifts: [{ id: `tot`, label: 'Total Planned', key: `d${baseOffsetDays + i}_tot` }],
      });
    } else if (mode === 'week') {
      if (i % 7 === 0) {
        result.push({
          id: `w-${Math.floor((baseOffsetDays + i) / 7)}`,
          label: `Week ${Math.floor((baseOffsetDays + i) / 7) + 1} (${dateStr})`,
          shifts: [
            { id: `w_req`, label: 'Gross Demand', key: `w${baseOffsetDays + i}_req` },
            { id: `w_rec`, label: 'Planned Receipts', key: `w${baseOffsetDays + i}_rec` },
          ],
        });
      }
    } else {
      // month
      if (i % 28 === 0) {
        result.push({
          id: `m-${Math.floor((baseOffsetDays + i) / 28)}`,
          label: `Month ${Math.floor((baseOffsetDays + i) / 28) + 1}`,
          shifts: [
            { id: `m_dem`, label: 'Demand Plan', key: `m${baseOffsetDays + i}_dem` },
            { id: `m_sup`, label: 'Supply MPS', key: `m${baseOffsetDays + i}_sup` },
          ],
        });
      }
    }
  }
  return result;
};

// Manufacturing Dataset for Asclepius & Anantshriveda
const generateMockRows = (count: number, periods: TimePhasedPeriod[]): TimePhasedMatrixRow[] => {
  const botanicals = [
    { sku: 'RM-BOT-014', name: 'Ashwagandha Extract 2.5%', cat: 'Active Botanical Extracts', uom: 'KG', conv: 20, secUom: 'Pk' },
    { sku: 'RM-BOT-022', name: 'Giloy Aqueous Standardized', cat: 'Hydro-alcoholic Extracts', uom: 'L', conv: 2, secUom: 'Btl' },
    { sku: 'RM-BOT-008', name: 'Brahmi Whole Leaf Shredded', cat: 'Crude Botanicals', uom: 'KG', conv: 10, secUom: 'Pk' },
    { sku: 'RM-ING-109', name: 'Organic Amla Pulp Concentrate', cat: 'Fruit Concentrates', uom: 'KG', conv: 5, secUom: 'Can' },
    { sku: 'RM-CHM-045', name: 'Ascorbic Acid (Vitamin C) USP', cat: 'Nutraceutical Actives', uom: 'KG', conv: 25, secUom: 'Pk' },
    { sku: 'RM-ING-201', name: 'Organic Jaggery Granules Base', cat: 'Carriers & Sweeteners', uom: 'KG', conv: 50, secUom: 'Bag' },
    { sku: 'RM-CHM-012', name: 'Sodium Benzoate Food Grade', cat: 'Preservatives', uom: 'KG', conv: 25, secUom: 'Pk' },
    { sku: 'PKG-PRI-088', name: '500ml HDPE Amber Bottles', cat: 'Primary Packaging', uom: 'Ea', conv: 1, secUom: 'Ea' },
    { sku: 'PKG-SEC-019', name: '28mm Induction Seal Caps', cat: 'Closures & Liners', uom: 'Ea', conv: 1, secUom: 'Ea' },
    { sku: 'FG-AYU-501', name: 'Immuno-Doc Ras 500ml Retail', cat: 'Finished Herbal Tonic', uom: 'Btl', conv: 0.5, secUom: 'L' },
    { sku: 'FG-AYU-502', name: 'Dibo-Doc Decoction 1000ml', cat: 'Finished Ayurvedic Decoction', uom: 'Btl', conv: 1, secUom: 'L' },
    { sku: 'FG-AYU-503', name: 'Orthodoc Joint Care Oil 200ml', cat: 'Medicated Oils', uom: 'Btl', conv: 0.2, secUom: 'L' },
  ];

  const shiftKeys = periods.flatMap((p) => p.shifts.map((s) => s.key));
  const rows: TimePhasedMatrixRow[] = [];

  for (let i = 0; i < count; i++) {
    const template = botanicals[i % botanicals.length];
    const skuCode = count > botanicals.length ? `${template.sku}-${String(Math.floor(i / botanicals.length) + 1).padStart(3, '0')}` : template.sku;
    const baseStock = Math.floor(100 + (Math.sin(i * 1.5) + 1) * 2500);

    const cells: Record<string, { value: number; type?: 'planned' | 'actual' | 'projected'; isDeficit?: boolean }> = {};
    let rollingStock = baseStock;

    shiftKeys.forEach((key, shiftIdx) => {
      // Generate realistic shift consumption and scheduled receipt batches
      const isShiftReceipt = (i + shiftIdx) % 7 === 0;
      const consumption = Math.floor(40 + (Math.cos(i + shiftIdx) + 1) * 80);
      const receipt = isShiftReceipt ? Math.floor(300 + (i % 5) * 150) : 0;
      rollingStock = rollingStock - consumption + receipt;

      const isDeficit = rollingStock < 0;
      cells[key] = {
        value: rollingStock,
        type: isShiftReceipt ? 'planned' : 'actual',
        isDeficit,
      };
    });

    rows.push({
      id: `row-${i}`,
      sku: skuCode,
      name: count > botanicals.length ? `${template.name} (Batch Lot ${i + 1})` : template.name,
      category: template.cat,
      primaryStock: baseStock,
      primaryUom: template.uom,
      secondaryStock: Math.round(baseStock * template.conv),
      secondaryUom: template.secUom,
      cells,
    });
  }

  return rows;
};

export const ProductionPlannerMatrix: Story = {
  render: () => {
    const [bucket, setBucket] = useState<TimeHorizonBucket>('shift');
    const [selectedRowId, setSelectedRowId] = useState<string>('row-0');
    const [lastSync] = useState(new Date(Date.now() - 3.5 * 60 * 1000));
    const [dayOffset, setDayOffset] = useState(0);
    const [activeShift, setActiveShift] = useState(1);

    const periods = useMemo(() => createPeriods(7, bucket, dayOffset), [bucket, dayOffset]);
    const data = useMemo(() => generateMockRows(25, periods), [periods]);

    const handlePrev = () => {
      if (bucket === 'shift') {
        if (activeShift > 1) {
          setActiveShift((s) => s - 1);
        } else {
          setActiveShift(3);
          setDayOffset((d) => Math.max(0, d - 1));
        }
      } else if (bucket === 'day') {
        setDayOffset((d) => Math.max(0, d - 1));
      } else if (bucket === 'week') {
        setDayOffset((d) => Math.max(0, d - 7));
      } else {
        setDayOffset((d) => Math.max(0, d - 28));
      }
    };

    const handleNext = () => {
      if (bucket === 'shift') {
        if (activeShift < 3) {
          setActiveShift((s) => s + 1);
        } else {
          setActiveShift(1);
          setDayOffset((d) => d + 1);
        }
      } else if (bucket === 'day') {
        setDayOffset((d) => d + 1);
      } else if (bucket === 'week') {
        setDayOffset((d) => d + 7);
      } else {
        setDayOffset((d) => d + 28);
      }
    };

    const handleJumpToday = () => {
      setDayOffset(0);
      setActiveShift(1);
    };

    const curDate = new Date(2026, 9, 14);
    curDate.setDate(curDate.getDate() + dayOffset);
    const dateStr = curDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

    const currentHorizonLabel =
      bucket === 'shift'
        ? `${dateStr} · Shift ${activeShift}`
        : bucket === 'day'
        ? dateStr
        : bucket === 'week'
        ? `Week ${Math.floor(dayOffset / 7) + 1} (${dateStr})`
        : `Month ${Math.floor(dayOffset / 28) + 1} (${curDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})`;

    return (
      <div style={{ height: '80vh', padding: '16px', background: '#F9FAFB', display: 'flex', flexDirection: 'column' }}>
        <TimePhasedMatrix
          data={data}
          periods={periods}
          selectedRowId={selectedRowId}
          onSelectRow={(r) => setSelectedRowId(r.id)}
          toolbarContent={
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>
                  Asclepius Food F-119 · Multi-Shift Schedule
                </span>
                <StaleDataPill
                  lastSyncTime={lastSync}
                  staleThresholdMinutes={5}
                  title="MES SCADA Sync"
                  onRefresh={() => alert('Triggering ERP MES live sync...')}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TimeHorizonStepper
                  bucketSize={bucket}
                  onBucketSizeChange={(b) => {
                    setBucket(b);
                    setDayOffset(0);
                    setActiveShift(1);
                  }}
                  currentHorizonLabel={currentHorizonLabel}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  onJumpToday={handleJumpToday}
                  jumpTodayLabel="Today / Shift 1"
                />
              </div>
            </>
          }
        />
      </div>
    );
  },
};

export const VirtualScrollStressTest10kRows: Story = {
  render: () => {
    const [bucket, setBucket] = useState<TimeHorizonBucket>('shift');
    const [selectedRowId, setSelectedRowId] = useState<string>('row-42');
    const [dayOffset, setDayOffset] = useState(0);
    const [activeShift, setActiveShift] = useState(1);

    const periods = useMemo(() => createPeriods(14, bucket, dayOffset), [bucket, dayOffset]);

    // 10,000 row high-density manufacturing ERP stress test dataset
    const data = useMemo(() => generateMockRows(10000, periods), [periods]);

    const handlePrev = () => {
      if (bucket === 'shift') {
        if (activeShift > 1) {
          setActiveShift((s) => s - 1);
        } else {
          setActiveShift(3);
          setDayOffset((d) => Math.max(0, d - 1));
        }
      } else if (bucket === 'day') {
        setDayOffset((d) => Math.max(0, d - 1));
      } else if (bucket === 'week') {
        setDayOffset((d) => Math.max(0, d - 7));
      } else {
        setDayOffset((d) => Math.max(0, d - 28));
      }
    };

    const handleNext = () => {
      if (bucket === 'shift') {
        if (activeShift < 3) {
          setActiveShift((s) => s + 1);
        } else {
          setActiveShift(1);
          setDayOffset((d) => d + 1);
        }
      } else if (bucket === 'day') {
        setDayOffset((d) => d + 1);
      } else if (bucket === 'week') {
        setDayOffset((d) => d + 7);
      } else {
        setDayOffset((d) => d + 28);
      }
    };

    const handleJumpToday = () => {
      setDayOffset(0);
      setActiveShift(1);
    };

    const curDate = new Date(2026, 9, 14);
    curDate.setDate(curDate.getDate() + dayOffset);
    const dateStr = curDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

    const currentHorizonLabel =
      bucket === 'shift'
        ? `${dateStr} · Shift ${activeShift}`
        : bucket === 'day'
        ? dateStr
        : bucket === 'week'
        ? `Week ${Math.floor(dayOffset / 7) + 1} (${dateStr})`
        : `Month ${Math.floor(dayOffset / 28) + 1} (${curDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})`;

    return (
      <div style={{ height: '90vh', padding: '16px', background: '#F9FAFB', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
              ⚡ 10,000-Row Virtualized Stress Test
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#4B5563' }}>
              Dataset: 10,000 SKUs × 42 Shift Buckets = 420,000 Data Points. Performance Budget: Max ~40-60 active DOM rows.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Badge variant="success">Total Records: 10,000</Badge>
            <Badge variant="neutral">Active DOM Rows: ~35</Badge>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0 }}>
          <TimePhasedMatrix
            data={data}
            periods={periods}
            selectedRowId={selectedRowId}
            onSelectRow={(r) => setSelectedRowId(r.id)}
            toolbarContent={
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Anantshriveda RM Central Depot (H-9 & F-25)</span>
                </div>
                <TimeHorizonStepper
                  bucketSize={bucket}
                  onBucketSizeChange={(b) => {
                    setBucket(b);
                    setDayOffset(0);
                    setActiveShift(1);
                  }}
                  currentHorizonLabel={currentHorizonLabel}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  onJumpToday={handleJumpToday}
                  jumpTodayLabel="Today / Shift 1"
                />
              </div>
            }
          />
        </div>
      </div>
    );
  },
};
