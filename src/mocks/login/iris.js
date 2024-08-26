/* eslint-disable import/no-extraneous-dependencies */
/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { http, delay, HttpResponse } from 'msw';

import { IRIS_CHECK_URL } from '../../constants';

export default http.get(IRIS_CHECK_URL, async () => {
	await delay(1000);
	return HttpResponse.json(null, { status: 200 });
});
