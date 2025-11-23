import type {KeyPair} from '@/types/encryption';
import {generateKeyPair} from '@/utils/encryption/rsa';

const STORAGE_KEYS = {
	KEY_PAIR: 'user_key_pair',
	PUBLIC_KEYS: 'public_keys_'
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

export function storeOtherUserPublicKey(currentUserId: string, otherUserId: string, publicKey: string): void {
	const storageKey = STORAGE_KEYS.PUBLIC_KEYS + currentUserId;
	const stored = localStorage.getItem(storageKey);
	const publicKeys = stored ? JSON.parse(stored) : {};
	publicKeys[otherUserId] = publicKey;
	localStorage.setItem(storageKey, JSON.stringify(publicKeys));
}

export function getOtherUserPublicKey(currentUserId: string, otherUserId: string): string | null {
	const storageKey = STORAGE_KEYS.PUBLIC_KEYS + currentUserId;
	const stored = localStorage.getItem(storageKey);
	const publicKeys = stored ? JSON.parse(stored) : {};
	return publicKeys[otherUserId] || null;
}

export function getAllPublicKeys(currentUserId: string): Record<string, string> {
	const storageKey = STORAGE_KEYS.PUBLIC_KEYS + currentUserId;
	const stored = localStorage.getItem(storageKey);
	return stored ? JSON.parse(stored) : {};
}