/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { act, screen } from '@testing-library/react';
import React from 'react';
import OfflineModal from './modals';
import { setup } from '../tests/testUtils';

describe('modals', () => {
	test('loads modal screen', async () => {
		const onCloseFn = jest.fn();
		const open = true;
		const { user } = setup(<OfflineModal open={open} onClose={onCloseFn} />);
		act(() => {
			jest.runOnlyPendingTimers();
		});
		expect(screen.getByText('Offline')).toBeVisible();
	});
});
