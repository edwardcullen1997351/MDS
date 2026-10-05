Switches between sibling views inside one screen — never for navigating to another page.

```jsx
<Tabs label="Alarm state" idBase="alarms" value={tab} onChange={setTab}
  items={[{value:'open',label:'Open',count:3},{value:'ack',label:'Acknowledged',count:1}]} />
<TabPanel idBase="alarms" value="open" active={tab==='open'}><AlarmTable /></TabPanel>

<Tabs label="Range" variant="segmented" size="sm" items={['1h','24h','7d']} value={range} onChange={setRange} />
```

`underline` spans the full content width under a page header; `segmented` is compact and sits inside a card header or toolbar. Always pass `label`. Selection follows focus by default — pass `activation="manual"` when a panel costs a fetch. Pass `idBase` + `TabPanel` to get the tab↔panel roles; without it the component makes no `aria-controls` claim.
