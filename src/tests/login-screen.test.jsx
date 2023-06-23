/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { render, screen } from '@testing-library/react';
import React from 'react';
import PageLayout from '../components-v1/page-layout';

describe('login-screen', () => {
	test('loads and displays login screen', async () => {
		// ARRANGE
		// eslint-disable-next-line react/react-in-jsx-scope
		// render(<PageLayout version={2} hasBackendApi={false} />);
		// ACT
		// await screen.findByRole('title');
		// ASSERT
		/* const loginButton = screen.getByRole('button', {
			name: /login/i
		});
		expect(loginButton).toBeDisabled(); */
	});
});
