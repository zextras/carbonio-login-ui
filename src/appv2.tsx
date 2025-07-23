/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { Suspense } from 'react';

import { SnackbarManager } from '@zextras/carbonio-design-system';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import { LoginAdvanced } from './loginAdvanced';
import { LoginCE } from './loginCE';
import { ThemeProvider } from './theme-provider/theme-provider';

export function AppV2(): React.JSX.Element {
	// TODO: check advanced supported
	// getAdvancedSupported()
	const supported = true;

	return (
		<ThemeProvider>
			<SnackbarManager>
				<Suspense fallback={<div></div>}>
					<Router>
						<Switch>{supported ? <LoginAdvanced /> : <LoginCE />}</Switch>
					</Router>
				</Suspense>
			</SnackbarManager>
		</ThemeProvider>
	);
}
