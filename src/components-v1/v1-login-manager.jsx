import { useTranslation } from 'react-i18next';
import React, { useCallback, useState } from 'react';
import { Button, Row, Snackbar, Text } from '@zextras/zapp-ui';
import { OfflineModal } from './modals';
import Spinner from './Spinner';
import CredentialsForm from './credentials-form';

export default function V1LoginManager ({ configuration, hideSamlButton }) {
	const { t } = useTranslation();

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
			default:
				setSnackbarNetworkError(true);
		}
	};

	const submitOtp = useCallback((ev) => {
		// TODO: submitOtp, call Api?
	}, []);

	return (
		<>
			{progress === 'credentials'
			&& (
				<CredentialsForm
					configuration={configuration}
					showAuthError={showAuthError}
					handleSubmitCredentialsResponse={handleSubmitCredentialsResponse}
				/>
			)}
			{progress === 'waiting'
			&& (
				<Row orientation="vertical" crossAlignment="center" padding={{ vertical: 'extralarge' }}>
					<Spinner/>
				</Row>
			)}
			{progress === 'two-factor'
			&& (
				<form style={{ width: '100%' }}>
					<Row padding={{ bottom: 'large' }}>
						<Text size="large" color="text" weight="bold">
							Two-Step-Authentication
						</Text>
					</Row>
					<Row padding={{ top: 'large' }}>
						<Input
							value={otp}
							disabled={configuration.disableInputs}
							onChange={(ev) => setOtp(ev.target.value)}
							hasError={showOtpError}
							label={t('Type here One-Time-Password')}
							backgroundColor="gray5"
						/>
					</Row>
					<Row orientation="vertical" crossAlignment="flex-start" padding={{ vertical: 'small' }}>
						<Button onClick={submitOtp} disabled={configuration.disableInputs} label={t('Login')} size="fill"/>
					</Row>
				</form>
			)}
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
