export interface User {
	id: string
	username: string
	publicKey?: string
}

export interface Message {
	id: string
	senderId: string
	receiverId: string
	content: string
	timestamp: Date
	isEncrypted: boolean
}

export interface Chat {
	id: string
	participants: string[]
	publicKeyExchanged: boolean
	lastMessage?: Message
}