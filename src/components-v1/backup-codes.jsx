/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useMemo, useState } from 'react';

import styled from '@emotion/styled';
import { Button, Checkbox, Row, Text } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';

const CodesGrid = styled.div`
	width: 100%;
	padding: 16px 24px;
	border: 1px solid #ccc;
	border-radius: 4px;
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 8px 32px;
	justify-items: center;
	font-family: monospace;
	font-size: 0.875rem;
`;

export default function BackupCodes({ staticOtpCodes, onLoginToWorkspace, configuration }) {
	const [t] = useTranslation();
	const [savedConfirmed, setSavedConfirmed] = useState(false);
	const toggleSavedConfirmed = useCallback(() => setSavedConfirmed((v) => !v), []);

	const codes = useMemo(() => (staticOtpCodes || []).map((c) => c.code), [staticOtpCodes]);

	const codesText = useMemo(() => codes.join('\n'), [codes]);

	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(codesText);
	}, [codesText]);

	const handleSaveAsTxt = useCallback(() => {
		const blob = new Blob([codesText], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'backup-codes.txt';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}, [codesText]);

	return (
		<div style={{ width: '100%' }}>
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
						'backup_codes_description',
						'Please download or print these codes and keep them in a safe place. You will need them to sign in if you lose access to your mobile device or authentication app.'
					)}
				</Text>
			</Row>

			<Row padding={{ bottom: 'small' }} mainAlignment="center">
				<CodesGrid data-testid="backup_codes_grid">
					{codes.map((code) => (
						<Text key={code} size="small" style={{ fontFamily: 'monospace' }}>
							{code}
						</Text>
					))}
				</CodesGrid>
			</Row>

			<Row padding={{ vertical: 'small' }} mainAlignment="center">
				<Button
					type="outlined"
					onClick={handleCopy}
					label={t('copy', 'Copy')}
					icon="CopyOutline"
					data-testid="backup_codes_copy"
				/>
				<div style={{ width: '12px' }} />
				<Button
					type="outlined"
					onClick={handleSaveAsTxt}
					label={t('save_as_txt', 'Save as TXT')}
					icon="DownloadOutline"
					data-testid="backup_codes_save"
				/>
			</Row>

			<Row padding={{ vertical: 'small' }} mainAlignment="flex-start">
				<Checkbox
					value={savedConfirmed}
					label={t('backup_codes_confirm_saved', 'I have saved this backup codes (mandatory)')}
					onClick={toggleSavedConfirmed}
					data-testid="backup_codes_checkbox"
				/>
			</Row>

			<Row orientation="vertical" crossAlignment="flex-start" padding={{ vertical: 'small' }}>
				<Button
					onClick={onLoginToWorkspace}
					disabled={!savedConfirmed}
					label={t('login_to_my_workspace', 'Login to my workspace')}
					width="fill"
					data-testid="backup_codes_login"
				/>
			</Row>
		</div>
	);
}
