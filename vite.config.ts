/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';


export default defineConfig({
	plugins: [
		react({
			babel: {
				presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
				plugins: [
					'@babel/plugin-transform-runtime',
					'@babel/plugin-proposal-class-properties',
					'babel-plugin-styled-components'
				]
			}
		})
	]
});
