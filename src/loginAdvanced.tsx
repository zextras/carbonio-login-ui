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
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;
		getLoginSupported(signal)
			.then(({ minApiVersion, maxApiVersion }) => {
				const v = maxApiVersion;
				setVersions({
					minApiVersion,
					maxApiVersion,
					version: v
				});
			})
			.catch(() => setHasError(true));
		return () => {
			controller.abort();
		};
	}, []);

	const notSupported = hasError || (versions && versions.version < versions.minApiVersion);

	return (
		<>
			{versions && versions.version >= versions.minApiVersion && (
				<PageLayout version={versions?.version} isAdvanced />
			)}
			{notSupported && <NotSupportedVersion />}
		</>
	);
}
