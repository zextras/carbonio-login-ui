/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { act, render, screen } from '@testing-library/react';
import { HttpResponse } from 'msw';

import { AppV2 } from '../appv2';
import { APIInterceptor, createAPIInterceptor } from '../jest-env-setup';

function mockAdvancedSupportedApi(response: HttpResponse): APIInterceptor {
	return createAPIInterceptor('get', '/advanced/supported', response);
}
describe('App', () => {
	it('should display error', async () => {
		mockAdvancedSupportedApi(HttpResponse.error());

		await act(async () => {
			render(<AppV2 />);
		});

		await screen.findByText('Unable to determine product version');
	});
});
