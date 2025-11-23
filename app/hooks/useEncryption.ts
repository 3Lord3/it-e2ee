import { useState, useCallback } from 'react';
import { type KeyPair } from '@/types/encryption';
import {
	generateKeyPair,
	encryptWithScrambling,
	decryptWithUnscrambling
} from '@/utils/encryption/rsa';
import {
	generateAndStoreKeyPair,
	getStoredKeyPair,
	storeOtherUserPublicKey,
	getOtherUserPublicKey
} from '@/utils/encryption/keyManagement';

export function useEncryption() {
	const [keyPair, setKeyPair] = useState<KeyPair | null>(getStoredKeyPair());

	const generateKeys = useCallback(() => {
		const newKeyPair = generateAndStoreKeyPair();
		setKeyPair(newKeyPair);
		return newKeyPair;
	}, []);

	const encryptForUser = useCallback((message: string, targetUserId: string): number[] => {
		const targetPublicKey = getOtherUserPublicKey(targetUserId);
		if (!targetPublicKey) {
			throw new Error(`Публичный ключ пользователя ${targetUserId} не найден`);
		}

		return encryptWithScrambling(message, targetPublicKey);
	}, []);

	const decryptMessageForMe = useCallback((encryptedData: number[]): string => {
		if (!keyPair) {
			throw new Error('Приватный ключ не найден');
		}

		return decryptWithUnscrambling(encryptedData, keyPair.privateKey);
	}, [keyPair]);

	const savePublicKey = useCallback((userId: string, publicKey: string) => {
		storeOtherUserPublicKey(userId, publicKey);
	}, []);

	const getPublicKey = useCallback((userId: string): string | null => {
		return getOtherUserPublicKey(userId);
	}, []);

	return {
		keyPair,
		generateKeys,
		encryptForUser,
		decryptMessageForMe,
		savePublicKey,
		getPublicKey,
		hasKeys: !!keyPair
	};
}