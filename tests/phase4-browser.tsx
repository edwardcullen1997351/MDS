import React from 'react';
import { createRoot } from 'react-dom/client';
import { CommandToolbarGroup } from '../packages/react/src/components/Toolbar/CommandToolbarGroup.js';
import { TimePhasedMatrix } from '../packages/react/src/components/Table/TimePhasedMatrix.js';
import { Card, CardLink, CardHeader, CardTitle, CardFooter } from '../packages/react/src/components/Card/Card.js';
import { LineChart } from '../packages/react/src/components/LineChart/LineChart.js';
import { BarChart } from '../packages/react/src/components/BarChart/BarChart.js';
import { AreaChart } from '../packages/react/src/components/AreaChart/AreaChart.js';

const periods = [{ id: 'today', label: 'Today', shifts: [{ id: 'am', label: 'AM', key: 'am' }] }];
const rows = Array.from({ length: 3 }, (_, index) => ({
  id: `row-${index}`, sku: `SKU-${index}`, name: `Material ${index}`,
  primaryStock: index + 1, primaryUom: 'kg', cells: { am: { value: index + 1 } },
}));
const chartData = [
  { label: 'Mon', value: 5, target: 7 },
  { label: 'Tue', value: 8, target: 6 },
  { label: 'Wed', value: 6, target: 9 },
];
const checks: string[] = [];
const check = (name: string, passed: boolean) => checks.push(`${name}:${passed ? 'pass' : 'fail'}`);
const delay = () => new Promise(resolve => setTimeout(resolve, 80));

function App() {
  const [pinned, setPinned] = React.useState(false);
  return <>
    <div id="toolbar">
      <CommandToolbarGroup aria-label="Test commands" primaryControls={<>
        <button id="command-a">First</button><button id="command-b">Second</button><button id="command-c">Third</button>
      </>} filterControls={<input aria-label="Filter records" />} />
    </div>
    <div id="matrix"><TimePhasedMatrix data={rows} periods={periods} /></div>
    <div id="card"><Card as="article"><CardHeader><CardTitle><CardLink href="#report">Open report</CardLink></CardTitle></CardHeader>
      <CardFooter><button id="pin" onClick={() => setPinned(!pinned)}>{pinned ? 'Unpin' : 'Pin'}</button></CardFooter></Card></div>
    <section id="report">Report</section>
    <div id="line"><LineChart data={chartData} xKey="label" yKey="value" series={[
      { key: 'value', label: 'Actual' }, { key: 'target', label: 'Target' },
    ]} /></div>
    <div id="bar"><BarChart data={chartData} categoryKey="label" series={[
      { key: 'value', label: 'Actual' }, { key: 'target', label: 'Target' },
    ]} /></div>
    <div id="area"><AreaChart data={chartData} xKey="label" xScaleType="point" series={[
      { key: 'value', label: 'Actual' }, { key: 'target', label: 'Target' },
    ]} /></div>
  </>;
}

async function run() {
  createRoot(document.querySelector('#root')!).render(<App />);
  await delay();
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('#toolbar button')];
  check('toolbar-one-tab-stop', buttons.map(button => button.tabIndex).join(',') === '0,-1,-1');
  buttons[0].focus();
  buttons[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
  check('toolbar-arrow', document.activeElement === buttons[1] && buttons[1].tabIndex === 0);
  check('toolbar-filter-tab-stop', document.querySelector<HTMLInputElement>('#toolbar input')!.tabIndex === 0);

  const gridRows = [...document.querySelectorAll<HTMLTableRowElement>('#matrix tr[data-row-index]')];
  check('matrix-one-tab-stop', gridRows.map(row => row.tabIndex).join(',') === '0,-1,-1');
  gridRows[0].focus();
  gridRows[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
  await delay();
  check('matrix-arrow', document.activeElement === gridRows[1] && gridRows[1].tabIndex === 0);

  const card = document.querySelector<HTMLElement>('#card article')!;
  const link = card.querySelector<HTMLAnchorElement>('a')!;
  check('card-separate-controls', card.querySelector('button')?.parentElement !== link && getComputedStyle(link, '::after').position === 'absolute');
  card.querySelector<HTMLButtonElement>('#pin')!.click();
  await delay();
  check('card-secondary-action', card.querySelector('#pin')?.textContent === 'Unpin' && location.hash === '');

  for (const type of ['line', 'bar', 'area']) {
    const region = document.querySelector<HTMLElement>(`#${type}`)!;
    const table = region.querySelector('table');
    const wrapper = region.querySelector<HTMLElement>('.ds-chart-table-content')!;
    check(`${type}-screen-reader-table`, !!table && getComputedStyle(wrapper).display !== 'none' && getComputedStyle(wrapper).position === 'absolute');
    region.querySelector<HTMLButtonElement>('.ds-chart-table-summary')!.click();
    await delay();
    check(`${type}-visual-table-toggle`, getComputedStyle(wrapper).position !== 'absolute');
  }
  check('line-shapes', !!document.querySelector('#line svg circle') && !!document.querySelector('#line svg rect'));
  check('bar-patterns', !!document.querySelector('#bar svg pattern') && !!document.querySelector('#bar svg rect[fill^="url("]'));
  check('area-patterns', !!document.querySelector('#area svg pattern') && !!document.querySelector('#area svg path[fill^="url("]'));
  document.querySelector('#result')!.textContent = `PHASE4_RESULT ${checks.join(' ')}`;
}

run().catch(error => {
  document.querySelector('#result')!.textContent = `PHASE4_RESULT script:fail ${String(error)}`;
});
