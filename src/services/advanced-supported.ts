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

export function getAdvancedSupported(): GetAdvancedSupportedResponse {
	return fetch('/advanced/supported')
		.then(async (res) => {
			const data = await res.json();
			if (!('supported' in data)) {
				return { errorMessage: 'Failed to check Advanced installation' };
			}
			return { supported: data.supported };
		})
		.catch(() => {
			return { errorMessage: 'Failed to check Advanced installation' };
		});
}

const useIsAdvanced = () => {};
