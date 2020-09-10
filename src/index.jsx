import React from 'react';
import { render } from 'react-dom';
import {
	BrowserRouter as Router,
	Switch,
	Route
} from 'react-router-dom';
import { extendTheme, SnackbarManager, ThemeProvider } from "@zextras/zapp-ui";

import LoginView from './components/login';
import './index.css';
import './i18n/i18n.config';

render(<App />, document.getElementById('app'));

function App() {
	return (
		<ThemeProvider theme={extendTheme({ palette: {light: {}, dark: {}}})}>
			<SnackbarManager>
				<Router>
					<Switch>
						<Route path="/">
							<LoginView />
						</Route>
					</Switch>
				</Router>
			</SnackbarManager>
		</ThemeProvider>
	);
}