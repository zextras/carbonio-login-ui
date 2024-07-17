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
	SnackbarManagerContext,
	Select,
	Checkbox
} from '@zextras/carbonio-design-system';
import { map } from 'lodash';
import { Trans, useTranslation } from 'react-i18next';

import {
	FEATURE_RESET_PASSWORD_DISABLED,
	ZM_AUTH_TOKEN,
	CONTACT_ADMIN,
	RECOVERY_TOKEN,
	CARBONIO
} from '../constants';
import {
	getRecoveryAccount,
	getSendRecoveryToken,
	validateRecoveryToken
} from '../services/forget-password-service';
import { postV2Login, submitOtp } from '../services/v2-service';
import { setCookie } from '../utils';

const urlParams = new URLSearchParams(window.location.search);

const state = {
	retrieveRecoveryEmail: 'retrieve-recovery-email',
	sendRecoveryToken: 'send-recovery-token',
	validateRecoveryToken: 'validate-recovery-token',
	submitOtpCode: 'submit-otp-code',
	proceedToLoginScreen: 'proceed-to-login-screen'
};

const ForgetPassword = ({ configuration, disableInputs }) => {
	const [t] = useTranslation();
	const [username, setUsername] = useState(urlParams.get('username') || '');
	const [progress, setProgress] = useState(state.retrieveRecoveryEmail);
	const [token, setToken] = useState('');
	const [recoveryEmail, setRecoveryEmail] = useState('');
	const [recoveryEmailError, setRecoveryEmailError] = useState('');
	const [sendTokenError, setSendTokenError] = useState('');
	const [validationTokenError, setValidationTokenError] = useState('');
	const [recoveryAttemptsLeft, setRecoveryAttemptsLeft] = useState();
	const [validationOTPError, setValidationOTPError] = useState('');
	const createSnackbar = useContext(SnackbarManagerContext);
	const [otpList, setOtpList] = useState([]);
	const [otpId, setOtpId] = useState('');
	const [otp, setOtp] = useState('');
	const [trustDevice, setTrustDevice] = useState(false);
	const toggleTrustDevice = useCallback(() => setTrustDevice((v) => !v), [setTrustDevice]);
	const onChangeOtp = useCallback(
		(ev) => {
			setOtp(ev.target.value);
		},
		[setOtp]
	);

	const handleAccountRecoveryError = useCallback(
		(errorCode) => {
			switch (errorCode) {
				case FEATURE_RESET_PASSWORD_DISABLED:
					setRecoveryEmailError(
						t('password_Reset_feature_disabled', 'Password reset feature is disabled.')
					);
					break;

				case CONTACT_ADMIN:
					setRecoveryEmailError(
						t(
							'account_recovery_not_found_or_not_verified',
							'Account Recovery is either not found or not verified. Please contact your administrator.'
						)
					);
					break;

				default:
					setRecoveryEmailError(
						t('something_went_wrong', 'Something went wrong. Please contact your administrator.')
					);
					break;
			}
		},
		[t]
	);

	const onRetrieveRecoveryEmail = useCallback(() => {
		getRecoveryAccount(username)
			.then(async (res) => {
				let payload;
				try {
					payload = await res.json();
				} catch (err) {
					payload = res;
				}
				let email;
				switch (res.status) {
					case 200:
						email = payload?.Body?.RecoverAccountResponse?.recoveryAccount;
						setRecoveryEmail(email);
						setProgress(state.sendRecoveryToken);
						break;
					case 401:
					case 500:
						handleAccountRecoveryError(payload?.Body?.Fault?.Detail?.Error?.Code);
						break;
					case 502:
						setRecoveryEmailError(
							t('server_unreachable', 'Error 502: Service Unreachable - Retry later.')
						);
						break;
					default:
						setRecoveryEmailError(
							t('something_went_wrong', 'Something went wrong. Please contact your administrator.')
						);
						break;
				}
			})
			.catch((err) => {
				setRecoveryEmailError(
					t('something_went_wrong', 'Something went wrong. Please contact your administrator.')
				);
			});
	}, [handleAccountRecoveryError, t, username]);

	const onSendRecoveryToken = useCallback(() => {
		getSendRecoveryToken(username)
			.then(async (res) => {
				let payload;
				try {
					payload = await res.json();
				} catch (err) {
					payload = res;
				}
				let rAttemptLeft;
				switch (res.status) {
					case 200:
						rAttemptLeft = payload?.Body?.RecoverAccountResponse?.recoveryAttemptsLeft;
						setRecoveryAttemptsLeft(rAttemptLeft);
						createSnackbar({
							key: 'success',
							type: 'success',
							label: t(
								'recovery_code_send_success',
								'The Recovery code has been send successfully'
							),
							autoHideTimeout: 3000,
							hideButton: true,
							replace: true
						});
						setProgress(state.validateRecoveryToken);
						break;
					case 502:
						setSendTokenError(
							t('server_unreachable', 'Error 502: Service Unreachable - Retry later.')
						);
						break;
					default:
						setSendTokenError(
							t('something_went_wrong', 'Something went wrong. Please contact your administrator.')
						);
						break;
				}
			})
			.catch((err) => {
				setSendTokenError(
					t('something_went_wrong', 'Something went wrong. Please contact your administrator.')
				);
			});
	}, [createSnackbar, t, username]);

	const validateCommunityToken = useCallback(() => {
		validateRecoveryToken(username, token)
			.then(async (res) => {
				let payload;
				try {
					payload = await res.json();
				} catch (err) {
					payload = res;
				}
				let authTokenArr;
				let authToken;
				switch (res.status) {
					case 200:
						authTokenArr = payload?.Body?.AuthResponse?.authToken;
						authToken =
							authTokenArr && authTokenArr.length > 0 ? authTokenArr[0]._content : undefined;
						if (authToken) {
							setCookie(ZM_AUTH_TOKEN, authToken);
						}
						setProgress(state.proceedToLoginScreen);
						break;
					case 401:
					case 500:
						setValidationTokenError(
							t('authentication_error', 'Authentication Error - Retry later.')
						);
						break;
					case 502:
						setValidationTokenError(
							t('server_unreachable', 'Error 502: Service Unreachable - Retry later.')
						);
						break;
					default:
						setValidationTokenError(
							t('something_went_wrong', 'Something went wrong. Please contact your administrator.')
						);
						break;
				}
			})
			.catch((err) => {
				setValidationTokenError(
					t('something_went_wrong', 'Something went wrong. Please contact your administrator.')
				);
			});
	}, [t, token, username]);

	const validateCarbonioToken = useCallback(() => {
		postV2Login(RECOVERY_TOKEN, username, token)
			.then(async (res) => {
				let payload;
				try {
					payload = await res.json();
				} catch (err) {
					payload = res;
				}
				switch (res.status) {
					case 200:
						if (payload?.['2FA'] === true) {
							setOtpList(
								map(payload?.otp ?? [], (obj) => ({
									label: obj.label,
									value: obj.id
								}))
							);
							setOtpId(payload?.otp?.[0].id);
							setProgress(state.submitOtpCode);
						} else {
							setProgress(state.proceedToLoginScreen);
						}
						break;
					case 401:
					case 500:
						setValidationTokenError(
							t('authentication_error', 'Authentication Error - Retry later.')
						);
						break;
					case 502:
						setValidationTokenError(
							t('server_unreachable', 'Error 502: Service Unreachable - Retry later.')
						);
						break;
					default:
						setValidationTokenError(
							t('something_went_wrong', 'Something went wrong. Please contact your administrator.')
						);
						break;
				}
			})
			.catch((err) => {
				setValidationTokenError(
					t('something_went_wrong', 'Something went wrong. Please contact your administrator.')
				);
			});
	}, [t, token, username]);

	const onValidateToken = useCallback(() => {
		if (configuration?.systemType === CARBONIO) {
			validateCarbonioToken();
		} else {
			validateCommunityToken();
		}
	}, [configuration, validateCarbonioToken, validateCommunityToken]);

	const submitOtpCb = useCallback(
		(e) => {
			submitOtp(otpId, otp, trustDevice)
				.then((res) => {
					switch (res.status) {
						case 200:
							setProgress(state.proceedToLoginScreen);
							break;
						case 400:
						case 401:
						case 500:
							setValidationOTPError(
								t('authentication_error', 'Authentication Error - Retry later.')
							);
							break;
						case 502:
							setValidationOTPError(
								t('server_unreachable', 'Error 502: Service Unreachable - Retry later.')
							);
							break;
						default:
							setValidationOTPError(
								t(
									'something_went_wrong',
									'Something went wrong. Please contact your administrator.'
								)
							);
							break;
					}
				})
				.catch((err) => {
					setValidationOTPError(
						t('something_went_wrong', 'Something went wrong. Please contact your administrator.')
					);
				});
		},
		[otpId, otp, trustDevice, t]
	);

	const onProceedWithSession = useCallback(() => {
		window.location.assign('/');
	}, []);

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
					<Row width="100%">
						<Input
							defaultValue={username}
							data-testid="username"
							onChange={(e) => {
								setUsername(e.target.value);
								setRecoveryEmailError('');
							}}
							autocomplete="username"
							hasError={recoveryEmailError}
							label={t('username', 'Username')}
							backgroundColor="gray5"
						/>
					</Row>
					{recoveryEmailError && (
						<Row mainAlignment="flex-start" width="100%">
							<Text color="error" size="small" overflow="break-word">
								{recoveryEmailError}
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
			{progress === state.sendRecoveryToken && (
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
					{sendTokenError && (
						<Row mainAlignment="flex-start" width="100%">
							<Text color="error" size="small" overflow="break-word">
								{sendTokenError}
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
							onClick={onSendRecoveryToken}
							label={t('send_recovery_code', 'Send Recovery Code')}
							width="fill"
						/>
					</Row>
				</>
			)}
			{progress === state.validateRecoveryToken && (
				<>
					<Row crossAlignment="flex-start" mainAlignment="flex-start" width="100%">
						<Text overflow="break-word">
							<Trans
								i18nKey="validation_code_was_sent_to_recovery_email"
								defaults="The validation code was sent to <strong>{{ recovery_email }}</strong> and will be valid for 10 minutes. You have {{ recoveryAttemptsLeft }} more attempts. Enter the code in the form below."
								components={{ bold: <strong /> }}
								values={{
									recovery_email: recoveryEmail,
									recoveryAttemptsLeft
								}}
							/>
						</Text>
					</Row>
					<Row padding={{ bottom: 'large' }} width="100%">
						<Input
							defaultValue={token}
							data-testid="username"
							onChange={(e) => setToken(e.target.value)}
							autocomplete="code"
							label={t('code', 'Code')}
							backgroundColor="gray5"
						/>
					</Row>
					{validationTokenError && (
						<Row mainAlignment="flex-start" width="100%">
							<Text color="error" size="small" overflow="break-word">
								{validationTokenError}
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
								onClick={onSendRecoveryToken}
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
								onClick={onValidateToken}
								label={t('validate_code', 'Validate Code')}
								width="fill"
								size="medium"
								disabled={!token}
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
			{progress === state.submitOtpCode && (
				<>
					<Row crossAlignment="center" mainAlignment="center" width="100%">
						<Text size="medium" overflow="break-word">
							<Trans
								i18nKey="glad_to_have_you_back_username"
								defaults="Glad to have you back, <strong>{{ username }}</strong>!"
								components={{ bold: <strong /> }}
								values={{ username }}
							/>
						</Text>
					</Row>
					<Row crossAlignment="center" mainAlignment="center" width="100%">
						<Text size="medium" overflow="break-word">
							{t(
								'we_just_need_one_more_check_before_getting_back_in',
								'We just need one more check before getting back in.'
							)}
						</Text>
					</Row>
					<Row crossAlignment="flex-start" mainAlignment="flex-start" width="100%">
						<Select
							items={otpList}
							background="gray5"
							label={t('choose_otp', 'Choose the OTP Method')}
							onChange={setOtpId}
							defaultSelection={otpList[0]}
						/>
					</Row>
					<Row crossAlignment="flex-start" mainAlignment="flex-start" width="100%">
						<Input
							defaultValue={otp}
							hasError={validationOTPError}
							disabled={disableInputs}
							onChange={onChangeOtp}
							label={t('code', 'Code')}
							backgroundColor="gray5"
						/>
					</Row>
					{validationOTPError && (
						<Row mainAlignment="flex-start" width="100%">
							<Text color="error" size="small" overflow="break-word">
								{validationOTPError}
							</Text>
						</Row>
					)}
					<Row crossAlignment="center" mainAlignment="flex-start" width="100%">
						<Row width="65%" mainAlignment="flex-start">
							<Checkbox
								value={trustDevice}
								label={t('rember_this_device', 'Remember this device')}
								onClick={toggleTrustDevice}
							/>
						</Row>
						<Row width="35%" mainAlignment="flex-end">
							<Button
								onClick={submitOtpCb}
								disabled={!otp}
								label={t('verify', 'Verify')}
								width="fill"
								size="medium"
							/>
						</Row>
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
