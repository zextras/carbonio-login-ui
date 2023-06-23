/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { render, RenderResult } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import { ModalManager, SnackbarManager, ThemeProvider } from '@zextras/carbonio-design-system';
import React, { useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import I18nTestFactory from './i18n-test-factory';
import { previewContextMock, PreviewsManagerContext } from './carbonio-ui-preview';

export const ProvidersWrapper = ({ children, options }) => {
	const i18n = useMemo(() => {
		const i18nFactory = new I18nTestFactory();
		return i18nFactory.getAppI18n();
	}, []);

	return (
		<ThemeProvider>
			<MemoryRouter>
				<Route>
					<Provider>
						<I18nextProvider i18n={i18n}>
							<SnackbarManager>
								<PreviewsManagerContext.Provider value={previewContextMock}>
									<ModalManager>{children}</ModalManager>
								</PreviewsManagerContext.Provider>
							</SnackbarManager>
						</I18nextProvider>
					</Provider>
				</Route>
			</MemoryRouter>
		</ThemeProvider>
	);
};

function customRender(ui, options) {
	const Wrapper = ({ children }) => (
		<ProvidersWrapper options={options}>{children}</ProvidersWrapper>
	);
	return render(ui, {
		wrapper: Wrapper,
		...options
	});
}

export function setupTest(...args) {
	return {
		user: userEvent.setup({ advanceTimers: jest.advanceTimersByTime }),
		...customRender(...args)
	};
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function setupHook(hook, options = {}) {
	const Wrapper = ({ children }) => (
		<ProvidersWrapper options={options}>{children}</ProvidersWrapper>
	);
	const { result, unmount } = renderHook(() => hook(), { wrapper: Wrapper });

	return { result, unmount };
}
