/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { Suspense, useEffect, useState } from 'react';

import { SnackbarManager } from '@zextras/carbonio-design-system';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import './i18n/i18n.config';
import './index.css';
import NotSupportedVersion from './components-index/not-supported-version';
import { getLoginSupported } from './services/login-page-services';
import { ThemeProvider } from './theme-provider/theme-provider';

const PageLayoutV1 = React.lazy(() => import('./components-v1/page-layout'));

export function App() {
	const [versions, setVersions] = useState();
	const [hasBackendApi, setHasBackendApi] = useState(true);

	useEffect(() => {
		// let canceled = false;

		if (hasBackendApi) {
			getLoginSupported()
				.then(({ minApiVersion, maxApiVersion }) => {
					// if (!canceled) {
					const v = maxApiVersion;
					// if (v > MAX_SUPPORTED_VERSION) {
					// 	v = MAX_SUPPORTED_VERSION;
					// }
					setVersions({
						minApiVersion,
						maxApiVersion,
						version: v
					});
					// }
				})
				.catch(() => setHasBackendApi(false));
		}
		// return () => {
		// 	canceled = true;
		// };
	}, [hasBackendApi]);

	return (
		<ThemeProvider>
			<SnackbarManager>
				<Suspense fallback={<div></div>}>
					<Router>
						<Switch>
							{(!hasBackendApi || (versions && versions.version >= versions.minApiVersion)) && (
								<PageLayoutV1 version={versions?.version} hasBackendApi={hasBackendApi} />
							)}
							{versions && versions.version < versions.minApiVersion && <NotSupportedVersion />}
						</Switch>
					</Router>
				</Suspense>
			</SnackbarManager>
		</ThemeProvider>
	);
}
