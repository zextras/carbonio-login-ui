import React, { lazy, Suspense, useState } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { extendTheme, SnackbarManager, ThemeProvider } from '@zextras/zapp-ui';

import '../i18n/i18n.config';
import './index.css';
import { getLoginSupported } from './services/login-page-services';
import { useTranslation } from 'react-i18next';

const Loader = lazy(function LoaderFn () {
	const domain = new URLSearchParams(window.location.search).get('domain');
	return getLoginSupported(domain)
		.then(({ maxApiVersion }) => {
			switch (maxApiVersion) {
				case 1:
					return import(/* webpackChunkName: "v1" */ './components-v1/page-layout');
			}
		})
		.catch(() => {
			console.error('The server is not responding. Please contact your server administrator');
			alert('The server is not responding. Please contact your server administrator');
		});
});

function App () {
	const [theme, setTheme] = useState({});
	const { t } = useTranslation();

	return (
		<ThemeProvider theme={extendTheme(theme)}>
			<SnackbarManager>
				<Suspense fallback={
					<div></div>
				}>
					<Router>
						<Switch>
							<Loader theme={theme} setTheme={setTheme}/>
						</Switch>
					</Router>
				</Suspense>
			</SnackbarManager>
		</ThemeProvider>
	);
}

render(
	<App/>
	, document.getElementById('app'));
