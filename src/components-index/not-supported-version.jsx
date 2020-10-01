import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar } from '@zextras/zapp-ui';

export default function NotSupportedVersion() {
	const { t } = useTranslation();
	const [isOpen, setOpen] = useState(true);

	return (
		<Snackbar
			open={isOpen}
			label={t('unsupported_version', 'The server sent a not valid response. Please contact your server administrator')}
			onClose={() => setOpen(false)}
			autoHideTimeout={10000}
			type="error"
		/>
	);
}
