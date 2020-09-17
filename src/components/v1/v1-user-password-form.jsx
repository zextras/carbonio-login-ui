import {useTranslation} from "react-i18next";
import React, {useCallback, useState} from "react";
import {Button, Input, Padding, PasswordInput, Row, Snackbar, Text} from '@zextras/zapp-ui';
import {postV1Login} from "../../services/v1-service";
import {OfflineModal} from "../modals";

export default function V1UserPasswordForm({disabled}) {
    const {t} = useTranslation();

    const [progress, setProgress] = useState('waiting');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [snackbarNetworkError, setSnackbarNetworkError] = useState(false);
    const [detailNetworkModal, setDetailNetworkModal] = useState(false);

    const [showAuthError, setShowAuthError] = useState(false);


    const submitUserPassword = useCallback((ev) => {
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
                if (res.status >= 400)
                    setSnackbarNetworkError(true);
                // TODO: handle res.status = 202 (two factor authentication)
                // TODO: handle successful case: redirect to source?
                return res;
            })
    }, [username, password]);

    return (
        <>
            {progress === 'credentials' &&
            <form onSubmit={submitUserPassword} style={{width: '100%'}}>
                <Row padding={{bottom: 'large'}}>
                    <Input
                        value={username}
                        disabled={disabled}
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
                        disabled={disabled}
                        onChange={(ev) => setPassword(ev.target.value)}
                        hasError={showAuthError}
                        autocomplete="password"
                        label={t('Password')}
                        backgroundColor="gray5"
                    />
                </Row>
                <Row orientation="vertical" crossAlignment="flex-start" padding={{vertical: 'extralarge'}}>
                    <Button onClick={submitUserPassword} disabled={disabled} label={t('Login')} size="fill"/>
                    {showAuthError && (
                        <Padding top="small">
                            <Text color="error" size="large" overflow="break-word">
                                {t('The username or password is incorrect')}.
                                {t('Verify that CAPS LOCK is not on, and then retype the current username and password')}.
                            </Text>
                        </Padding>
                    )}
                </Row>
                <input type="submit" style={{display: 'none'}}/>
            </form>
            }
            {progress === 'waiting' &&
            <Row orientation="vertical" crossAlignment="flex-start" padding={{vertical: 'extralarge'}}>
                <Button label="Button" color="primary" onClick={()=>{}} loading />
                <Button type="ghost" label="Button" color="primary" loading />
            </Row>
            }
            {progress === 'two-factor' &&
            <form onSubmit={submitUserPassword} style={{width: '100%'}}>
                <Row padding={{bottom: 'large'}}>
                    <Input
                        value={username}
                        disabled={disabled}
                        onChange={(ev) => setUsername(ev.target.value)}
                        hasError={showAuthError}
                        label={t('Type here One-Time-Password')}
                        backgroundColor="gray5"
                    />
                </Row>
                <input type="submit" style={{display: 'none'}}/>
            </form>
            }
            <Snackbar
                open={snackbarNetworkError}
                label={t('Can not do the login now')}
                actionLabel="Details"
                onActionClick={() => setDetailNetworkModal(true)}
                onClose={() => setSnackbarNetworkError(false)}
                autoHideTimeout={10000}
                type="error"
            />
            <OfflineModal open={detailNetworkModal} onClose={() => setDetailNetworkModal(false)}/>
        </>
    );
}