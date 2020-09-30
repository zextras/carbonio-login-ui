import React, { useEffect, useState } from 'react';
import V1LoginManager from './v1-login-manager';
import { getAuthSupported } from '../services/auth-configuration-service';

export default function FormSelector ({}) {
	const [configuration, setConfiguration] = useState(null);

	useEffect(() => {
		let componentIsMounted = true;
		const urlParams = new URLSearchParams(window.location.search);
		const domain = urlParams.get('domain');
		const destinationUrl = urlParams.get('destinationUrl');

		getAuthSupported(domain)
			.then((res) => {
				if (componentIsMounted) {
					res.destinationUrl = destinationUrl;
					res.disableInputs = false;
					setConfiguration(res);
				}
			})
			.catch(() => {
				// It should never happen, If the server doesn't respond this page will not be loaded
				alert('The server is not responding. Please contact your server administrator');
			});
		return () => componentIsMounted = false;
	}, []);

	if (configuration === null)
		return <div></div>;

	if (configuration.maxApiVersion === 1)
		return <V1LoginManager configuration={configuration}/>;
}
