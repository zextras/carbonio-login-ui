import { rest } from 'msw';

import { IRIS_CHECK_URL } from '../../constants';

export default rest.get(
	IRIS_CHECK_URL,
	(req, res, ctx) => {
		return res(
			ctx.delay(1000),
			ctx.status(200)
		)
	}
);
