/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { HttpResponse } from 'msw';
import { getAdvancedSupported } from '../advanced-supported';
import { createAPIInterceptor } from '../../jest-env-setup';

describe('getAdvancedSupported', () => {
	it('should return advanced supported TRUE when it replies true', async () => {
		createAPIInterceptor(
			'get',
			'/advanced/supported',
			HttpResponse.json({ supported: true }, { status: 200 })
		);
		const response = await getAdvancedSupported();
		expect(response).toEqual({ supported: true });
	});
	it('should return advanced supported FALSE when it replies false', async () => {
		createAPIInterceptor(
			'get',
			'/advanced/supported',
			HttpResponse.json({ supported: false }, { status: 200 })
		);
		const response = await getAdvancedSupported();
		expect(response).toEqual({ supported: false });
	});
	it('should return error when it fails', async () => {
		createAPIInterceptor('get', '/advanced/supported', HttpResponse.json({}, { status: 500 }));
		const response = await getAdvancedSupported();
		expect(response).toEqual({ errorMessage: 'Failed to check Advanced installation' });
	});
});
