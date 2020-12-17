import React, { useEffect, useState } from 'react';
import V1LoginManager from './v1-login-manager';
import { getAuthSupported } from '../services/auth-configuration-service';
import ServerNotResponding from '../components-index/server-not-responding';
import NotSupportedVersion from '../components-index/not-supported-version';

export default function FormSelector ({ publicUrl }) {
	const [ configuration, setConfiguration ] = useState(null);
	const [ error, setError ] = useState(false);
	const [ disableInputs, setDisableInputs ] = useState(true);

	useEffect(() => {
		let componentIsMounted = true;
		const urlParams = new URLSearchParams(window.location.search);
		const domain = urlParams.get('domain');
		const destinationUrl = urlParams.get('destinationUrl');

		getAuthSupported(domain)
			.then((res) => {
				if (componentIsMounted) {
					setConfiguration({
						...res,
						destinationUrl: destinationUrl || publicUrl
					});
					setDisableInputs(false);
				}
			})
			.catch(() => {
				// It should never happen, If the server doesn't respond this page will not be loaded
				if(componentIsMounted) setError(true);
			});
		return () => {
			componentIsMounted = false;
		}
	}, [publicUrl]);

	if(error)
		return <ServerNotResponding />

	if (configuration === null)
		return <div></div>;

	if (configuration.maxApiVersion >= 1  &&  configuration.minApiVersion <= 1)
		return <V1LoginManager
			configuration={configuration}
			disableInputs={disableInputs}
		/>;

	return <NotSupportedVersion />
}
