// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

// Preprocessor imports
import dsVariableProcessor from "./js-libs/variables.js";
import lhSubstituteCurrentVersion from "./js-libs/versions.js";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Neuvector Docs',
  tagline: 'Neuvector Docs',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://open-docs.neuvector.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'

  // ***** EDIT BEFORE MERGE *****
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'neuvector', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Preprocessor config
  //
  markdown: {
    mermaid: true,
    preprocessor: ({ filePath, fileContent }) => {
      // Process versions
      fileContent = lhSubstituteCurrentVersion(fileContent, filePath);

      // Process variables
      fileContent = dsVariableProcessor(fileContent);
      return fileContent;
    },
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          sidebarCollapsed: true,
          sidebarCollapsible: true,
          editUrl: 'https://github.com/neuvector/docs/edit/main',
          versions: {
            current: {
              label: 'Next 🚧',
            },
          },
        },
        blog: false,
        theme: {
          customCss: ['./src/css/custom.css', './src/css/index.css'],
        },
        googleTagManager: {
          containerId: "GTM-WJ4HBFR", 
          },
      }),
    ],
  ],

  plugins: [
    [ 
      require.resolve('docusaurus-lunr-search'), 
      {
        languages: ['en'],
        indexBaseUrl: true,
        maxHits: 10,
        highlightResult: true,
      }
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          autoCollapseCategories: true,
        },
      },
      navbar: {
        title: '',
        logo: {
          alt: 'Neuvector Logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo-dark.svg',
        },
        items: [
          // {
          //   type: 'doc',
          //   docId: 'basics/basics',
          //   position: 'left',
          //   label: 'Documentation',
          // },
          { 
            type: 'search',
            position: 'left',
          },
          {
            type: `dropdown`,
            label: `Quick Links`,
            position: `right`,
            items: [
              {
                href: 'https://neuvector.com/',
                label: 'Neuvector Home',
              },
              {
                href: 'https://github.com/neuvector/neuvector/',
                label: 'GitHub',
              },
              {
                href: 'https://github.com/neuvector/docs/',
                label: 'Docs GitHub',
              },
              {
                href: 'https://hub.docker.com/u/neuvector',
                label: 'NeuVector images on Docker Hub',
              },
            ]
          },
          {
            type: 'docsVersionDropdown',
            position: 'left',
            dropdownActiveClassDisabled: true,
          },
          {
            type: 'dropdown',
            label: 'More From SUSE',
            position: 'right',
            items: [
              {
                label: 'Rancher',
                to: 'https://www.rancher.com',
                className: 'navbar__icon navbar__rancher',
              },
              {
                type: 'html',
                value: '<hr style="margin: 0.3rem 0;">',
              },
              {
                label: 'Harvester',
                to: "http://harvesterhci.io",
                className: 'navbar__icon navbar__harvester',
              },
              {
                label: 'Fleet',
                to: "http://fleet.rancher.io",
                className: 'navbar__icon navbar__fleet',
              },
              {
                label: 'Kubewarden',
                to: "http://kubewarden.io",
                className: 'navbar__icon navbar__kubewarden',
              },
              {
                label: 'Rancher Desktop',
                to: "https://rancherdesktop.io",
                className: 'navbar__icon navbar__rd',
              },
              {
                type: 'html',
                value: '<hr style="margin: 0.3rem 0;">',
              },
              {
                label: 'More Projects...',
                to: "https://opensource.suse.com",
                className: 'navbar__icon navbar__suse',
              },
            ],
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} SUSE NeuVector. All Rights Reserved.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['docker'],
      },
    }),
};

export default config;
