import React, {Suspense, useEffect, useState} from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { SnackbarManager, ThemeContextProvider } from '@zextras/zapp-ui';

import './i18n/i18n.config';
import './index.css';
import { getLoginSupported } from './services/login-page-services';

import ServerNotResponding from './components-index/server-not-responding';
import NotSupportedVersion from './components-index/not-supported-version';

const PageLayoutV1 = React.lazy(() => import('./components-v1/page-layout'));

const MAX_SUPPORTED_VERSION = 2; // to keep updated adding new versions

function App () {
	const [versions, setVersions] = useState();

	useEffect(() => {
		let canceled = false;
		const urlParams = new URLSearchParams(window.location.search);
		const destinationUrl = urlParams.get('destinationUrl');
		const domain = urlParams.get('domain') ?? destinationUrl;

		getLoginSupported(domain)
			.then(({ minApiVersion, maxApiVersion }) => {
				if (!canceled) {
					let v = maxApiVersion;
					if (v > MAX_SUPPORTED_VERSION) {
						v = MAX_SUPPORTED_VERSION;
					}
					setVersions({
						minApiVersion,
						maxApiVersion,
						version: v
					});
				}
			})
			.catch((err) => setVersions({ error: err }));
		return () => {
			canceled = true
		};
	}, []);

	return (
		<ThemeContextProvider>
			<SnackbarManager>
				<Suspense fallback={<div></div>}>
					<Router>
						<Switch>
							{versions && versions.version >= versions.minApiVersion && (
								<PageLayoutV1 version={versions.version} />
							)}
							{versions && versions.version < versions.minApiVersion && <NotSupportedVersion />}
							{versions && versions.error && <ServerNotResponding />}
						</Switch>
					</Router>
				</Suspense>
			</SnackbarManager>
		</ThemeContextProvider>
	);
}

if (process.env.NODE_ENV === 'development') {
	// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
	const { worker } = require('./mocks/browser');
	worker.start();
}

render(
	<App/>,
	document.getElementById('app')
);
