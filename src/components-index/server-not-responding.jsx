import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar } from '@zextras/zapp-ui';

export default function ServerNotResponding() {
	const [ t ] = useTranslation();
	const [ isOpen, setOpen ] = useState(true);
	const onCloseCbk = useCallback(
		() => setOpen(false),
		[]
	);

	return (
		<Snackbar
			open={isOpen}
			label={t('server_not_responding', 'The server is not responding. Please contact your server administrator')}
			onClose={onCloseCbk}
			autoHideTimeout={10000}
			type="error"
		/>
	);
}