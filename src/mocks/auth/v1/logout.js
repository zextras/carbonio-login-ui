/* eslint-disable import/no-extraneous-dependencies */
/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { rest } from 'msw';

export default rest.get('/zx/auth/v1/logout', (req, res, ctx) => {
	return res(ctx.status(200));
});
