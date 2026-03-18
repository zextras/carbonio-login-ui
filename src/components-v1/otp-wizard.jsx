/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useMemo, useState } from 'react';

import { Button, Container, Input, Row, Text, Padding } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';

import { useLoginConfigStore } from '../store/login/store';

const OTP_NAME_MAX_LENGTH = 20;
const OTP_NAME_REGEX = /^[a-zA-Z0-9_]+$/;

export default function OtpWizard({ onBackToLogin, onProceed, disableInputs, loading }) {
	const [t] = useTranslation();
	const { loginLogo } = useLoginConfigStore();
	const [otpName, setOtpName] = useState('');
	const [hasError, setHasError] = useState(false);

	const onChangeOtpName = useCallback((ev) => {
		const { value } = ev.target;
		setOtpName(value);
		if (value.length > 0 && !OTP_NAME_REGEX.test(value)) {
			setHasError(true);
		} else if (value.length > OTP_NAME_MAX_LENGTH) {
			setHasError(true);
		} else {
			setHasError(false);
		}
	}, []);

	const isProceedDisabled = useMemo(
		() =>
			disableInputs ||
			otpName.length === 0 ||
			otpName.length > OTP_NAME_MAX_LENGTH ||
			!OTP_NAME_REGEX.test(otpName),
		[disableInputs, otpName]
	);

	const handleProceed = useCallback(
		(e) => {
			e.preventDefault();
			if (!isProceedDisabled) {
				onProceed(otpName);
			}
		},
		[isProceedDisabled, onProceed, otpName]
	);

	return (
		<form onSubmit={handleProceed} style={{ width: '100%' }}>
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
					width="fill"
				/>
			</Row>
			<Container mainAlignment="flex-start" height="auto" data-testid="form-wrapper">
				<Padding value="28px 0 28px" width="100%">
					<Container crossAlignment="center">
						{loginLogo &&
							(loginLogo.url ? (
								<a target="_blank" href={loginLogo.url} rel="noreferrer">
									<img
										alt="Logo"
										src={loginLogo.image}
										width={loginLogo.width}
										style={{
											maxWidth: '100%',
											maxHeight: '150px',
											display: 'block',
											marginLeft: 'auto',
											marginRight: 'auto'
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
										display: 'block',
										marginLeft: 'auto',
										marginRight: 'auto'
									}}
									data-testid="logo"
								/>
							))}
					</Container>
				</Padding>
			</Container>
			<Row padding={{ bottom: 'large' }} mainAlignment="flex-start">
				<Text size="large" color="text" weight="bold" overflow="break-word">
					{t(
						'otp_wizard_title',
						'Your organization introduced the Two-Factor-Authentication to improve the security of your account.'
					)}
				</Text>
			</Row>
			<Row padding={{ bottom: 'large' }} mainAlignment="flex-start">
				<Text color="secondary" overflow="break-word">
					{t(
						'otp_wizard_description',
						'Before you start, create a unique name to help you identify it later in your security settings.'
					)}
				</Text>
			</Row>
			<Row padding={{ bottom: 'small' }} mainAlignment="flex-start">
				<Text color="text" overflow="break-word">
					{t('otp_wizard_input_label', 'Enter a name that is easy for you to remember')}
				</Text>
			</Row>
			<Row padding={{ bottom: 'extrasmall' }}>
				<Input
					value={otpName}
					hasError={hasError}
					disabled={disableInputs}
					onChange={onChangeOtpName}
					label={t('otp_wizard_input_placeholder', 'Insert a unique name')}
					backgroundColor="gray5"
					data-testid="otp_wizard_name_input"
				/>
			</Row>
			<Row padding={{ bottom: 'large' }} mainAlignment="flex-start">
				<Text color="secondary" size="small" overflow="break-word">
					{t(
						'otp_wizard_input_hint',
						'Maximum 20 characters. Do not use special characters, spaces, or hyphens.'
					)}
				</Text>
			</Row>
			<Row orientation="vertical" crossAlignment="flex-start" padding={{ vertical: 'small' }}>
				<Button
					onClick={handleProceed}
					disabled={isProceedDisabled}
					label={t('proceed_with_configuration', 'Proceed with configuration')}
					width="fill"
					loading={loading}
					data-testid="otp_wizard_proceed"
				/>
			</Row>
		</form>
	);
}
