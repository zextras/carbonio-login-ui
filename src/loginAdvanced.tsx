/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useEffect, useState } from 'react';

import NotSupportedVersion from './components-index/not-supported-version';
import PageLayout from './components-v1/page-layout';
import { getLoginSupported } from './services/login-page-services';

const PageLayoutV1 = React.lazy(() => import('./components-v1/page-layout'));
type Versions = {
	minApiVersion: string;
	maxApiVersion: string;
	version: string;
};
export function LoginAdvanced(): React.JSX.Element {
	const [versions, setVersions] = useState<Versions>();
	const [hasBackendApi, setHasBackendApi] = useState(true);

	useEffect(() => {
		// let canceled = false;

		if (hasBackendApi) {
			getLoginSupported()
				.then(({ minApiVersion, maxApiVersion }) => {
					// if (!canceled) {
					const v = maxApiVersion;
					// if (v > MAX_SUPPORTED_VERSION) {
					// 	v = MAX_SUPPORTED_VERSION;
					// }
					setVersions({
						minApiVersion,
						maxApiVersion,
						version: v
					});
					// }
				})
				.catch(() => setHasBackendApi(false));
		}
		// return () => {
		// 	canceled = true;
		// };
	}, [hasBackendApi]);

	return (
		<>
			{(!hasBackendApi || (versions && versions.version >= versions.minApiVersion)) && (
				<PageLayout version={versions?.version} hasBackendApi={hasBackendApi} />
			)}
			{versions && versions.version < versions.minApiVersion && <NotSupportedVersion />}
		</>
	);
}
