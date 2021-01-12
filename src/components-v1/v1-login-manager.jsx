import { useTranslation } from 'react-i18next';
import React, { useCallback, useState } from 'react';
import { Row, Snackbar } from '@zextras/zapp-ui';
import { OfflineModal } from './modals';
import Spinner from './spinner';
import CredentialsForm from './credentials-form';
import { postV1Login } from '../services/v1-service';
import { saveCredentials } from '../utils';

export default function V1LoginManager({ configuration, disableInputs }) {
	const [ t ] = useTranslation();

	const [ progress, setProgress ] = useState('credentials');

	const [ showAuthError, setShowAuthError ] = useState(false);

	const [ snackbarNetworkError, setSnackbarNetworkError ] = useState(false);
	const [ detailNetworkModal, setDetailNetworkModal ] = useState(false);

	const submitCredentials = useCallback((username, password) => {
		postV1Login('password', username, password)
			.then(res => {
				switch (res.status) {
					case 200:
						saveCredentials(username, password);
						window.location.assign(configuration.destinationUrl);
						break;
					case 401:
						setShowAuthError(true);
						break;
					default:
						setSnackbarNetworkError(true);
				}
			});
	}, [setShowAuthError, setSnackbarNetworkError, configuration.destinationUrl]);

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
