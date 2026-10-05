import React, { useState } from 'react';
import './ChartDataTable.css';

/** Keeps the data table in the accessibility tree while its visual display is toggled. */
export const ChartDataTable: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  return (
    <section className="ds-chart-table-details">
      <button
        type="button"
        className="ds-chart-table-summary"
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? 'Hide data table on screen' : 'Show data table on screen'}
      </button>
      <div
        className={`ds-chart-table-content ${visible ? '' : 'ds-chart-table-content--visually-hidden'}`}
        role="group"
        aria-label="Chart data table"
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Visible overflow needs a keyboard scroll target.
        tabIndex={visible ? 0 : -1}
      >
        {children}
      </div>
    </section>
  );
};
