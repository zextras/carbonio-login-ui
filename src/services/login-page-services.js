export function getLoginSupported(domain) {
    return fetch('/zx/login/supported?' + new URLSearchParams({domain: domain}), {
        method: 'GET',
    })
        .then((res) => {
            if(res.status === 200)
                return res.json();
            else
                throw Error('Notwork Error');
        });
}

export function getLoginConfig(version, domain, host) {
    return fetch('/zx/login/v' + version + '/config?' + new URLSearchParams({domain: domain, host: host}), {
        method: 'GET'
    })
        .then((res) => {
            if(res.status === 200)
                return res.json();
            else
                throw Error('Notwork Error');
        });
}
