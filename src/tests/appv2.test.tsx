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
	it('should display error if api returns error', async () => {
		mockAdvancedSupportedApi(HttpResponse.error());

		await act(async () => {
			render(<AppV2 />);
		});

		await screen.findByText('Unable to determine product version');
	});

	it('should display loading', async () => {
		mockAdvancedSupportedApi(HttpResponse.error());

		render(<AppV2 />);

		await screen.findByText('loading');
	});
	it('should display supported true if API ok and supported', async () => {
		mockAdvancedSupportedApi(HttpResponse.json({ supported: true }, { status: 200 }));

		await act(async () => {
			render(<AppV2 />);
		});

		await screen.findByText('Supported: true');
	});

	it('should display supported false if API ok and supported false', async () => {
		mockAdvancedSupportedApi(HttpResponse.json({ supported: false }, { status: 200 }));

		await act(async () => {
			render(<AppV2 />);
		});

		await screen.findByText('Supported: false');
	});
});
