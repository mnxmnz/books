// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "MZ's Book Report",
  tagline: 'Learning by Writing || 안녕하세요. 개발 서적을 읽고 기록하고 있습니다.',
  url: 'https://mnxmnz-book.vercel.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "MZ's Book Report",
        logo: {
          alt: "MZ's Book Report Logo",
          src: 'img/logo.svg',
        },
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Books',
            items: [
              {
                label: 'Bottlenecks',
                to: '/category/bottlenecks',
              },
              {
                label: 'Clean Code',
                to: '/category/clean-code',
              },
              {
                label: 'Javascript The Definitive Guide',
                to: '/category/javascript-the-definitive-guide',
              },
              {
                label: 'Networking Principles',
                to: '/category/networking-principles',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/mnxmnz',
              },
              {
                label: "MZ's Devlog",
                href: 'https://mnxmnz.vercel.app',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} 김민지 Built with Docusaurus`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
