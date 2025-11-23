import type {KeyPair} from "@/types/encryption";

export interface MockUser {
	id: string
	username: string
	password: string
	keyPair?: KeyPair
}

export const mockUsers: MockUser[] = [
	{
		id: "1",
		username: "alice",
		password: "password123"
	},
	{
		id: "2",
		username: "bob",
		password: "password123"
	},
	{
		id: "3",
		username: "charlie",
		password: "password123"
	}
]