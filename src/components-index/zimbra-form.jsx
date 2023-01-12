/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useTranslation } from 'react-i18next';
import React, { useCallback, useState } from 'react';

import CredentialsForm from '../components-v1/credentials-form';
import ChangePasswordForm from '../components-v1/change-password-form';

const formState = {
	credentials: 'credentials',
	waiting: 'waiting',
	twoFactor: 'two-factor',
	changePassword: 'change-password'
};

const zimbraLogin = (username, password) => {
	return fetch('/service/soap/AuthRequest', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'omit',
		body: JSON.stringify({
			Body: {
				AuthRequest: {
					_jsns: 'urn:zimbraAccount',
					csrfTokenSecured: '1',
					persistAuthTokenCookie: '1',
					generateDeviceId: '1',
					account: {
						by: 'name',
						_content: username
					},
					password: {
						_content: password
					},
					prefs: [{ pref: { name: 'zimbraPrefMailPollingInterval' } }]
				}
			}
		})
	});
};

export function ZimbraForm({ destinationUrl }) {
	const { t } = useTranslation();
	const [authError, setAuthError] = useState();
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(formState.credentials);
	const [loadingChangePassword, setLoadingChangePassword] = useState(false);
	const [loadingCredentials, setLoadingCredentials] = useState(false);
	const [email, setEmail] = useState('');

	const submitCredentials = useCallback(
		(username, password) => {
			setLoading(true);
			setLoadingCredentials(true);
			return zimbraLogin(username, password)
				.then(async (res) => {
					const payload = await res.json();
					console.log('[payload]', payload);
					console.log('[payload][res]', res);
					setLoadingCredentials(false);
					setEmail(username);
					if (payload.Body.Fault) {
						if (
							payload.Body.Fault?.Detail?.Error?.Code &&
							payload.Body.Fault?.Detail?.Error?.Code === 'account.CHANGE_PASSWORD'
						) {
							console.log('[payload] change password');
							setProgress(formState.changePassword);
						} else {
							throw new Error(payload.Body.Fault.Reason.Text);
						}
					}
					console.log('[payload][comes]', payload);
					switch (res.status) {
						case 200:
							window.location.assign(destinationUrl || window.location.origin);
							break;
						case 401:
						case 500:
							setAuthError(
								t(
									'credentials_not_valid',
									'Credentials are not valid, please check data and try again'
								)
							);
							setLoading(false);
							break;
						case 403:
							setAuthError(
								t(
									'auth_not_valid',
									'The authentication policy needs more steps: please contact your administrator for more information'
								)
							);
							setLoading(false);
							break;
						default:
							setLoading(false);
					}
				})
				.catch((err) => {
					setLoading(false);
					setLoadingCredentials(false);
					if (err.message.startsWith('authentication failed'))
						setAuthError(
							t(
								'credentials_not_valid',
								'Credentials are not valid, please check data and try again'
							)
						);
					else setAuthError(err.message);
				});
		},
		[destinationUrl, t]
	);

	return (
		<>
			{progress === formState.credentials && (
				<CredentialsForm
					configuration={{ destinationUrl, authMethods: ['zimbra'] }}
					disableInputs={false}
					authError={authError}
					submitCredentials={submitCredentials}
					loading={loading}
				/>
			)}
			{progress === formState.changePassword && (
				<ChangePasswordForm
					isLoading={loadingChangePassword}
					setIsLoading={setLoadingChangePassword}
					configuration={{
						destinationUrl: `${window?.location?.protocol}//${window?.location?.host}`,
						authMethods: ['zimbra']
					}}
					username={email}
				/>
			)}
		</>
	);
}
