import React, { useEffect, useState } from 'react';
import V1LoginManager from './v1-login-manager';
import V2LoginManager from './v2-login-manager';
import { getAuthSupported } from '../services/auth-configuration-service';
import ServerNotResponding from '../components-index/server-not-responding';
import NotSupportedVersion from '../components-index/not-supported-version';

export default function FormSelector({ destinationUrl, domain }) {
	const [ configuration, setConfiguration ] = useState(null);
	const [ error, setError ] = useState(false);
	const [ disableInputs, setDisableInputs ] = useState(true);

	useEffect(() => {
		let componentIsMounted = true;

		getAuthSupported(domain)
			.then((res) => {
				if (componentIsMounted) {
					setConfiguration({
						...res,
						destinationUrl
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
	}, [destinationUrl, domain]);

	if(error)
		return <ServerNotResponding />

	if (configuration === null)
		return <div></div>;

	if (configuration.maxApiVersion >= 2  &&  configuration.minApiVersion <= 2)
		return <V2LoginManager
			configuration={configuration}
			disableInputs={disableInputs}
		/>;
	if (configuration.maxApiVersion >= 1  &&  configuration.minApiVersion <= 1)
		return <V1LoginManager
			configuration={configuration}
			disableInputs={disableInputs}
		/>;

	return <NotSupportedVersion />
}
