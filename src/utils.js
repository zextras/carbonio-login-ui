import {
	browserName,
	browserVersion,
	isMobile,
	mobileModel,
	mobileVendor,
	osName,
	osVersion
} from 'react-device-detect';
import DeviceUUID from 'device-uuid';

export function getDeviceModel() {
	let deviceModel = isMobile ? `${mobileVendor} ${mobileModel}` : `${browserName} ${browserVersion}`;
	deviceModel = `${deviceModel}/${osName} ${osVersion}`;
	return deviceModel;
}

export function getDeviceId() {
	return new DeviceUUID().get();
}
