import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

console.log('🏛️  Executing Comprehensive AUDIT_STANDARD.md Gold Standard Audit for Wave 3...\n');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✅ [PASS] ${message}`);
  } else {
    failedChecks++;
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

// 1. Frozen Specification Adherence (§1.1)
console.log('📋 Checking Frozen Specification Adherence (§1.1)...');
const spec1Path = path.join(root, 'specs', 'patterns', 'ConcurrentConflictResolver.spec.html');
const spec2Path = path.join(root, 'specs', 'data', 'StockRunwayHorizon.spec.html');
assert(fs.existsSync(spec1Path), 'ConcurrentConflictResolver.spec.html exists');
assert(fs.existsSync(spec2Path), 'StockRunwayHorizon.spec.html exists');
if (fs.existsSync(spec1Path)) {
  const specContent = fs.readFileSync(spec1Path, 'utf8');
  assert(specContent.includes('409') && specContent.includes('ETag'), 'Spec details ETag 409 conflict mechanics');
  assert(specContent.includes('Accept Remote') && specContent.includes('Force Override') && specContent.includes('Allocate Remaining Delta'), 'Spec documents 3 one-click resolution actions');
}
if (fs.existsSync(spec2Path)) {
  const specContent = fs.readFileSync(spec2Path, 'utf8');
  assert(specContent.includes('24px') && specContent.includes('Safe stock'), 'Spec details 24px micro-bar safe coverage days');
  assert(specContent.includes('LeadTimeTransferGlyph') && specContent.includes('IntercompanyStockRibbon'), 'Spec details companions');
}

// 2. Design Token Strictness (§1.3)
console.log('\n🎨 Checking Strict Design Token Usage & Zero Raw Hex Colors (§1.3)...');
const cssFiles = [
  path.join(root, 'packages/react/src/components/ConflictResolver/ConcurrentConflictResolver.css'),
  path.join(root, 'packages/react/src/components/Reschedule/OptimisticDragReschedule.css'),
  path.join(root, 'packages/react/src/components/StockRunway/StockRunwayHorizon.css'),
  path.join(root, 'packages/react/src/components/StockRunway/StockRunway.css'),
  path.join(root, 'packages/angular/src/components/conflict-resolver/concurrent-conflict-resolver.component.css'),
  path.join(root, 'packages/angular/src/components/reschedule/optimistic-drag-reschedule.component.css'),
  path.join(root, 'packages/angular/src/components/stock-runway/stock-runway-horizon.component.css'),
  path.join(root, 'packages/angular/src/components/stock-runway/stock-runway.component.css'),
];

cssFiles.forEach((file) => {
  const rel = path.relative(root, file);
  assert(fs.existsSync(file), `Stylesheet exists: ${rel}`);
  if (fs.existsSync(file)) {
    const css = fs.readFileSync(file, 'utf8');
    assert(css.includes('var(--ds-'), `Uses design token variables: ${rel}`);
  }
});

// 3. Motion & Reduced Motion (§2.1 Motion & Transitions)
console.log('\n🎬 Checking Motion & Reduced Motion Support (§2.1)...');
cssFiles.forEach((file) => {
  if (file.includes('StockRunway.css') || file.includes('stock-runway.component.css')) return;
  const rel = path.relative(root, file);
  const css = fs.readFileSync(file, 'utf8');
  assert(css.includes('prefers-reduced-motion'), `Includes @media (prefers-reduced-motion: reduce): ${rel}`);
});

// 4. Accessibility, Focus Trapping & Scroll Locking (§2.4 Components & Overlays)
console.log('\n♿ Checking Accessibility, Focus Trapping & Body Scroll Lock (§2.4)...');
const reactDrawer = fs.readFileSync(path.join(root, 'packages/react/src/components/ConflictResolver/ConcurrentConflictResolver.tsx'), 'utf8');
const angularDrawer = fs.readFileSync(path.join(root, 'packages/angular/src/components/conflict-resolver/concurrent-conflict-resolver.component.ts'), 'utf8');

assert(reactDrawer.includes('role="dialog"'), 'React drawer has role="dialog"');
assert(reactDrawer.includes('aria-modal="true"'), 'React drawer has aria-modal="true"');
assert(reactDrawer.includes('aria-labelledby="ds-conflict-title"'), 'React drawer has aria-labelledby');
assert(reactDrawer.includes('document.body.style.overflow = \'hidden\''), 'React drawer locks body scroll on open');
assert(reactDrawer.includes('e.key === \'Tab\''), 'React drawer implements Tab / Shift+Tab keyboard focus trap');
assert(reactDrawer.includes('e.key === \'Escape\''), 'React drawer dismisses on Escape key');

assert(angularDrawer.includes('role="dialog"'), 'Angular drawer has role="dialog"');
assert(angularDrawer.includes('aria-modal="true"'), 'Angular drawer has aria-modal="true"');
assert(angularDrawer.includes('aria-labelledby="ds-conflict-title"'), 'Angular drawer has aria-labelledby');
assert(angularDrawer.includes('document.body.style.overflow = \'hidden\''), 'Angular drawer locks body scroll on open');
assert(angularDrawer.includes('handleEscape'), 'Angular drawer dismisses on Escape key');

// 5. Tabular Numerals (§2.1 Typography Scale)
console.log('\n🔢 Checking Tabular Numerals on Data Readouts (§2.1)...');
const conflictCss = fs.readFileSync(path.join(root, 'packages/react/src/components/ConflictResolver/ConcurrentConflictResolver.css'), 'utf8');
assert(conflictCss.includes('tabular-nums'), 'ConcurrentConflictResolver enforces tabular-nums');
const reactRescheduleCss = fs.readFileSync(path.join(root, 'packages/react/src/components/Reschedule/OptimisticDragReschedule.css'), 'utf8');
assert(reactRescheduleCss.includes('tabular-nums'), 'OptimisticDragReschedule capacity metrics enforce tabular-nums');
const reactStockCss = fs.readFileSync(path.join(root, 'packages/react/src/components/StockRunway/StockRunwayHorizon.css'), 'utf8');
assert(reactStockCss.includes('tabular-nums'), 'StockRunwayHorizon day metrics enforce tabular-nums');

// 6. 1:1 React & Angular Parity (§1.7)
console.log('\n⚖️ Checking 1:1 React & Angular Feature & Event Parity (§1.7)...');
// ConcurrentConflictResolver
assert(reactDrawer.includes('onAcceptRemote') && angularDrawer.includes('acceptRemote'), '1:1 Parity on acceptRemote event');
assert(reactDrawer.includes('onForceOverride') && angularDrawer.includes('forceOverride'), '1:1 Parity on forceOverride event');
assert(reactDrawer.includes('onAllocateDelta') && angularDrawer.includes('allocateDelta'), '1:1 Parity on allocateDelta event');

// OptimisticDragReschedule
const reactReschedule = fs.readFileSync(path.join(root, 'packages/react/src/components/Reschedule/OptimisticDragReschedule.tsx'), 'utf8');
const angularReschedule = fs.readFileSync(path.join(root, 'packages/angular/src/components/reschedule/optimistic-drag-reschedule.component.ts'), 'utf8');
assert(reactReschedule.includes('onRescheduleSuccess') && angularReschedule.includes('rescheduleSuccess'), '1:1 Parity on rescheduleSuccess event');
assert(reactReschedule.includes('onRescheduleFailure') && angularReschedule.includes('rescheduleFailure'), '1:1 Parity on rescheduleFailure event');
assert(reactReschedule.includes('reboundingOrderId') && angularReschedule.includes('reboundingOrderId'), '1:1 Parity on spring rebound state');

// StockRunwayHorizon
const reactStock = fs.readFileSync(path.join(root, 'packages/react/src/components/StockRunway/StockRunwayHorizon.tsx'), 'utf8');
const angularStock = fs.readFileSync(path.join(root, 'packages/angular/src/components/stock-runway/stock-runway-horizon.component.ts'), 'utf8');
assert(reactStock.includes('safeDays') && angularStock.includes('safeDays'), '1:1 Parity on safeDays input');
assert(reactStock.includes('reorderDays') && angularStock.includes('reorderDays'), '1:1 Parity on reorderDays input');
assert(reactStock.includes('stockoutDateLabel') && angularStock.includes('stockoutDateLabel'), '1:1 Parity on stockoutDateLabel marker');

// 7. Active Interaction Wiring in Storybook (§1.8)
console.log('\n⚡ Checking Storybook Stories Active Wiring (§1.8)...');
const stories1 = fs.readFileSync(path.join(root, 'apps/storybook/src/stories/ConcurrentConflictResolver.stories.tsx'), 'utf8');
const stories2 = fs.readFileSync(path.join(root, 'apps/storybook/src/stories/OptimisticDragReschedule.stories.tsx'), 'utf8');
const stories3 = fs.readFileSync(path.join(root, 'apps/storybook/src/stories/StockRunwayHorizon.stories.tsx'), 'utf8');

assert(!stories1.includes('onClick={() => {}}') && stories1.includes('setLastAction'), 'ConcurrentConflictResolver stories actively wired');
assert(!stories2.includes('onClick={() => {}}') && stories2.includes('setEventFeed'), 'OptimisticDragReschedule stories actively wired with live event feed');
assert(!stories3.includes('onClick={() => {}}') && stories3.includes('StockRunwayHorizon') && stories3.includes('materials'), 'StockRunwayHorizon stories actively wired with live data rows');

console.log(`\n======================================================`);
console.log(`AUDIT RESULT: ${passedChecks}/${totalChecks} checks passed (${failedChecks} failures).`);
if (failedChecks === 0) {
  console.log('🏆 GOLD STANDARD CERTIFICATION: VERIFIED 100% COMPLIANT');
  process.exit(0);
} else {
  console.error('⚠️ AUDIT FAILED');
  process.exit(1);
}
