import {useState} from "react"
import {getAllPublicKeys, storeOtherUserPublicKey} from "@/utils/encryption/keyManagement"

export function usePublicKeys() {
	const [otherUserPublicKeys, setOtherUserPublicKeys] = useState<Record<string, string>>(getAllPublicKeys)

	const savePublicKey = (userId: string, publicKey: string) => {
		storeOtherUserPublicKey(userId, publicKey)
		setOtherUserPublicKeys(getAllPublicKeys())
	}

	const hasPublicKey = (userId: string) => {
		return !!otherUserPublicKeys[userId]
	}

	return {
		otherUserPublicKeys,
		savePublicKey,
		hasPublicKey
	}
}