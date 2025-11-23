import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type {Chat, Message, User} from '@/types/chat'

interface ChatState {
	users: User[]
	chats: Chat[]
	activeChat: string | null
	messages: Record<string, Message[]>
}

const saveMessageForUser = (userId: string, message: Message) => {
	const storageKey = `chatMessages_${userId}`
	try {
		const stored = localStorage.getItem(storageKey)
		const existingMessages: Record<string, Message[]> = stored ? JSON.parse(stored) : {}

		const participants = [message.senderId, message.receiverId].sort()
		const chatId = participants.join('-')

		if (!existingMessages[chatId]) {
			existingMessages[chatId] = []
		}

		const messageExists = existingMessages[chatId].some(msg => msg.id === message.id)
		if (!messageExists) {
			existingMessages[chatId].push(message)
			existingMessages[chatId].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
		}

		localStorage.setItem(storageKey, JSON.stringify(existingMessages))
	} catch (error) {
		console.error(`Failed to save message for user ${userId}:`, error)
	}
}

const saveMessageForBothUsers = (message: Message) => {
	saveMessageForUser(message.senderId, message)
	saveMessageForUser(message.receiverId, message)
}

const loadMessagesForCurrentUser = (): Record<string, Message[]> => {
	try {
		const currentUser = localStorage.getItem('currentUser')
		if (!currentUser) return {}

		const user = JSON.parse(currentUser)
		const storageKey = `chatMessages_${user.id}`
		const stored = localStorage.getItem(storageKey)

		if (stored) {
			const parsed: Record<string, Message[]> = JSON.parse(stored)
			return parsed
		}
		return {}
	} catch {
		return {}
	}
}

const initialState: ChatState = {
	users: [],
	chats: [],
	activeChat: null,
	messages: loadMessagesForCurrentUser()
}

const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		setUsers: (state, action: PayloadAction<User[]>) => {
			state.users = action.payload
		},
		setChats: (state, action: PayloadAction<Chat[]>) => {
			state.chats = action.payload
		},
		setActiveChat: (state, action: PayloadAction<string>) => {
			state.activeChat = action.payload
		},
		addMessage: (state, action: PayloadAction<Message>) => {
			const message = action.payload
			const participants = [message.senderId, message.receiverId].sort()
			const chatId = participants.join('-')

			if (!state.messages[chatId]) {
				state.messages[chatId] = []
			}

			const messageExists = state.messages[chatId].some(msg => msg.id === message.id)
			if (!messageExists) {
				state.messages[chatId].push(message)
				state.messages[chatId].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
			}

			saveMessageForBothUsers(message)
		},
		markKeyExchanged: (state, action: PayloadAction<string>) => {
			const chat = state.chats.find(c => c.id === action.payload)
			if (chat) {
				chat.publicKeyExchanged = true
			}
		},
		loadUserMessages: (state) => {
			state.messages = loadMessagesForCurrentUser()
		}
	}
})

export const {setUsers, setChats, setActiveChat, addMessage, markKeyExchanged, loadUserMessages} = chatSlice.actions
export default chatSlice.reducer