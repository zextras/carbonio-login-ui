import { useTranslation } from 'react-i18next';
import React, { useCallback, useState } from 'react';
import { Button, Row, Snackbar, Text, Input } from '@zextras/zapp-ui';
import { OfflineModal } from './modals';
import Spinner from './spinner';
import CredentialsForm from './credentials-form';

export default function V1LoginManager({ configuration, disableInputs }) {
	const [ t ] = useTranslation();

	const [ progress, setProgress ] = useState('credentials');

	const [ showAuthError, setShowAuthError ] = useState(false);

	const [ otp, setOtp ] = useState('');

	const [ snackbarNetworkError, setSnackbarNetworkError ] = useState(false);
	const [ detailNetworkModal, setDetailNetworkModal ] = useState(false);

	const handleSubmitCredentialsResponse = (res) => {
		switch (res.status) {
			case 401:
				setShowAuthError(true);
				break;
			case 202:
				setProgress('two-factor');
				break;
			default:
				setSnackbarNetworkError(true);
		}
	};

	const submitOtp = useCallback((ev) => {
		// TODO: submitOtp, call Api?
	}, []);

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
					handleSubmitCredentialsResponse={handleSubmitCredentialsResponse}
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
							value={otp}
							disabled={disableInputs}
							onChange={(ev) => setOtp(ev.target.value)}
							label={t('type_otp','Type here One-Time-Password')}
							backgroundColor="gray5"
						/>
					</Row>
					<Row
						orientation="vertical"
						crossAlignment="flex-start"
						padding={{ vertical: 'small' }}
					>
						<Button
							onClick={submitOtp}
							disabled={disableInputs}
							label={t('login', 'Login')}
							size="fill"
						/>
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
