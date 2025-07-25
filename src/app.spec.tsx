/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { test, expect } from '@playwright/experimental-ct-react17';
import {Component} from "./component";




test('should return error when advanced supported API does not answer', async ({ mount }) => {
	const component = await mount(<Component />);
	await expect(component).toContainText('Hello');
});
