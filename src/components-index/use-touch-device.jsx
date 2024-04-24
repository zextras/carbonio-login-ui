/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useState, useEffect } from 'react';

function useIsTouchDevice() {
	const [isTouchDevice, setIsTouchDevice] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(pointer:coarse)');

		const handleMediaChange = () => {
			setIsTouchDevice(mediaQuery.matches);
		};

		// Initial check
		handleMediaChange();

		// Listen for changes
		mediaQuery.addEventListener('change', handleMediaChange);

		// Cleanup
		return () => {
			mediaQuery.removeEventListener('change', handleMediaChange);
		};
	}, []);

	return isTouchDevice;
}

export default useIsTouchDevice;
