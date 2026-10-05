import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const storyPath = new URL('../apps/storybook/src/stories/ReferenceAssemblies.stories.tsx', import.meta.url);
const dashboardLayoutPath = new URL('../packages/react/src/components/LayoutTemplates/DashboardLayout.tsx', import.meta.url);
const dashboardSpecPath = new URL('../specs/assemblies/plant-operations-dashboard.spec.md', import.meta.url);
const plantSettingsSpecPath = new URL('../specs/assemblies/plant-settings.spec.md', import.meta.url);
const workOrderDetailSpecPath = new URL('../specs/assemblies/work-order-detail.spec.md', import.meta.url);

const storySource = readFileSync(storyPath, 'utf8');
const dashboardLayoutSource = readFileSync(dashboardLayoutPath, 'utf8');
const dashboardSpec = readFileSync(dashboardSpecPath, 'utf8');
const plantSettingsSpec = readFileSync(plantSettingsSpecPath, 'utf8');
const workOrderDetailSpec = readFileSync(workOrderDetailSpecPath, 'utf8');

const workOrderRegisterSource = storySource.slice(
  storySource.indexOf('export const RecordListExample'),
  storySource.indexOf('export const RecordDetailExample')
);
const workOrderDetailSource = storySource.slice(
  storySource.indexOf('export const RecordDetailExample'),
  storySource.indexOf('export const DashboardExample')
);
const dashboardSource = storySource.slice(
  storySource.indexOf('export const DashboardExample'),
  storySource.indexOf('export const FormExample')
);
const maintenanceFormSource = storySource.slice(
  storySource.indexOf('export const FormExample'),
  storySource.indexOf('export const SettingsExample')
);
const plantSettingsSource = storySource.slice(
  storySource.indexOf('export const SettingsExample'),
  storySource.indexOf('export const AnalyticsExample')
);
const productionAnalyticsSource = storySource.slice(
  storySource.indexOf('export const AnalyticsExample'),
  storySource.length
);

const requiredWorkOrderDetailContracts = [
  'AssemblyStateHarness id="work-order-detail"',
  'reference-assembly-workspace--comfortable',
  'reference-assembly-data-surface',
  'WORK_ORDER_DETAIL_SCENARIO_ITEMS',
  'WORK_ORDER_DETAIL_SAVE_OUTCOME_ITEMS',
  'WORK_ORDER_DETAIL_HOLD_OUTCOME_ITEMS',
  "getDashboardParam('detailScenario', 'ready')",
  "getDashboardParam('saveOutcome', 'success')",
  "getDashboardParam('holdOutcome', 'success')",
  'role="status"',
  'work-order-detail-header',
  'work-order-detail-grid',
  'Place work order on hold',
  'Confirm Line Hold',
  'QP-4820-D',
  'WO-561204',
  'stress-long-content',
  'high-density-history',
];

const requiredWorkOrderRegisterContracts = [
  'AssemblyStateHarness id="work-order-register"',
  'reference-assembly-workspace--comfortable',
  'reference-assembly-data-surface',
  'WORK_ORDER_REGISTER_SCENARIO_ITEMS',
  'WORK_ORDER_BULK_OUTCOME_ITEMS',
  "getDashboardParam('registerScenario', 'ready')",
  "getDashboardParam('bulkOutcome', 'success')",
  'createWorkOrderStressRecords',
  'paginationWindow',
  'work-order-pagination-ellipsis',
  'Confirm delete selected',
  'Bulk delete outcome unknown',
  'work-order-register-list',
  'role="status"',
  'stress-long-content',
  'high-density',
];

const requiredDashboardContracts = [
  'AssemblyStateHarness id="plant-operations-dashboard"',
  'DASHBOARD_SCENARIO_ITEMS',
  'DASHBOARD_ACTION_OUTCOME_ITEMS',
  "getDashboardParam('dashboardScenario', 'complete')",
  "getDashboardParam('assemblyState', 'ready')",
  'stress-long-content',
  'stress-max-priority',
  'Array.from({ length: 50 }',
  'isLoading={isExporting}',
  "isLoading={scenario === 'module-loading'}",
  "isError={scenario === 'module-error'}",
  'AccessibleDataTable data={displayedTrend}',
  'AccessibleDataTable data={displayedCategories}',
  'displayedReviews.map',
];

const requiredMaintenanceFormContracts = [
  'AssemblyStateHarness id="maintenance-request-form"',
  'MAINTENANCE_FORM_SCENARIO_ITEMS',
  'MAINTENANCE_SUBMIT_OUTCOME_ITEMS',
  'MAINTENANCE_DRAFT_OUTCOME_ITEMS',
  "getDashboardParam('formScenario', 'ready')",
  "getDashboardParam('submitOutcome', 'success')",
  "getDashboardParam('draftOutcome', 'success')",
  'parseMaintenanceCost',
  'Partial dispatch recorded',
  'Draft save failed',
  'aria-live="polite"',
  'label="Run equipment diagnostics"',
  'label="Notify maintenance planner"',
  'stress-long-content',
];

