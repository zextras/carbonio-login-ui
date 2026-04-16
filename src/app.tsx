/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useEffect, useState } from 'react';

import { SnackbarManager } from '@zextras/carbonio-design-system';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import { ErrorPage } from './error-page';
import { LoadingView } from './loading-view';
import { LoginAdvanced } from './loginAdvanced';
import { LoginCE } from './loginCE';
import { OidcErrorPage } from './oidc-error-page';
import { getAdvancedSupported } from './services/advanced-supported';
import { ThemeProvider } from './theme-provider/theme-provider';

type Error = {
	errorMessage: string;
};

type AdvancedSupport = {
	supported: boolean;
};

type Loading = {
	isLoading: true;
};

export function App(): React.JSX.Element {
	const oidcError =
		new URLSearchParams(window.location.search).has('oidcError') ||
		new URLSearchParams(window.location.search).has('error');

	const [apiResponse, setApiResponse] = useState<AdvancedSupport | Loading | Error>({
		isLoading: true
	});

	useEffect(() => {
		setApiResponse({ isLoading: true });
		getAdvancedSupported().then((data) => {
			if ('errorMessage' in data) {
				setApiResponse({
					errorMessage: ''
				});
				return;
			}
			setApiResponse({
				supported: data.supported
			});
		});
	}, []);
	const errorResponse = apiResponse && 'errorMessage' in apiResponse;
	const isLoading = !apiResponse || (apiResponse && 'isLoading' in apiResponse);
	const supportedResponse = apiResponse && 'supported' in apiResponse;

	return (
		<ThemeProvider>
			<SnackbarManager>
				<Router>
					<Switch>
						{oidcError && <OidcErrorPage />}
						{!oidcError && errorResponse && <ErrorPage />}
						{isLoading && <LoadingView />}
						{supportedResponse && apiResponse.supported && <LoginAdvanced />}
						{supportedResponse && !apiResponse.supported && <LoginCE />}
					</Switch>
				</Router>
			</SnackbarManager>
		</ThemeProvider>
	);
}
