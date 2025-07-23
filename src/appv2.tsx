/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { Suspense, useEffect, useState } from 'react';

import { SnackbarManager } from '@zextras/carbonio-design-system';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

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

export function AppV2(): React.JSX.Element {
	// TODO: check advanced supported
	const [advancedSupported, setAdvancedSupported] = useState<AdvancedSupport | Loading | Error>({
		isLoading: true
	});

	useEffect(() => {
		setAdvancedSupported({ isLoading: true });
		getAdvancedSupported()
			.then((data) => {
				if ('supported' in data) {
					setAdvancedSupported({
						supported: data.supported
					});
				} else {
					setAdvancedSupported({
						errorMessage: ''
					});
				}
			})
			.catch(() => {
				setAdvancedSupported({ errorMessage: '' });
			});
	}, []);
	const errorResponse = advancedSupported && 'errorMessage' in advancedSupported;
	const isLoading = !advancedSupported || (advancedSupported && 'isLoading' in advancedSupported);
	const supportedResponse = advancedSupported && 'supported' in advancedSupported;

	return (
		<ThemeProvider>
			<SnackbarManager>
				<Suspense fallback={<div></div>}>
					<Router>
						<Switch>
							<>
								{errorResponse && `Unable to determine product version`}
								{isLoading && `loading`}
								{supportedResponse && `Supported: ${advancedSupported.supported}`}
							</>
						</Switch>
					</Router>
				</Suspense>
			</SnackbarManager>
		</ThemeProvider>
	);
}
