const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
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
								label: 'Bottlenecks',
								to: '/category/bottlenecks',
							},
							{
								label: 'Javascript The Definitive Guide',
								to: '/category/javascript-the-definitive-guide',
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
								label: 'Blog',
								href: 'https://mnxmnz.github.io/',
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
