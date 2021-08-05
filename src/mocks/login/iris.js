import { rest } from 'msw';

import { IRIS_URL } from '../../constants';

export default rest.get(
	`${IRIS_URL}commit`,
	(req, res, ctx) => {
		return res(
			ctx.delay(1000),
			ctx.status(200)
		)
	}
);
