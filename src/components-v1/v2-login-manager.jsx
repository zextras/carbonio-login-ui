import { useTranslation } from 'react-i18next';
import React, { useCallback, useState } from 'react';
import { map } from	'lodash';
import { Button, Row, Snackbar, Text, Input, Checkbox, Select } from '@zextras/zapp-ui';
import { OfflineModal } from './modals';
import Spinner from './spinner';
import CredentialsForm from './credentials-form';
import { postV2Login, submitOtp } from '../services/v2-service';
import { saveCredentials } from '../utils';

export default function V2LoginManager({ configuration, disableInputs }) {
	const [t] = useTranslation();

	const [loadingCredentials, setLoadingCredentials] = useState(false);
	const [loadingOtp, setLoadingOtp] = useState(false);
	const [progress, setProgress] = useState('credentials');

	const [authError, setAuthError] = useState(false);
	const [showOtpError, setShowOtpError] = useState(false);

	const [otpList, setOtpList] = useState([]);
	const [otpId, setOtpId] = useState('');
	const [otp, setOtp] = useState('');
	const onChangeOtp = useCallback((ev) => {
		setOtp(ev.target.value);
	}, [setOtp]);
	const [rememberDevice, setRememberDevice] = useState(true);
	const toggleRememberDevice = useCallback(() => setRememberDevice(v => !v), [setRememberDevice]);

	const [snackbarNetworkError, setSnackbarNetworkError] = useState(false);
	const [detailNetworkModal, setDetailNetworkModal] = useState(false);

	const submitCredentials = useCallback((username, password) => {
		setLoadingCredentials(true);
		return postV2Login('password', username, password)
			.then(res => {
				switch (res.status) {
					case 200:
						res.json().then(response => {
							saveCredentials(username, password);
							if(response?.['2FA'] === true) {
								setOtpList(
									map(
										response?.otp ?? [],
										obj => ({ label: obj.label, value: obj.id })
									)
								);
								setOtpId(response?.otp?.[0].id);
								setProgress('two-factor');
								setLoadingCredentials(false);
							}
							else {
								window.location.assign(configuration.destinationUrl);
							}
						});
						break;
					case 401:
						setAuthError(t('credentials_not_valid','Credentials are not valid, please check data and try again'));
						setLoadingCredentials(false);
						break;
					case 403:
						setAuthError(t('auth_not_valid','The authentication policy needs more steps: please contact your administrator for more information'));
						setLoadingCredentials(false);
						break;
					default:
						setSnackbarNetworkError(true);
						setLoadingCredentials(false);
				}
			})
			.catch(() => setLoadingCredentials(false));
	}, [configuration.destinationUrl]);

	const submitOtpCb = useCallback((e) => {
		e.preventDefault();
		setLoadingOtp(true);
		submitOtp(otpId, otp, rememberDevice)
			.then(res => {
				if (res.status === 200) {
					window.location.assign(configuration.destinationUrl);
				}
				else {
					setLoadingOtp(false);
					setShowOtpError(true);
				}
			})
			.catch(() => setLoadingOtp(false));
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
					authError={authError}
					submitCredentials={submitCredentials}
					loading={loadingCredentials}
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
				<form onSubmit={submitOtpCb} style={{ width: '100%' }}>
					<input type="submit" style={{ display: 'none' }}/>
					<Row padding={{ bottom: 'large' }}>
						<Text size="large" color="text" weight="bold">
							{t('two_step_authentication', 'Two-Step-Authentication') }
						</Text>
					</Row>
					<Row padding={{ top: 'large' }}>
						<Select
							items={otpList}
							background="gray5"
							label={ t('choose_otp', 'Choose the OTP Method') }
							onChange={setOtpId}
							defaultSelection={otpList[0]}
						/>
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
							loading={loadingOtp}
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