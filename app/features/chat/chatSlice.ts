import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User, Message, Chat } from '@/types/chat'

interface ChatState {
	users: User[]
	chats: Chat[]
	activeChat: string | null
	messages: Record<string, Message[]>
}

const initialState: ChatState = {
	users: [],
	chats: [],
	activeChat: null,
	messages: {}
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
			const chatId = action.payload.senderId + action.payload.receiverId
			if (!state.messages[chatId]) {
				state.messages[chatId] = []
			}
			state.messages[chatId].push(action.payload)
		},
		markKeyExchanged: (state, action: PayloadAction<string>) => {
			const chat = state.chats.find(c => c.id === action.payload)
			if (chat) {
				chat.publicKeyExchanged = true
			}
		}
	}
})

export const { setUsers, setChats, setActiveChat, addMessage, markKeyExchanged } = chatSlice.actions
export default chatSlice.reducer