
export function getAuthSupported(domain) {
    return fetch('/zx/auth/supported?' + new URLSearchParams({domain: domain}), {
        method: 'GET',
    })
        .then((res) => {
            if(res.status === 200)
                return res.json();
            else
                throw Error('Notwork Error');
        });
}
