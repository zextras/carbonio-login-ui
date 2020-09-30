import { useTranslation } from 'react-i18next';
import React from 'react';

import { Modal, Paragraph, Link } from '@zextras/zapp-ui';

export function HelpModal({ open, onClose }) {
	const { t } = useTranslation();
	return (
		<Modal
			title={t('help_modal_title', 'Help')}
			open={open}
			onClose={onClose}
		>
			<Paragraph>
				{ t('Do you need help') }
?
			</Paragraph>
			<Paragraph>
				{ t('help_phone_number', 'Please call this number') }
:
				{' '}
				<Link href="tel:+123445678910">1234 - 45678910</Link>
			</Paragraph>
			<Paragraph>
				{ t('Or write an email to') }
:
				{' '}
				<Link href="mailto:help.assistance@iris.com" target="_blank">help.assistance@iris.com</Link>
			</Paragraph>
		</Modal>
	);
}
export function OfflineModal({ open, onClose }) {
	const { t } = useTranslation();
	return (
		<Modal
			title="Offline"
			open={open}
			onClose={onClose}
		>
			<Paragraph>
				{ t('currently_offline_message', 'You are currently offline, please check your internet connection') }
.
			</Paragraph>
		</Modal>
	);
}

export function GenericErrorModal({ open, onClose, message }) {
	const { t } = useTranslation();
	return (
		<Modal
			title="Error"
			open={open}
			onClose={onClose}
		>
			<Paragraph>{ t(message) }</Paragraph>
		</Modal>
	);
}
