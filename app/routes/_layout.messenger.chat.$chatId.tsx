import {useParams} from "react-router"
import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import type {RootState} from "@/store"
import {addMessage, loadUserMessages} from "@/features/chat/chatSlice"
import {useAuth} from "@/hooks/useAuth"
import {encryptWithScrambling} from "@/utils/encryption/rsa"
import {ChatSidebar} from "@/components/chat/ChatSidebar"
import {ChatContainer} from "@/components/chat/ChatContainer"
import {useChatMessages} from "@/hooks/useChatMessages"
import {usePublicKeys} from "@/hooks/usePublicKeys"

export default function ChatPage() {
	const {chatId} = useParams()
	const dispatch = useDispatch()
	const {messages} = useSelector((state: RootState) => state.chat)
	const {getOtherUsers, logout, currentUser} = useAuth()

	const {
		expandedMessages,
		toggleExpandMessage,
		getDisplayMessage,
		getMessageStatus
	} = useChatMessages(currentUser?.id)

	const {
		otherUserPublicKeys,
		savePublicKey,
		hasPublicKey
	} = usePublicKeys()

	const otherUsers = getOtherUsers()
	const otherUser = otherUsers.find(user => user.id === chatId)

	const participants = currentUser && chatId ? [currentUser.id, chatId].sort() : []
	const chatKey = participants.join('-')
	const chatMessages = messages[chatKey] || []

	useEffect(() => {
		dispatch(loadUserMessages())
	}, [dispatch])

	const handleSendMessage = (messageText: string) => {
		if (!messageText.trim() || !chatId || !currentUser) return

		let isEncrypted = false
		let encryptedContent = null

		if (hasPublicKey(chatId!)) {
			try {
				const otherUserPublicKey = otherUserPublicKeys[chatId!]
				const encryptedData = encryptWithScrambling(messageText, otherUserPublicKey)
				encryptedContent = JSON.stringify(encryptedData)
				isEncrypted = true
			} catch (error) {
				console.error("Ошибка шифрования:", error)
			}
		}

		const message = {
			id: `${Date.now()}-${currentUser.id}-${chatId}`,
			senderId: currentUser.id,
			receiverId: chatId,
			content: messageText,
			encryptedContent: encryptedContent,
			timestamp: new Date().toISOString(),
			isEncrypted
		}

		dispatch(addMessage(message))
	}

	if (!otherUser) {
		return (
			<div className="flex w-full h-screen">
				<ChatSidebar activeChatId={chatId} onLogout={logout}/>
				<div className="flex-1 flex items-center justify-center">
					<div className="text-center space-y-4">
						<h2 className="text-xl font-semibold">Пользователь не найден</h2>
						<p className="text-gray-600">Вернитесь к списку чатов</p>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="flex w-full h-screen">
			<ChatSidebar activeChatId={chatId} onLogout={logout}/>

			<ChatContainer
				otherUser={otherUser}
				messages={chatMessages}
				currentUserId={currentUser?.id}
				hasPublicKey={hasPublicKey(chatId!)}
				onSavePublicKey={savePublicKey}
				onSendMessage={handleSendMessage}
				expandedMessages={expandedMessages}
				onToggleExpand={toggleExpandMessage}
				getDisplayMessage={getDisplayMessage}
				getMessageStatus={getMessageStatus}
			/>
		</div>
	)
}