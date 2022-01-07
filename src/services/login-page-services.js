// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

export function getLoginSupported() {
	return fetch('/zx/login/supported')
		.then((res) => {
			if (res.status === 200) return res.json();
			throw Error('Network Error');
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
			throw Error('Network Error');
		});
}