const requiredPlantSettingsContracts = [
  'AssemblyStateHarness id="plant-settings"',
  'reference-assembly-workspace--comfortable',
  'reference-assembly-data-surface',
  'PLANT_SETTINGS_SCENARIO_ITEMS',
  'PLANT_SETTINGS_SAVE_OUTCOME_ITEMS',
  'PLANT_SETTINGS_ROTATION_OUTCOME_ITEMS',
  "getDashboardParam('settingsScenario', 'ready')",
  "getDashboardParam('saveOutcome', 'success')",
  "getDashboardParam('rotationOutcome', 'success')",
  "getDashboardParam('settingsSection', 'general')",
  'plant-settings-nav',
  'plant-settings-status',
  'Rotate webhook signing key',
  'Rollback executed',
  'POL-AUD-12',
  'role="status"',
  'stress-long-content',
  'high-density',
];

const requiredProductionAnalyticsContracts = [
  'AssemblyStateHarness id="production-analytics"',
  'ANALYTICS_SCENARIO_ITEMS',
  'ANALYTICS_EXPORT_OUTCOME_ITEMS',
  "getDashboardParam('analyticsRange', '30d')",
  "getDashboardParam('analyticsScenario', 'complete')",
  "getDashboardParam('exportOutcome', 'success')",
  'analyticsStressSeries',
  'high-density',
  'missing-points',
  'partial-series',
  'Export outcome unknown',
  'role="status"',
  'AccessibleDataTable data={currentData.area}',
  'AccessibleDataTable data={currentData.bars}',
  'AccessibleDataTable data={currentData.velocity}',
];

for (const contract of [
  ...requiredWorkOrderRegisterContracts,
  ...requiredWorkOrderDetailContracts,
  ...requiredDashboardContracts,
  ...requiredMaintenanceFormContracts,
  ...requiredPlantSettingsContracts,
  ...requiredProductionAnalyticsContracts,
]) {
  assert.ok(storySource.includes(contract), `Reference assembly contract missing: ${contract}`);
}

assert.ok(storySource.includes('data-harness="remove-on-copy"'), 'Shared removable inspection harness marker is missing.');

for (const [name, source] of [
  ['Work order register', workOrderRegisterSource],
  ['Work order detail', workOrderDetailSource],
  ['Dashboard assembly', dashboardSource],
  ['Maintenance request form', maintenanceFormSource],
  ['Plant settings', plantSettingsSource],
  ['Production analytics', productionAnalyticsSource],
]) {
  assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b/i, `${name} contains a hexadecimal color literal.`);
  assert.doesNotMatch(source, /['"]\d+(?:\.\d+)?px['"]/, `${name} contains a raw pixel string.`);
  assert.doesNotMatch(source, /[Ã‚ï¿½]|Ã¢[^\s]*/u, `${name} contains mojibake-like text.`);
  assert.doesNotMatch(source, /\b(password|secret|api[_-]?key|bearer|token)\b/i, `${name} contains secret-like text.`);
}

assert.doesNotMatch(dashboardLayoutSource, /#[0-9a-f]{3,8}\b/i, 'DashboardWidget contains a hexadecimal color literal.');
assert.doesNotMatch(dashboardLayoutSource, /['"]\d+(?:\.\d+)?px['"]/, 'DashboardWidget contains a raw pixel string.');

for (const phrase of ['Maximum supported dataset', 'Interaction response p95', 'Module isolation']) {
  assert.ok(dashboardSpec.includes(phrase), `Dashboard performance contract missing: ${phrase}`);
}

for (const phrase of ['Maximum supported dataset', 'Interaction response p95', 'Section switch feedback']) {
  assert.ok(plantSettingsSpec.includes(phrase), `Plant settings performance contract missing: ${phrase}`);
}

for (const phrase of ['Primary record usable within 2 s', 'Tab switch feedback under 100 ms', 'No more than one blocking mutation']) {
  assert.ok(workOrderDetailSpec.includes(phrase), `Work order detail performance contract missing: ${phrase}`);
}

const count =
  requiredWorkOrderRegisterContracts.length +
  requiredWorkOrderDetailContracts.length +
  requiredDashboardContracts.length +
  requiredMaintenanceFormContracts.length +
  requiredPlantSettingsContracts.length +
  requiredProductionAnalyticsContracts.length +
  34;

console.log(`✓ Reference assembly contract verification passed (${count} checks).`);
