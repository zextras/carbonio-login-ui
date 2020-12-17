import React, { useCallback, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { find } from 'lodash';
import { Button, Input, PasswordInput, Row, Text } from '@zextras/zapp-ui';
import { postV1Login } from '../services/v1-service';

export default function CredentialsForm({
	showAuthError,
	handleSubmitCredentialsResponse,
	configuration,
	disableInputs
}) {
	const [ t ] = useTranslation();

	const [ username, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');

	const submitUserPassword = useCallback((ev) => {
		ev.preventDefault();

		if (!username || !password) return;

		postV1Login(
			'PASSWORD',
			username,
			password
		).then((res) => {
			if (res.status === 200) {
				if (window.PasswordCredential) {
					// eslint-disable-next-line no-undef
					const cred = new PasswordCredential({
						id: username,
						password,
						name: password
					});
					navigator.credentials.store(cred);
				}
				window.location.assign(configuration.destinationUrl);
			}
			else {
				handleSubmitCredentialsResponse(res);
			}
		});
	}, [username, password, configuration.destinationUrl, handleSubmitCredentialsResponse]);

	const samlButtonCbk = useCallback(() => {
		window.location.assign(`/zx/auth/startSamlWorkflow?redirectUrl=${configuration.destinationUrl}`);
	}, [configuration]);

	const samlButton = useMemo(() => {
		if (find(configuration.authMethods, 'saml')) {
			return (
				<Button
					type="outlined"
					label={t('login_saml', 'Login SAML')}
					color="primary"
					disabled={disableInputs}
					onClick={samlButtonCbk}/>
			);
		}

		return (
			// used to keep the correct space where or not SAML is shown
			<div style={{ minHeight: '20px' }}/>
		);
	}, [configuration, disableInputs, samlButtonCbk, t]);

	return (
		<form style={{ width: '100%' }}>
			<Row padding={{ bottom: 'large' }}>
				<Input
					value={username}
					disabled={disableInputs}
					onChange={(ev) => setUsername(ev.target.value)}
					hasError={showAuthError}
					autocomplete="username"
					label={t('username','Username')}
					backgroundColor="gray5"
				/>
			</Row>
			<Row padding={{ bottom: 'small' }}>
				<PasswordInput
					value={password}
					disabled={disableInputs}
					onChange={(ev) => setPassword(ev.target.value)}
					hasError={showAuthError}
					autocomplete="password"
					label={t('password', 'Password')}
					backgroundColor="gray5"
				/>
			</Row>
			<Text color="error" size="medium" overflow="break-word">
				{showAuthError && t('credentials_not_valid','Credentials are not valid, please check data and try again')}
				{!showAuthError && <br/>}
			</Text>
			<Row orientation="vertical" crossAlignment="flex-start" padding={{ bottom: 'large', top: 'small' }}>
				<Button onClick={submitUserPassword} disabled={disableInputs} label={t('login','Login')} size="fill"/>
			</Row>
			<Row mainAlignment="flex-end" padding={{ bottom: 'extralarge' }}>
				{samlButton}
			</Row>
		</form>
	);
}
