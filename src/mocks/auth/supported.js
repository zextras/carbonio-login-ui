/* eslint-disable import/no-extraneous-dependencies */
/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { http, HttpResponse } from 'msw';

export default http.get('/zx/auth/supported', () => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars

	return HttpResponse.json(
		{
			twoFactorsEnabled: false,
			domain: '6f4c8e62.testarea.zextras.com',
			minApiVersion: 1,
			maxApiVersion: 2,
			destinationUrl: '',
			authMethods: ['password', 'saml']
		},
		{ status: 200 }
	);
});
