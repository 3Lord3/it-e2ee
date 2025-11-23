import {useState} from "react"
import {useKeys} from "@/hooks/useKeys"
import {decryptWithUnscrambling} from "@/utils/encryption/rsa"

export function useChatMessages(currentUserId?: string) {
	const {keyPair} = useKeys()
	const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set())

	const toggleExpandMessage = (messageId: string) => {
		const newExpanded = new Set(expandedMessages)
		if (newExpanded.has(messageId)) {
			newExpanded.delete(messageId)
		} else {
			newExpanded.add(messageId)
		}
		setExpandedMessages(newExpanded)
	}

	const getDisplayMessage = (message: any) => {
		if (message.senderId === currentUserId) {
			return message.content
		}

		if (!message.isEncrypted || !message.encryptedContent) {
			return message.content
		}

		try {
			const encryptedData = JSON.parse(message.encryptedContent)
			return decryptWithUnscrambling(encryptedData, keyPair.privateKey)
		} catch (error) {
			return "🔒 Зашифрованное сообщение"
		}
	}

	const getMessageStatus = (message: any) => {
		if (message.senderId === currentUserId) {
			return message.isEncrypted ? "sent_encrypted" : "sent_plain"
		} else {
			if (!message.isEncrypted || !message.encryptedContent) return "plain"
			try {
				const encryptedData = JSON.parse(message.encryptedContent)
				decryptWithUnscrambling(encryptedData, keyPair.privateKey)
				return "decrypted"
			} catch {
				return "encrypted"
			}
		}
	}

	return {
		expandedMessages,
		toggleExpandMessage,
		getDisplayMessage,
		getMessageStatus
	}
}