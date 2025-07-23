/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { screen } from '@testing-library/react';
import { HttpResponse } from 'msw';

import { setup } from './testUtils';
import { App } from '../app';
import { CARBONIO_CE_SUPPORTED_BROWSER_LINK } from '../constants';
import { createAPIInterceptor } from '../jest-env-setup';

describe('App', () => {
	it.todo('display error when advanced supported api fails');

	it('should display the CE form when advanced supported api fails', async () => {
		createAPIInterceptor('get', '/zx/login/supported', HttpResponse.error());

		setup(<App />);

		// didn't want to add a data-testid and touch legacy code, so relied on link
		const links = await screen.findAllByRole('link');
		const carbonioCeLink = links.find(
			(link) => link.getAttribute('href') === CARBONIO_CE_SUPPORTED_BROWSER_LINK
		);
		expect(carbonioCeLink).toBeInTheDocument();
	});
});
