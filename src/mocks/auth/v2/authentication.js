import { rest } from "msw";

export default rest.get(
	'/zx/auth/v2/myself',
	(req, res, ctx) => {
		return res(
			ctx.delay(1000),
			ctx.status(401),
		);
	}
);
