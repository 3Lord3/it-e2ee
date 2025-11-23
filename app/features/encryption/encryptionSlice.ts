import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type KeyPair } from '@/types/encryption'

interface EncryptionState {
	keyPair: KeyPair | null
	otherUsersPublicKeys: Record<string, string>
	isInitialized: boolean
}

const initialState: EncryptionState = {
	keyPair: null,
	otherUsersPublicKeys: {},
	isInitialized: false
}

const encryptionSlice = createSlice({
	name: 'encryption',
	initialState,
	reducers: {
		setKeyPair: (state, action: PayloadAction<KeyPair>) => {
			state.keyPair = action.payload
			state.isInitialized = true
		},
		addPublicKey: (state, action: PayloadAction<{ userId: string; publicKey: string }>) => {
			state.otherUsersPublicKeys[action.payload.userId] = action.payload.publicKey
		},
		removePublicKey: (state, action: PayloadAction<string>) => {
			delete state.otherUsersPublicKeys[action.payload]
		},
		clearEncryptionData: (state) => {
			state.keyPair = null
			state.otherUsersPublicKeys = {}
			state.isInitialized = false
		}
	}
})

export const { setKeyPair, addPublicKey, removePublicKey, clearEncryptionData } = encryptionSlice.actions
export default encryptionSlice.reducer