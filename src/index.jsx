import React, { Suspense, useState } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { extendTheme, SnackbarManager, ThemeProvider } from '@zextras/zapp-ui';

import '../i18n/i18n.config';
import './index.css';
import Loader from './components-index/loader';

function App () {
	const [theme, setTheme] = useState({});

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
