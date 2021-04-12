import { rest } from 'msw';

export default rest.get(
	'/zx/auth/v1/logout',
	(req, res, ctx) => {
		return res(
			ctx.status(200)
		);
	}
);