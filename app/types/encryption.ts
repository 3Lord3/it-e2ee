export interface KeyPair {
	publicKey: string
	privateKey: string
}

export interface PublicKey {
	e: number
	n: number
}

export interface PrivateKey {
	d: number
	n: number
}