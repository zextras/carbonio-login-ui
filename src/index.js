import React, {useState} from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {extendTheme, SnackbarManager, ThemeProvider} from "@zextras/zapp-ui";

import LoginView from './components/login-view';
import '../i18n/i18n.config';
import './index.css';

function App() {
    const [theme, setTheme] = useState({});

    return (
        <>
            <ThemeProvider theme={extendTheme(theme)}>
                <SnackbarManager>
                    <Router>
                        <Switch>
                            <Route path="/">
                                <LoginView theme={theme} setTheme={setTheme}/>
                            </Route>
                        </Switch>
                    </Router>
                </SnackbarManager>
            </ThemeProvider>
        </>
    );
}

render(<App/>, document.getElementById('app'));
