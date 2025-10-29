/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const rotate = keyframes`
	100% {
		transform: rotate(360deg);
	}
`;

const dash = keyframes`
	0% {
		stroke-dasharray: 1, 150;
		stroke-dashoffset: 0;
	}
	50% {
		stroke-dasharray: 90, 150;
		stroke-dashoffset: -35;
	}
	100% {
		stroke-dasharray: 90, 150;
		stroke-dashoffset: -124;
	}
`;

const StyledSpinner = styled.svg`
	animation: ${rotate} 2s linear infinite;
	margin: -25px 0 0 -25px;
	width: 50px;
	height: 50px;

	& .path {
		stroke: #0000ff;
		animation: ${dash} 1.5s ease-in-out infinite;
	}
`;

export default function Spinner() {
	return (
		<StyledSpinner viewBox="0 0 50 50">
			<circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
		</StyledSpinner>
	);
}
