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

import React, {useEffect, useState} from 'react';
import styled, {css} from 'styled-components';
import {Link as RouterLink} from 'react-router-dom';
import {Button, Container, Link, Padding, Row, Snackbar, Text, Tooltip, useScreenMode} from '@zextras/zapp-ui';

import {useTranslation} from 'react-i18next';
import logoChrome from 'assets/logo-chrome.svg';
import logoFirefox from 'assets/logo-firefox.svg';
import logoIE from 'assets/logo-internet-explorer.svg';
import logoEdge from 'assets/logo-edge.svg';
import logoSafari from 'assets/logo-safari.svg';
import logoOpera from 'assets/logo-opera.svg';
import logoYandex from 'assets/logo-yandex.svg';
import logoUC from 'assets/logo-ucbrowser.svg';
import {getConfig, getSupported} from '../services/configuration-service';
import FormSelector from './form-selector';
import {GenericErrorModal, HelpModal, OfflineModal} from './modals'

const LoginContainer = styled(Container)`
	padding: 0 100px;
	background: url(${(props) => {
    return props.backgroundImage
}}) no-repeat 75% center/cover;
	justify-content: center;
	align-items: flex-start;
	${({screenMode, theme}) => screenMode === 'mobile' && css`
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
	max-height: 720px;
	height: 100vh;
	overflow-y: auto;
	${({screenMode, theme}) => screenMode === 'mobile' && css`
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

export default function LoginView({theme, setTheme}) {
    const {t} = useTranslation();
    const screenMode = useScreenMode();
    const [config, setConfig] = useState(null);
    const [logo, setLogo] = useState(null);

    const [openHelpModal, setOpenHelpModal] = useState(false);
    const [openOfflineModal, setOpenOfflineModal] = useState(false);
    const [openGenericModal, setOpenGenericModal] = useState(false);
    const [snackbarThemeError, setSnackbarThemeError] = useState(false);

    const domain = window.location.hostname;

    useEffect(() => {
        let componentIsMounted = true;
        getSupported(domain)
            .then((res) => {
                if (componentIsMounted) {
                    const version = res.minApiVersion;
                    setConfig({
                        version: version
                    });
                    getConfig(version, domain, domain)
                        .then((res) => {
                            if (componentIsMounted) {
                                let edited_theme = {
                                    palette: {
                                        light: {}
                                    }
                                };
                                if (res.hasOwnProperty('loginPageBackgroundImage' && res.loginPageBackgroundImage)) {
                                    edited_theme.loginBackground = res.loginPageBackgroundImage;
                                } else {
                                    edited_theme.loginBackground = "assets/bg.jpg";
                                }

                                if (res.hasOwnProperty('loginPageLogo' && res.loginPageLogo)) {
                                    // TODO: edited_theme.logo = res.loginPageLogo;
                                } else {
                                    setLogo('https://f0xqhztc8f3dlju13uzd0o1e-wpengine.netdna-ssl.com/wp-content/uploads/2019/08/zimbra-mail-iphone-tablet.png');
                                }

                                if (res.hasOwnProperty('loginPageColorSet' && res.loginPageColorSet)) {
                                    const color_set = res.loginPageColorSet;
                                    if (color_set.hasOwnProperty('primary' && color_set.primary)) {
                                        edited_theme.palette.light.primary = {
                                            regular: color_set.primary
                                        };
                                    }
                                    if (color_set.hasOwnProperty('secondary' && color_set.secondary)) {
                                        edited_theme.palette.light.secondary = {
                                            regular: color_set.secondary
                                        };
                                    }
                                }

                                // USED TO TEST THE CUSTOMIZATION OF THE THEME
                                // edited_theme.palette.light.primary = {
                                //     regular: '#FF0000'
                                // };
                                // edited_theme.palette.light.secondary = {
                                //     regular: '#111111'
                                // };
                                // edited_theme.loginBackground = 'https://images.pexels.com/photos/956981/milky-way-starry-sky-night-sky-star-956981.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260';

                                setTheme(edited_theme);
                            }
                        })
                        .catch((err) => {
                            if (componentIsMounted) {
                                setTheme({
                                    loginBackground: "assets/bg.jpg"
                                });
                                setSnackbarThemeError(true);
                            }
                        });
                }
            })
            .catch((err) => {
                if (componentIsMounted) {
                    setTheme({
                        loginBackground: "assets/bg.jpg"
                    });
                    setOpenGenericModal(true);
                }
            });
        return () => {
            componentIsMounted = false;
        };
    }, []);

    return (
        <>
            {
                config &&
                <>
                    <LoginContainer screenMode={screenMode} backgroundImage={theme.loginBackground}>
                        <FormContainer>
                            <FormWrapper mainAlignment="space-between" screenMode={screenMode}>
                                <Container mainAlignment="flex-start" height="auto">
                                    <Padding value="38px 0 38px">
                                        <img src={logo} style={{maxWidth: '100%', maxHeight: '150px'}}/>
                                    </Padding>
                                    <Padding bottom="extralarge" style={{width: '100%'}}>
                                        <FormSelector configuration={config}/>
                                        <Container orientation="horizontal" height="auto" mainAlignment="space-between">
                                            <Row mainAlignment="flex-start">
                                                <Link color="primary" size="medium"
                                                      onClick={() => setOpenHelpModal(true)}>{t('Help')}?</Link>
                                                <Separator/>
                                                <Link as={RouterLink} to="/" size="medium"
                                                      color="primary">{t('Privacy policy')}</Link>
                                            </Row>
                                            {false &&
                                            <Row mainAlignment="flex-end">
                                                <Button type="outlined" label={t('Login SAML')} color="primary"
                                                        onClick={() => {
                                                            console.log('Login SAML TODO')
                                                        } /* TODO */}/>
                                            </Row>
                                            }
                                        </Container>
                                    </Padding>
                                </Container>
                                <Container crossAlignment="flex-start" height="auto" padding={{bottom: 'extralarge'}}>
                                    <Text>{t('Supported browsers')}</Text>
                                    <Row padding={{top: 'medium', bottom: 'extralarge'}} wrap="nowrap">
                                        <Padding all="extrasmall" right="small"><Tooltip label="Chrome"><img
                                            src={logoChrome}
                                            width="18px"/></Tooltip></Padding>
                                        <Padding all="extrasmall" right="small"><Tooltip label="Firefox"><img
                                            src={logoFirefox}
                                            width="18px"/></Tooltip></Padding>
                                        <Padding all="extrasmall" right="small"><Tooltip
                                            label="Internet Explorer 11+"><img
                                            src={logoIE} width="18px"/></Tooltip></Padding>
                                        <Padding all="extrasmall" right="small"><Tooltip label="Edge"><img
                                            src={logoEdge}
                                            width="18px"/></Tooltip></Padding>
                                        <Padding all="extrasmall" right="small"><Tooltip label="Safari"><img
                                            src={logoSafari}
                                            width="18px"/></Tooltip></Padding>
                                        <Padding all="extrasmall" right="small"><Tooltip label="Opera"><img
                                            src={logoOpera}
                                            width="18px"/></Tooltip></Padding>
                                        <Padding all="extrasmall" right="small"><Tooltip label="Yandex"><img
                                            src={logoYandex}
                                            width="18px"/></Tooltip></Padding>
                                        <Padding all="extrasmall" right="small"><Tooltip label="UC"><img src={logoUC}
                                                                                                         width="18px"/></Tooltip></Padding>
                                    </Row>
                                    <Text size="small"
                                          overflow="break-word">Copyright &copy; {new Date().getFullYear()} Zextras, {t('All rights reserved')}</Text>
                                </Container>
                            </FormWrapper>
                        </FormContainer>
                    </LoginContainer>
                    <HelpModal open={openHelpModal} onClose={() => setOpenHelpModal(false)}/>
                    <Snackbar open={snackbarThemeError} onClose={() => setSnackbarThemeError(false)} type="error"
                              label={`${t('Failed to fetch the application theme')}.`}/>
                </>
            }
            <GenericErrorModal
                open={openGenericModal}
                onClose={() => setOpenOfflineModal(false)}
                message='Cannot connect to the authentication server.'
            />
        </>
    );
}
