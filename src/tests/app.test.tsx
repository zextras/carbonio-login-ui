/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import { HttpResponse } from 'msw';

import { setup } from './testUtils';
import { App } from '../app';
import { CARBONIO_CE_SUPPORTED_BROWSER_LINK, CARBONIO_SUPPORTED_BROWSER_LINK } from '../constants';
import { APIInterceptor, createAPIInterceptor } from '../jest-env-setup';

function apiMinMaxVersions(response: HttpResponse): APIInterceptor {
	return createAPIInterceptor('get', '/zx/login/supported', response);
}

function apiLoginConfigAPI(response: HttpResponse): APIInterceptor {
	return createAPIInterceptor('get', '/zx/login/supported', response);
}

describe('App', () => {
	it('should display the CE form when advanced supported api fails', async () => {
		apiMinMaxVersions(HttpResponse.error());

		setup(<App />);

		// didn't want to add a data-testid and touch legacy code, so relied on link
		const links = await screen.findAllByRole('link');
		const carbonioCeLink = links.find(
			(link) => link.getAttribute('href') === CARBONIO_CE_SUPPORTED_BROWSER_LINK
		);
		expect(carbonioCeLink).toBeInTheDocument();
	});
	it('should display the ADVANCED form when advanced supported api pass', async () => {
		const version = 1;
		const apiInterceptor = apiMinMaxVersions(
			HttpResponse.json(
				{ minApiVersion: version, maxApiVersion: 2, version },
				{
					status: 200
				}
			)
		);

		setup(<App />);

		await waitFor(() => expect(apiInterceptor.getCalledTimes()).toBe(1));
		// vuoto

		const links = await screen.findAllByRole('link');
		const carbonioLink = links.find(
			(link) => link.getAttribute('href') === CARBONIO_SUPPORTED_BROWSER_LINK
		);
		expect(carbonioLink).toBeInTheDocument();
	});
});
