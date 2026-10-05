/**
 * Meridian Design System — Shared Visualization Infrastructure Engine (viz-core)
 *
 * Provides the 10 foundational systems for all chart and visualization components:
 * 1. Plot Region (bounds, margins, coordinate math, layer stacking)
 * 2. Scale Engine (band, linear, log, temporal, sequential, diverging, sqrt area)
 * 3. Axis Engine (tick generation, label formatting, decimation, collision)
 * 4. Legend Engine (categorical swatches, continuous gradient ramps, isolation)
 * 5. Label Engine (positioning, anchoring, collision avoidance)
 * 6. Annotation Engine (data callouts, range highlights, non-visual description)
 * 7. Reference Indicator Engine (baselines, targets, UCL/LCL control limits, bands)
 * 8. Color Encoding Engine (categorical --viz-1..6, semantic status, SVG hatch patterns)
 * 9. Data Interaction Engine (inspection vs operation, roving tabindex, dragging alternatives)
 * 10. Visualization State Engine (skeleton sweeps, empty vs null, partial telemetry)
 */

/* ==========================================================================
   1. COLOR ENCODING & PATTERNS
   ========================================================================== */

export const VIZ_COLORS = [
  'var(--viz-1, #2563eb)',
  'var(--viz-2, #0d9488)',
  'var(--viz-3, #d97706)',
  'var(--viz-4, #7c3aed)',
  'var(--viz-5, #db2777)',
  'var(--viz-6, #4b5563)',
];

export const VIZ_SEMANTIC_COLORS = {
  critical: 'var(--status-critical-solid, #ef4444)',
  warning: 'var(--status-warning-solid, #f59e0b)',
  success: 'var(--status-success-solid, #10b981)',
  info: 'var(--action-solid, #2563eb)',
  neutral: 'var(--border-strong, #64748b)'
};

export const PATTERN_PRESETS = [
  { id: 'pat-diagonal', name: 'Diagonal Lines', transform: 'rotate(45 0 0)', strokeWidth: 1.5, stroke: 'rgba(255,255,255,0.35)' },
  { id: 'pat-dots', name: 'Stippled Dots', type: 'circle', r: 1.2, fill: 'rgba(255,255,255,0.45)' },
  { id: 'pat-cross', name: 'Crosshatch', strokeWidth: 1, stroke: 'rgba(255,255,255,0.35)' },
  { id: 'pat-horizontal', name: 'Horizontal Stripe', strokeWidth: 1.5, stroke: 'rgba(255,255,255,0.35)' },
  { id: 'pat-vertical', name: 'Vertical Stripe', strokeWidth: 1.5, stroke: 'rgba(255,255,255,0.35)' },
  { id: 'pat-mesh', name: 'Diamond Mesh', transform: 'rotate(45 0 0)', strokeWidth: 1, stroke: 'rgba(255,255,255,0.3)' }
];

export const POINT_SYMBOLS = ['circle', 'square', 'diamond', 'triangle', 'cross', 'star'];

/* ==========================================================================
   2. NUMBER & LOCALE FORMATTING (en-IN & Shop-Floor Units)
   ========================================================================== */

export function formatVizValue(val, unit = '', locale = 'en-IN') {
  if (val == null || (typeof val === 'number' && isNaN(val))) return '—';
  const num = Number(val);

  if (unit === '₹' || unit === 'INR') {
    return `₹${num.toLocaleString(locale)}`;
  }
  if (unit === '%') {
    return `${num.toFixed(1)}%`;
  }
  if (unit === 'lakh' || unit === 'L') {
    return `₹${(num / 100000).toFixed(2)}L`;
  }
  if (unit === 'crore' || unit === 'Cr') {
    return `₹${(num / 10000000).toFixed(2)}Cr`;
  }
  const formatted = num.toLocaleString(locale);
  return unit ? `${formatted} ${unit}` : formatted;
}

/* ==========================================================================
   3. PLOT REGION & COORDINATE SYSTEM
   ========================================================================== */

export const LAYER_STACK = {
  BACKGROUND: 0,
  GRIDLINES_AND_BANDS: 10,
  MARKS_AND_FILLS: 20,
  REFERENCE_TARGETS: 30,
  ANNOTATIONS_AND_CROSSHAIR: 40,
  TOOLTIP_AND_OVERLAYS: 50
};

export function createPlotRegion({
  containerWidth = 600,
  containerHeight = 300,
  margins = { top: 16, right: 24, bottom: 36, left: 54 }
}) {
  const width = Math.max(10, containerWidth - margins.left - margins.right);
  const height = Math.max(10, containerHeight - margins.top - margins.bottom);

  return {
    containerWidth,
    containerHeight,
    margins,
    plotWidth: width,
    plotHeight: height,
    bounds: {
      left: margins.left,
      top: margins.top,
      right: margins.left + width,
      bottom: margins.top + height
    },
    toPlotX: (canvasX) => canvasX - margins.left,
    toPlotY: (canvasY) => canvasY - margins.top,
    toCanvasX: (plotX) => plotX + margins.left,
    toCanvasY: (plotY) => plotY + margins.top
  };
}

/* ==========================================================================
   4. SCALE ENGINE
   ========================================================================== */

// Categorical / Band Scale
export function createBandScale({
  domain = [],
  range = [0, 100],
  paddingInner = 0.2,
  paddingOuter = 0.1,
  align = 0.5
}) {
  const [r0, r1] = range;
  const rangeSpan = r1 - r0;
  const n = domain.length;

  if (n === 0) {
    const fn = () => r0;
    fn.bandwidth = () => 0;
    fn.step = () => 0;
    fn.domain = () => [];
    fn.range = () => range;
    return fn;
  }

  const step = rangeSpan / Math.max(1, n - paddingInner + 2 * paddingOuter);
  const start = r0 + step * paddingOuter;
  const bandwidth = step * (1 - paddingInner);

  const scaleFn = (value) => {
    const idx = domain.indexOf(value);
    if (idx === -1) return undefined;
    return start + idx * step;
  };

  scaleFn.bandwidth = () => bandwidth;
  scaleFn.step = () => step;
  scaleFn.domain = () => domain;
  scaleFn.range = () => range;
  scaleFn.type = 'band';

  return scaleFn;
}

// Linear Scale with optional baseline preservation
export function createLinearScale({
  domain = [0, 100],
  range = [100, 0],
  clamp = false,
  nice = true,
  baseline = 0
}) {
  let [d0, d1] = domain;
  if (baseline != null) {
    if (d0 > baseline) d0 = baseline;
    if (d1 < baseline) d1 = baseline;
  }
  if (d0 === d1) {
    d1 = d0 + 10;
  }

  const [r0, r1] = range;

  const scaleFn = (value) => {
    const num = Number(value);
    if (isNaN(num)) return undefined;
    let clamped = num;
    if (clamp) {
      const minD = Math.min(d0, d1);
      const maxD = Math.max(d0, d1);
      clamped = Math.max(minD, Math.min(maxD, num));
    }
    const ratio = (clamped - d0) / (d1 - d0 || 1);
    return r0 + ratio * (r1 - r0);
  };

  scaleFn.invert = (pos) => {
    const ratio = (pos - r0) / (r1 - r0 || 1);
    return d0 + ratio * (d1 - d0);
  };

  scaleFn.domain = () => [d0, d1];
  scaleFn.range = () => [r0, r1];
  scaleFn.baseline = () => baseline;
  scaleFn.type = 'linear';

  return scaleFn;
}

// Logarithmic Scale
export function createLogScale({
  domain = [1, 1000],
  range = [100, 0],
  base = 10,
  clamp = false
}) {
  const d0 = Math.max(1e-6, domain[0]);
  const d1 = Math.max(1e-6, domain[1]);
  const [r0, r1] = range;

  const log0 = Math.log(d0) / Math.log(base);
  const log1 = Math.log(d1) / Math.log(base);

  const scaleFn = (value) => {
    const num = Math.max(1e-6, Number(value));
    const logV = Math.log(num) / Math.log(base);
    const ratio = (logV - log0) / (log1 - log0 || 1);
    return r0 + ratio * (r1 - r0);
  };

  scaleFn.domain = () => [d0, d1];
  scaleFn.range = () => [r0, r1];
  scaleFn.type = 'log';

  return scaleFn;
}

// Sqrt Area Scale (preserves true visual circle/bubble area proportionality)
export function createAreaScale({
  domain = [0, 100],
  maxRadius = 24,
  minRadius = 3
}) {
  const [d0, d1] = domain;
  const maxSqrt = Math.sqrt(Math.max(0, d1));

  const scaleFn = (value) => {
    const num = Math.max(0, Number(value));
    const ratio = Math.sqrt(num) / (maxSqrt || 1);
    return minRadius + ratio * (maxRadius - minRadius);
  };

  scaleFn.domain = () => [d0, d1];
  scaleFn.range = () => [minRadius, maxRadius];
  scaleFn.type = 'area-sqrt';

  return scaleFn;
}

