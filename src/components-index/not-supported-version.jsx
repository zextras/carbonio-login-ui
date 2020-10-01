import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar } from '../../zapp-ui/src';

export default function NotSupportedVersion() {
	const { t } = useTranslation();
	const [isOpen, setOpen] = useState(true);

	return (
		<Snackbar
			open={isOpen}
			label={t('unsupported_version', 'The server is not responding. Please contact your server administators')}
			onClose={() => setOpen(false)}
			autoHideTimeout={10000}
			type="error"
		/>
	);
}
