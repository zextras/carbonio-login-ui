import {browserName, browserVersion, isMobile, mobileModel, mobileVendor, osName, osVersion} from "react-device-detect";

export function postV1Login(auth_method, user, password, service) {
    let deviceModel = isMobile ? mobileVendor + ' ' + mobileModel : browserName + ' ' + browserVersion;
    deviceModel = deviceModel + "/" + osName + " " + osVersion
    return fetch('/zx/auth/v1/login', {
        method: 'POST',
        headers: {
            'X-Device-Model': deviceModel,
            'X-Device-Id': 1,
            'X-Service': 'ZimbraUI'
        },
        body: JSON.stringify({
            auth_method: auth_method,
            user: user,
            password: password
        })
    });
}