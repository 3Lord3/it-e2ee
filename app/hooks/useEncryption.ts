import {useCallback, useState} from 'react';
import {type KeyPair} from '@/types/encryption';
import {decryptWithUnscrambling, encryptWithScrambling} from '@/utils/encryption/rsa';
import {
	generateAndStoreKeyPair,
	getOtherUserPublicKey,
	getStoredKeyPair,
	storeOtherUserPublicKey
} from '@/utils/encryption/keyManagement';

export function useEncryption() {
	const [keyPair, setKeyPair] = useState<KeyPair | null>(getStoredKeyPair());

	const generateKeys = useCallback(() => {
		const newKeyPair = generateAndStoreKeyPair();
		setKeyPair(newKeyPair);
		return newKeyPair;
	}, []);

	const encryptForUser = useCallback((message: string, currentUserId: string, targetUserId: string): number[] => {
		const targetPublicKey = getOtherUserPublicKey(currentUserId, targetUserId);
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

	const savePublicKey = useCallback((currentUserId: string, userId: string, publicKey: string) => {
		storeOtherUserPublicKey(currentUserId, userId, publicKey);
	}, []);

	const getPublicKey = useCallback((currentUserId: string, userId: string): string | null => {
		return getOtherUserPublicKey(currentUserId, userId);
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