/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */
import loginSupported from './login/supported';
import authSupported from './auth/supported';
import v1config from './login/v1/config';
import v1login from './auth/v1/login';
import v2login from './auth/v2/login';
import v2OTPValidate from './auth/v2/otp_validate';

export const handlers = [
	loginSupported,
	authSupported,
	v1config,
	v1login,
	v2login,
	v2OTPValidate
];
