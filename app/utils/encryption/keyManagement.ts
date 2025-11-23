import type { KeyPair } from '@/types/encryption';
import { generateKeyPair } from '@/utils/encryption/rsa';

const STORAGE_KEYS = {
	KEY_PAIR: 'user_key_pair',
	PUBLIC_KEYS: 'other_users_public_keys'
};

export function generateAndStoreKeyPair(): KeyPair {
	const keyPair = generateKeyPair();
	localStorage.setItem(STORAGE_KEYS.KEY_PAIR, JSON.stringify(keyPair));
	return keyPair;
}

export function getStoredKeyPair(): KeyPair | null {
	const stored = localStorage.getItem(STORAGE_KEYS.KEY_PAIR);
	return stored ? JSON.parse(stored) : null;
}

export function storeOtherUserPublicKey(userId: string, publicKey: string): void {
	const stored = localStorage.getItem(STORAGE_KEYS.PUBLIC_KEYS);
	const publicKeys = stored ? JSON.parse(stored) : {};
	publicKeys[userId] = publicKey;
	localStorage.setItem(STORAGE_KEYS.PUBLIC_KEYS, JSON.stringify(publicKeys));
}

export function getOtherUserPublicKey(userId: string): string | null {
	const stored = localStorage.getItem(STORAGE_KEYS.PUBLIC_KEYS);
	const publicKeys = stored ? JSON.parse(stored) : {};
	return publicKeys[userId] || null;
}

export function getAllPublicKeys(): Record<string, string> {
	const stored = localStorage.getItem(STORAGE_KEYS.PUBLIC_KEYS);
	return stored ? JSON.parse(stored) : {};
}