import { lazy } from 'react';
import { getLoginSupported } from '../services/login-page-services';
import ServerNotResponding from './server-not-responding';
import NotSupportedVersion from './not-supported-version';

const Loader = lazy(() => {
  const domain = new URLSearchParams(window.location.search).get('domain');
  return getLoginSupported(domain)
    .then(({ minApiVersion, maxApiVersion }) => {
      const maxSupportedVersion = 1; // to keep updated adding new versions

      let version = maxApiVersion;
      if (version > maxSupportedVersion) {
        version -= maxSupportedVersion;
      }

      if (version < minApiVersion) {
        return new Promise((resolve) => {
          resolve({ default: NotSupportedVersion });
        });
      }

      switch (version) {
        case 1:
          return import(/* webpackChunkName: "v1" */ '../components-v1/page-layout');
        default:
          return new Promise((resolve) => {
            resolve({ default: NotSupportedVersion });
          });
      }
    })
    .catch(() => new Promise((resolve) => {
      resolve({ default: ServerNotResponding });
    }));
});

export default Loader;
