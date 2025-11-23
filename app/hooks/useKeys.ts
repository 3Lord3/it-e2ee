import {useCallback, useState} from "react"
import {generateKeyPair} from "@/utils/encryption/rsa"
import type {KeyPair} from "@/types/encryption"

export function useKeys() {
	const getStorageKey = (): string => {
		const currentUser = localStorage.getItem('currentUser')
		if (currentUser) {
			const user = JSON.parse(currentUser)
			return `userKeyPair_${user.id}`
		}
		return 'userKeyPair'
	}

	const [keyPair, setKeyPair] = useState<KeyPair>(() => {
		const storageKey = getStorageKey()
		const stored = localStorage.getItem(storageKey)
		if (stored) {
			return JSON.parse(stored)
		}
		const newKeyPair = generateKeyPair()
		localStorage.setItem(storageKey, JSON.stringify(newKeyPair))
		return newKeyPair
	})

	const generateNewKeyPair = useCallback(() => {
		const storageKey = getStorageKey()
		const newKeyPair = generateKeyPair()
		localStorage.setItem(storageKey, JSON.stringify(newKeyPair))
		setKeyPair(newKeyPair)
		return newKeyPair
	}, [])

	const clearKeyPair = useCallback(() => {
		const storageKey = getStorageKey()
		localStorage.removeItem(storageKey)
		const newKeyPair = generateKeyPair()
		setKeyPair(newKeyPair)
	}, [])

	return {
		keyPair,
		generateNewKeyPair,
		clearKeyPair
	}
}