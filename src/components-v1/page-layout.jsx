/* eslint-disable import/no-extraneous-dependencies */
/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useLayoutEffect, useState, useContext, useEffect } from 'react';
import styled, { css } from 'styled-components';
import {
	Checkbox,
	Container,
	Modal,
	Padding,
	Row,
	Text,
	Tooltip
} from '@zextras/carbonio-design-system';
import { Trans, useTranslation } from 'react-i18next';
import logoChrome from '../../assets/logo-chrome.svg';
import logoFirefox from '../../assets/logo-firefox.svg';
import logoEdge from '../../assets/logo-edge.svg';
import logoSafari from '../../assets/logo-safari.svg';
import logoOpera from '../../assets/logo-opera.svg';
import logoYandex from '../../assets/logo-yandex.svg';
import logoUC from '../../assets/logo-ucbrowser.svg';
import backgroundImage from '../../assets/carbonio_loginpage.jpg';
import backgroundImageRetina from '../../assets/carbonio_loginpage-retina.jpg';
import logoCarbonio from '../../assets/logo-carbonio.png';
import { getLoginConfig } from '../services/login-page-services';
import FormSelector from './form-selector';
import ServerNotResponding from '../components-index/server-not-responding';
import { ZimbraForm } from '../components-index/zimbra-form';
import playStore from '../../assets/play-store.svg';
import appStore from '../../assets/app-store.svg';
import { generateColorSet, prepareUrlForForward } from '../utils';
import { ThemeCallbacksContext } from '../theme-provider/theme-provider';
import { APP_STORE_URL, CARBONIO_LOGO_URL, DESKTOP, MOBILE, PLAY_STORE_URL } from '../constants';
import { useLoginConfigStore } from '../store/login/store';
import { useDarkReaderResultValue } from '../dark-mode/use-dark-reader-result-value';
import useScreenMode from '../components-index/use-screen-mode';

const LoginContainer = styled(Container)`
	padding: 0 100px;
	background: url(${(props) => props.backgroundImage}) no-repeat 75% center/cover;
	justify-content: center;
	align-items: flex-start;
	${({ screenMode }) =>
		screenMode !== DESKTOP &&
		css`
			padding: 0 12px;
			align-items: center;
		`}
	${({ isDefaultBg }) =>
		isDefaultBg &&
		css`
			@media (-webkit-min-device-pixel-ratio: 1.5), (min-resolution: 144dpi) {
				background: url(${backgroundImageRetina}) no-repeat 75% center/cover;
			}
		`}
`;

const FormContainer = styled.div`
	max-width: 100%;
	max-height: 100vh;
	box-shadow: 0px 0px 20px -7px rgba(0, 0, 0, 0.3);
`;

const FormWrapper = styled(Container)`
	width: auto;
	height: auto;
	background-color: ${({ theme }) => theme.palette.gray6.regular};
	padding: 48px 48px 0;
	width: 436px;
	max-width: 100%;
	min-height: 620px;
	// height: 100vh;
	overflow-y: auto;
	${({ screenMode }) =>
		screenMode !== DESKTOP &&
		css`
			padding: 20px 20px 0;
			width: 360px;
			max-height: 100%;
			height: auto;
		`}
`;

function DarkReaderListener() {
	const { setDarkReaderState } = useContext(ThemeCallbacksContext);
	const darkReaderResultValue = useDarkReaderResultValue();
	useEffect(() => {
		if (darkReaderResultValue) {
			setDarkReaderState(darkReaderResultValue);
		}
	}, [darkReaderResultValue, setDarkReaderState]);
	return null;
}

