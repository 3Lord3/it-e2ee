import {useCallback, useState} from "react"
import {generateKeyPair} from "@/utils/encryption/rsa"
import type {KeyPair} from "@/mocks/users"

export function useKeys() {
	const [keyPair, setKeyPair] = useState<KeyPair>(() => {
		const stored = localStorage.getItem("userKeyPair")
		if (stored) {
			return JSON.parse(stored)
		}
		const newKeyPair = generateKeyPair()
		localStorage.setItem("userKeyPair", JSON.stringify(newKeyPair))
		return newKeyPair
	})

	const generateNewKeyPair = useCallback(() => {
		const newKeyPair = generateKeyPair()
		localStorage.setItem("userKeyPair", JSON.stringify(newKeyPair))
		setKeyPair(newKeyPair)
		return newKeyPair
	}, [])

	const clearKeyPair = useCallback(() => {
		localStorage.removeItem("userKeyPair")
		const newKeyPair = generateKeyPair()
		setKeyPair(newKeyPair)
	}, [])

	return {
		keyPair,
		generateNewKeyPair,
		clearKeyPair
	}
}