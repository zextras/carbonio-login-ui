/* eslint-disable import/no-extraneous-dependencies */
/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useLayoutEffect, useState, useContext, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import {
	Container,
	Link,
	Padding,
	Row,
	Text,
	Tooltip,
	useScreenMode,
	Popper
} from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import logoChrome from '../../assets/logo-chrome.svg';
import logoFirefox from '../../assets/logo-firefox.svg';
import logoGlobe from '../../assets/globe-outline.svg';
import backgroundImage from '../../assets/carbonio_loginpage.jpg';
import backgroundImageRetina from '../../assets/carbonio_loginpage-retina.jpg';
import logoCarbonio from '../../assets/logo-carbonio.png';
import { getLoginConfig } from '../services/login-page-services';
import FormSelector from './form-selector';
import ServerNotResponding from '../components-index/server-not-responding';
import { ZimbraForm } from '../components-index/zimbra-form';
import { generateColorSet, prepareUrlForForward } from '../utils';
import { ThemeCallbacksContext } from '../theme-provider/theme-provider';
import { CARBONIO_LOGO_URL } from '../constants';
import { useLoginConfigStore } from '../store/login/store';
import { useDarkReaderResultValue } from '../dark-mode/use-dark-reader-result-value';

const LoginContainer = styled(Container)`
	padding: 0 100px;
	background: url(${(props) => props.backgroundImage}) no-repeat 75% center/cover;
	justify-content: center;
	align-items: flex-start;
	${({ screenMode }) =>
		screenMode === 'mobile' &&
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
		screenMode === 'mobile' &&
		css`
			padding: 20px 20px 0;
			width: 360px;
			max-height: 100%;
			height: auto;
		`}
`;

const PhotoLink = styled(Link)``;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PhotoCredits = styled(Text)`
	position: absolute;
	bottom: ${({ theme }) => theme.sizes.padding.large};
	right: ${({ theme }) => theme.sizes.padding.large};
	opacity: 50%;
	&,
	${PhotoLink} {
		color: #fff;
	}

	@media (max-width: 767px) {
		display: none;
	}
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
	const screenMode = useScreenMode();
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
	const [open, setOpen] = useState(false);
	const rowRef = useRef(undefined);

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
									<Tooltip label={t('browser_label.chrome', 'Chrome')}>
										<img alt="Logo Chrome" src={logoChrome} width="18px" />
									</Tooltip>
								</Padding>
								<Padding all="extrasmall" right="small">
									<Tooltip label={t('browser_label.firefox', 'Firefox')}>
										<img alt="Logo Firefox" src={logoFirefox} width="18px" />
									</Tooltip>
								</Padding>
								<Padding all="extrasmall" right="small">
									<Row
										ref={rowRef}
										onMouseEnter={() => setOpen(true)}
										onMouseLeave={() => setOpen(false)}
									>
										<img alt="Logo Globe" src={logoGlobe} width="18px" />
										<Text color="#a0a4a9">*</Text>
									</Row>
								</Padding>
							</Row>
							<Popper
								open={open}
								anchorEl={rowRef}
								placement="bottom"
								onClose={() => setOpen(false)}
								disableRestoreFocus
							>
								<Container
									orientation="horizontal"
									mainAlignment="flex-start"
									background="gray3"
									height="fit"
									crossAlignment="flex-start"
								>
									<Padding all="small">
										<Padding bottom="small">
											<Text size="extrasmall" weight="bold">
												{t('browser_with_limited_support', 'Browser with limited support')}
											</Text>
										</Padding>
										<Padding bottom="extrasmall">
											<Text size="extrasmall">
												{t('browser_label.microsoft_edge', 'Microsoft Edge (Chromium)')}
											</Text>
										</Padding>
										<Padding bottom="extrasmall">
											<Text size="extrasmall">{t('browser_label.safari', 'Safari')}</Text>
										</Padding>
										<Padding bottom="extrasmall">
											<Text size="extrasmall">{t('browser_label.opera', 'Opera')}</Text>
										</Padding>
									</Padding>
								</Container>
							</Popper>
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
			</LoginContainer>
		);
	}

	return null;
}
