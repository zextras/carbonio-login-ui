/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Container, Padding, Row, Text, Tooltip, useScreenMode } from '@zextras/zapp-ui';

import { useTranslation } from 'react-i18next';
import logoChrome from '../../assets/logo-chrome.svg';
import logoFirefox from '../../assets/logo-firefox.svg';
import logoIE from '../../assets/logo-internet-explorer.svg';
import logoEdge from '../../assets/logo-edge.svg';
import logoSafari from '../../assets/logo-safari.svg';
import logoOpera from '../../assets/logo-opera.svg';
import logoYandex from '../../assets/logo-yandex.svg';
import logoUC from '../../assets/logo-ucbrowser.svg';
import bakgoundImage from '../../assets/bg.jpg';
import logoZextras from '../../assets/logo-zextras.png';
import { getLoginConfig } from '../services/login-page-services';
import FormSelector from './form-selector';
import ServerNotResponding from '../components-index/server-not-responding';

const LoginContainer = styled(Container)`
	padding: 0 100px;
	background: url(${(props) => props.backgroundImage}) no-repeat 75% center/cover;
	justify-content: center;
	align-items: flex-start;
	${({ screenMode }) => screenMode === 'mobile' && css`
		padding: 0 12px;
		align-items: center;	
	`}
`;

const FormContainer = styled.div`
	max-width: 100%;
	max-height: 100vh;
	box-shadow: 0px 0px 20px -7px rgba(0,0,0,0.3);
`;

const FormWrapper = styled(Container)`
	width: auto;
	height: auto;
	background-color: #fff;
	padding: 48px 48px 0;
	width: 436px;
	max-width: 100%;
	max-height: 620px;
	height: 100vh;
	overflow-y: auto;
	${({ screenMode, theme }) => screenMode === 'mobile' && css`
		padding: 20px 20px 0;
		width: 360px;
		max-height: 100%;
		height: auto;
	`}
`;

const Separator = styled.div`
	width: 1px;
	height: 16px;
	margin: 0 10px 0 12px;
	background-color: #828282;
`;

export default function PageLayout ({ theme, setTheme }) {
	const [ t ] = useTranslation();
	const screenMode = useScreenMode();
	const [ logo, setLogo ] = useState(null);
	const [ serverError, setServerError ] = useState(false);

	const urlParams = new URLSearchParams(window.location.search);
	const [destinationUrl, setDestinationUrl] = useState(urlParams.get('destinationUrl'));
	const [domain, setDomain] = useState(urlParams.get('domain') ?? destinationUrl);

	useEffect(() => {
		let componentIsMounted = true;

		getLoginConfig(1, domain, domain)
			.then((res) => {
				if(!destinationUrl) setDestinationUrl(res.publicUrl);
				if(!domain) setDomain(res.zimbraDomainName);

				const _logo = {};

				if (componentIsMounted) {
					const editedTheme = {
						palette: {
							light: {}
						}
					};
					if (res.loginPageBackgroundImage) {
						editedTheme.loginBackground = res.loginPageBackgroundImage;
					}
					else {
						editedTheme.loginBackground = bakgoundImage;
					}

					if (res.loginPageLogo) {
						_logo.image = res.loginPageLogo;
					}
					else {
						_logo.image = logoZextras;
					}

					if (res.loginPageSkinLogoUrl) {
						_logo.url = res.loginPageSkinLogoUrl;
					}
					else {
						_logo.url = '';
					}

					if (res.loginPageFavicon) {
						const link = document.querySelector('link[rel*=\'icon\']') || document.createElement('link');
						link.type = 'image/x-icon';
						link.rel = 'shortcut icon';
						link.href = res.loginPageFavicon;
						document.getElementsByTagName('head')[0].appendChild(link);
					}

					if (res.loginPageColorPalette) {
						const colorSet = res.loginPageColorPalette;
						if (colorSet.primary) {
							editedTheme.palette.light.primary = {
								regular: colorSet.primary
							};
						}
						if (colorSet.secondary) {
							editedTheme.palette.light.secondary = {
								regular: colorSet.secondary
							};
						}
					}
					setLogo(_logo);
					setTheme(editedTheme);
				}
			})
			.catch(() => {
				// It should never happen, If the server doesn't respond this page will not be loaded
				if (componentIsMounted)
					setServerError(true);
			});
		return () => {
			componentIsMounted = false;
		};
	}, [setLogo, setTheme, destinationUrl, domain]);

	if (serverError)
		return <ServerNotResponding/>;

	if (logo) {
		const logoHtml = (
			<img
				alt="Logo"
				src={logo.image}
				style={{
					maxWidth: '65%',
					maxHeight: '150px',
					display: 'block',
					marginLeft: 'auto',
					marginRight: 'auto'
				}}
			/>
		);

		return (
			<LoginContainer screenMode={screenMode} backgroundImage={theme.loginBackground}>
				<FormContainer>
					<FormWrapper mainAlignment="space-between" screenMode={screenMode}>
						<Container mainAlignment="flex-start" height="auto">
							<Padding value="28px 0 28px" crossAlignment="center">
								<Container crossAlignment="center">
									{logo.url
										? <a href={logo.url}>{logoHtml}</a>
										: logoHtml
									}
								</Container>
							</Padding>
						</Container>
						<FormSelector domain={domain} destinationUrl={destinationUrl} />
						<Container crossAlignment="flex-start" height="auto"
							padding={{ bottom: 'extralarge', top: 'extralarge' }}>
							<Text>{t('supported_browsers', 'Supported browsers')}</Text>
							<Row padding={{ top: 'medium', bottom: 'extralarge' }} wrap="nowrap">
								<Padding all="extrasmall" right="small">
									<Tooltip label="Chrome">
										<img
											alt=""
											src={logoChrome}
											width="18px"
										/>
									</Tooltip>
								</Padding>
								<Padding all="extrasmall" right="small">
									<Tooltip label="Firefox">
										<img
											alt=""
											src={logoFirefox}
											width="18px"
										/>
									</Tooltip>
								</Padding>
								<Padding all="extrasmall" right="small">
									<Tooltip label="Internet Explorer 11+">
										<img
											alt=""
											src={logoIE}
											width="18px"
										/>
									</Tooltip>
								</Padding>
								<Padding all="extrasmall" right="small">
									<Tooltip label="Edge">
										<img
											alt=""
											src={logoEdge}
											width="18px"
										/>
									</Tooltip>
								</Padding>
								<Padding all="extrasmall" right="small">
									<Tooltip label="Safari">
										<img
											alt=""
											src={logoSafari}
											width="18px"
										/>
									</Tooltip>
								</Padding>
								<Padding all="extrasmall" right="small">
									<Tooltip label="Opera">
										<img
											alt=""
											src={logoOpera}
											width="18px"
										/>
									</Tooltip>
								</Padding>
								<Padding all="extrasmall" right="small">
									<Tooltip label="Yandex">
										<img
											alt=""
											src={logoYandex}
											width="18px"
										/>
									</Tooltip>
								</Padding>
								<Padding all="extrasmall" right="small">
									<Tooltip label="UC">
										<img
											alt=""
											src={logoUC}
											width="18px"
										/>
									</Tooltip>
								</Padding>
							</Row>
							<Text
								size="small"
								overflow="break-word"
							>
								Copyright &copy;
								{` ${new Date().getFullYear()} Zextras, `}
								{t('all_rights_reserved', 'All rights reserved')}
							</Text>
						</Container>
					</FormWrapper>
				</FormContainer>
			</LoginContainer>
		);
	}

	return null;
}
