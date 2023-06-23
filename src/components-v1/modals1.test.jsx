/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import OfflineModal from './modals';

describe('OfflineModal', () => {
	test('renders modal with correct title and content', () => {
		// Render the OfflineModal component
		render(<OfflineModal open onClose={jest.fn()} />);

		// Assert that the modal title is rendered correctly
		const modalTitle = screen.getByText('Offline');
		expect(modalTitle).toBeInTheDocument();

		// Assert that the modal content is rendered correctly
		const modalContent = screen.getByText('dgsdgsdgds');
		expect(modalContent).toBeInTheDocument();
	});
});
