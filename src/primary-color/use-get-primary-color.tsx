/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useTheme } from '@zextras/carbonio-design-system';
import { useEffect, useMemo } from 'react';
import { size } from 'lodash';
import { useLocalStorage } from '../local-storage/local-storage';
import { LOCAL_STORAGE_LAST_PRIMARY_KEY } from '../constants';
import { useLoginConfigStore } from '../store/login/store';
import { useDarkMode } from '../dark-mode/use-dark-mode';

export function useGetPrimaryColor(): string | undefined {
	const [localStorageLastPrimary, setLocalStorageLastPrimary] = useLocalStorage<
		Partial<Record<'dark' | 'light', string>> | undefined
	>(LOCAL_STORAGE_LAST_PRIMARY_KEY, undefined);
	const { carbonioWebUiPrimaryColor, carbonioWebUiDarkPrimaryColor } = useLoginConfigStore();
	const { darkModeEnabled, darkReaderStatus } = useDarkMode();
	const theme = useTheme();

	const primaryColor = useMemo(() => {
		if (darkReaderStatus !== undefined) {
			if (carbonioWebUiPrimaryColor || carbonioWebUiDarkPrimaryColor) {
				if (darkModeEnabled) {
					return carbonioWebUiDarkPrimaryColor || carbonioWebUiPrimaryColor;
				}
				return carbonioWebUiPrimaryColor || carbonioWebUiDarkPrimaryColor;
			}
		}
		if (localStorageLastPrimary && size(localStorageLastPrimary) > 0) {
			return (
				(darkModeEnabled && (localStorageLastPrimary.dark || localStorageLastPrimary.light)) ||
				localStorageLastPrimary.light ||
				localStorageLastPrimary.dark
			);
		}
		if (theme) {
			return theme.palette.primary.regular;
		}
		return undefined;
	}, [
		carbonioWebUiDarkPrimaryColor,
		carbonioWebUiPrimaryColor,
		darkModeEnabled,
		darkReaderStatus,
		localStorageLastPrimary,
		theme
	]);

	useEffect(() => {
		if (darkReaderStatus !== undefined) {
			setLocalStorageLastPrimary((prevState) => ({
				...prevState,
				[darkModeEnabled ? 'dark' : 'light']: primaryColor
			}));
		}
	}, [darkModeEnabled, darkReaderStatus, primaryColor, setLocalStorageLastPrimary]);

	return primaryColor;
}
