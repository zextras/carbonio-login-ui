import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Snackbar } from '@zextras/zapp-ui';
import { OfflineModal } from './modals';
import Spinner from './spinner';
import CredentialsForm from './credentials-form';
import { postV1Login } from '../services/v1-service';
import { addUiParameters, saveCredentials } from '../utils';

export default function V1LoginManager({ configuration, disableInputs }) {
	const [t] = useTranslation();

	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState('credentials');

	const [authError, setAuthError] = useState();

	const [snackbarNetworkError, setSnackbarNetworkError] = useState(false);
	const [detailNetworkModal, setDetailNetworkModal] = useState(false);

	const submitCredentials = useCallback((username, password) => {
		setLoading(true);
		return postV1Login('password', username, password)
			.then(res => {
				switch (res.status) {
					case 200:
						saveCredentials(username, password);
						window.location.assign(addUiParameters(configuration.destinationUrl, configuration.hasIris));
						break;
					case 401:
						setAuthError(t('credentials_not_valid','Credentials are not valid, please check data and try again'));
						setLoading(false);
						break;
					case 403:
						setAuthError(t('auth_not_valid','The authentication policy needs more steps: please contact your administrator for more information'));
						setLoading(false);
						break;
					default:
						setSnackbarNetworkError(true);
						setLoading(false);
				}
			})
			.catch(() => setLoading(false));
	}, [configuration.destinationUrl]);

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
					loading={loading}
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
