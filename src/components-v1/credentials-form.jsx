import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Container, Input, PasswordInput, Row, Text } from '@zextras/zapp-ui';
import { postV1Login } from '../services/v1-service';

export default function CredentialsForm ({
	showAuthError,
	handleSubmitCredentialsResponse,
	configuration
}) {
	const { t } = useTranslation();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

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
					const cred = new PasswordCredential({
						id: username,
						password,
						name: password
					});
					navigator.credentials.store(cred);
				}
				window.location.assign(configuration.destinationUrl);
			} else {
				handleSubmitCredentialsResponse(res);
			}
		});
	}, [username, password, configuration.destinationUrl, handleSubmitCredentialsResponse]);

	return (
		<form style={{ width: '100%' }}>
			<Row padding={{ bottom: 'large' }}>
				<Input
					value={username}
					disabled={configuration.disableInputs}
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
					disabled={configuration.disableInputs}
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
				<Button onClick={submitUserPassword} disabled={configuration.disableInputs} label={t('login','Login')} size="fill"/>
			</Row>
			<Row mainAlignment="flex-end" padding={{ bottom: 'extralarge' }}>
				{configuration.authMethods.includes('SAML') &&
				<Button type="outlined" label={t('login_saml', 'Login SAML')} color="primary" disabled={configuration.disableInputs}
								onClick={() => { window.location.assign(`/zx/auth/startSamlWorkflow?destinationUrl=${configuration.destinationUrl}`);}}/>
				}
				{
					!configuration.authMethods.includes('SAML') && <div style={{ minHeight: '20px' }}/>
					// used to keep the correct space where or not SAML is shown
				}
			</Row>
		</form>
	);
}
