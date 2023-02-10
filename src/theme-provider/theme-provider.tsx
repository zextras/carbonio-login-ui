/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, {
	createContext,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useState
} from 'react';
import {
	generateColorSet,
	ThemeProvider as UIThemeProvider,
	ThemeProviderProps as UIThemeProviderProps
} from '@zextras/carbonio-design-system';
import { auto, disable, enable, setFetchMethod } from 'darkreader';
import { reduce } from 'lodash';
import { createGlobalStyle, DefaultTheme } from 'styled-components';
import { DarkReaderPropValues, ThemeExtension } from '../../types';
import {
	darkReaderDynamicThemeFixes,
	BASE_FONT_SIZE,
	SCALING_LIMIT,
	SCALING_OPTIONS
} from '../constants';
// import { getAutoScalingFontSize } from '../utils';
// import { useGetPrimaryColor } from './use-get-primary-color';

setFetchMethod(window.fetch);

export const getAutoScalingFontSize = (): number => {
	if (
		window.screen.width <= SCALING_LIMIT.WIDTH &&
		window.screen.height <= SCALING_LIMIT.HEIGHT &&
		window.devicePixelRatio >= SCALING_LIMIT.DPR
	) {
		const baseFontIndex = SCALING_OPTIONS.findIndex((option) => option.value === BASE_FONT_SIZE);
		if (baseFontIndex > 0) {
			return SCALING_OPTIONS[baseFontIndex - 1].value;
		}
	}
	console.log('base font size::::', BASE_FONT_SIZE);
	return BASE_FONT_SIZE;
};

interface ThemeCallbacks {
	addExtension: (newExtension: ThemeExtension, id: string) => void;
	setDarkReaderState: (newState: DarkReaderPropValues) => void;
}

export const ThemeCallbacksContext = createContext<ThemeCallbacks>({
	addExtension: () => {
		throw Error('Not implemented');
	},
	setDarkReaderState: () => {
		throw Error('not implemented');
	}
});

type CustomTheme = Partial<Omit<DefaultTheme, 'palette'>> & {
	palette?: Partial<DefaultTheme['palette']>;
};

const paletteExtension =
	(customTheme: CustomTheme = {}) =>
	(theme: DefaultTheme): DefaultTheme => ({
		...theme,
		...customTheme,
		palette: {
			...theme.palette,
			...customTheme.palette,
			shared: {
				regular: '#FFB74D',
				hover: '#FFA21A',
				active: '#FFA21A',
				focus: '#FF9800',
				disabled: '#FFD699'
			},
			linked: {
				regular: '#AB47BC',
				hover: '#8B3899',
				active: '#8B3899',
				focus: '#7A3187',
				disabled: '#DDB4E4'
			}
		}
	});

const iconExtension: ThemeExtension = (theme) => ({
	...theme,
	icons: {
		...theme.icons,
		Shared: theme.icons.ArrowCircleRight,
		Linked: theme.icons.ArrowCircleLeft
	}
});

interface GlobalStyledProps {
	baseFontSize: number;
}

const GlobalStyle = createGlobalStyle<GlobalStyledProps>`
  html {
    font-size: ${({ baseFontSize }): string => `${baseFontSize}%`};
  }
`;

interface ThemeProviderProps {
	children?: React.ReactNode | React.ReactNode[];
}
export const ThemeProvider = ({ children }: ThemeProviderProps): JSX.Element => {
	const [extensions, setExtensions] = useState<Partial<Record<keyof DefaultTheme, ThemeExtension>>>(
		{}
	);

	const primaryColor = '#FF0000';

	useLayoutEffect(() => {
		const customThemePalette: Partial<DefaultTheme['palette']> = primaryColor
			? { primary: generateColorSet({ regular: primaryColor }) }
			: {};
		setExtensions((extension) => ({
			...extension,
			palette: paletteExtension({
				palette: customThemePalette
			}),
			icons: iconExtension
		}));
	}, [primaryColor]);

	const [darkReaderState, setDarkReaderState] = useState<DarkReaderPropValues>('disabled');

	useEffect(() => {
		switch (darkReaderState) {
			case 'disabled':
				auto(false);
				disable();
				break;
			case 'enabled':
				auto(false);
				enable(
					{
						sepia: -50
					},
					darkReaderDynamicThemeFixes
				);
				break;
			case 'auto':
			default:
				auto(
					{
						sepia: -50
					},
					darkReaderDynamicThemeFixes
				);
				break;
		}
	}, [darkReaderState]);

	const aggregatedExtensions = useCallback<NonNullable<UIThemeProviderProps['extension']>>(
		(theme) =>
			reduce(
				extensions,
				(themeAccumulator, themeExtensionFn) => {
					if (themeExtensionFn) {
						return themeExtensionFn(themeAccumulator);
					}
					return themeAccumulator;
				},
				theme
			),
		[extensions]
	);

	const addExtension = useCallback<ThemeCallbacks['addExtension']>((newExtension, id) => {
		setExtensions((ext) => ({ ...ext, [id]: newExtension }));
	}, []);

	const baseFontSize = useMemo<GlobalStyledProps['baseFontSize']>(() => {
		return getAutoScalingFontSize();
	}, []);

	return (
		<UIThemeProvider extension={aggregatedExtensions}>
			<ThemeCallbacksContext.Provider value={{ addExtension, setDarkReaderState }}>
				{/* <GlobalStyle baseFontSize={baseFontSize} /> */}
				{children}
			</ThemeCallbacksContext.Provider>
		</UIThemeProvider>
	);
};
