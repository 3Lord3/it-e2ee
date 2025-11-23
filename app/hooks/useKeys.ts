import {useCallback, useState} from "react"
import {generateKeyPair} from "@/utils/encryption/rsa"
import type {KeyPair} from "@/mocks/users"

export function useKeys() {
	const [keyPair, setKeyPair] = useState<KeyPair | null>(() => {
		const stored = localStorage.getItem("userKeyPair")
		return stored ? JSON.parse(stored) : null
	})

	const generateNewKeyPair = useCallback(() => {
		const newKeyPair = generateKeyPair()
		localStorage.setItem("userKeyPair", JSON.stringify(newKeyPair))
		setKeyPair(newKeyPair)
		return newKeyPair
	}, [])

	const clearKeyPair = useCallback(() => {
		localStorage.removeItem("userKeyPair")
		setKeyPair(null)
	}, [])

	return {
		keyPair,
		generateNewKeyPair,
		clearKeyPair,
		hasKeys: !!keyPair
	}
}