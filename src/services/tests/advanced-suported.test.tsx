/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { HttpResponse } from 'msw';

import { APIInterceptor, createAPIInterceptor } from '../../jest-env-setup';
import { getAdvancedSupported } from '../advanced-supported';

function mockAdvancedSupportedApi(response: HttpResponse): APIInterceptor {
	return createAPIInterceptor('get', '/advanced/supported', response);
}

describe('getAdvancedSupported', () => {
	it('should return advanced supported TRUE when it replies true', async () => {
		mockAdvancedSupportedApi(HttpResponse.json({ supported: true }, { status: 200 }));
		const response = await getAdvancedSupported();
		expect(response).toEqual({ supported: true });
	});

	it('should return advanced supported FALSE when it replies false', async () => {
		mockAdvancedSupportedApi(HttpResponse.json({ supported: false }, { status: 200 }));
		const response = await getAdvancedSupported();
		expect(response).toEqual({ supported: false });
	});

	it.each([500, 404, 503, 502])('should return error when api returns %d', async (code: number) => {
		mockAdvancedSupportedApi(HttpResponse.json({}, { status: code }));
		const response = await getAdvancedSupported();
		expect(response).toEqual({ errorMessage: 'Failed to check Advanced installation' });
	});

	it('should return error when api returns 500 with supported', async () => {
		mockAdvancedSupportedApi(HttpResponse.json({ supported: true }, { status: 500 }));
		const response = await getAdvancedSupported();
		expect(response).toEqual({ errorMessage: 'Failed to check Advanced installation' });
	});

	it('should return error when api returns http error', async () => {
		mockAdvancedSupportedApi(HttpResponse.error());
		const response = await getAdvancedSupported();
		expect(response).toEqual({ errorMessage: 'Failed to check Advanced installation' });
	});
});
