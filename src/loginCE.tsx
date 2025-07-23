/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

const PageLayoutV1 = React.lazy(() => import('./components-v1/page-layout'));

export function LoginCE(): React.JSX.Element {
	// TODO: remove version
	return <PageLayoutV1 version={undefined} hasBackendApi={false} />;
}
