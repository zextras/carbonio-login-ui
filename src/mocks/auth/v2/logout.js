import { rest } from 'msw';

export default rest.get(
	'/zx/auth/v2/logout',
	(req, res, ctx) => {
		return res(
			ctx.status(200)
		);
	}
);