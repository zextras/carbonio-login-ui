import {useTranslation} from "react-i18next";
import React, {useCallback, useState} from "react";
import {Button, Checkbox, Input, Padding, PasswordInput, Row, Snackbar, Text} from '@zextras/zapp-ui';
import {postV1Login} from "../../services/v1-service";
import {OfflineModal} from "../modals";

export default function V1UserPasswordForm() {
    const {t} = useTranslation();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [snackbarNetworkError, setSnackbarNetworkError] = useState(false);
    const [detailNetworkModal, setDetailNetworkModal] = useState(false);

    const [showAuthError, setShowAuthError] = useState(false);


    const onSubmit = useCallback((ev) => {
        ev.preventDefault();
        setShowAuthError(false);

        // TODO: Move after a successful login
        // It's here for testing (I don't have successful credentials)
        if (window.PasswordCredential) {
            const cred = new PasswordCredential({
                id: username,
                password: password,
                name: password
            });
            navigator.credentials.store(cred);
        }

        postV1Login(
            "PASSWORD",
            username,
            password
        )
            .then(res => {
                if (res.status === 401)
                    setShowAuthError(true);
                if (res.status >= 500)
                    setSnackbarNetworkError(true);
                // TODO: handle successful case: redirect to source?
                return res;
            })
    }, [username, password]);

    return (
        <>
            <form onSubmit={onSubmit} style={{width: '100%'}}>
                <Row padding={{bottom: 'large'}}>
                    <Input
                        value={username}
                        onChange={(ev) => setUsername(ev.target.value)}
                        hasError={showAuthError}
                        autocomplete="username"
                        label={t('Username')}
                        backgroundColor="gray5"
                    />
                </Row>
                <Row>
                    <PasswordInput
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                        hasError={showAuthError}
                        autocomplete="password"
                        label={t('Password')}
                        backgroundColor="gray5"
                    />
                </Row>
                <Row orientation="vertical" crossAlignment="flex-start" padding={{vertical: 'extralarge'}}>
                    <Button onClick={onSubmit} label={t('Login')} size="fill"/>
                    {showAuthError && (
                        <Padding top="small">
                            <Text color="error" overflow="break-word">
                                {t('The username or password is incorrect')}.
                                {t('Verify that CAPS LOCK is not on, and then retype the current username and password')}.
                            </Text>
                        </Padding>
                    )}
                </Row>
                <input type="submit" style={{display: 'none'}}/>
            </form>
            <Snackbar
                open={snackbarNetworkError}
                label={t('Can not do the login now')}
                actionLabel="Details"
                onActionClick={() => setDetailNetworkModal(true)}
                onClose={() => setSnackbarNetworkError(false)}
                autoHideTimeout={10000}
                type="error"
            />
            <OfflineModal open={detailNetworkModal} onClose={()=> setDetailNetworkModal(false)} />
        </>
    );
}