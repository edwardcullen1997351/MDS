import '@angular/compiler';
import 'zone.js';
import { Component, ɵresolveComponentResources } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { DsLineChartComponent } from '../packages/angular/src/components/line-chart/line-chart.component.js';
import { DsBarChartComponent } from '../packages/angular/src/components/bar-chart/bar-chart.component.js';
import { DsAreaChartComponent } from '../packages/angular/src/components/area-chart/area-chart.component.js';
import { DsCommandToolbarGroupComponent } from '../packages/angular/src/components/toolbar/command-toolbar-group.component.js';
import { DsTimePhasedMatrixComponent } from '../packages/angular/src/components/table/time-phased-matrix.component.js';
import { DsWorkbench3PaneLayoutComponent } from '../packages/angular/src/components/layout-templates/workbench-3pane-layout.component.js';

@Component({
  selector: 'phase4-angular-host',
  standalone: true,
  imports: [
    DsLineChartComponent, DsBarChartComponent, DsAreaChartComponent,
    DsCommandToolbarGroupComponent, DsTimePhasedMatrixComponent,
    DsWorkbench3PaneLayoutComponent,
  ],
  template: `
    <ds-workbench-3pane-layout>
      <div navPane>Resources</div>
      <div mainPane>Schedule</div>
      <div inspectorPane>Inspector</div>
    </ds-workbench-3pane-layout>
    <ds-command-toolbar-group>
      <button type="button">First</button><button type="button">Second</button><button type="button">Third</button>
    </ds-command-toolbar-group>
    <ds-time-phased-matrix [data]="rows" [periods]="periods"></ds-time-phased-matrix>
    <ds-line-chart title="Output trend" [data]="lineData" [series]="lineSeries"></ds-line-chart>
    <ds-bar-chart title="Output bars" [data]="barData" [series]="barSeries"></ds-bar-chart>
    <ds-area-chart title="Output area" [data]="areaData" [series]="areaSeries" xScaleType="linear"></ds-area-chart>
  `,
})
class Phase4AngularHost {
  periods = [{ id: 'today', label: 'Today', shifts: [{ id: 'day', label: 'Day', key: 'day' }] }];
  rows = [
    { id: 'a', sku: 'A-1', name: 'Item A', primaryStock: 10, primaryUom: 'kg', cells: { day: { value: 2 } } },
    { id: 'b', sku: 'B-1', name: 'Item B', primaryStock: 20, primaryUom: 'kg', cells: { day: { value: 3 } } },
    { id: 'c', sku: 'C-1', name: 'Item C', primaryStock: 30, primaryUom: 'kg', cells: { day: { value: 4 } } },
  ];
  lineData = [
    { timestamp: '2026-01-01', a: 10, b: 15 },
    { timestamp: '2026-01-02', a: 12, b: 13 },
  ];
  lineSeries = [{ key: 'a', label: 'Line A' }, { key: 'b', label: 'Line B' }];
  barData = [{ label: 'A', a: 10, b: 15 }, { label: 'B', a: 12, b: 13 }];
  barSeries = [{ key: 'a', label: 'Bar A' }, { key: 'b', label: 'Bar B' }];
  areaData = [{ x: 1, a: 10, b: 15 }, { x: 2, a: 12, b: 13 }];
  areaSeries = [{ key: 'a', label: 'Area A' }, { key: 'b', label: 'Area B' }];
}

const checks: string[] = [];
const check = (name: string, pass: boolean) => checks.push(`${name}:${pass ? 'pass' : 'fail'}`);

async function run() {
  await ɵresolveComponentResources(async () => '');
  await bootstrapApplication(Phase4AngularHost);
  await new Promise(resolve => setTimeout(resolve, 50));
  const root = document.querySelector('phase4-angular-host')!;
  const workbench = root.querySelector('ds-workbench-3pane-layout')!;
  check('workbench-main', workbench.querySelectorAll('main:not([role]),main[role="main"]').length === 1);
  check('workbench-secondary', [...workbench.querySelectorAll('nav:not([role]),aside:not([role])')].every(region => Boolean(region.getAttribute('aria-label'))));
  check('workbench-tabs', workbench.querySelectorAll('[role="tab"][aria-controls]').length === 3 && workbench.querySelectorAll('[role="tabpanel"]').length === 3);

  const toolbar = root.querySelector('[role="toolbar"]')!;
  const buttons = [...toolbar.querySelectorAll('button')];
  check('toolbar-one-tab-stop', buttons.filter(button => button.tabIndex === 0).length === 1);
  buttons[0].focus();
  buttons[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
  check('toolbar-arrow', document.activeElement === buttons[1] && buttons[1].tabIndex === 0);

  const gridRows = [...root.querySelectorAll('ds-time-phased-matrix tbody tr')];
  check('matrix-one-tab-stop', gridRows.length === 3 && gridRows.filter(row => (row as HTMLElement).tabIndex === 0).length === 1);
  (gridRows[0] as HTMLElement).focus();
  gridRows[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
  check('matrix-arrow', document.activeElement === gridRows[1] && (gridRows[1] as HTMLElement).tabIndex === 0);

  for (const kind of ['line', 'bar', 'area']) {
    const chart = root.querySelector(`ds-${kind}-chart`)!;
    const table = chart.querySelector('table');
    check(`${kind}-table`, Boolean(table && table.querySelectorAll('tbody tr').length >= 2));
    const toggle = chart.querySelector<HTMLButtonElement>('.ds-chart-table-summary');
    check(`${kind}-toggle`, Boolean(toggle && toggle.getAttribute('aria-pressed') === 'false'));
    toggle?.click();
    await new Promise(resolve => setTimeout(resolve, 0));
    check(`${kind}-visible-table`, Boolean(toggle?.getAttribute('aria-pressed') === 'true' && !table?.parentElement?.classList.contains('ds-chart-table-wrap--visually-hidden')));
  }
  check('line-shapes', root.querySelectorAll('ds-line-chart .ds-line-chart__legend-line circle,ds-line-chart .ds-line-chart__legend-line rect').length >= 2);
  check('bar-patterns', root.querySelectorAll('ds-bar-chart pattern').length > 0);
  check('area-patterns', root.querySelectorAll('ds-area-chart pattern').length > 0);
  document.querySelector('#result')!.textContent = `PHASE4_ANGULAR ${checks.join(' ')}`;
}

run().catch(error => {
  document.querySelector('#result')!.textContent = `PHASE4_ANGULAR runtime:fail(${String(error?.stack || error).replace(/[<>]/g, '')})`;
});
