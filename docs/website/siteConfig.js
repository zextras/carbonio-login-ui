// Copyright (c) 2017-present, Facebook, Inc.
/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
	title: 'Zextras Login', // Title for your website.
	tagline: '',
	url: 'https://doc.dev.zextras.com/', // Your website URL
	baseUrl: '/iris/zapp-login/' + (process.env.BRANCH_NAME ? `${process.env.BRANCH_NAME}/` : ''), // Base URL for your project */
	// For github.io type URLs, you would set the url and baseUrl like:
	//   url: 'https://facebook.github.io',
	//   baseUrl: '/test-site/',

	// Used for publishing and more
	projectName: 'com_zextras_zapp_login',
	organizationName: 'Zextras',
	// For top-level user or org sites, the organization is still the same.
	// e.g., for the https://JoelMarcey.github.io site, it would be set like...
	//   organizationName: 'JoelMarcey'

	// For no header links in the top nav bar -> headerLinks: [],
	headerLinks: [
		{ doc: 'main', label: 'Docs' },
		{ doc: 'CHANGELOG', label: 'Change Log' },
		{ page: 'help', label: 'Help' }
	],

	/* path to images for header/footer */
	headerIcon: 'img/favicon.ico',
	footerIcon: 'img/favicon.ico',
	favicon: 'img/favicon.ico',

	/* Colors for website */
	colors: {
		primaryColor: '#149c6f',
		secondaryColor: '#0e6d4d'
	},

	/* Custom fonts for website */
	/*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

	// This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
	copyright: `Copyright © ${new Date().getFullYear()} Zextras`,

	highlight: {
		// Highlight.js theme to use for syntax highlighting in code blocks.
		theme: 'default'
	},

	// Add custom scripts here that would be placed in <script> tags.
	// scripts: ['https://buttons.github.io/buttons.js'],

	// On page navigation for the current documentation page.
	onPageNav: 'separate',
	// No .html extensions for paths.
	cleanUrl: true

	// Open Graph and Twitter card images.
	// ogImage: 'img/undraw_online.svg',
	// twitterImage: 'img/undraw_tweetstorm.svg',

	// For sites with a sizable amount of content, set collapsible to true.
	// Expand/collapse the links and subcategories under categories.
	// docsSideNavCollapsible: true,

	// Show documentation's last contributor's name.
	// enableUpdateBy: true,

	// Show documentation's last update time.
	// enableUpdateTime: true,

	// You may provide arbitrary config keys to be used as needed by your
	// template. For example, if you need your repo's URL...
	//   repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;
