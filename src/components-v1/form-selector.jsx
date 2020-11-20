import React, { useEffect, useState } from 'react';
import V1LoginManager from './v1-login-manager';
import { getAuthSupported } from '../services/auth-configuration-service';
import ServerNotResponding from '../components-index/server-not-responding';

export default function FormSelector ({ publicUrl }) {
	const [configuration, setConfiguration] = useState(null);
	const [error, setError] = useState(false);

	useEffect(() => {
		let componentIsMounted = true;
		const urlParams = new URLSearchParams(window.location.search);
		const domain = urlParams.get('domain');
		const destinationUrl = urlParams.get('destinationUrl');

		getAuthSupported(domain)
			.then((res) => {
				if (componentIsMounted) {
					res.destinationUrl = destinationUrl || publicUrl;
					res.disableInputs = false;
					setConfiguration(res);
				}
			})
			.catch(() => {
				// It should never happen, If the server doesn't respond this page will not be loaded
				if(componentIsMounted) setError(true);
			});
		return () => componentIsMounted = false;
	}, []);

	if(error)
		return <ServerNotResponding />

	if (configuration === null)
		return <div></div>;

	if (configuration.maxApiVersion === 1)
		return <V1LoginManager configuration={configuration}/>;

}
