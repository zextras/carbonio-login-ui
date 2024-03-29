/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useState, useMemo } from 'react';
import { Button, Input, PasswordInput, Row, Text, Tooltip } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { useLoginConfigStore } from '../store/login/store';

const urlParams = new URLSearchParams(window.location.search);

export default function CredentialsForm({
	authError,
	submitCredentials,
	configuration,
	disableInputs,
	onClickForgetPassword,
	loading = false
}) {
	const [t] = useTranslation();

	const [username, setUsername] = useState(urlParams.get('username') || '');
	const [password, setPassword] = useState('');
	const { carbonioDomainName, carbonioFeatureResetPasswordEnabled } = useLoginConfigStore();

	const submitUserPassword = useCallback(
		(e) => {
			e.preventDefault();
			if (username && password) {
				let usernameModified = username;
				if (urlParams.has('virtualacctdomain')) {
					usernameModified = `${usernameModified.replace('@', '.')}@${urlParams.get(
						'virtualacctdomain'
					)}`;
				} else if (urlParams.has('customerDomain') && !username.includes('@')) {
					usernameModified = `${usernameModified.trim()}@${urlParams.get('customerDomain')}`;
				}
				if (!username.includes('@') && carbonioDomainName) {
					usernameModified = `${username}@${carbonioDomainName}`;
				}
				submitCredentials(usernameModified, password);
			}
		},
		[username, password, carbonioDomainName, submitCredentials]
	);

	const samlButtonCbk = useCallback(() => {
		window.location.assign(
			`/zx/auth/startSamlWorkflow?redirectUrl=${configuration.destinationUrl}`
		);
	}, [configuration]);
	const samlButton = useMemo(() => {
		if (configuration.authMethods.includes('saml')) {
			return (
				<Button
					type="outlined"
					data-testid="loginSaml"
					label={t('login_saml', 'Login SAML')}
					color="primary"
					disabled={disableInputs}
					onClick={samlButtonCbk}
				/>
			);
		}
		return (
			// used to keep the correct space where or not SAML is shown
			<div style={{ minHeight: '0px' }} />
		);
	}, [configuration, disableInputs, samlButtonCbk, t]);

	const clickForgetPassword = useCallback(
		(e) => {
			e.preventDefault();
			onClickForgetPassword();
		},
		[onClickForgetPassword]
	);

	const domainElement = useMemo(() => {
		return !username?.includes('@') && carbonioDomainName ? (
			<Tooltip placement="top" label={`@${carbonioDomainName}`} size="small">
				<Text
					color="secondary"
					size="small"
					weight="light"
					style={{ marginTop: '1.25rem', maxWidth: '8.125rem' }}
				>
					@{carbonioDomainName}
				</Text>
			</Tooltip>
		) : null;
	}, [username, carbonioDomainName]);

	return (
		<form
			onSubmit={(e) => e.preventDefault()}
			style={{ width: '100%' }}
			data-testid="credentials-form"
		>
			<Row padding={{ bottom: 'large' }}>
				<Input
					defaultValue={username}
					disabled={disableInputs}
					data-testid="username"
					onChange={(e) => setUsername(e.target.value)}
					hasError={!!authError}
					autocomplete="username"
					label={t('username', 'Username')}
					backgroundColor="gray5"
					CustomIcon={() => domainElement}
				/>
			</Row>
			<Row padding={{ bottom: 'small' }}>
				<PasswordInput
					defaultValue={password}
					disabled={disableInputs}
					data-testid="password"
					onChange={(e) => setPassword(e.target.value)}
					hasError={!!authError}
					autocomplete="password"
					label={t('password', 'Password')}
					backgroundColor="gray5"
				/>
			</Row>
			<Text color="error" size="medium" overflow="break-word">
				{authError || <br />}
			</Text>
			<Row
				orientation="vertical"
				crossAlignment="flex-start"
				padding={{ bottom: 'large', top: 'small' }}
			>
				<Button
					loading={loading}
					data-testid="login"
					onClick={submitUserPassword}
					disabled={disableInputs}
					label={t('login', 'Login')}
					width="fill"
				/>
			</Row>
			<Row mainAlignment="flex-end" padding={{ bottom: 'extralarge' }}>
				{samlButton}
			</Row>
			{carbonioFeatureResetPasswordEnabled !== false && (
				<Row mainAlignment="flex-start" crossAlignment="flex-start">
					<Text
						onClick={clickForgetPassword}
						color="primary"
						style={{ textDecorationLine: 'underline', cursor: 'pointer' }}
					>
						{t('forget_password', 'Forget Password?')}
					</Text>
				</Row>
			)}
		</form>
	);
}
