export function getLoginSupported(domain) {
	const urlParams = new URLSearchParams();
	if(domain) urlParams.append("domain", domain);
	return fetch(`/zx/login/supported?${urlParams}`, {
		method: 'GET',
	})
		.then((res) => {
			if (res.status === 200) return res.json();
			throw Error('Notwork Error');
		});
}

export function getLoginConfig(version, domain, host) {
	const urlParams = new URLSearchParams();
	if(domain) urlParams.append("domain", domain);
	if(host) urlParams.append("host", host);
	return fetch(`/zx/login/v${version}/config?${urlParams}`, {
		method: 'GET'
	})
		.then((res) => {
			if (res.status === 200) return res.json();
			throw Error('Notwork Error');
		});
}
