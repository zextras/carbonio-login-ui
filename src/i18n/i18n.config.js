/* eslint-disable import/no-extraneous-dependencies */
/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		react: {
			useSuspense: false
		},
		fallbackLng: 'en',
		debug: false,
		interpolation: {
			escapeValue: false // react already safes from xss
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		missingKeyHandler: (lng, ns, key, fallbackValue) => {
			// eslint-disable-next-line no-console
			console.warn('Missing translation with key', key);
		},
		backend: {
			loadPath: 'i18n/{{lng}}.json'
		}
	});

export default i18n;
