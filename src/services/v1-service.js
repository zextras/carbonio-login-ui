import { getDeviceId, getDeviceModel } from '../utils';

export function postV1Login(authMethod, user, password, service) {
	return fetch('/zx/auth/v1/login', {
		method: 'POST',
		headers: {
			'X-Device-Model': getDeviceModel(),
			'X-Device-Id': getDeviceId(),
			'X-Service': 'ZimbraUI',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			auth_method: authMethod,
			user,
			password
		})
	});
}
