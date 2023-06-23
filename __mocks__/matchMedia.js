/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
// __mocks__/matchMedia.js

Object.defineProperty(window, 'matchMedia', {
	value: () => ({
		matches: false,
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		addListener: () => {},
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		removeListener: () => {}
	})
});

Object.defineProperty(window, 'getComputedStyle', {
	value: () => ({
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		getPropertyValue: () => {}
	})
});

// module.exports = window;
