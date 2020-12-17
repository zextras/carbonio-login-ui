import { rest } from 'msw';

export default rest.post(
	'/zx/auth/v1/login',
	(req, res, ctx) => {
		return res(
			ctx.status(200)
		);
	}
);