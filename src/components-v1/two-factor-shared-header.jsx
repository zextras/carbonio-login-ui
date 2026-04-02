/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { Container, Padding, Row, Text } from '@zextras/carbonio-design-system';
import PropTypes from 'prop-types';

export function TwoFactorLogoHeader({ loginLogo }) {
	return (
		<Container mainAlignment="flex-start" height="auto" data-testid="form-wrapper">
			<Padding value="16px 0 20px" width="100%">
				<Container crossAlignment="left">
					{loginLogo &&
						(loginLogo.url ? (
							<a target="_blank" href={loginLogo.url} rel="noreferrer">
								<img
									alt="Logo"
									src={loginLogo.image}
									width={150}
									style={{
										maxWidth: '100%',
										maxHeight: '150px',
										display: 'block'
									}}
									data-testid="logo"
								/>
							</a>
						) : (
							<img
								alt="Logo"
								src={loginLogo.image}
								width={loginLogo.width}
								style={{
									maxWidth: '100%',
									maxHeight: '150px',
									display: 'block'
								}}
								data-testid="logo"
							/>
						))}
				</Container>
			</Padding>
		</Container>
	);
}

TwoFactorLogoHeader.propTypes = {
	loginLogo: PropTypes.shape({
		image: PropTypes.string,
		width: PropTypes.string,
		url: PropTypes.string
	})
};

TwoFactorLogoHeader.defaultProps = {
	loginLogo: undefined
};

export function TwoFactorIntro({ title, description, descriptionColor }) {
	return (
		<>
			<Row padding={{ bottom: 'large' }} mainAlignment="flex-start">
				<Text
					size="large"
					color="text"
					weight="bold"
					overflow="break-word"
					style={{ lineHeight: '27px' }}
				>
					{title}
				</Text>
			</Row>
			<Row padding={{ bottom: 'large' }} mainAlignment="flex-start">
				<Text color={descriptionColor} overflow="break-word" style={{ lineHeight: '24px' }}>
					{description}
				</Text>
			</Row>
		</>
	);
}

TwoFactorIntro.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	descriptionColor: PropTypes.string
};

TwoFactorIntro.defaultProps = {
	descriptionColor: 'text'
};
