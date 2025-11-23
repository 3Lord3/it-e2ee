export interface KeyPair {
	publicKey: string
	privateKey: string
}

export interface MockUser {
	id: string
	username: string
	password: string
	keyPair?: KeyPair
	isOnline: boolean
}

export const mockUsers: MockUser[] = [
	{
		id: "1",
		username: "alice",
		password: "password123",
		isOnline: true
	},
	{
		id: "2",
		username: "bob",
		password: "password123",
		isOnline: false
	},
	{
		id: "3",
		username: "charlie",
		password: "password123",
		isOnline: true
	}
]