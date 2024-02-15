/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useCallback, useEffect, useState } from 'react';
import { DESKTOP, MOBILE, TABLET } from '../constants';

export default function GetScreenMode() {
	const check = useCallback((width) => {
		if (width < 1280) {
			if (width < 640) {
				return MOBILE;
			}
			return TABLET;
		}
		return DESKTOP;
	}, []);

	const [screenMode, setScreenMode] = useState(DESKTOP);

	useEffect(() => {
		const handleResize = () => {
			setScreenMode(check(window.innerWidth));
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [check]);

	return screenMode;
}
