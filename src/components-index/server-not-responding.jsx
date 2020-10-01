import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar } from '../../zapp-ui/src';

export default function ServerNotResponding() {
	const { t } = useTranslation();
	const [isOpen, setOpen] = useState(true);

	return (
		<Snackbar
			open={isOpen}
			label={t('server_not_responding', 'The server is not responding. Please contact your server administrator')}
			onClose={() => setOpen(false)}
			autoHideTimeout={10000}
			type="error"
		/>
	);
}
