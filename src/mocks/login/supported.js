import { rest } from 'msw';

export default rest.get(
	'/zx/login/supported',
	(req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json({
				minApiVersion: 1,
				maxApiVersion: 1
			}),
		)
	}
);
