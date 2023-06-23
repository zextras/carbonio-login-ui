/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { render, screen } from '@testing-library/react';
import React from 'react';
import Test1 from './test1';

describe('<Test1 />', () => {
	it('Renders <Test1 /> component correctly', () => {
		const { getByText } = render(<Test1 />);
		expect(getByText(/Getting started with React testing library/i)).toBeInTheDocument();
	});
});
