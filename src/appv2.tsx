/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { Suspense, useEffect, useState } from 'react';

import { SnackbarManager } from '@zextras/carbonio-design-system';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import { getLoginSupported } from './services/login-page-services';
import { ThemeProvider } from './theme-provider/theme-provider';

type Error = {
	errorMessage: string;
};

type AdvancedSupport = {
	supported: boolean;
};
export function AppV2(): React.JSX.Element {
	// TODO: check advanced supported
	const [advancedSupported, setAdvancedSupported] = useState<AdvancedSupport>();
	const [error, setError] = useState<Error>();

	useEffect(() => {
		getLoginSupported()
			.then((data) => {
				if ('supported' in data) {
					setAdvancedSupported({
						supported: data.supported
					});
				} else {
					setError({
						errorMessage: ''
					});
				}
			})
			.catch(() => {
				setError({ errorMessage: '' });
			});
	}, []);

	return (
		<ThemeProvider>
			<SnackbarManager>
				<Suspense fallback={<div></div>}>
					<Router>
						<Switch>{error ? <>Unable to determine product version</> : <></>}</Switch>
					</Router>
				</Suspense>
			</SnackbarManager>
		</ThemeProvider>
	);
}
