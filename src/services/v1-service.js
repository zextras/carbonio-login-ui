import {deviceModel, deviceId} from './../utils'

export function postV1Login(auth_method, user, password, service) {
    return fetch('/zx/auth/v1/login', {
        method: 'POST',
        headers: {
            'X-Device-Model': deviceModel(),
            'X-Device-Id': deviceId(),
            'X-Service': 'ZimbraUI',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            auth_method: auth_method,
            user: user,
            password: password
        })
    });
}