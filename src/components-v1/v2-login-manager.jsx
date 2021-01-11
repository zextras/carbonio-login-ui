import { useTranslation } from 'react-i18next';
import React, { useCallback, useState } from 'react';
import { Button, Row, Snackbar, Text, Input, Checkbox } from '@zextras/zapp-ui';
import { OfflineModal } from './modals';
import Spinner from './spinner';
import CredentialsForm from './credentials-form';
import { postV2Login, submitOtp } from '../services/v2-service';
import { saveCredentials } from '../utils';

export default function V2LoginManager({ configuration, disableInputs }) {
	const [ t ] = useTranslation();

	const [ progress, setProgress ] = useState('credentials');

	const [ showAuthError, setShowAuthError ] = useState(false);
	const [ showOtpError, setShowOtpError ] = useState(false);

	const [ otpId, setOtpId ] = useState('');
	const [ otp, setOtp ] = useState('');
	const onChangeOtp = useCallback((ev) => {
		setOtp(ev.target.value);
	}, [setOtp]);
	const [rememberDevice, setRememberDevice] = useState(true);
	const toggleRememberDevice = useCallback(() => setRememberDevice(v => !v), [setRememberDevice]);

	const [ snackbarNetworkError, setSnackbarNetworkError ] = useState(false);
	const [ detailNetworkModal, setDetailNetworkModal ] = useState(false);

	const submitCredentials = useCallback((username, password) => {
		postV2Login('password', username, password)
			.then(res => {
				switch (res.status) {
					case 200:
						saveCredentials(username, password);
						if(res?.['2FA'] === true) {
							setOtpId(res?.otp?.[0].id);
							setProgress('two-factor');
						}
						else {
							window.location.assign(configuration.destinationUrl);
						}
						break;
					case 401:
						setShowAuthError(true);
						break;
					default:
						setSnackbarNetworkError(true);
				}
			});
	}, [setShowAuthError, setSnackbarNetworkError, configuration.destinationUrl, setOtpId, setProgress]);

	const submitOtpCb = useCallback(() => {
		submitOtp(otpId, otp, rememberDevice).then(res => {
			if (res.status === 200) {
				window.location.assign(configuration.destinationUrl);
			}
			else {
				setShowOtpError(true)
			}
		});
	}, [otpId, otp, rememberDevice, configuration.destinationUrl]);

	const onCloseCbk = useCallback(() => setDetailNetworkModal(false), [setDetailNetworkModal]);
	const onSnackbarActionCbk = useCallback(() => setDetailNetworkModal(true), [setDetailNetworkModal]);
	const onCloseSnackbarCbk = useCallback(() => setSnackbarNetworkError(false), [setSnackbarNetworkError]);

	return (
		<>
			{progress === 'credentials'
			&& (
				<CredentialsForm
					configuration={configuration}
					disableInputs={disableInputs}
					showAuthError={showAuthError}
					submitCredentials={submitCredentials}
				/>
			)}
			{progress === 'waiting'
			&& (
				<Row
					orientation="vertical"
					crossAlignment="center"
					padding={{ vertical: 'extralarge' }}
				>
					<Spinner/>
				</Row>
			)}
			{progress === 'two-factor'
			&& (
				<form style={{ width: '100%' }}>
					<Row padding={{ bottom: 'large' }}>
						<Text size="large" color="text" weight="bold">
							{t('two_step_authentication', 'Two-Step-Authentication') }
						</Text>
					</Row>
					<Row padding={{ top: 'large' }}>
						<Input
							defaultValue={otp}
							hasError={showOtpError}
							disabled={disableInputs}
							onChange={onChangeOtp}
							label={t('type_otp','Type here One-Time-Password')}
							backgroundColor="gray5"
						/>
					</Row>
					<Row padding={{ top: 'extrasmall' }} mainAlignment="flex-start">
						<Text color="error" size="medium" overflow="break-word">
							{showOtpError && t('wrong_password','Wrong password, please check data and try again')}
							{!showOtpError && <br/>}
						</Text>
					</Row>
					<Row
						orientation="vertical"
						crossAlignment="flex-start"
						padding={{ vertical: 'small' }}
					>
						<Button
							onClick={submitOtpCb}
							disabled={disableInputs}
							label={t('login', 'Login')}
							size="fill"
						/>
					</Row>
					<Row mainAlignment="flex-start">
						<Checkbox value={rememberDevice} label={t('remember_device', 'Remember this device')} onClick={toggleRememberDevice} />
					</Row>
				</form>
			)}
			<Snackbar
				open={snackbarNetworkError}
				label={t('cant_login', 'Can not do the login now')}
				actionLabel={t('details', 'Details')}
				onActionClick={onSnackbarActionCbk}
				onClose={onCloseSnackbarCbk}
				autoHideTimeout={10000}
				type="error"
			/>
			<OfflineModal
				open={detailNetworkModal}
				onClose={onCloseCbk}
			/>
		</>
	);
}