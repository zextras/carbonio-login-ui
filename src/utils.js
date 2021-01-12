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
import { DeviceUUID } from 'device-uuid';

export function getDeviceModel() {
	let deviceModel = isMobile ? `${mobileVendor} ${mobileModel}` : `${browserName} ${browserVersion}`;
	deviceModel = `${deviceModel}/${osName} ${osVersion}`;
	return deviceModel;
}

export function deviceId() {
	return (new DeviceUUID()).get();
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
