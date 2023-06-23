/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { render, screen } from '@testing-library/react';
import React from 'react';
import CredentialsForm from './credentials-form';

describe('credentails-form', () => {
	test('loads and displays credentails screen', async () => {
		const authErrorFn = jest.fn();
		const submitCredentialsFn = jest.fn();
		const destinationUrl = 'https://zextras.com';
		// eslint-disable-next-line react/react-in-jsx-scope
		// render(
		// 	<CredentialsForm
		// 		configuration={{ destinationUrl, authMethods: ['zimbra'] }}
		// 		authError={authErrorFn}
		// 		submitCredentials={submitCredentialsFn}
		// 		disableInputs={false}
		// 		loading={false}
		// 	/>
		// );
		// ACT
		// await screen.findByRole('title');
		// ASSERT
		/* const loginButton = screen.getByRole('button', {
			name: /login/i
		});
		expect(loginButton).toBeDisabled(); */
	});
});