// Temporal / Time Scale
export function createTimeScale({
  domain = [new Date(2026, 0, 1), new Date(2026, 0, 2)],
  range = [0, 100]
}) {
  const t0 = new Date(domain[0]).getTime();
  const t1 = new Date(domain[1]).getTime();
  const [r0, r1] = range;

  const scaleFn = (dateValue) => {
    const t = new Date(dateValue).getTime();
    const ratio = (t - t0) / (t1 - t0 || 1);
    return r0 + ratio * (r1 - r0);
  };

  scaleFn.invert = (pos) => {
    const ratio = (pos - r0) / (r1 - r0 || 1);
    return new Date(t0 + ratio * (t1 - t0));
  };

  scaleFn.domain = () => [new Date(t0), new Date(t1)];
  scaleFn.range = () => [r0, r1];
  scaleFn.type = 'time';

  return scaleFn;
}

/* ==========================================================================
   5. AXIS ENGINE (Ticks, Gridlines, Collision)
   ========================================================================== */

export function generateTicks(scale, approximateCount = 5) {
  if (!scale) return [];
  if (scale.type === 'band') {
    return scale.domain();
  }

  if (scale.type === 'linear') {
    const [min, max] = scale.domain();
    if (min === max) return [min];

    const span = max - min;
    const rawStep = span / approximateCount;
    // Compute nice power of 10 step
    const power = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const fraction = rawStep / power;
    let niceMultiplier = 1;
    if (fraction >= 1.5 && fraction < 3) niceMultiplier = 2;
    else if (fraction >= 3 && fraction < 7) niceMultiplier = 5;
    else if (fraction >= 7) niceMultiplier = 10;

    const step = niceMultiplier * power;
    const start = Math.ceil(min / step) * step;
    const ticks = [];
    for (let v = start; v <= max + 1e-9; v += step) {
      ticks.push(Number(v.toFixed(6)));
    }
    return ticks;
  }

  if (scale.type === 'time') {
    const [d0, d1] = scale.domain();
    const t0 = d0.getTime();
    const t1 = d1.getTime();
    const step = (t1 - t0) / approximateCount;
    const ticks = [];
    for (let i = 0; i <= approximateCount; i++) {
      ticks.push(new Date(t0 + step * i));
    }
    return ticks;
  }

  return [];
}

/* ==========================================================================
   6. DATA INTERACTION & ACCESSIBILITY CONTROLS
   ========================================================================== */

export function createKeyboardRovingFocus({
  itemCount = 0,
  currentIndex = -1,
  onIndexChange = () => {},
  onSelect = () => {},
  onDismiss = () => {},
  onToggleTable = () => {}
}) {
  return function handleKeyDown(e) {
    if (itemCount === 0) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        onIndexChange((currentIndex + 1) % itemCount);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        onIndexChange((currentIndex - 1 + itemCount) % itemCount);
        break;
      case 'Home':
        e.preventDefault();
        onIndexChange(0);
        break;
      case 'End':
        e.preventDefault();
        onIndexChange(itemCount - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (currentIndex >= 0) onSelect(currentIndex);
        break;
      case 'Escape':
        e.preventDefault();
        onDismiss();
        break;
      case 'F11':
        if (e.altKey) {
          e.preventDefault();
          onToggleTable();
        }
        break;
      default:
        break;
    }
  };
}

/* ==========================================================================
   7. LINE & PATH INTERPOLATION ENGINE
   ========================================================================== */

export const STROKE_DASH_PATTERNS = ['none', '5 4', '8 4', '2 3', '6 3 2 3'];

