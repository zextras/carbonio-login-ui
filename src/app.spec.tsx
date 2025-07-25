/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { test, expect } from '@playwright/experimental-ct-react17';

import { App } from './app';

test('should work', async ({ mount }) => {
	const component = await mount(<App />);
	await expect(component).toContainText('Learn React');
});
