import {browserName, browserVersion, isMobile, mobileModel, mobileVendor, osName, osVersion, u} from "react-device-detect";

const deviceUuid = require("device-uuid");

export function deviceModel() {
    let deviceModel = isMobile ? mobileVendor + ' ' + mobileModel : browserName + ' ' + browserVersion;
    deviceModel = deviceModel + "/" + osName + " " + osVersion;
    return deviceModel;
}

export function deviceId() {
    return new deviceUuid.DeviceUUID().get();
}
