import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

const config: Config = {
  title: 'Books',
  tagline: 'Learning by Reading || 안녕하세요. 개발 서적을 읽고 기록하고 있습니다.',
  url: 'https://mnxmnz-books.vercel.app/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/icon.png',
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'Books',
      logo: {
        alt: 'logo',
        src: 'img/icon.png',
      },
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Books',
          items: [
            {
              label: 'HTTP 완벽 가이드',
              to: '/category/http-완벽-가이드',
            },
            {
              label: 'UX 심리학',
              to: '/category/ux-심리학',
            },
            {
              label: '러닝 타입스크립트',
              to: '/category/러닝-타입스크립트',
            },
            {
              label: '모던 자바스크립트 Deep Dive',
              to: '/category/모던-자바스크립트-deep-dive',
            },
            {
              label: '이펙티브 타입스크립트',
              to: '/category/이펙티브-타입스크립트',
            },
            {
              label: '클린 아키텍처',
              to: '/category/클린-아키텍처',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              href: 'https://mnxmnz.github.io',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/mnxmnz',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/dev-mnxmnz',
            },
          ],
        },
      ],
      copyright: `Copyright © 2022-${new Date().getFullYear()} 김민지 Built with Docusaurus`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  } satisfies Preset.ThemeConfig,
};

module.exports = config;
