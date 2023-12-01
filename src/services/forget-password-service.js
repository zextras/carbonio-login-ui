/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
export function getRecoveryAccount(username) {
	return fetch('/service/soap/RecoverAccountRequest', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'omit',
		body: JSON.stringify({
			Body: {
				RecoverAccountRequest: {
					_jsns: 'urn:zimbraMail',
					op: 'getRecoveryAccount',
					email: username,
					channel: 'email'
				}
			}
		})
	});
}

export function getSendRecoveryCode(username) {
	return fetch('/service/soap/RecoverAccountRequest', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'omit',
		body: JSON.stringify({
			Body: {
				RecoverAccountRequest: {
					_jsns: 'urn:zimbraMail',
					op: 'sendRecoveryCode',
					email: username,
					channel: 'email'
				}
			}
		})
	});
}

export function validateRecoveryCode(username, recoveryCode) {
	return fetch('/service/soap/AuthRequest', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'omit',
		body: JSON.stringify({
			Body: {
				AuthRequest: {
					_jsns: 'urn:zimbraAccount',
					account: {
						by: 'name',
						_content: username
					},
					recoveryCode: {
						_content: recoveryCode
					}
				}
			}
		})
	});
}
