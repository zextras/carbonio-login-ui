export function getAuthSupported(domain) {
	return fetch(`/zx/auth/supported?${new URLSearchParams({ domain })}`, {
		method: 'GET',
	})
		.then((res) => {
			if (res.status === 200) return res.json();
			throw Error('Notwork Error');
		});
}
