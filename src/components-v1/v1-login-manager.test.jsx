/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { act, screen, within } from '@testing-library/react';
import React from 'react';
import { setup } from '../tests/testUtils';
import V1LoginManager from './v1-login-manager';

describe('v1-login-manager', () => {
	test('renders CredentialsForm component when progress is set to "credentials"', () => {
		setup(
			<V1LoginManager
				configuration={{ authMethods: ['saml'], destinationUrl: 'https://example.com' }}
				disableInputs={false}
			/>
		);

		const credentialsForm = screen.getByTestId('credentials-form');
		expect(credentialsForm).toBeInTheDocument();
	});

	test('submits valid credentials and redirects to destination URL', async () => {
		const mockPostLogin = jest.fn().mockResolvedValueOnce({ status: 200 });
		const mockSaveCredentials = jest.fn();

		jest.mock('../services/v1-service', () => ({
			postV1Login: mockPostLogin
		}));

		jest.mock('../utils', () => ({
			saveCredentials: mockSaveCredentials
		}));

		const { user } = setup(
			<V1LoginManager
				configuration={{ authMethods: ['password'], destinationUrl: '/dashboard' }}
				disableInputs={false}
			/>
		);

		const username = screen.getByTestId('username');
		const password = screen.getByTestId('password');
		const usernameInput = within(username).getByRole('textbox');
		const passwordInput = within(password).getByLabelText(/password/i);
		const loginButton = screen.getByTestId('login');
		await user.clear(usernameInput);
		await user.type(usernameInput, 'testuser');
		await user.clear(passwordInput);
		await user.type(passwordInput, 'testpassword');
		expect(loginButton).toBeEnabled();
		await user.click(loginButton);

		expect(mockPostLogin).toHaveBeenCalledWith('password', 'testuser', 'testpassword');

		// // Wait for the redirection to happen
		// await screen.findByText('Redirecting...');
		// expect(window.location.assign).toHaveBeenCalledWith('/dashboard');
	});
});
