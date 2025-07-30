/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import './loading-view.css';
import React, { FC } from 'react';

import Helmet from '../assets/carbonio-head.svg';

export const LoadingView: FC = () => (
	<div data-testid={'loading-view'} className="splash">
		<Helmet />
		<div className="loader">
			<div className="bar"></div>
		</div>
	</div>
);
