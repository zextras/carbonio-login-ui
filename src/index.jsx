import React, { Suspense, useState } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { extendTheme, SnackbarManager, ThemeProvider } from '@zextras/zapp-ui';

import '../i18n/i18n.config';
import './index.css';
import Loader from './components-index/loader';
import { useTranslation } from 'react-i18next';

function App () {
	const [theme, setTheme] = useState({});
	const {t} = useTranslation();

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

render(
	<App/>
	, document.getElementById('app'));
