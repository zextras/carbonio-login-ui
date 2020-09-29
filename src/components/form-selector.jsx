import React from 'react';
import V1Login from './v1-login';

export default function FormSelector({ configuration, hideSamlButton }) {
	return (
		<>
			{
				configuration && (configuration.maxApiVersion === 1 || configuration.disableInputs === true) && <V1Login configuration={configuration} hideSamlButton={hideSamlButton} />
			}
		</>
	);
}