export default function PageLayout({ version, hasBackendApi }) {
	const [t] = useTranslation();
	const [logo, setLogo] = useState(null);
	const [serverError, setServerError] = useState(false);

	const urlParams = new URLSearchParams(window.location.search);
	const [destinationUrl, setDestinationUrl] = useState(
		prepareUrlForForward(urlParams.get('destinationUrl'))
	);
	const [domain, setDomain] = useState(urlParams.get('domain') ?? destinationUrl);

	const [bg, setBg] = useState(backgroundImage);
	const [isDefaultBg, setIsDefaultBg] = useState(true);
	const [editedTheme, setEditedTheme] = useState({});
	const [copyrightBanner, setCopyrightBanner] = useState('');
	const { setDarkReaderState } = useContext(ThemeCallbacksContext);
	const { setDomainName } = useLoginConfigStore();
	const [showModal, setShowModal] = useState(true);
	const [showMobileAppModal, setShowMobileAppModal] = useState(true);
	const [doNotShowAgain, setDoNotShowAgain] = useState(false);
	const screenMode = useScreenMode();

	useEffect(() => {
		const storedState = localStorage.getItem('doNotShowMobileAppModal');
		if (storedState) {
			setShowMobileAppModal(false);
		}
	}, []);

	useLayoutEffect(() => {
		let componentIsMounted = true;

		if (hasBackendApi) {
			getLoginConfig(version, domain, domain)
				.then((res) => {
					if (!destinationUrl) setDestinationUrl(prepareUrlForForward(res.publicUrl));
					if (!domain) setDomain(res.zimbraDomainName);
					setDomainName(res.zimbraDomainName);

					const _logo = {};

					if (componentIsMounted) {
						if (res.loginPageBackgroundImage) {
							setBg(res.loginPageBackgroundImage);
							setIsDefaultBg(false);
						}

						if (res.loginPageLogo) {
							_logo.image = res.loginPageLogo;
							_logo.width = '100%';
						} else {
							_logo.image = logoCarbonio;
							_logo.width = '221px';
						}

						if (res.loginPageSkinLogoUrl) {
							_logo.url = res.loginPageSkinLogoUrl;
						} else {
							_logo.url = '';
						}

						if (res.loginPageTitle) {
							document.title = res.loginPageTitle;
						} else {
							document.title = t('carbonio_authentication', 'Carbonio Authentication');
						}

						if (res.loginPageFavicon) {
							const link =
								document.querySelector("link[rel*='icon']") || document.createElement('link');
							link.type = 'image/x-icon';
							link.rel = 'shortcut icon';
							link.href = res.loginPageFavicon;
							document.getElementsByTagName('head')[0].appendChild(link);
						}

						if (res.loginPageColorSet) {
							const colorSet = res.loginPageColorSet;
							if (colorSet.primary) {
								setEditedTheme((et) => ({
									...et,
									'palette.primary': generateColorSet({
										regular: `#${colorSet.primary}`
									})
								}));
							}
							if (colorSet.secondary) {
								setEditedTheme((et) => ({
									...et,
									'palette.secondary': generateColorSet({
										regular: `#${colorSet.secondary}`
									})
								}));
							}
						}

						if (version === 3) {
							useLoginConfigStore.setState(res);
							// In case of v3 API response
							if (res?.carbonioWebUiTitle) {
								document.title = res.carbonioWebUiTitle;
							}
							if (res?.carbonioWebUiFavicon) {
								const link =
									document.querySelector("link[rel*='icon']") || document.createElement('link');
								link.type = 'image/x-icon';
								link.rel = 'shortcut icon';
								link.href = res.carbonioWebUiFavicon;
								document.getElementsByTagName('head')[0].appendChild(link);
							}
							if (res?.carbonioWebUiDarkMode) {
								if (res?.carbonioWebUiDarkLoginBackground) {
									setBg(res.carbonioWebUiDarkLoginBackground);
									setIsDefaultBg(false);
								}

								if (res?.carbonioWebUiDarkLoginLogo) {
									_logo.image = res.carbonioWebUiDarkLoginLogo;
									_logo.width = '100%';
								}
							} else {
								if (res?.carbonioWebUiLoginBackground) {
									setBg(res.carbonioWebUiLoginBackground);
									setIsDefaultBg(false);
								}

								if (res?.carbonioWebUiLoginLogo) {
									_logo.image = res.carbonioWebUiLoginLogo;
									_logo.width = '100%';
								}
							}
							if (res?.carbonioWebUiDescription) {
								setCopyrightBanner(res.carbonioWebUiDescription);
							}
							_logo.url = res?.carbonioLogoURL ? res.carbonioLogoURL : CARBONIO_LOGO_URL;
						}
						setLogo(_logo);
					}
				})
				.catch(() => {
					// It should never happen, If the server doesn't respond this page will not be loaded
					if (componentIsMounted) setServerError(true);
				});
		} else {
			setLogo({ image: logoCarbonio, width: '221px', url: CARBONIO_LOGO_URL });
			document.title = t('carbonio_authentication', 'Carbonio Authentication');
		}

		return () => {
			componentIsMounted = false;
		};
	}, [t, version, domain, destinationUrl, hasBackendApi, setDarkReaderState, setDomainName]);

	if (serverError) return <ServerNotResponding />;

	if (logo) {
		const logoHtml = (
			<img
				alt="Logo"
				src={logo.image}
				width={logo.width}
				style={{
					maxWidth: '100%',
					maxHeight: '150px',
					display: 'block',
					marginLeft: 'auto',
					marginRight: 'auto'
				}}
				data-testid="logo"
			/>
		);

		return (
			<LoginContainer screenMode={screenMode} isDefaultBg={isDefaultBg} backgroundImage={bg}>
				<DarkReaderListener />
				<FormContainer data-testid="form-container">
					<FormWrapper mainAlignment="space-between" screenMode={screenMode}>
						<Container mainAlignment="flex-start" height="auto">
							<Padding value="28px 0 28px" crossAlignment="center" width="100%">
								<Container crossAlignment="center">
									{logo.url ? (
										<a target="_blank" href={logo.url} rel="noreferrer">
											{logoHtml}
										</a>
									) : (
										logoHtml
									)}
								</Container>
							</Padding>
						</Container>
						{hasBackendApi ? (
							<FormSelector domain={domain} destinationUrl={destinationUrl} />
						) : (
							<ZimbraForm destinationUrl={destinationUrl} />
						)}
						<Container
							crossAlignment="flex-start"
							height="auto"
							padding={{ bottom: 'extralarge', top: 'extralarge' }}
						>
							<Text>{t('supported_browsers', 'Supported browsers')}</Text>
							<Row padding={{ top: 'medium', bottom: 'extralarge' }} wrap="nowrap">
								<Padding all="extrasmall" right="small">
									<Tooltip label="Chrome">
										<img alt="Logo Chrome" src={logoChrome} width="18px" />
									</Tooltip>
								</Padding>
								<Padding all="extrasmall" right="small">
									<Tooltip label="Firefox">
										<img alt="Logo Firefox" src={logoFirefox} width="18px" />
									</Tooltip>
								</Padding>
								<Padding all="extrasmall" right="small">
									<Tooltip label="Edge Chromium">
										<img alt="Logo Edge Chromium" src={logoEdge} width="18px" />
									</Tooltip>
								</Padding>
								<Padding all="extrasmall" right="small">
									<Tooltip label="Safari">
										<img alt="Logo Safari" src={logoSafari} width="18px" />
									</Tooltip>
								</Padding>
								<Padding all="extrasmall" right="small">
									<Tooltip label="Opera">
										<img alt="Logo Opera" src={logoOpera} width="18px" />
									</Tooltip>
								</Padding>
								<Padding all="extrasmall" right="small">
									<Tooltip label="Yandex">
										<img alt="Logo Yandex" src={logoYandex} width="18px" />
									</Tooltip>
								</Padding>
								<Padding all="extrasmall" right="small">
									<Tooltip label="UC">
										<img alt="Logo UC" src={logoUC} width="18px" />
									</Tooltip>
								</Padding>
							</Row>
							{copyrightBanner ? (
								<Text size="small" overflow="break-word">
									{copyrightBanner}
								</Text>
							) : (
								<Text size="small" overflow="break-word" data-testid="default-banner">
									Copyright &copy;
									{` ${new Date().getFullYear()} Zextras, `}
									{t('all_rights_reserved', 'All rights reserved')}
								</Text>
							)}
						</Container>
					</FormWrapper>
				</FormContainer>
				{showMobileAppModal && screenMode !== DESKTOP && (
					<Modal
						size={screenMode === MOBILE ? 'small' : 'medium'}
						title={t('are_you_using_a_small_screen?', 'Are you using a small screen?')}
						open={showModal}
						customFooter={
							<Container orientation="horizontal" mainAlignment="flex-end">
								<Row style={{ gap: '1rem' }}></Row>
							</Container>
						}
						showCloseIcon
						onClose={() => {
							if (doNotShowAgain) {
								localStorage.setItem('doNotShowMobileAppModal', JSON.stringify(true));
							}
							setShowModal(false);
						}}
					>
						<Row
							padding={{ vertical: 'extralarge' }}
							mainAlignment="center"
							crossAlignment="center"
						>
							<Row mainAlignment="center" crossAlignment="center" padding={{ bottom: 'large' }}>
								<Text
									style={{ lineHeight: '1.5rem' }}
									size={screenMode === MOBILE ? 'small' : 'medium'}
									overflow="break-word"
								>
									<Trans
										i18nKey="login_with_app"
										defaults="You can login using the dedicated app for <bold> Android </bold> and  <bold> Iphone, </bold> download your version using the buttons below!"
										components={{ bold: <strong /> }}
									/>
								</Text>
							</Row>
							<Row mainAlignment="center" crossAlignment="center" padding={{ bottom: 'large' }}>
								<a target="_blank" href={PLAY_STORE_URL} rel="noreferrer">
									<img
										alt="play-store-logo"
										src={playStore}
										style={{
											maxHeight: '150px',
											display: 'block',
											marginLeft: 'auto',
											marginRight: 'auto'
										}}
									/>
								</a>
								<a target="_blank" href={APP_STORE_URL} rel="noreferrer">
									<img
										alt="app-store-logo"
										src={appStore}
										style={{
											maxHeight: '150px',
											display: 'block',
											marginLeft: 'auto',
											marginRight: 'auto'
										}}
									/>
								</a>
							</Row>
							<Row width="80%" mainAlignment="center" crossAlignment="center">
								<Checkbox
									iconColor="primary"
									size="small"
									label={t('do_not_show_this_again', 'Do not show this again')}
									value={doNotShowAgain}
									onClick={() => {
										setDoNotShowAgain(!doNotShowAgain);
									}}
								/>
							</Row>
						</Row>
					</Modal>
				)}
			</LoginContainer>
		);
	}

	return null;
}
