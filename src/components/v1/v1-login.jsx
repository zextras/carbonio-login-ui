import {useTranslation} from "react-i18next";
import React, {useCallback, useState} from "react";
import {Button, Input, Padding, PasswordInput, Row, Snackbar, Text} from '@zextras/zapp-ui';
import {postV1Login} from "../../services/v1-service";
import {OfflineModal} from "../modals";
import Spinner from "./Spinner";
import V1CredentialsForm from "./v1-credentials-form";

export default function V1Login({disabled, hideSamlButton}) {
    const {t} = useTranslation();

    const [progress, setProgress] = useState('credentials');

    const [showAuthError, setShowAuthError] = useState(false);

    const [otp, setOtp] = useState('');
    const [showOtpError, setOtpError] = useState(true);

    const [snackbarNetworkError, setSnackbarNetworkError] = useState(false);
    const [detailNetworkModal, setDetailNetworkModal] = useState(false);

    const handleSubmitCredentialsResponse = (res) => {
        switch (res.status) {
            case 401:
                setShowAuthError(true);
                break;
            case 202:
                hideSamlButton();
                setProgress('two-factor');
        }
    };

    const submitOtp = useCallback((ev) => {
        // TODO: submitOtp, call Api?
    }, [otp]);

    return (
        <>
            {progress === 'credentials' &&
                <V1CredentialsForm
                    disabled={disabled}
                    showAuthError={showAuthError}
                    handleSubmitCredentialsResponse={handleSubmitCredentialsResponse}
                />
            }
            {progress === 'waiting' &&
                <Row orientation="vertical" crossAlignment="center" padding={{vertical: 'extralarge'}}>
                    <Spinner/>
                </Row>
            }
            {progress === 'two-factor' &&
                <form style={{width: '100%'}}>
                    <Row padding={{bottom: 'large'}}>
                        <Text size="large" color="text" weight="bold">
                            Two-Step-Authentication
                        </Text>
                    </Row>
                    <Row padding={{top: 'large'}}>
                        <Input
                            value={otp}
                            disabled={disabled}
                            onChange={(ev) => setOtp(ev.target.value)}
                            hasError={showAuthError}
                            label={t('Type here One-Time-Password')}
                            backgroundColor="gray5"
                        />
                    </Row>
                    {showOtpError && (
                        <Padding top="small">
                            <Text color="error" overflow="break-word" size="small">
                                {t('Wrong password, please check the the data and try again.')}
                            </Text>
                        </Padding>
                    )}
                    <Row orientation="vertical" crossAlignment="flex-start" padding={{vertical: 'small'}}>
                        <Button onClick={submitOtp} disabled={disabled} label={t('Login')} size="fill"/>
                    </Row>
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