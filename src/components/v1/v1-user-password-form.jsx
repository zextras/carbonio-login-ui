import useLoginView from "./v1-user-password-form-hook";
import {useTranslation} from "react-i18next";
import React, {useCallback, useState} from "react";
import {Button, Checkbox, Input, Padding, PasswordInput, Row, Text, useSnackbar} from '@zextras/zapp-ui';

export default function V1UserPasswordForm({setOpenGenericModal, setOpenOfflineModal}) {
    const {
        doLogin,
        usernameRef,
        passwordRef
    } = useLoginView();
    const {t} = useTranslation();
    const createSnackbar = useSnackbar();
    const [showAuthError, setShowAuthError] = useState(false);

    const onSubmit = useCallback((e) => {
        setShowAuthError(false);
        doLogin(e)
            .catch((err) => {
                if (err.message.startsWith('Unauthorized'))
                    setShowAuthError(true);
                else {
                    const snackbarRef = createSnackbar(
                        {
                            key: String(Date.now()),
                            type: 'error',
                            label: `${t('Can not do the login now')}.`,
                            actionLabel: 'Details',
                            replace: true,
                            onActionClick: () => {
                                window.top.navigator.onLine ? setOpenGenericModal(true) : setOpenOfflineModal(true);
                                snackbarRef();
                            },
                            autoHideTimeout: 5000,
                        }
                    );
                }
            });
    }, [doLogin, createSnackbar, setShowAuthError, setOpenGenericModal, setOpenOfflineModal]);

    return (
        <>
            <form onSubmit={onSubmit} style={{width: '100%'}}>
                <Row padding={{bottom: 'large'}}>
                    <Input inputRef={usernameRef} label={t('Username')} backgroundColor="gray5"/>
                </Row>
                <Row>
                    <PasswordInput inputRef={passwordRef} label={t('Password')} backgroundColor="gray5"/>
                </Row>
                <Row padding={{vertical: 'extralarge'}} mainAlignment="space-between">
                    <Checkbox label={t('Remember me')}/>
                </Row>
                <Row orientation="vertical" crossAlignment="flex-start" padding={{bottom: 'extralarge'}}>
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
        </>
    );
}