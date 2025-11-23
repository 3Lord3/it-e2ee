import {useState} from "react"
import {getAllPublicKeys, storeOtherUserPublicKey} from "@/utils/encryption/keyManagement"
import {useAuth} from "@/hooks/useAuth"

export function usePublicKeys() {
	const {currentUser} = useAuth()
	const currentUserId = currentUser?.id || ''

	const [otherUserPublicKeys, setOtherUserPublicKeys] = useState<Record<string, string>>(
		() => getAllPublicKeys(currentUserId)
	)

	const savePublicKey = (userId: string, publicKey: string) => {
		storeOtherUserPublicKey(currentUserId, userId, publicKey)
		setOtherUserPublicKeys(getAllPublicKeys(currentUserId))
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