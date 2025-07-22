/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export function getAdvancedSupported(): Promise<{ supported: boolean }> {
	return fetch('/advanced/supported').then(async (res) => {
		const data: { supported: boolean } = await res.json();
		return { supported: data.supported };
	});
}
