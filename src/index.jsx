import React, { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { extendTheme, SnackbarManager, ThemeProvider } from '@zextras/zapp-ui';

import './i18n/i18n.config';
import './index.css';
import Loader from './components-index/loader';

function App () {
	const [ theme, setTheme ] = useState({});
	const [ t ] = useTranslation();

	document.title = t('zextras_authentication', 'Zextras Authentication');

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

if (process.env.NODE_ENV === 'development') {
	// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
	const { worker } = require('./mocks/browser');
	worker.start();
}

render(
	<App/>, 
	document.getElementById('app')
);
