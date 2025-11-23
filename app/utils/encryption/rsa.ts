import type {KeyPair} from "@/types/encryption"

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

function getRandomPrime(min: number, max: number): number {
	const primes = [61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199];
	const availablePrimes = primes.filter(p => p >= min && p <= max);
	return availablePrimes[Math.floor(Math.random() * availablePrimes.length)];
}

export function generateKeyPair(): KeyPair {
	const p = getRandomPrime(60, 100);
	let q = getRandomPrime(60, 100);

	while (q === p) {
		q = getRandomPrime(60, 100);
	}

	const n = p * q;
	const phi = (p - 1) * (q - 1);

	let e = 17;
	while (e < phi) {
		if (gcd(e, phi) === 1) break;
		e++;
	}

	const d = modInverse(e, phi);

	return {
		publicKey: `${e}:${n}`,
		privateKey: `${d}:${n}`
	};
}

export function encryptWithScrambling(message: string, publicKey: string): number[] {
	const [e, n] = publicKey.split(':').map(Number);

	const randomPrefix = Math.floor(Math.random() * 32) + 65;
	const data = [randomPrefix, ...message.split('').map(c => c.charCodeAt(0))];

	for (let i = 1; i < data.length; i++) {
		data[i] = (data[i] + data[i - 1]) % n;
	}

	const encrypted: number[] = [];
	for (let i = 0; i < data.length; i++) {
		const charCode = data[i];

		if (charCode >= n) {
			throw new Error(`Символ с кодом ${charCode} не может быть зашифрован, так как n=${n}.`);
		}

		const encryptedChar = modPow(charCode, e, n);
		encrypted.push(encryptedChar);
	}

	return encrypted;
}

export function decryptWithUnscrambling(encryptedData: number[], privateKey: string): string {
	const [d, n] = privateKey.split(':').map(Number);

	const decryptedData: number[] = [];
	for (const encryptedChar of encryptedData) {
		const decryptedCharCode = modPow(encryptedChar, d, n);
		decryptedData.push(decryptedCharCode);
	}

	for (let i = decryptedData.length - 1; i > 0; i--) {
		decryptedData[i] = (decryptedData[i] - decryptedData[i - 1] + n) % n;
	}

	return String.fromCharCode(...decryptedData.slice(1));
}