import type { KeyPair, PublicKey, PrivateKey } from '@/types/encryption';

function gcd(a: number, b: number): number {
	while (b !== 0) {
		const temp = b;
		b = a % b;
		a = temp;
	}
	return a;
}

function modInverse(a: number, m: number): number {
	let m0 = m;
	let y = 0;
	let x = 1;

	if (m === 1) return 0;

	while (a > 1) {
		const q = Math.floor(a / m);
		let t = m;

		m = a % m;
		a = t;
		t = y;

		y = x - q * y;
		x = t;
	}

	if (x < 0) x += m0;

	return x;
}

function modPow(base: number, exponent: number, modulus: number): number {
	if (modulus === 1) return 0;

	let result = 1;
	base = base % modulus;

	while (exponent > 0) {
		if (exponent % 2 === 1) {
			result = (result * base) % modulus;
		}
		exponent = Math.floor(exponent / 2);
		base = (base * base) % modulus;
	}

	return result;
}

export function generateKeyPair(p: number = 17, q: number = 19): KeyPair {
	const n = p * q;
	const phi = (p - 1) * (q - 1);

	let e = 5;
	while (e < phi) {
		if (gcd(e, phi) === 1) break;
		e++;
	}

	const d = modInverse(e, phi);

	const publicKey: PublicKey = { e, n };
	const privateKey: PrivateKey = { d, n };

	return {
		publicKey: JSON.stringify(publicKey),
		privateKey: JSON.stringify(privateKey)
	};
}

export function encryptMessage(message: string, publicKeyStr: string): number[] {
	const publicKey: PublicKey = JSON.parse(publicKeyStr);
	const { e, n } = publicKey;

	const encrypted: number[] = [];

	for (let i = 0; i < message.length; i++) {
		const charCode = message.charCodeAt(i);

		if (charCode >= n) {
			throw new Error(`Символ '${message[i]}' (код ${charCode}) не может быть зашифрован, так как n=${n}. Используйте большие простые числа.`);
		}

		const encryptedChar = modPow(charCode, e, n);
		encrypted.push(encryptedChar);
	}

	return encrypted;
}

export function decryptMessage(encryptedData: number[], privateKeyStr: string): string {
	const privateKey: PrivateKey = JSON.parse(privateKeyStr);
	const { d, n } = privateKey;

	let decrypted = '';

	for (const encryptedChar of encryptedData) {
		const decryptedCharCode = modPow(encryptedChar, d, n);
		decrypted += String.fromCharCode(decryptedCharCode);
	}

	return decrypted;
}

export function encryptWithScrambling(message: string, publicKeyStr: string): number[] {
	const publicKey: PublicKey = JSON.parse(publicKeyStr);
	const { n } = publicKey;

	const randomPrefix = Math.floor(Math.random() * 32) + 65;
	const data = [randomPrefix, ...message.split('').map(c => c.charCodeAt(0))];

	for (let i = 1; i < data.length; i++) {
		data[i] = (data[i] + data[i - 1]) % n;
	}

	return encryptMessage(String.fromCharCode(...data), publicKeyStr);
}

export function decryptWithUnscrambling(encryptedData: number[], privateKeyStr: string): string {
	const privateKey: PrivateKey = JSON.parse(privateKeyStr);
	const { n } = privateKey;

	const decryptedStr = decryptMessage(encryptedData, privateKeyStr);
	const data = decryptedStr.split('').map(c => c.charCodeAt(0));

	for (let i = data.length - 1; i > 0; i--) {
		data[i] = (data[i] - data[i - 1] + n) % n;
	}

	return String.fromCharCode(...data.slice(1));
}