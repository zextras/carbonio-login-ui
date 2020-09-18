import React, {useCallback, useState} from "react";
import {Button, Input, Padding, PasswordInput, Row, Text} from '@zextras/zapp-ui';
import {postV1Login} from "../../services/v1-service";
import {useTranslation} from "react-i18next";


export default function V1CredentialsForm({
                                              disabled,
                                              showAuthError,
                                              handleSubmitCredentialsResponse
                                          }) {
    const {t} = useTranslation();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const submitUserPassword = useCallback((ev) => {
        ev.preventDefault();

        if (!username || !password)
            return;

        postV1Login(
            "PASSWORD",
            username,
            password
        ).then(res => {
            if (res.status === 200) {
                if (window.PasswordCredential) {
                    const cred = new PasswordCredential({
                        id: username,
                        password: password,
                        name: password
                    });
                    navigator.credentials.store(cred);
                }
                // TODO: redirect, setCoockie or token
                window.location.href = 'http://www.google.com';
            } else {
                handleSubmitCredentialsResponse(res);
            }
        });
    }, [username, password]);

    return <form style={{width: '100%'}}>
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
        <Row padding={{bottom: 'small'}}>
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
        {showAuthError && (
            <Text color="error" size="medium" overflow="break-word">
                {t('Credentials are not valid. Please check data and try again')}.
            </Text>
        )}
        {!showAuthError && <Text color="error" size="medium" overflow="break-word">&nbsp;</Text>}
        <Row orientation="vertical" crossAlignment="flex-start" padding={{bottom: 'extralarge', top:'large'}}>
            <Button onClick={submitUserPassword} disabled={disabled} label={t('Login')} size="fill"/>

        </Row>
    </form>
}
