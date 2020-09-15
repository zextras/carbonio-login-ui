export function getSupported(domain) {
    return fetch('/zx/auth/supported?' + new URLSearchParams({domain: domain}), {
        method: 'GET',
    }).then(res => res.json());
}

export function getConfig(version, domain, host) {
    return fetch('/zx/login/v' + version + '/config?' + new URLSearchParams({domain: domain, host: host}), {
        method: 'GET'
    }).then(res => res.json());
}

export function getAsset(version, path) {
    return fetch('/zx/login/v' + version + '/assets?' + new URLSearchParams({assetsPathFile: path}), {
        method: 'GET'
    }).then(res => res.json());
}


