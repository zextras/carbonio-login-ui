module.exports = {
	clearMocks: true,
	transform: {
		"^.+\\.[t|j]sx?$": ['babel-jest', { configFile: './babel.config.app.js' }]
	},
	moduleDirectories: [
		'node_modules',
		// add the directory with the test-utils.js file:
	],
	testEnvironment: "jsdom",
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx'],
	coverageDirectory: 'test/coverage',
	coverageReporters: ['text'],
	coveragePathIgnorePatterns: [
		"/node_modules/", '<rootDir>/zapp-ui/src/'
	],
	moduleNameMapper: {
		'^@zextras/zapp-ui$': '<rootDir>/zapp-ui/src/',
	},
	reporters: [ "default", "jest-junit" ],
	roots: [
	  "<rootDir>/src"
	],
	setupFilesAfterEnv: [
		"<rootDir>/src/setupTest.js"
	],
};
