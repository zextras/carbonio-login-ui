import {rest} from "msw";

export default rest.post(
	'/zx/auth/v2/otp/validate',
	(req, res, ctx) => {
		return res(
			ctx.status(200)
		);
	}
);