export function getAuthSupported(domain) {
	const urlParams = new URLSearchParams();
	if(domain) urlParams.append("domain", domain);
	return fetch(`/zx/auth/supported?${urlParams}`, {
		method: 'GET',
	})
		.then((res) => {
			if (res.status === 200) return res.json();
			throw Error('Notwork Error');
		});
}

export function doAuthLogout(configuration) {
	return fetch(`/zx/auth/v${configuration.maxApiVersion}/logout`, {
		method: 'GET',
	})
		.then((res) => {
			if (res.status !== 200)
				throw Error('Notwork Error');
		});
}