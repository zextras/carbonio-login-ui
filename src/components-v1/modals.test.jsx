/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import OfflineModal from './modals';
import { setupTest } from '../tests/test-setup';

jest.mock('react-i18next');
jest.mock('@zextras/carbonio-design-system');

describe('modals', () => {
	test('loads modal screen', async () => {
		const onCloseFn = jest.fn();
		const open = true;
		// eslint-disable-next-line react/react-in-jsx-scope
		const { offline } = render(<OfflineModal open={open} onClose={onCloseFn} />);
		expect(screen.getByTestId('offline')).toBeInTheDocument();
		// ACT
		// await screen.findByRole('title');
		// ASSERT
		/* const loginButton = screen.getByRole('button', {
			name: /login/i
		});
		expect(loginButton).toBeDisabled(); */
	});
});
