/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useState } from 'react';

import styled from '@emotion/styled';
import {
	Button,
	Checkbox,
	Input,
	Row,
	Text,
	Container,
	Padding
} from '@zextras/carbonio-design-system';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';

import { useLoginConfigStore } from '../store/login/store';

const SecretCodeBox = styled.div`
	width: 100%;
	padding: 16px;
	border: 1px solid #ccc;
	border-radius: 4px;
	text-align: center;
	word-break: break-all;
	font-size: 1.25rem;
	font-weight: bold;
	letter-spacing: 2px;
`;

function extractSecretFromUri(uri) {
	try {
		const url = new URL(uri);
		return url.searchParams.get('secret') || '';
	} catch {
		return '';
	}
}

export default function OtpSetup({
	otpUri,
	onBackToLogin,
	onVerifyCode,
	disableInputs,
	loading,
	verifyError,
	attemptsRemaining,
	onBack
}) {
	const [t] = useTranslation();
	const { loginLogo } = useLoginConfigStore();
	const [code, setCode] = useState('');
	const [trustDevice, setTrustDevice] = useState(false);
	const toggleTrustDevice = useCallback(() => setTrustDevice((v) => !v), []);

	const hasError = !!verifyError;

	const secretCode = extractSecretFromUri(otpUri);

	const onChangeCode = useCallback((ev) => {
		const { value } = ev.target;
		setCode(value);
	}, []);

	const handleSubmit = useCallback(
		(e) => {
			e.preventDefault();
			if (code.length > 0) {
				onVerifyCode(code, trustDevice);
			}
		},
		[code, onVerifyCode, trustDevice]
	);

	return (
		<form onSubmit={handleSubmit} style={{ width: '100%' }}>
			<input type="submit" style={{ display: 'none' }} />
			<Row
				orientation="vertical"
				crossAlignment="flex-start"
				padding={{ bottom: 'small' }}
				width="100%"
			>
				<Button
					data-testid="back_to_login"
					type="ghost"
					onClick={onBackToLogin}
					label={t('back_to_login_page', 'Back to login page')}
					icon="ArrowBackOutline"
					iconPlacement="left"
				/>
			</Row>
			<Container mainAlignment="flex-start" height="auto" data-testid="form-wrapper">
				<Padding value="16px 0 20px" width="100%">
					<Container crossAlignment="left">
						{loginLogo &&
							(loginLogo.url ? (
								<a target="_blank" href={loginLogo.url} rel="noreferrer">
									<img
										alt="Logo"
										src={loginLogo.image}
										width={150}
										style={{
											maxWidth: '100%',
											maxHeight: '150px',
											display: 'block'
										}}
										data-testid="logo"
									/>
								</a>
							) : (
								<img
									alt="Logo"
									src={loginLogo.image}
									width={loginLogo.width}
									style={{
										maxWidth: '100%',
										maxHeight: '150px',
										display: 'block'
									}}
									data-testid="logo"
								/>
							))}
					</Container>
				</Padding>
			</Container>
			<Row padding={{ bottom: 'large' }} mainAlignment="flex-start">
				<Text
					size="large"
					color="text"
					weight="bold"
					overflow="break-word"
					style={{ lineHeight: '27px' }}
				>
					{t(
						'otp_wizard_title',
						'Your organization introduced the Two-Factor-Authentication to improve the security of your account.'
					)}
				</Text>
			</Row>
			<Row padding={{ bottom: 'large' }} mainAlignment="flex-start">
				<Text color="text" overflow="break-word" style={{ lineHeight: '24px' }}>
					{t(
						'otp_setup_description',
						'Configure the 2 Factor Authentication service (2FA) following few easy steps:'
					)}
				</Text>
			</Row>

			{/* Step 1 */}
			<Row padding={{ bottom: 'small', top: 'large' }} mainAlignment="flex-start">
				<Text weight="bold" overflow="break-word">
					{t('otp_setup_step1_title', 'Step 1')}
				</Text>
			</Row>
			<Row padding={{ bottom: 'large' }} mainAlignment="flex-start">
				<Text color="text" overflow="break-word">
					{t('otp_setup_step1_scan_qr', 'Use your authenticator app to scan the QR Code below')}
				</Text>
			</Row>

			{/* QR Code */}
			<Row padding={{ bottom: 'small' }} mainAlignment="flex-start">
				<div
					data-testid="otp_qr_code"
					style={{
						padding: '16px',
						border: '1px solid #ccc',
						borderRadius: '2px',
						display: 'inline-block'
					}}
				>
					<QRCodeSVG value={otpUri} size={140} />
				</div>
			</Row>

			<Row padding={{ top: 'large', bottom: 'small' }} mainAlignment="flex-start">
				<Text color="text" overflow="break-word">
					{t(
						'otp_setup_cant_scan',
						"Can't scan the code? Enter this secret code into your authenticator app"
					)}
				</Text>
			</Row>
			<Row padding={{ bottom: 'large' }} mainAlignment="flex-start">
				<SecretCodeBox data-testid="otp_secret_code">{secretCode}</SecretCodeBox>
			</Row>

			{/* Step 2 */}
			<Row padding={{ bottom: 'small', top: 'large' }} mainAlignment="flex-start">
				<Text weight="bold" overflow="break-word">
					{t('otp_setup_step2_title', 'Step 2')}
				</Text>
			</Row>
			<Row padding={{ bottom: 'small' }} mainAlignment="flex-start">
				<Text color="text" overflow="break-word">
					{t(
						'otp_setup_step2_enter_code',
						'Enter the 6-digit code generated by your authenticator app'
					)}
				</Text>
			</Row>
			<Row padding={{ bottom: 'large' }}>
				<Input
					value={code}
					hasError={hasError}
					disabled={disableInputs}
					onChange={onChangeCode}
					label={t('otp_setup_code_placeholder', 'Insert the 6-digit code generated')}
					backgroundColor="gray5"
					data-testid="otp_setup_code_input"
				/>
			</Row>
			<Row padding={{ bottom: 'extrasmall' }} mainAlignment="flex-start">
				<Text color="error" size="small" overflow="break-word">
					{hasError
						? t(
								'otp_setup_code_error',
								'This code is incorrect or expired. Please try again. ({{count}} attempts remaining)',
								{ count: attemptsRemaining ?? 0 }
							)
						: ''}
					{!hasError && <br />}
				</Text>
			</Row>
			<Row padding={{ bottom: 'small' }} mainAlignment="flex-start">
				<Checkbox
					value={trustDevice}
					label={t('remember_device_or_ip', 'Remember this device or IP')}
					onClick={toggleTrustDevice}
				/>
			</Row>
			<Row mainAlignment="space-between" padding={{ vertical: 'small' }} width="100%">
				<Row padding={{ all: 'small' }} width="50%">
					<Button
						type="outlined"
						onClick={onBack}
						label={t('back', 'Back')}
						style={{ flex: 1 }}
						data-testid="otp_setup_back"
						width="fill"
					/>
				</Row>
				<Row padding={{ all: 'small' }} width="50%">
					<Button
						onClick={handleSubmit}
						disabled={disableInputs || code.length === 0}
						label={t('verify_and_proceed', 'Verify and proceed')}
						loading={loading}
						style={{ flex: 1 }}
						width="fill"
						data-testid="otp_setup_verify"
					/>
				</Row>
			</Row>
		</form>
	);
}
