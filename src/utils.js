/* eslint @typescript-eslint/no-var-requires: "off" */
import {
	browserName,
	browserVersion,
	isMobile,
	mobileModel,
	mobileVendor,
	osName,
	osVersion
} from 'react-device-detect';
import { darken, desaturate, lighten, setLightness } from 'polished';

import { DEFAULT_UI, IRIS_URL } from './constants';

export function getDeviceModel() {
	let deviceModel = isMobile ? `${mobileVendor} ${mobileModel}` : `${browserName} ${browserVersion}`;
	deviceModel = `${deviceModel}/${osName} ${osVersion}`;
	return deviceModel;
}

export function deviceId() {
	const uuid = localStorage.getItem('device-uuid');
	if (uuid !== null) return uuid;
	// eslint-disable-next-line
	const generatedUUID = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c =>(c^(window.crypto||window.msCrypto).getRandomValues(new Uint8Array(1))[0]&15>>c/4).toString(16));
	localStorage.setItem('device-uuid', generatedUUID);
	return generatedUUID;
}

export function saveCredentials(username, password) {
	if (window.PasswordCredential) {
		// eslint-disable-next-line no-undef
		const cred = new PasswordCredential({
			id: username,
			password,
			name: password
		});
		navigator.credentials.store(cred);
	}
}

export function prepareUrlForForward(oUrl) {
	if (typeof oUrl !== 'string') return oUrl;
	let url;
	try {
		url = new URL(oUrl);
	}
	catch(err) {
		return undefined;
	}
	const urlParams = new URLSearchParams(window.location.search);
	const blackListedQueryStrings = [
		'loginOp',
		'loginNewPassword',
		'totpcode',
		'loginConfirmNewPassword',
		'loginErrorCode',
		'username',
		'email',
		'password',
		'zrememberme',
		'ztrusteddevice',
		'zlastserver',
		'client',
		'login_csrf',
		'ignoreLoginURL',
		'soo',
		'destinationUrl'
	];
	blackListedQueryStrings.map((queryString) => urlParams.has(queryString) && urlParams.delete(queryString));
	urlParams.forEach((value, key) => {
		url.searchParams.set(key, value);
	});
	return url.toString();
}

export function generateColorSet({ regular, hover, active, disabled, focus }, dark = false) {
	return {
		regular,
		hover: hover ?? dark ? lighten(0.1, regular) : darken(0.1, regular),
		focus: focus ?? dark ? lighten(0.1, regular) : darken(0.1, regular),
		active: active ?? dark ? lighten(0.15, regular) : darken(0.15, regular),
		disabled: disabled ?? dark ? setLightness(0.8, regular) : desaturate(0.3, darken(0.3, regular))
	};
}

export function addUiParameters(destinationUrl) {
	// Get selected ui from current url
	const urlParams = new URLSearchParams(window.location.search);
	const ui = urlParams.get('ui') || DEFAULT_UI;
	// Build url from the destinationUrl and get its search params
	// to add to final built url
	const destinationUrlObj = new URL(destinationUrl);
	const destinationSearchParams = new URLSearchParams(destinationUrlObj.search);
	destinationSearchParams.delete('ui');
	const newUrl = new URL(ui === 'iris' ? IRIS_URL : '/', destinationUrl.replace(IRIS_URL, '/'));
	newUrl.search = destinationSearchParams.toString();
	return newUrl.toString();
}
