import './index.css';

fetch('/zx/login/supported')
    .then((resp) => resp.json())
    .then(({ minApiVersion }) => {
        const el = document.createElement('script');
        el.setAttribute('type', 'text/javascript');
        el.setAttribute('src', `/v${minApiVersion}.js`);
        document.head.appendChild(el);
    });
