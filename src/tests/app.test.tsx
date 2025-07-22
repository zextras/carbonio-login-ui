/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { HttpResponse } from 'msw';
import { createAPIInterceptor } from '../jest-env-setup';
import React from 'react';
import { setup } from './testUtils';
import { screen } from '@testing-library/react';
import { App } from '../app';

describe('App', () => {
	it('should return advanced supported TRUE when it replies true', async () => {
		createAPIInterceptor('get', '/advanced/supported', HttpResponse.error());

		setup(<App />);
		expect(await screen.findByText('text-to-define')).toBeInTheDocument();
	});
});
