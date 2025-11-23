import {configureStore} from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'
import chatReducer from '@/features/chat/chatSlice'
import encryptionReducer from '@/features/encryption/encryptionSlice'

export const store = configureStore({
	reducer: {
		auth: authReducer,
		chat: chatReducer,
		encryption: encryptionReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['chat/addMessage'],
				ignoredPaths: ['chat.messages'],
			},
		}),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch