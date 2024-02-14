/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useCallback, useLayoutEffect, useState } from 'react';

export default function GetScreenMode(target = window) {
	const check = useCallback((width) => {
		if (width < 1280) {
			if (width < 640) {
				return 'mobile';
			}
			return 'tablet';
		}
		return 'desktop';
	}, []);

	const [screenMode, setScreenMode] = useState();

	useLayoutEffect(() => {
		const handleResize = () => {
			setScreenMode(check(target.innerWidth, target.innerHeight));
		};
		target.addEventListener('resize', handleResize);

		return () => {
			target.removeEventListener('resize', handleResize);
		};
	}, [check, setScreenMode, target]);

	return screenMode;
}
