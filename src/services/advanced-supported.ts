/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

type Error = {
	errorMessage: string;
};

type Success = {
	supported: boolean;
};

export type GetAdvancedSupportedResponse = Promise<Success | Error>;

function errorMessage(): Error {
	return { errorMessage: 'Failed to check Advanced installation' };
}

export const getAdvancedSupported = (): GetAdvancedSupportedResponse =>
	fetch('/advanced/supported')
		.then(async (res) => {
			if (res.ok) {
				const data = await res.json();
				const installedServices = Object.keys(data);
				const isAdvanced =
					installedServices.filter((service): boolean => service === 'carbonio-advanced').length >
					0;
				return { supported: isAdvanced };
			}
			return errorMessage();
		})
		.catch(() => {
			return { errorMessage: 'Failed to check Advanced installation' };
		});