export function createLinePath(points = [], interpolation = 'linear') {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  if (interpolation === 'step' || interpolation === 'step-after') {
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` H ${points[i].x} V ${points[i].y}`;
    }
    return path;
  }

  if (interpolation === 'step-before') {
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` V ${points[i].y} H ${points[i].x}`;
    }
    return path;
  }

  if (interpolation === 'monotone' || interpolation === 'smooth') {
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  }

  // Default: Linear polyline
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`;
  }
  return path;
}

/* ==========================================================================
   8. AREA & STACKING ENGINE
   ========================================================================== */

export function createAreaPath(upperPoints = [], lowerPoints = [], interpolation = 'linear') {
  if (!upperPoints || upperPoints.length === 0 || !lowerPoints || lowerPoints.length === 0) return '';

  if (interpolation === 'step' || interpolation === 'step-after') {
    let path = `M ${upperPoints[0].x} ${upperPoints[0].y}`;
    for (let i = 1; i < upperPoints.length; i++) {
      path += ` H ${upperPoints[i].x} V ${upperPoints[i].y}`;
    }
    const lastLower = lowerPoints[lowerPoints.length - 1];
    path += ` L ${lastLower.x} ${lastLower.y}`;
    for (let i = lowerPoints.length - 2; i >= 0; i--) {
      path += ` H ${lowerPoints[i].x} V ${lowerPoints[i].y}`;
    }
    path += ' Z';
    return path;
  }

  if (interpolation === 'monotone' || interpolation === 'smooth') {
    let upperPath = `M ${upperPoints[0].x} ${upperPoints[0].y}`;
    for (let i = 0; i < upperPoints.length - 1; i++) {
      const p0 = upperPoints[Math.max(0, i - 1)];
      const p1 = upperPoints[i];
      const p2 = upperPoints[i + 1];
      const p3 = upperPoints[Math.min(upperPoints.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      upperPath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    const lastLower = lowerPoints[lowerPoints.length - 1];
    let lowerPath = ` L ${lastLower.x} ${lastLower.y}`;
    for (let i = lowerPoints.length - 1; i > 0; i--) {
      const p0 = lowerPoints[Math.min(lowerPoints.length - 1, i + 1)];
      const p1 = lowerPoints[i];
      const p2 = lowerPoints[i - 1];
      const p3 = lowerPoints[Math.max(0, i - 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      lowerPath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return `${upperPath}${lowerPath} Z`;
  }

  // Default: Linear
  let path = `M ${upperPoints[0].x} ${upperPoints[0].y}`;
  for (let i = 1; i < upperPoints.length; i++) {
    path += ` L ${upperPoints[i].x} ${upperPoints[i].y}`;
  }
  for (let i = lowerPoints.length - 1; i >= 0; i--) {
    path += ` L ${lowerPoints[i].x} ${lowerPoints[i].y}`;
  }
  path += ' Z';
  return path;
}

export function stackSeriesData(data = [], seriesKeys = [], options = {}) {
  const { type = 'stacked', baseline = 0 } = options;
  const n = data.length;
  const m = seriesKeys.length;
  const stacked = seriesKeys.map(() => []);

  for (let i = 0; i < n; i++) {
    const datum = data[i];
    const rawValues = seriesKeys.map(k => Number(datum[k] || 0));
    const totalSum = rawValues.reduce((acc, v) => acc + Math.abs(v), 0);

    if (type === 'normalized') {
      let cumulative = 0;
      for (let s = 0; s < m; s++) {
        const val = rawValues[s];
        const share = totalSum > 0 ? (val / totalSum) * 100 : 0;
        const y0 = cumulative;
        const y1 = cumulative + share;
        cumulative = y1;
        stacked[s].push({ y0, y1, val, share, rawVal: val, datum });
      }
    } else if (type === 'stream') {
      let cumulative = -totalSum / 2;
      for (let s = 0; s < m; s++) {
        const val = rawValues[s];
        const y0 = cumulative;
        const y1 = cumulative + val;
        cumulative = y1;
        stacked[s].push({ y0, y1, val, share: totalSum > 0 ? (val / totalSum) * 100 : 0, rawVal: val, datum });
      }
    } else if (type === 'diverging') {
      let posCumulative = baseline;
      let negCumulative = baseline;
      for (let s = 0; s < m; s++) {
        const val = rawValues[s];
        let y0, y1;
        if (val >= 0) {
          y0 = posCumulative;
          y1 = posCumulative + val;
          posCumulative = y1;
        } else {
          y0 = negCumulative;
          y1 = negCumulative + val;
          negCumulative = y1;
        }
        stacked[s].push({ y0, y1, val, share: 0, rawVal: val, datum });
      }
    } else {
      let cumulative = baseline;
      for (let s = 0; s < m; s++) {
        const val = rawValues[s];
        const y0 = cumulative;
        const y1 = cumulative + val;
        cumulative = y1;
        stacked[s].push({ y0, y1, val, share: totalSum > 0 ? (val / totalSum) * 100 : 0, rawVal: val, datum });
      }
    }
  }

  return stacked;
}

/* ==========================================================================
   9. POINT SYMBOLS & STATISTICAL OVERLAYS
   ========================================================================== */

export function renderPointSymbol(symbol = 'circle', x = 0, y = 0, r = 4) {
  switch (symbol) {
    case 'square':
      return `M ${x - r} ${y - r} h ${r * 2} v ${r * 2} h ${-r * 2} Z`;
    case 'diamond':
      return `M ${x} ${y - r * 1.3} L ${x + r * 1.3} ${y} L ${x} ${y + r * 1.3} L ${x - r * 1.3} ${y} Z`;
    case 'triangle':
      return `M ${x} ${y - r * 1.25} L ${x + r * 1.15} ${y + r * 0.9} L ${x - r * 1.15} ${y + r * 0.9} Z`;
    case 'cross':
      return `M ${x - r} ${y - r} L ${x + r} ${y + r} M ${x - r} ${y + r} L ${x + r} ${y - r}`;
    case 'star': {
      const spikes = 5;
      const step = Math.PI / spikes;
      let path = '';
      let rot = (Math.PI / 2) * 3;
      let cx = x, cy = y;
      const outerR = r * 1.2;
      const innerR = r * 0.55;
      for (let i = 0; i < spikes; i++) {
        cx = x + Math.cos(rot) * outerR;
        cy = y + Math.sin(rot) * outerR;
        path += (i === 0 ? `M ${cx} ${cy}` : ` L ${cx} ${cy}`);
        rot += step;
        cx = x + Math.cos(rot) * innerR;
        cy = y + Math.sin(rot) * innerR;
        path += ` L ${cx} ${cy}`;
        rot += step;
      }
      return `${path} Z`;
    }
    case 'circle':
    default:
      return `M ${x - r} ${y} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`;
  }
}

export function calculateLinearRegression(points = []) {
  const valid = points.filter(p => p && typeof p.x === 'number' && typeof p.y === 'number' && !isNaN(p.x) && !isNaN(p.y));
  const n = valid.length;
  if (n < 2) return null;

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;
  for (let i = 0; i < n; i++) {
    const { x, y } = valid[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
    sumYY += y * y;
  }

  const denominator = n * sumXX - sumX * sumX;
  if (denominator === 0) return null;

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  // Pearson correlation coefficient r
  const rNumerator = n * sumXY - sumX * sumY;
  const rDenominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
  const r = rDenominator !== 0 ? rNumerator / rDenominator : 0;
  const rSquared = r * r;

  return {
    slope,
    intercept,
    r,
    rSquared,
    predict: (x) => slope * x + intercept
  };
}

/* ==========================================================================
   10. STATISTICAL DISTRIBUTION ENGINES
   ========================================================================== */

export function computeHistogramBins(values = [], options = {}) {
  const valid = values.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b);
  const n = valid.length;
  if (n === 0) return [];

  const minVal = options.min != null ? options.min : valid[0];
  const maxVal = options.max != null ? options.max : valid[n - 1];
  const span = maxVal - minVal || 1;

  const defaultBinCount = Math.max(5, Math.min(25, Math.ceil(Math.log2(n) + 1)));
  const binCount = options.binCount || defaultBinCount;
  const binWidth = options.binWidth || (span / binCount);

  const bins = [];
  for (let i = 0; i < binCount; i++) {
    const x0 = minVal + i * binWidth;
    const x1 = x0 + binWidth;
    bins.push({
      binIndex: i,
      x0,
      x1,
      xMid: (x0 + x1) / 2,
      count: 0,
      frequency: 0,
      items: []
    });
  }

  valid.forEach(v => {
    let bIdx = Math.floor((v - minVal) / binWidth);
    if (bIdx >= binCount) bIdx = binCount - 1;
    if (bIdx < 0) bIdx = 0;
    bins[bIdx].count += 1;
    bins[bIdx].items.push(v);
  });

  bins.forEach(b => {
    b.frequency = n > 0 ? b.count / n : 0;
  });

  return bins;
}

export function computeBoxPlotQuantiles(values = []) {
  const valid = values.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b);
  const n = valid.length;
  if (n === 0) {
    return { min: 0, q1: 0, median: 0, q3: 0, max: 0, iqr: 0, lowerWhisker: 0, upperWhisker: 0, outliers: [], mean: 0, stdDev: 0, count: 0 };
  }

  const getQuantile = (arr, q) => {
    const pos = (arr.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (arr[base + 1] !== undefined) {
      return arr[base] + rest * (arr[base + 1] - arr[base]);
    }
    return arr[base];
  };

  const min = valid[0];
  const max = valid[n - 1];
  const q1 = getQuantile(valid, 0.25);
  const median = getQuantile(valid, 0.5);
  const q3 = getQuantile(valid, 0.75);
  const iqr = q3 - q1;

  const lowerLimit = q1 - 1.5 * iqr;
  const upperLimit = q3 + 1.5 * iqr;

  const inliers = valid.filter(v => v >= lowerLimit && v <= upperLimit);
  const lowerWhisker = inliers.length > 0 ? inliers[0] : min;
  const upperWhisker = inliers.length > 0 ? inliers[inliers.length - 1] : max;

  const outliers = valid.filter(v => v < lowerLimit || v > upperLimit);

  const sum = valid.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  const variance = valid.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1 || 1);
  const stdDev = Math.sqrt(variance);

  return {
    min,
    q1,
    median,
    q3,
    max,
    iqr,
    lowerWhisker,
    upperWhisker,
    outliers,
    mean,
    stdDev,
    count: n
  };
}

export function computeKDE(values = [], options = {}) {
  const valid = values.map(Number).filter(v => !isNaN(v));
  const n = valid.length;
  if (n === 0) return { points: [], maxDensity: 0, bandwidth: 1 };

  const minVal = options.min != null ? options.min : Math.min(...valid);
  const maxVal = options.max != null ? options.max : Math.max(...valid);
  const sampleCount = options.samplePoints || 50;

  const mean = valid.reduce((a, b) => a + b, 0) / n;
  const stdDev = Math.sqrt(valid.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1 || 1)) || 1;
  const h = options.bandwidth || (1.06 * stdDev * Math.pow(n, -0.2));

  const gaussianKernel = (u) => (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * u * u);

  const step = (maxVal - minVal) / (sampleCount - 1 || 1);
  const kdePoints = [];
  let maxDensity = 0;

  for (let i = 0; i < sampleCount; i++) {
    const x = minVal + i * step;
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += gaussianKernel((x - valid[j]) / h);
    }
    const density = sum / (n * h);
    if (density > maxDensity) maxDensity = density;
    kdePoints.push({ x, density });
  }

  return {
    points: kdePoints,
    maxDensity,
    bandwidth: h
  };
}

/* ==========================================================================
   11. HEATMAP COLOR SCALES & MATRIX UTILITIES
   ========================================================================== */

export function interpolateRgb(hex1, hex2, ratio) {
  const parseHex = (hex) => {
    let clean = (hex || '#000000').replace('#', '');
    if (clean.length === 3) clean = clean.split('').map(c => c + c).join('');
    const num = parseInt(clean, 16) || 0;
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  };
  const rgb1 = parseHex(hex1);
  const rgb2 = parseHex(hex2);
  const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * ratio);
  const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * ratio);
  const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * ratio);
  return `rgb(${r}, ${g}, ${b})`;
}

export function createSequentialColorScale({
  domain = [0, 100],
  colors = ['#eff6ff', '#1d4ed8']
}) {
  const [d0, d1] = domain;
  const span = d1 - d0 || 1;

  const scaleFn = (val) => {
    if (val == null || isNaN(val)) return 'transparent';
    const clamped = Math.max(d0, Math.min(d1, Number(val)));
    const ratio = (clamped - d0) / span;
    return interpolateRgb(colors[0], colors[1], ratio);
  };

  scaleFn.domain = () => [d0, d1];
  scaleFn.colors = () => colors;
  return scaleFn;
}

export function createDivergingColorScale({
  domain = [-1, 1],
  colors = ['#ef4444', '#f8fafc', '#2563eb'],
  neutral = 0
}) {
  const [d0, d1] = domain;

  const scaleFn = (val) => {
    if (val == null || isNaN(val)) return 'transparent';
    const num = Number(val);
    if (num < neutral) {
      const ratio = (num - d0) / (neutral - d0 || 1);
      return interpolateRgb(colors[0], colors[1], Math.max(0, Math.min(1, ratio)));
    } else {
      const ratio = (num - neutral) / (d1 - neutral || 1);
      return interpolateRgb(colors[1], colors[2], Math.max(0, Math.min(1, ratio)));
    }
  };

  scaleFn.domain = () => [d0, d1];
  scaleFn.colors = () => colors;
  return scaleFn;
}

/* ==========================================================================
   12. RADIAL & PIE/DONUT ARC ENGINES
   ========================================================================== */

export function computePieSlices(data = [], options = {}) {
  const { valueKey = 'value', startAngle = -Math.PI / 2, padAngle = 0 } = options;
  const validData = data.map((d, i) => {
    const rawVal = typeof d === 'number' ? d : Number(d[valueKey] || 0);
    return {
      index: i,
      datum: d,
      value: Math.max(0, isNaN(rawVal) ? 0 : rawVal)
    };
  });

  const total = validData.reduce((acc, d) => acc + d.value, 0);
  const n = validData.length;
  let currentAngle = startAngle;

  return validData.map((d) => {
    const share = total > 0 ? d.value / total : (1 / (n || 1));
    const angleSpan = share * 2 * Math.PI;
    const a0 = currentAngle + (n > 1 ? padAngle / 2 : 0);
    const a1 = currentAngle + angleSpan - (n > 1 ? padAngle / 2 : 0);
    const midAngle = (a0 + a1) / 2;
    currentAngle += angleSpan;

    return {
      ...d,
      share,
      percentage: share * 100,
      startAngle: a0,
      endAngle: a1,
      midAngle,
      total
    };
  });
}

export function createArcPath({
  cx = 0,
  cy = 0,
  innerRadius = 0,
  outerRadius = 100,
  startAngle = 0,
  endAngle = Math.PI / 2
}) {
  const isFullCircle = Math.abs(endAngle - startAngle) >= 2 * Math.PI - 1e-4;
  const deltaAngle = endAngle - startAngle;
  const largeArcFlag = deltaAngle > Math.PI ? 1 : 0;

  const p0x = cx + outerRadius * Math.cos(startAngle);
  const p0y = cy + outerRadius * Math.sin(startAngle);
  const p1x = cx + outerRadius * Math.cos(endAngle);
  const p1y = cy + outerRadius * Math.sin(endAngle);

  if (innerRadius <= 0) {
    if (isFullCircle) {
      return `M ${cx - outerRadius} ${cy} A ${outerRadius} ${outerRadius} 0 1 0 ${cx + outerRadius} ${cy} A ${outerRadius} ${outerRadius} 0 1 0 ${cx - outerRadius} ${cy} Z`;
    }
    return `M ${cx} ${cy} L ${p0x} ${p0y} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${p1x} ${p1y} Z`;
  }

  const p2x = cx + innerRadius * Math.cos(endAngle);
  const p2y = cy + innerRadius * Math.sin(endAngle);
  const p3x = cx + innerRadius * Math.cos(startAngle);
  const p3y = cy + innerRadius * Math.sin(startAngle);

  if (isFullCircle) {
    return `M ${cx - outerRadius} ${cy} A ${outerRadius} ${outerRadius} 0 1 0 ${cx + outerRadius} ${cy} A ${outerRadius} ${outerRadius} 0 1 0 ${cx - outerRadius} ${cy} M ${cx - innerRadius} ${cy} A ${innerRadius} ${innerRadius} 0 1 1 ${cx + innerRadius} ${cy} A ${innerRadius} ${innerRadius} 0 1 1 ${cx - innerRadius} ${cy} Z`;
  }

  return `M ${p0x} ${p0y} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${p1x} ${p1y} L ${p2x} ${p2y} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${p3x} ${p3y} Z`;
}

/* ==========================================================================
   13. TREEMAP HIERARCHY & LAYOUT ENGINE
   ========================================================================== */

/**
 * Normalizes and computes cumulative values for hierarchical trees.
 * Accepts either nested `{ label, value, children: [] }` or flat node lists with `parent` ID links.
 */
export function rollupHierarchy(inputData, {
  idKey = 'id',
  labelKey = 'label',
  valueKey = 'value',
  childrenKey = 'children',
  categoryKey = 'category'
} = {}) {
  if (!inputData) return null;

  // Helper to clone and calculate recursive values
  function processNode(node, depth = 0, parent = null) {
    const id = node[idKey] || node.id || node[labelKey] || `node-${Math.random().toString(36).substr(2, 9)}`;
    const label = node[labelKey] || node.label || node.name || id;
    const category = node[categoryKey] || (parent ? parent.category : label);
    const rawChildren = node[childrenKey] || node.children || [];

    const processed = {
      id,
      label,
      category,
      depth,
      parent: parent ? { id: parent.id, label: parent.label } : null,
      raw: node
    };

    if (Array.isArray(rawChildren) && rawChildren.length > 0) {
      processed.children = rawChildren
        .map(child => processNode(child, depth + 1, processed))
        .filter(Boolean)
        // Sort descending by value for layout stability
        .sort((a, b) => (b.value || 0) - (a.value || 0));
      processed.value = processed.children.reduce((sum, c) => sum + (c.value || 0), 0);
      processed.isLeaf = false;
    } else {
      const v = Number(node[valueKey] !== undefined ? node[valueKey] : node.value);
      processed.value = Math.max(0, isNaN(v) ? 0 : v);
      processed.children = [];
      processed.isLeaf = true;
    }

    return processed;
  }

  // If input is an array of root-level nodes, wrap in a virtual root
  if (Array.isArray(inputData)) {
    const processedChildren = inputData
      .map(item => processNode(item, 1, null))
      .sort((a, b) => (b.value || 0) - (a.value || 0));
    const totalVal = processedChildren.reduce((sum, c) => sum + c.value, 0);
    return {
      id: 'root',
      label: 'Root',
      category: 'Root',
      depth: 0,
      parent: null,
      children: processedChildren,
      value: totalVal,
      isLeaf: false,
      raw: inputData
    };
  }

  return processNode(inputData, 0, null);
}

/**
 * Computes spatial bounding boxes (x, y, width, height) for hierarchical nodes
 * Supports 'squarified' (Bruls et al. 2000) and 'slice-and-dice' algorithms.
 */
export function computeTreemapLayout({
  rootNode,
  x = 0,
  y = 0,
  width = 600,
  height = 400,
  padding = 2,
  containerPadding = 4,
  headerHeight = 20,
  algorithm = 'squarified', // 'squarified' | 'slice-and-dice'
  maxDepth = Infinity
}) {
  if (!rootNode || width <= 0 || height <= 0) return [];

  const nodes = [];

  function layoutLevel(node, rx, ry, rw, rh) {
    if (rw <= 0 || rh <= 0) return;

    const isRoot = node.depth === 0;
    const isBranch = !node.isLeaf && node.depth < maxDepth && node.children && node.children.length > 0;

    const nodeLayout = {
      ...node,
      x: rx,
      y: ry,
      width: rw,
      height: rh,
      x0: rx,
      y0: ry,
      x1: rx + rw,
      y1: ry + rh
    };

    nodes.push(nodeLayout);

    if (!isBranch) return;

    // Interior rectangle available for children
    const childX = rx + (isRoot ? 0 : containerPadding);
    const childY = ry + (isRoot ? 0 : (headerHeight + containerPadding));
    const childW = Math.max(0, rw - (isRoot ? 0 : containerPadding * 2));
    const childH = Math.max(0, rh - (isRoot ? 0 : (headerHeight + containerPadding * 2)));

    if (childW <= 0 || childH <= 0 || node.children.length === 0) return;

    const totalVal = node.value || node.children.reduce((sum, c) => sum + c.value, 0);
    if (totalVal <= 0) return;

    if (algorithm === 'slice-and-dice') {
      layoutSliceAndDice(node.children, childX, childY, childW, childH, node.depth % 2 === 0, totalVal);
    } else {
      layoutSquarified(node.children, childX, childY, childW, childH, totalVal);
    }
  }

  function layoutSliceAndDice(children, bx, by, bw, bh, isVertical, totalVal) {
    let offset = isVertical ? bx : by;
    const totalDim = isVertical ? bw : bh;

    children.forEach((child, idx) => {
      const share = totalVal > 0 ? child.value / totalVal : 1 / children.length;
      const span = share * totalDim;
      const pad = padding / 2;

      const cx = isVertical ? offset + pad : bx + pad;
      const cy = isVertical ? by + pad : offset + pad;
      const cw = Math.max(0, (isVertical ? span : bw) - padding);
      const ch = Math.max(0, (isVertical ? bh : span) - padding);

      layoutLevel(child, cx, cy, cw, ch);
      offset += span;
    });
  }

  function layoutSquarified(children, bx, by, bw, bh, totalVal) {
    // Normalize children values to area units
    const totalArea = bw * bh;
    const items = children.map(c => ({
      node: c,
      area: totalVal > 0 ? (c.value / totalVal) * totalArea : 0
    })).filter(item => item.area > 0);

    if (items.length === 0) return;

    let curX = bx;
    let curY = by;
    let curW = bw;
    let curH = bh;

    let remaining = [...items];

    while (remaining.length > 0) {
      const shortestSide = Math.min(curW, curH);
      const row = [remaining[0]];
      let bestAspect = worstAspectRatio(row, shortestSide);

      let i = 1;
      while (i < remaining.length) {
        const testRow = [...row, remaining[i]];
        const testAspect = worstAspectRatio(testRow, shortestSide);
        if (testAspect <= bestAspect) {
          row.push(remaining[i]);
          bestAspect = testAspect;
          i++;
        } else {
          break;
        }
      }

      // Layout the settled row
      const rowArea = row.reduce((sum, r) => sum + r.area, 0);
      const isHorizontal = curW >= curH;
      const rowThickness = shortestSide > 0 ? rowArea / shortestSide : 0;

      let itemOffset = isHorizontal ? curY : curX;

      row.forEach(item => {
        const itemSpan = rowArea > 0 ? (item.area / rowArea) * (isHorizontal ? curH : curW) : 0;
        const ix = isHorizontal ? curX : itemOffset;
        const iy = isHorizontal ? itemOffset : curY;
        const iw = isHorizontal ? rowThickness : itemSpan;
        const ih = isHorizontal ? itemSpan : rowThickness;

        const px = ix + padding / 2;
        const py = iy + padding / 2;
        const pw = Math.max(0, iw - padding);
        const ph = Math.max(0, ih - padding);

        layoutLevel(item.node, px, py, pw, ph);

        itemOffset += itemSpan;
      });

      // Update remaining space
      if (isHorizontal) {
        curX += rowThickness;
        curW = Math.max(0, curW - rowThickness);
      } else {
        curY += rowThickness;
        curH = Math.max(0, curH - rowThickness);
      }

      remaining = remaining.slice(row.length);
    }
  }

  function worstAspectRatio(row, side) {
    if (row.length === 0 || side <= 0) return Infinity;
    const rowArea = row.reduce((sum, r) => sum + r.area, 0);
    if (rowArea <= 0) return Infinity;

    const sideSq = side * side;
    const areaSq = rowArea * rowArea;

    let maxAspect = 0;
    for (const item of row) {
      if (item.area <= 0) continue;
      const aspect = Math.max(
        (sideSq * item.area) / areaSq,
        areaSq / (sideSq * item.area)
      );
      if (aspect > maxAspect) maxAspect = aspect;
    }
    return maxAspect || Infinity;
  }

  layoutLevel(rootNode, x, y, width, height);
  return nodes;
}

/* ==========================================================================
   14. TREE DIAGRAM & TOPOLOGY LAYOUT ENGINE
   ========================================================================== */

/**
 * Computes explicit 2D coordinates and parent-child link geometries for tree diagrams.
 * Supports horizontal (L-to-R), vertical (Top-to-Bottom), collapsible state folding,
 * and subtree boundary calculation.
 */
export function computeTreeTopology({
  rootNode,
  orientation = 'horizontal', // 'horizontal' | 'vertical'
  nodeWidth = 150,
  nodeHeight = 54,
  levelSpacing = 70,
  siblingSpacing = 20,
  collapsedIds = new Set()
}) {
  if (!rootNode) return { nodes: [], links: [], bounds: { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 } };

  const nodes = [];
  const links = [];

  // 1. Calculate subtree size recursively for compact layout
  function measureSubtree(node, depth = 0) {
    const isCollapsed = collapsedIds.has(node.id);
    const hasChildren = !isCollapsed && Array.isArray(node.children) && node.children.length > 0;

    if (!hasChildren) {
      const leafBreadth = orientation === 'horizontal' ? nodeHeight + siblingSpacing : nodeWidth + siblingSpacing;
      return { ...node, depth, isCollapsed, breadth: leafBreadth, measuredChildren: [] };
    }

    const measuredChildren = node.children.map(child => measureSubtree(child, depth + 1));
    const totalBreadth = measuredChildren.reduce((sum, c) => sum + c.breadth, 0);

    return {
      ...node,
      depth,
      isCollapsed,
      breadth: Math.max(orientation === 'horizontal' ? nodeHeight + siblingSpacing : nodeWidth + siblingSpacing, totalBreadth),
      measuredChildren
    };
  }

  const measuredRoot = measureSubtree(rootNode, 0);

  // 2. Position nodes based on measured subtree breadths
  function positionSubtree(mNode, levelOffset, breadthOffset, parentNode = null) {
    const isHorizontal = orientation === 'horizontal';

    let x, y;
    if (isHorizontal) {
      x = levelOffset;
      y = breadthOffset + (mNode.breadth - (nodeHeight + siblingSpacing)) / 2;
    } else {
      x = breadthOffset + (mNode.breadth - (nodeWidth + siblingSpacing)) / 2;
      y = levelOffset;
    }

    const layoutNode = {
      id: mNode.id,
      label: mNode.label,
      category: mNode.category,
      depth: mNode.depth,
      value: mNode.value,
      status: mNode.status,
      code: mNode.code,
      role: mNode.role,
      isLeaf: !mNode.children || mNode.children.length === 0,
      isCollapsed: mNode.isCollapsed,
      childrenCount: mNode.children ? mNode.children.length : 0,
      x,
      y,
      width: nodeWidth,
      height: nodeHeight,
      raw: mNode.raw || mNode,
      parent: parentNode ? { id: parentNode.id, label: parentNode.label, x: parentNode.x, y: parentNode.y } : null
    };

    nodes.push(layoutNode);

    if (parentNode) {
      links.push({
        id: `link-${parentNode.id}-${layoutNode.id}`,
        source: parentNode,
        target: layoutNode
      });
    }

    if (!mNode.isCollapsed && mNode.measuredChildren && mNode.measuredChildren.length > 0) {
      let currentBreadth = breadthOffset;
      const nextLevel = levelOffset + (isHorizontal ? nodeWidth + levelSpacing : nodeHeight + levelSpacing);

      mNode.measuredChildren.forEach(child => {
        positionSubtree(child, nextLevel, currentBreadth, layoutNode);
        currentBreadth += child.breadth;
      });
    }
  }

  positionSubtree(measuredRoot, 20, 20, null);

  // 3. Compute overall bounding envelope
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  nodes.forEach(n => {
    if (n.x < minX) minX = n.x;
    if (n.y < minY) minY = n.y;
    if (n.x + n.width > maxX) maxX = n.x + n.width;
    if (n.y + n.height > maxY) maxY = n.y + n.height;
  });

  return {
    nodes,
    links,
    bounds: {
      minX: minX === Infinity ? 0 : minX,
      minY: minY === Infinity ? 0 : minY,
      maxX: maxX === -Infinity ? 0 : maxX,
      maxY: maxY === -Infinity ? 0 : maxY,
      width: Math.max(100, maxX - minX + 40),
      height: Math.max(100, maxY - minY + 40)
    }
  };
}

/**
 * Generates an SVG path data string for parent-child hierarchy edges.
 * Supports smooth cubic bezier curves, orthogonal step links, and direct straight segments.
 */
export function createTreeLinkPath({
  source,
  target,
  orientation = 'horizontal',
  linkStyle = 'smooth' // 'smooth' | 'step' | 'straight'
}) {
  if (!source || !target) return '';

  const isHorizontal = orientation === 'horizontal';

  // Connecting anchor points:
  // Horizontal: source right-center -> target left-center
  // Vertical: source bottom-center -> target top-center
  const sx = isHorizontal ? source.x + source.width : source.x + source.width / 2;
  const sy = isHorizontal ? source.y + source.height / 2 : source.y + source.height;
  const tx = isHorizontal ? target.x : target.x + target.width / 2;
  const ty = isHorizontal ? target.y + target.height / 2 : target.y;

  if (linkStyle === 'straight') {
    return `M ${sx} ${sy} L ${tx} ${ty}`;
  }

  if (linkStyle === 'step') {
    if (isHorizontal) {
      const midX = (sx + tx) / 2;
      return `M ${sx} ${sy} H ${midX} V ${ty} H ${tx}`;
    } else {
      const midY = (sy + ty) / 2;
      return `M ${sx} ${sy} V ${midY} H ${tx} V ${ty}`;
    }
  }

  // Default: Smooth cubic bezier
  if (isHorizontal) {
    const dx = Math.max(20, Math.abs(tx - sx) / 2);
    return `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`;
  } else {
    const dy = Math.max(20, Math.abs(ty - sy) / 2);
    return `M ${sx} ${sy} C ${sx} ${sy + dy}, ${tx} ${ty - dy}, ${tx} ${ty}`;
  }
}

/* ==========================================================================
   15. SANKEY DIAGRAM FLOW ENGINE
   ========================================================================== */

/**
 * Computes deterministic multi-stage node coordinates and ribbon link coordinates
 * for weighted flow networks (Sankey diagrams).
 */
export function computeSankeyLayout({
  nodes: rawNodes = [],
  links: rawLinks = [],
  width = 760,
  height = 440,
  nodeWidth = 20,
  nodePadding = 18,
  align = 'justify',
  margin = { top: 28, right: 28, bottom: 24, left: 28 }
} = {}) {
  if (!rawNodes || rawNodes.length === 0 || width <= 0 || height <= 0) {
    return { nodes: [], links: [], stages: [], ky: 1, bounds: { width, height } };
  }

  const mTop = margin.top ?? 28;
  const mRight = margin.right ?? 28;
  const mBottom = margin.bottom ?? 24;
  const mLeft = margin.left ?? 28;

  const innerWidth = Math.max(100, width - mLeft - mRight);
  const innerHeight = Math.max(80, height - mTop - mBottom);

  // 1. Clone nodes and build fast lookup
  const nodeMap = new Map();
  const nodes = rawNodes.map((n, idx) => {
    const id = n.id !== undefined ? String(n.id) : `node-${idx}`;
    const nodeObj = {
      ...n,
      id,
      label: n.label || n.name || id,
      category: n.category || n.label || id,
      inLinks: [],
      outLinks: [],
      inValue: 0,
      outValue: 0,
      value: 0,
      column: 0
    };
    nodeMap.set(id, nodeObj);
    return nodeObj;
  });

  // 2. Clone links and connect to node references
  const links = [];
  rawLinks.forEach((l, idx) => {
    const sId = String(typeof l.source === 'object' && l.source !== null ? l.source.id : l.source);
    const tId = String(typeof l.target === 'object' && l.target !== null ? l.target.id : l.target);
    const sourceNode = nodeMap.get(sId);
    const targetNode = nodeMap.get(tId);
    const val = Math.max(0, Number(l.value) || 0);

    if (sourceNode && targetNode && val > 0) {
      const linkObj = {
        id: l.id || `link-${sId}-${tId}-${idx}`,
        source: sourceNode,
        target: targetNode,
        value: val,
        category: l.category || sourceNode.category,
        raw: l,
        y0: 0,
        y1: 0,
        width: 0
      };
      sourceNode.outLinks.push(linkObj);
      targetNode.inLinks.push(linkObj);
      sourceNode.outValue += val;
      targetNode.inValue += val;
      links.push(linkObj);
    }
  });

  // Calculate net node value (max of in or out flow)
  nodes.forEach(n => {
    n.value = Math.max(n.inValue, n.outValue);
  });

  // 3. Assign Stage Columns (DAG Topo Level Assignment)
  // Find roots (inDegree === 0)
  let remainingNodes = [...nodes];
  let currentStageNodes = remainingNodes.filter(n => n.inLinks.length === 0);
  if (currentStageNodes.length === 0) currentStageNodes = [remainingNodes[0]];

  currentStageNodes.forEach(n => { n.column = 0; });
  let maxCol = 0;

  // Breadth-first level push
  const visited = new Set(currentStageNodes.map(n => n.id));
  let queue = [...currentStageNodes];

  while (queue.length > 0) {
    const curr = queue.shift();
    curr.outLinks.forEach(link => {
      const target = link.target;
      target.column = Math.max(target.column, curr.column + 1);
      if (target.column > maxCol) maxCol = target.column;
      if (!visited.has(target.id)) {
        visited.add(target.id);
        queue.push(target);
      }
    });
  }

  // Handle sinks if align is 'justify'
  if (align === 'justify' && maxCol > 0) {
    nodes.forEach(n => {
      if (n.outLinks.length === 0 && n.column < maxCol) {
        n.column = maxCol;
      }
    });
  }

  // Group nodes by stage column
  const stageColumns = [];
  for (let c = 0; c <= maxCol; c++) {
    stageColumns.push([]);
  }
  nodes.forEach(n => {
    stageColumns[n.column].push(n);
  });

  // 4. Compute vertical scaling ratio (ky) based on densest column
  let maxColumnValue = 0;
  stageColumns.forEach(colNodes => {
    const colVal = colNodes.reduce((sum, n) => sum + n.value, 0);
    if (colVal > maxColumnValue) maxColumnValue = colVal;
  });

  const maxNodeCountInAnyCol = Math.max(1, ...stageColumns.map(c => c.length));
  const effectivePadding = Math.min(
    nodePadding,
    maxNodeCountInAnyCol > 1 ? (innerHeight * 0.45) / (maxNodeCountInAnyCol - 1) : nodePadding
  );

  const availablePlotHeight = Math.max(20, innerHeight - (maxNodeCountInAnyCol - 1) * effectivePadding);
  const ky = maxColumnValue > 0 ? availablePlotHeight / maxColumnValue : 1;

  // 5. Compute (X, Y) Coordinates for Nodes
  const colSpacing = maxCol > 0 ? (innerWidth - nodeWidth) / maxCol : 0;

  stageColumns.forEach((colNodes, colIdx) => {
    const colX = mLeft + colIdx * colSpacing;
    const totalColNodeH = colNodes.reduce((sum, n) => sum + Math.max(6, n.value * ky), 0);
    const totalColH = totalColNodeH + (colNodes.length - 1) * effectivePadding;
    let currentY = mTop + Math.max(0, (innerHeight - totalColH) / 2);

    colNodes.forEach(n => {
      n.x = colX;
      n.y = currentY;
      n.width = nodeWidth;
      n.height = Math.max(6, n.value * ky);
      currentY += n.height + effectivePadding;
    });
  });

  // 6. Compute Link Ribbon Y-Offsets (y0 on source, y1 on target)
  // Sort links at each node to minimize ribbon crossings
  nodes.forEach(n => {
    n.outLinks.sort((a, b) => a.target.y - b.target.y);
    n.inLinks.sort((a, b) => a.source.y - b.source.y);
  });

  nodes.forEach(n => {
    let sy = n.y;
    n.outLinks.forEach(l => {
      l.y0 = sy;
      l.width = Math.max(1.5, l.value * ky);
      sy += l.width;
    });

    let ty = n.y;
    n.inLinks.forEach(l => {
      l.y1 = ty;
      // If width not set by source, set it here
      if (!l.width) l.width = Math.max(1.5, l.value * ky);
      ty += l.width;
    });
  });

  return {
    nodes,
    links,
    stages: stageColumns,
    ky,
    bounds: { width, height }
  };
}

/**
 * Generates smooth SVG ribbon path string for Sankey flow band.
 */
export function createSankeyRibbonPath({
  link,
  curvature = 0.5
}) {
  if (!link || !link.source || !link.target) return '';

  const x0 = link.source.x + link.source.width;
  const x1 = link.target.x;
  const y0 = link.y0;
  const y1 = link.y1;
  const w = link.width || 2;

  const dx = Math.max(10, (x1 - x0) * curvature);

  // Flow band: Top curve -> line down -> bottom reverse curve -> close
  return `M ${x0} ${y0} C ${x0 + dx} ${y0}, ${x1 - dx} ${y1}, ${x1} ${y1} L ${x1} ${y1 + w} C ${x1 - dx} ${y1 + w}, ${x0 + dx} ${y0 + w}, ${x0} ${y0 + w} Z`;
}

/* ==========================================================================
   16. NETWORK GRAPH & TOPOLOGY ENGINE
   ========================================================================== */

/**
 * Computes deterministic 2D node coordinates and edge geometries for relational networks.
 * Supports Force-directed simulation (with simulated annealing cooling) and Circular layouts.
 */
export function computeNetworkLayout({
  nodes: rawNodes = [],
  links: rawLinks = [],
  width = 760,
  height = 480,
  layout = 'force', // 'force' | 'circular'
  iterations = 120,
  linkDistance = 90,
  repulsion = 1800,
  gravity = 0.06
} = {}) {
  if (!rawNodes || rawNodes.length === 0 || width <= 0 || height <= 0) {
    return { nodes: [], links: [], adjacencyMap: new Map() };
  }

  const cx = width / 2;
  const cy = height / 2;

  // 1. Clone nodes and build fast lookup
  const nodeMap = new Map();
  const adjacencyMap = new Map(); // id -> Set of neighbor IDs

  const nodes = rawNodes.map((n, idx) => {
    const id = n.id !== undefined ? String(n.id) : `node-${idx}`;
    const r = Math.max(8, Math.min(26, n.size || n.radius || (n.value ? Math.sqrt(n.value) * 3 : 12)));

    // Deterministic initial placement along spiral or circle
    const angle = idx * 2.3999632; // Golden angle
    const dist = Math.min(cx, cy) * 0.4 * Math.sqrt((idx + 1) / rawNodes.length);
    const initX = cx + dist * Math.cos(angle);
    const initY = cy + dist * Math.sin(angle);

    const nodeObj = {
      ...n,
      id,
      label: n.label || n.name || id,
      category: n.category || 'default',
      radius: r,
      degree: 0,
      x: initX,
      y: initY,
      vx: 0,
      vy: 0,
      raw: n
    };

    nodeMap.set(id, nodeObj);
    adjacencyMap.set(id, new Set());
    return nodeObj;
  });

  // 2. Clone links and connect to node references
  const links = [];
  rawLinks.forEach((l, idx) => {
    const sId = String(typeof l.source === 'object' ? l.source.id : l.source);
    const tId = String(typeof l.target === 'object' ? l.target.id : l.target);
    const sNode = nodeMap.get(sId);
    const tNode = nodeMap.get(tId);
    const weight = Math.max(1, Number(l.weight || l.value || 1));

    if (sNode && tNode) {
      const linkObj = {
        id: l.id || `edge-${sId}-${tId}-${idx}`,
        source: sNode,
        target: tNode,
        weight,
        directed: l.directed !== undefined ? l.directed : true,
        label: l.label || '',
        category: l.category || sNode.category,
        raw: l
      };
      sNode.degree++;
      tNode.degree++;
      adjacencyMap.get(sId).add(tId);
      adjacencyMap.get(tId).add(sId);
      links.push(linkObj);
    }
  });

  // 3. Layout computation
  if (layout === 'circular') {
    const radius = Math.min(cx, cy) - 50;
    const n = nodes.length;
    nodes.forEach((node, i) => {
      const theta = (2 * Math.PI * i) / n - Math.PI / 2;
      node.x = cx + radius * Math.cos(theta);
      node.y = cy + radius * Math.sin(theta);
    });
  } else {
    // Force-directed simulation with deterministic simulated annealing
    let temp = Math.min(width, height) * 0.15;
    const dt = 1.0;

    for (let iter = 0; iter < iterations; iter++) {
      // Repulsion between all node pairs
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x || (Math.random() - 0.5) * 0.1;
          const dy = n2.y - n1.y || (Math.random() - 0.5) * 0.1;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq) || 1;

          const f = repulsion / Math.max(100, distSq);
          const fx = (dx / dist) * f;
          const fy = (dy / dist) * f;

          n1.vx -= fx;
          n1.vy -= fy;
          n2.vx += fx;
          n2.vy += fy;
        }
      }

      // Spring attraction along links
      links.forEach(l => {
        const dx = l.target.x - l.source.x || 0.1;
        const dy = l.target.y - l.source.y || 0.1;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const displacement = dist - linkDistance;

        const f = displacement * 0.05 * Math.sqrt(l.weight);
        const fx = (dx / dist) * f;
        const fy = (dy / dist) * f;

        l.source.vx += fx;
        l.source.vy += fy;
        l.target.vx -= fx;
        l.target.vy -= fy;
      });

      // Gravity pull towards center & Position Update
      nodes.forEach(n => {
        n.vx += (cx - n.x) * gravity;
        n.vy += (cy - n.y) * gravity;

        const vel = Math.sqrt(n.vx * n.vx + n.vy * n.vy) || 1;
        const step = Math.min(vel, temp);

        n.x += (n.vx / vel) * step * dt;
        n.y += (n.vy / vel) * step * dt;

        // Reset velocity
        n.vx = 0;
        n.vy = 0;

        // Bounding box constraint
        const pad = n.radius + 15;
        n.x = Math.max(pad, Math.min(width - pad, n.x));
        n.y = Math.max(pad, Math.min(height - pad, n.y));
      });

      // Cool temperature
      temp *= 0.96;
    }
  }

  return {
    nodes,
    links,
    adjacencyMap
  };
}

/* ==========================================================================
   17. GEOGRAPHIC MAP PROJECTION & SPATIAL ENGINE
   ========================================================================== */

/**
 * Creates a geographic projection mapping [longitude, latitude] coordinates
 * to SVG 2D pixel coordinates [x, y].
 * Supports Mercator and Equirectangular projections with pan/zoom offsets.
 */
export function createGeoProjection({
  center = [78.5, 20.5], // Center of India (Lon, Lat)
  scale = 850,
  width = 760,
  height = 480,
  projection = 'mercator'
} = {}) {
  const lambda0 = (center[0] * Math.PI) / 180;
  const phi0 = (center[1] * Math.PI) / 180;
  const cx = width / 2;
  const cy = height / 2;

  function project(coords) {
    if (!coords || coords.length < 2) return [cx, cy];
    const lon = Number(coords[0]);
    const lat = Number(coords[1]);

    const lambda = (lon * Math.PI) / 180;
    const phi = Math.max(-85 * Math.PI / 180, Math.min(85 * Math.PI / 180, (lat * Math.PI) / 180));

    if (projection === 'equirectangular') {
      const x = cx + scale * (lambda - lambda0);
      const y = cy - scale * (phi - phi0);
      return [x, y];
    }

    // Default: Mercator projection
    const x = cx + scale * (lambda - lambda0);
    const y0 = Math.log(Math.tan(Math.PI / 4 + phi0 / 2));
    const y1 = Math.log(Math.tan(Math.PI / 4 + phi / 2));
    const y = cy - scale * (y1 - y0);

    return [x, y];
  }

  function invert(point) {
    const x = point[0];
    const y = point[1];

    const lambda = (x - cx) / scale + lambda0;
    const y0 = Math.log(Math.tan(Math.PI / 4 + phi0 / 2));
    const y1 = y0 - (y - cy) / scale;
    const phi = 2 * Math.atan(Math.exp(y1)) - Math.PI / 2;

    return [(lambda * 180) / Math.PI, (phi * 180) / Math.PI];
  }

  return {
    project,
    invert,
    center,
    scale,
    width,
    height
  };
}

/**
 * Generates an arched quadratic bezier SVG path for supply chain freight corridors.
 */
export function createCurvedRoutePath({
  sourcePoint, // [x0, y0]
  targetPoint, // [x1, y1]
  curvature = 0.22
}) {
  if (!sourcePoint || !targetPoint) return '';
  const [x0, y0] = sourcePoint;
  const [x1, y1] = targetPoint;

  const dx = x1 - x0;
  const dy = y1 - y0;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist === 0) return `M ${x0} ${y0}`;

  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2;

  // Normal vector offset for arched curve
  const cx = mx - dy * curvature;
  const cy = my + dx * curvature;

  return `M ${x0} ${y0} Q ${cx} ${cy} ${x1} ${y1}`;
}

/* ==========================================================================
   18. RANGE & BOUNDED INTERVAL ENGINE
   ========================================================================== */

/**
 * Calculates global min, max, span, and domain bounds for bounded interval data.
 */
export function calculateRangeExtents(data = [], {
  lowerKey = 'lower',
  upperKey = 'upper',
  centerKey = 'center',
  targetKey = 'target',
  baseline = null,
  padFraction = 0.08
} = {}) {
  if (!data || data.length === 0) {
    return { min: 0, max: 100, span: 100, domain: [0, 100] };
  }

  let min = Infinity;
  let max = -Infinity;

  data.forEach(d => {
    const l = d[lowerKey] != null ? Number(d[lowerKey]) : (d[centerKey] != null ? Number(d[centerKey]) : null);
    const u = d[upperKey] != null ? Number(d[upperKey]) : (d[centerKey] != null ? Number(d[centerKey]) : null);
    const c = d[centerKey] != null ? Number(d[centerKey]) : null;
    const t = d[targetKey] != null ? Number(d[targetKey]) : null;

    if (l != null && !isNaN(l) && l < min) min = l;
    if (u != null && !isNaN(u) && u > max) max = u;
    if (c != null && !isNaN(c)) {
      if (c < min) min = c;
      if (c > max) max = c;
    }
    if (t != null && !isNaN(t)) {
      if (t < min) min = t;
      if (t > max) max = t;
    }
  });

  if (baseline != null && !isNaN(baseline)) {
    if (baseline < min) min = baseline;
    if (baseline > max) max = baseline;
  }

  if (min === Infinity || max === -Infinity) {
    return { min: 0, max: 100, span: 100, domain: [0, 100] };
  }

  const span = max - min || 1;
  const pad = span * padFraction;
  const paddedMin = min - pad;
  const paddedMax = max + pad;

  return {
    rawMin: min,
    rawMax: max,
    min: paddedMin,
    max: paddedMax,
    span: paddedMax - paddedMin,
    domain: [paddedMin, paddedMax]
  };
}

/**
 * Computes interval metrics (spread, center ratio, before/after delta, percentage change).
 */
export function computeIntervalMetrics(item, {
  lowerKey = 'lower',
  upperKey = 'upper',
  centerKey = 'center',
  targetKey = 'target'
} = {}) {
  if (!item) return { spread: 0, delta: 0, pctChange: 0, isPositiveShift: false };

  const lower = Number(item[lowerKey] ?? 0);
  const upper = Number(item[upperKey] ?? 0);
  const center = item[centerKey] != null ? Number(item[centerKey]) : null;
  const target = item[targetKey] != null ? Number(item[targetKey]) : null;

  const spread = Math.abs(upper - lower);
  const delta = upper - lower;
  const pctChange = lower !== 0 ? ((upper - lower) / Math.abs(lower)) * 100 : 0;
  const isPositiveShift = delta >= 0;

  const targetDeviation = (center != null && target != null) ? (center - target) :
                          (target != null ? (upper - target) : null);

  return {
    lower,
    upper,
    center,
    target,
    spread,
    delta,
    pctChange,
    isPositiveShift,
    targetDeviation
  };
}

/**
 * Generates an enclosed SVG area path for confidence bands and continuous range envelopes.
 */
export function createRangeBandPath(points = [], {
  xScale,
  yScale,
  xKey = 'x',
  lowerKey = 'lower',
  upperKey = 'upper',
  curve = 'linear'
} = {}) {
  if (!points || points.length === 0 || !xScale || !yScale) return '';

  const upperCoords = [];
  const lowerCoords = [];

  points.forEach(p => {
    const xVal = p[xKey];
    const lowVal = p[lowerKey];
    const upVal = p[upperKey];

    if (xVal != null && lowVal != null && upVal != null) {
      const px = xScale(xVal);
      const pyUp = yScale(upVal);
      const pyLow = yScale(lowVal);

      upperCoords.push([px, pyUp]);
      lowerCoords.unshift([px, pyLow]); // reverse order for returning path
    }
  });

  if (upperCoords.length === 0) return '';

  let path = `M ${upperCoords[0][0]} ${upperCoords[0][1]}`;
  for (let i = 1; i < upperCoords.length; i++) {
    path += ` L ${upperCoords[i][0]} ${upperCoords[i][1]}`;
  }

  for (let i = 0; i < lowerCoords.length; i++) {
    path += ` L ${lowerCoords[i][0]} ${lowerCoords[i][1]}`;
  }

  path += ' Z';
  return path;
}

/* ==========================================================================
   19. GANTT & TEMPORAL SCHEDULE ENGINE
   ========================================================================== */

/**
 * Calculates global start date, end date, duration, and time scaler for Gantt tasks.
 */
export function calculateGanttDomain(tasks = [], {
  startKey = 'startDate',
  endKey = 'endDate',
  padDays = 2
} = {}) {
  if (!tasks || tasks.length === 0) {
    const now = Date.now();
    const start = new Date(now);
    const end = new Date(now + 30 * 86400000);
    return { minDate: start, maxDate: end, totalDays: 30, durationMs: 30 * 86400000 };
  }

  let minTime = Infinity;
  let maxTime = -Infinity;

  tasks.forEach(t => {
    const s = t[startKey] ? new Date(t[startKey]).getTime() : null;
    const e = t[endKey] ? new Date(t[endKey]).getTime() : (t.milestoneDate ? new Date(t.milestoneDate).getTime() : s);

    if (s != null && !isNaN(s) && s < minTime) minTime = s;
    if (e != null && !isNaN(e) && e > maxTime) maxTime = e;
  });

  if (minTime === Infinity || maxTime === -Infinity) {
    const now = Date.now();
    return { minDate: new Date(now), maxDate: new Date(now + 30 * 86400000), totalDays: 30, durationMs: 30 * 86400000 };
  }

  // Add padding days
  const padMs = padDays * 86400000;
  const paddedMin = new Date(minTime - padMs);
  const paddedMax = new Date(maxTime + padMs);
  const durationMs = paddedMax.getTime() - paddedMin.getTime() || 86400000;
  const totalDays = Math.ceil(durationMs / 86400000);

  return {
    minDate: paddedMin,
    maxDate: paddedMax,
    rawMinDate: new Date(minTime),
    rawMaxDate: new Date(maxTime),
    durationMs,
    totalDays
  };
}

/**
 * Generates structured time header ticks based on zoom level ('day', 'week', 'month').
 */
export function generateGanttTimeTicks(minDate, maxDate, zoomLevel = 'day') {
  const startMs = new Date(minDate).getTime();
  const endMs = new Date(maxDate).getTime();
  const ticks = [];

  const curr = new Date(startMs);
  curr.setHours(0, 0, 0, 0);

  while (curr.getTime() <= endMs) {
    const time = curr.getTime();
    let label = '';
    let secondary = '';

    if (zoomLevel === 'day') {
      label = curr.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      secondary = curr.toLocaleDateString('en-IN', { weekday: 'narrow' });
      ticks.push({ time, date: new Date(curr), label, secondary, isWeekend: curr.getDay() === 0 || curr.getDay() === 6 });
      curr.setDate(curr.getDate() + 1);
    } else if (zoomLevel === 'week') {
      label = `Wk ${Math.ceil(curr.getDate() / 7)} (${curr.toLocaleDateString('en-IN', { month: 'short' })})`;
      secondary = curr.toLocaleDateString('en-IN', { day: '2-digit' });
      ticks.push({ time, date: new Date(curr), label, secondary, isWeekend: false });
      curr.setDate(curr.getDate() + 7);
    } else {
      label = curr.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
      secondary = '';
      ticks.push({ time, date: new Date(curr), label, secondary, isWeekend: false });
      curr.setMonth(curr.getMonth() + 1);
    }
  }

  return ticks;
}

/**
 * Generates an orthogonal (right-angled) SVG path connecting predecessor to successor task.
 */
export function createOrthogonalDependencyPath({
  sourceX,
  sourceY,
  targetX,
  targetY,
  offset = 12,
  radius = 4
}) {
  if (sourceX == null || sourceY == null || targetX == null || targetY == null) return '';

  // If target is to the right of source
  if (targetX >= sourceX + offset * 2) {
    const midX = sourceX + offset;
    return `M ${sourceX} ${sourceY} L ${midX} ${sourceY} L ${midX} ${targetY} L ${targetX} ${targetY}`;
  }

  // If target is behind source (loop around)
  const midY = (sourceY + targetY) / 2;
  const rightX = sourceX + offset;
  const leftX = targetX - offset;

  return `M ${sourceX} ${sourceY} L ${rightX} ${sourceY} L ${rightX} ${midY} L ${leftX} ${midY} L ${leftX} ${targetY} L ${targetX} ${targetY}`;
}

/* ==========================================================================
   20. PARALLEL COORDINATES & MULTIVARIATE ENGINE
   ========================================================================== */

/**
 * Computes domain bounds (min, max, span, ticks) for each dimension in parallel coordinates.
 */
export function calculateDimensionDomains(data = [], dimensions = []) {
  const domains = {};

  dimensions.forEach(dim => {
    const key = typeof dim === 'string' ? dim : dim.key;
    const isCategorical = dim.isCategorical;

    if (isCategorical) {
      const categories = dim.categories || Array.from(new Set(data.map(d => String(d[key] ?? ''))));
      domains[key] = {
        key,
        isCategorical: true,
        categories,
        count: categories.length
      };
      return;
    }

    let min = dim.min != null ? Number(dim.min) : Infinity;
    let max = dim.max != null ? Number(dim.max) : -Infinity;

    data.forEach(d => {
      const v = d[key] != null ? Number(d[key]) : null;
      if (v != null && !isNaN(v)) {
        if (v < min) min = v;
        if (v > max) max = v;
      }
    });

    if (min === Infinity || max === -Infinity) {
      min = 0;
      max = 100;
    }

    const span = max - min || 1;
    const pad = span * 0.05;
    const paddedMin = dim.min != null ? dim.min : min - pad;
    const paddedMax = dim.max != null ? dim.max : max + pad;

    domains[key] = {
      key,
      isCategorical: false,
      min: paddedMin,
      max: paddedMax,
      rawMin: min,
      rawMax: max,
      span: paddedMax - paddedMin,
      inverted: !!dim.inverted
    };
  });

  return domains;
}

/**
 * Normalizes a raw dimension value to [0, 1] relative to domain bounds.
 */
export function normalizeDimensionValue(val, domain) {
  if (val == null || !domain) return 0.5;
  if (domain.isCategorical) {
    const idx = domain.categories.indexOf(String(val));
    if (idx === -1) return 0.5;
    return domain.categories.length > 1 ? idx / (domain.categories.length - 1) : 0.5;
  }

  const num = Number(val);
  if (isNaN(num)) return 0.5;

  let norm = (num - domain.min) / domain.span;
  norm = Math.max(0, Math.min(1, norm));

  return domain.inverted ? (1 - norm) : norm;
}

/**
 * Generates an SVG path string (straight or smooth bezier curve) crossing parallel axes.
 */
export function generateParallelPolylinePath(record, dimensions, xCoords, yScales, { smooth = false, curvature = 0.4 } = {}) {
  const points = [];

  dimensions.forEach((dim, i) => {
    const key = typeof dim === 'string' ? dim : dim.key;
    const x = xCoords[i];
    const yScale = yScales[key];
    const val = record[key];

    if (x != null && yScale) {
      const y = yScale(val);
      points.push([x, y]);
    }
  });

  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0][0]} ${points[0][1]}`;

  if (!smooth) {
    let path = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i][0]} ${points[i][1]}`;
    }
    return path;
  }

  // Smooth cubic bezier spline
  let path = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const dx = p1[0] - p0[0];
    const cx1 = p0[0] + dx * curvature;
    const cy1 = p0[1];
    const cx2 = p1[0] - dx * curvature;
    const cy2 = p1[1];

    path += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p1[0]} ${p1[1]}`;
  }

  return path;
}

/**
 * Evaluates whether a record passes all active 1D axis brush ranges.
 */
export function evaluateBrushFilters(record, activeBrushes = {}) {
  const keys = Object.keys(activeBrushes);
  if (keys.length === 0) return true;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const brush = activeBrushes[key];
    if (!brush) continue;

    const val = Number(record[key]);
    if (isNaN(val)) return false;

    if (val < brush.min || val > brush.max) {
      return false;
    }
  }

  return true;
}
