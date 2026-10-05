import type { Preview } from '@storybook/react';
import '@ds/tokens/css';
import '../src/dataviz.css';

const preview: Preview = {
  parameters: {
    viewport: {
      viewports: {
        mobile: {
          name: '📱 Mobile (Shop-Floor Handheld)',
          styles: {
            width: '375px',
            height: '667px',
          },
          type: 'mobile',
        },
        tablet: {
          name: '📱 Tablet (MES Shop-Floor Tablet)',
          styles: {
            width: '768px',
            height: '1024px',
          },
          type: 'tablet',
        },
        desktop: {
          name: '💻 Desktop (Control Room Workstation)',
          styles: {
            width: '1280px',
            height: '800px',
          },
          type: 'desktop',
        },
        controlRoom: {
          name: '🖥️ Control Room Wall (1080p)',
          styles: {
            width: '1920px',
            height: '1080px',
          },
          type: 'desktop',
        },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      },
    },
    options: {
      storySort: {
        order: [
          'Foundations',
          'Design Tokens',
          'Primitives',
          'Components',
          'Composites',
          'Interaction Patterns',
          [
            'Overview',
            '01 Validated Submission',
            '02 Conditional Input',
            '03 Staged Input',
            '04 Search Results',
            '05 Collection Refinement',
            '06 Bulk Selection and Action',
            '07 Selection Driven Detail',
            '08 Collection Editing',
            '09 Confirmed Action',
            '10 Explicit Save',
            '11 Asynchronous Action',
            '12 Recoverable Failure',
            '13 Evidence Attachment',
            '14 Direct Manipulation of Order',
            '15 Bulk Data Import',
          ],
          'Layout Templates',
          'Navigation System',
          'Data Visualization',
          '*',
        ],
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#FFFFFF' },
        { name: 'subtle', value: '#F9FAFB' },
        { name: 'dark', value: '#111827' },
      ],
    },
  },
};

export default preview;
