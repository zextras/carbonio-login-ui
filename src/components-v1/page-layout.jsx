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
import logoChrome from 'assets/logo-chrome.svg';
import logoFirefox from 'assets/logo-firefox.svg';
import logoIE from 'assets/logo-internet-explorer.svg';
import logoEdge from 'assets/logo-edge.svg';
import logoSafari from 'assets/logo-safari.svg';
import logoOpera from 'assets/logo-opera.svg';
import logoYandex from 'assets/logo-yandex.svg';
import logoUC from 'assets/logo-ucbrowser.svg';
import bakgoundImage from 'assets/bg.jpg';
import logoZextras from 'assets/logo-zextras.png';
import { getLoginConfig } from '../services/login-page-services';
import FormSelector from './form-selector';

const LoginContainer = styled(Container)`
	padding: 0 100px;
	background: url(${(props) => props.backgroundImage}) no-repeat 75% center/cover;
	justify-content: center;
	align-items: flex-start;
	${({ screenMode, theme }) => screenMode === 'mobile' && css`
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
  const { t } = useTranslation();
  const screenMode = useScreenMode();
  const [logo, setLogo] = useState(null);

  const domain = new URLSearchParams(window.location.search).get('domain');

  useEffect(() => {
    let componentIsMounted = true;

    getLoginConfig(1, domain, domain)
      .then((res) => {
        const logo = {};

        if (componentIsMounted) {
          const edited_theme = {
            palette: {
              light: {}
            }
          };
          if (res.hasOwnProperty('loginPageBackgroundImage') && res.loginPageBackgroundImage) {
            edited_theme.loginBackground = res.loginPageBackgroundImage;
          } else {
            edited_theme.loginBackground = bakgoundImage;
          }

          if (res.hasOwnProperty('loginPageLogo') && res.loginPageLogo) {
            logo.image = res.loginPageLogo;
          } else {
            logo.image = logoZextras;
          }

          if (res.hasOwnProperty('zimbraSkinLogoURL') && res.zimbraSkinLogoURL) {
            logo.url = res.zimbraSkinLogoURL;
          } else {
            logo.url = '';
          }

          if (res.hasOwnProperty('favicon') && res.favicon) {
            const link = document.querySelector('link[rel*=\'icon\']') || document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            link.href = res.favicon;
            document.getElementsByTagName('head')[0].appendChild(link);
          }

          if (res.hasOwnProperty('loginPageColorSet') && res.loginPageColorSet) {
            const color_set = res.loginPageColorSet;
            if (color_set.hasOwnProperty('primary') && color_set.primary) {
              edited_theme.palette.light.primary = {
                regular: color_set.primary
              };
            }
            if (color_set.hasOwnProperty('secondary') && color_set.secondary) {
              edited_theme.palette.light.secondary = {
                regular: color_set.secondary
              };
            }
          }
          setLogo(logo);
          setTheme(edited_theme);
        }
      })
      .catch(() => {
        // It should never happen, If the server doesn't respond this page will not be loaded
        alert('The server is not responding. Please contact your server administrator');
      });
    return () => {
      componentIsMounted = false;
    };
  }, []);

  return (
    <>
      {
        logo
        && (
          <LoginContainer screenMode={screenMode} backgroundImage={theme.loginBackground}>
            <FormContainer>
              <FormWrapper mainAlignment="space-between" screenMode={screenMode}>
                <Container mainAlignment="flex-start" height="auto">
                  <Padding value="28px 0 28px" crossAlignment="center">
                    <Container crossAlignment="center">
                      <a href={logo.url}>
                        <img
                          src={logo.image} style={{
                          maxWidth: '65%',
                          maxHeight: '150px',
                          display: 'block',
                          marginLeft: 'auto',
                          marginRight: 'auto'
                        }}
                        />
                      </a>
                    </Container>
                  </Padding>
                </Container>
                <FormSelector></FormSelector>
                <Container crossAlignment="flex-start" height="auto" padding={{ bottom: 'extralarge', top:'extralarge' }}>
                  <Text>{t('Supported browsers')}</Text>
                  <Row padding={{ top: 'medium', bottom: 'extralarge' }} wrap="nowrap">
                    <Padding all="extrasmall" right="small">
                      <Tooltip label="Chrome">
                        <img
                          src={logoChrome}
                          width="18px"
                        />
                      </Tooltip>
                    </Padding>
                    <Padding all="extrasmall" right="small">
                      <Tooltip label="Firefox">
                        <img
                          src={logoFirefox}
                          width="18px"
                        />
                      </Tooltip>
                    </Padding>
                    <Padding all="extrasmall" right="small">
                      <Tooltip
                        label="Internet Explorer 11+"
                      ><img
                        src={logoIE} width="18px"
                      />
                      </Tooltip>
                    </Padding>
                    <Padding all="extrasmall" right="small">
                      <Tooltip label="Edge">
                        <img
                          src={logoEdge}
                          width="18px"
                        />
                      </Tooltip>
                    </Padding>
                    <Padding all="extrasmall" right="small">
                      <Tooltip label="Safari">
                        <img
                          src={logoSafari}
                          width="18px"
                        />
                      </Tooltip>
                    </Padding>
                    <Padding all="extrasmall" right="small">
                      <Tooltip label="Opera">
                        <img
                          src={logoOpera}
                          width="18px"
                        />
                      </Tooltip>
                    </Padding>
                    <Padding all="extrasmall" right="small">
                      <Tooltip label="Yandex">
                        <img
                          src={logoYandex}
                          width="18px"
                        />
                      </Tooltip>
                    </Padding>
                    <Padding all="extrasmall" right="small">
                      <Tooltip label="UC">
                        <img
                          src={logoUC}
                          width="18px"
                        />
                      </Tooltip>
                    </Padding>
                  </Row>
                  <Text
                    size="small"
                    overflow="break-word"
                  >Copyright &copy;
                    {' '}
                    {new Date().getFullYear()}
                    {' '}
                    Zextras,
                    {' '}
                    {t('All rights reserved')}
                  </Text>
                </Container>
              </FormWrapper>
            </FormContainer>
          </LoginContainer>
        )
      }
    </>
  );
}
