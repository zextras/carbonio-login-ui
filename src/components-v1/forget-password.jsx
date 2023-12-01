/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useCallback, useContext, useState } from 'react';
import {
	Row,
	Text,
	Input,
	Button,
	Container,
	SnackbarManagerContext
} from '@zextras/carbonio-design-system';
import { Trans, useTranslation } from 'react-i18next';
import {
	getRecoveryAccount,
	getSendRecoveryCode,
	validateRecoveryCode
} from '../services/forget-password-service';

const urlParams = new URLSearchParams(window.location.search);

const state = {
	retrieveRecoveryEmail: 'retrieve-recovery-email',
	sendRecoveryCode: 'send-recovery-code',
	validateRecoveryCode: 'validate-recovery-code',
	proceedToLoginScreen: 'proceed-to-login-screen'
};

const ForgetPassword = ({ configuration, disableInputs }) => {
	const [t] = useTranslation();
	const [username, setUsername] = useState(urlParams.get('username') || '');
	const [progress, setProgress] = useState(state.retrieveRecoveryEmail);
	const [code, setCode] = useState('');
	const [recoveryEmail, setRecoveryEmail] = useState('');
	const [showRecoveryEmailError, setShowRecoveryEmailError] = useState(false);
	const [showSendCodeError, setShowSendCodeError] = useState(false);
	const [showValidationCodeError, setShowValidationCodeError] = useState(false);
	const [recoveryAttemptsLeft, setRecoveryAttemptsLeft] = useState();
	const createSnackbar = useContext(SnackbarManagerContext);

	const onRetrieveRecoveryEmail = useCallback(() => {
		getRecoveryAccount(username)
			.then(async (res) => {
				let payload;
				try {
					payload = await res.json();
				} catch (err) {
					payload = await res;
				}
				if (res.status === 200) {
					const email = payload?.Body?.RecoverAccountResponse?.recoveryAccount;
					setRecoveryEmail(email);
					setProgress(state.sendRecoveryCode);
				} else {
					setShowRecoveryEmailError(true);
				}
			})
			.catch((err) => {
				setShowRecoveryEmailError(true);
			});
	}, [username]);

	const onSendRecoveryCode = useCallback(() => {
		getSendRecoveryCode(username)
			.then(async (res) => {
				let payload;
				try {
					payload = await res.json();
				} catch (err) {
					payload = await res;
				}
				if (res.status === 200) {
					const rAttemptLeft = payload?.Body?.RecoverAccountResponse?.recoveryAttemptsLeft;
					setRecoveryAttemptsLeft(rAttemptLeft);
					createSnackbar({
						key: 'success',
						type: 'success',
						label: t('recovery_code_send_success', 'The Recovery code has been send successfully'),
						autoHideTimeout: 3000,
						hideButton: true,
						replace: true
					});
					setProgress(state.validateRecoveryCode);
				} else {
					setShowSendCodeError(true);
				}
			})
			.catch((err) => {
				setShowSendCodeError(true);
			});
	}, [createSnackbar, t, username]);

	const onValidateCode = useCallback(() => {
		validateRecoveryCode(username, code)
			.then(async (res) => {
				let payload;
				try {
					payload = await res.json();
				} catch (err) {
					payload = await res;
				}
				if (res.status === 200) {
					setProgress(state.proceedToLoginScreen);
				} else {
					setShowValidationCodeError(true);
				}
			})
			.catch((err) => {
				setShowValidationCodeError(true);
			});
	}, [code, username]);

	const onProceedWithSession = useCallback(() => {
		window.location.assign(configuration.destinationUrl);
	}, [configuration.destinationUrl]);

	return (
		<>
			{progress !== state.proceedToLoginScreen && (
				<Row
					orientation="vertical"
					crossAlignment="flex-start"
					padding={{ bottom: 'small' }}
					width="100%"
				>
					<Button
						data-testid="return_to_login"
						type="ghost"
						onClick={onProceedWithSession}
						label={t('return_to_login', 'Return To Login')}
						width="fill"
					/>
				</Row>
			)}
			{progress === state.retrieveRecoveryEmail && (
				<>
					<Row crossAlignment="flex-start" mainAlignment="flex-start">
						<Text overflow="break-word">
							{t(
								'enter_your_username_to_retrieve_recovery_email',
								'Please enter your username so we may retrieve the recovery email.'
							)}
						</Text>
					</Row>
					<Row padding={{ bottom: 'medium' }} width="100%">
						<Input
							defaultValue={username}
							data-testid="username"
							onChange={(e) => {
								setUsername(e.target.value);
								setShowRecoveryEmailError(false);
							}}
							autocomplete="username"
							hasError={showRecoveryEmailError}
							label={t('username', 'Username')}
							backgroundColor="gray5"
						/>
					</Row>
					{showRecoveryEmailError && (
						<Row padding={{ top: 'extrasmall' }} mainAlignment="flex-start">
							<Text color="error" size="medium" overflow="break-word">
								{t(
									'something_went_wrong',
									'Something went wrong. Please contact your administrator.'
								)}
							</Text>
						</Row>
					)}
					<Row
						orientation="vertical"
						crossAlignment="flex-start"
						padding={{ bottom: 'medium' }}
						width="100%"
					>
						<Button
							data-testid="submit"
							onClick={onRetrieveRecoveryEmail}
							label={t('submit', 'Submit')}
							width="fill"
							disabled={!username}
						/>
					</Row>
					<Row crossAlignment="flex-start" mainAlignment="flex-start">
						<Text size="small" overflow="break-word">
							{t(
								'not_have_recovery_email_setup_note',
								'Don’t have a recovery email setup? Please contact your system administrator for support.'
							)}
						</Text>
					</Row>
				</>
			)}
			{progress === state.sendRecoveryCode && (
				<>
					<Row crossAlignment="flex-start" mainAlignment="flex-start" width="100%">
						<Text overflow="break-word">
							<Trans
								i18nKey="still_have_access_to_recovery_email"
								defaults="Do you still have access to <strong>{{ recovery_email }}</strong>?"
								components={{ bold: <strong /> }}
								values={{ recovery_email: recoveryEmail }}
							/>
						</Text>
					</Row>
					<Row crossAlignment="flex-start" mainAlignment="flex-start" width="100%">
						<Text overflow="break-word">
							{t(
								'send_a_recovery_code_notes',
								'Click on the button below to send a recovery code to that address, use it validate the next request.'
							)}
						</Text>
					</Row>
					{showSendCodeError && (
						<Row padding={{ top: 'extrasmall' }} mainAlignment="flex-start">
							<Text color="error" size="medium" overflow="break-word">
								{t(
									'something_went_wrong',
									'Something went wrong. Please contact your administrator.'
								)}
							</Text>
						</Row>
					)}
					<Row
						orientation="vertical"
						crossAlignment="flex-start"
						padding={{ bottom: 'medium' }}
						width="100%"
					>
						<Button
							data-testid="submit"
							onClick={onSendRecoveryCode}
							label={t('send_recovery_code', 'Send Recovery Code')}
							width="fill"
						/>
					</Row>
				</>
			)}
			{progress === state.validateRecoveryCode && (
				<>
					<Row crossAlignment="flex-start" mainAlignment="flex-start" width="100%">
						<Text overflow="break-word">
							<Trans
								i18nKey="validation_code_was_sent_to_recovery_email"
								defaults="The validation code was sent to <strong>{{ recovery_email }}</strong> and will be valid for 10 minutes. Enter the code in the form below."
								components={{ bold: <strong /> }}
								values={{ recovery_email: recoveryEmail }}
							/>
						</Text>
					</Row>
					<Row padding={{ bottom: 'large' }} width="100%">
						<Input
							defaultValue={code}
							data-testid="username"
							onChange={(e) => setCode(e.target.value)}
							autocomplete="code"
							label={t('code', 'Code')}
							backgroundColor="gray5"
						/>
					</Row>
					{showValidationCodeError && (
						<Row padding={{ top: 'extrasmall' }} mainAlignment="flex-start">
							<Text color="error" size="medium" overflow="break-word">
								{t(
									'something_went_wrong',
									'Something went wrong. Please contact your administrator.'
								)}
							</Text>
						</Row>
					)}
					<Row
						width="100%"
						mainAlignment="space-between"
						crossAlignment="center"
						padding={{ bottom: 'large', top: 'small' }}
					>
						<Container crossAlignment="flex-start" mainAlignment="flex-start" width="48%">
							<Button
								data-testid="resendCode"
								onClick={onSendRecoveryCode}
								label={t('resend_Code', 'Resend Code')}
								type="outlined"
								size="medium"
								width="fill"
								disabled={recoveryAttemptsLeft === 0}
							/>
						</Container>
						<Container crossAlignment="flex-start" mainAlignment="flex-start" width="48%">
							<Button
								data-testid="validateCode"
								onClick={onValidateCode}
								label={t('validate_code', 'Validate Code')}
								width="fill"
								size="medium"
								disabled={!code}
							/>
						</Container>
					</Row>
					<Row width="100%">
						<Text size="small" overflow="break-word">
							{t(
								'resend_code_notes',
								'Don’t see the code in your inbox? Wait a couple of minutes or check your spam folder. If you still don’t see it please click on "Resend Code".'
							)}
						</Text>
					</Row>
				</>
			)}
			{progress === state.proceedToLoginScreen && (
				<>
					<Row crossAlignment="flex-start" mainAlignment="flex-start">
						<Text size="medium" overflow="break-word">
							<Trans
								i18nKey="glad_to_have_you_back_username"
								defaults="Glad to have you back, <strong>{{ username }}</strong>!"
								components={{ bold: <strong /> }}
								values={{ username }}
							/>
						</Text>
					</Row>
					<Row crossAlignment="flex-start" mainAlignment="flex-start">
						<Text size="medium" overflow="break-word">
							{t(
								'proceed_with_the_login_and_change_your_password',
								'You can proceed with the login, but remember to also change your password'
							)}
						</Text>
					</Row>
					<Row
						orientation="vertical"
						crossAlignment="flex-start"
						padding={{ bottom: 'large', top: 'small' }}
						width="100%"
					>
						<Button
							data-testid="submit"
							onClick={onProceedWithSession}
							label={t('continue_with_your_session', 'Continue With Your Session')}
							type="outlined"
							width="fill"
						/>
					</Row>
				</>
			)}
		</>
	);
};
export default ForgetPassword;
