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
