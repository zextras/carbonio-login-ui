/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { Suspense, useEffect, useState } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { SnackbarManager } from '@zextras/carbonio-design-system';
import { ThemeProvider } from './theme-provider/theme-provider';
import './i18n/i18n.config';
import './index.css';
import { getLoginSupported } from './services/login-page-services';
import NotSupportedVersion from './components-index/not-supported-version';
import { MAX_SUPPORTED_VERSION } from './constants';
import { prepareUrlForForward } from './utils';

const PageLayoutV1 = React.lazy(() => import('./components-v1/page-layout'));

function App() {
	const [versions, setVersions] = useState();
	const [hasBackendApi, setHasBackendApi] = useState(true);

	const urlParams = new URLSearchParams(window.location.search);

	useEffect(() => {
		let canceled = false;
		const domain = urlParams.get('domain') ?? urlParams.get('destinationUrl');

		if (hasBackendApi) {
			getLoginSupported(domain)
				.then(({ minApiVersion, maxApiVersion }) => {
					if (!canceled) {
						const v = maxApiVersion;
						// if (v > MAX_SUPPORTED_VERSION) {
						// 	v = MAX_SUPPORTED_VERSION;
						// }
						setVersions({
							minApiVersion,
							maxApiVersion,
							version: v
						});
					}
				})
				.catch(() => setHasBackendApi(false));
		}
		return () => {
			canceled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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

if (process.env.NODE_ENV === 'development') {
	// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
	const { worker } = require('./mocks/browser');
	worker.start();
}

render(<App />, document.getElementById('app'));
