/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

module.exports = {
	transform: {
		'^.+\\.[t|j]sx?$': ['babel-jest', { configFile: './babel.config.jest.js' }]
	},
	moduleNameMapper: {
		'\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'<rootDir>/__mocks__/fileMock.js',
		'\\.(css|less)$': '<rootDir>/__mocks__/fileMock.js'
	},
	moduleDirectories: [
		'node_modules',
		// add the directory with the test-utils.js file:
		'test/utils' // a utility folder
	],
	collectCoverage: true,
	testEnvironment: 'jsdom',
	collectCoverageFrom: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx'],
	// coverageDirectory: 'test/coverage',
	coverageReporters: ['text'],
	reporters: ['default', 'jest-junit'],
	// testMatch: ['/test/**/*.js?(x)'],
	setupFilesAfterEnv: ['<rootDir>/src/jest-env-setup.ts'],
	setupFiles: ['<rootDir>/src/jest-polyfills.ts']
};
