import {ChatHeader} from "./ChatHeader"
import {MessageList} from "./MessageList"
import {MessageInput} from "./MessageInput"

interface ChatContainerProps {
	otherUser: any
	messages: any[]
	currentUserId?: string
	hasPublicKey: boolean
	onSavePublicKey: (userId: string, publicKey: string) => void
	onSendMessage: (message: string) => void
	expandedMessages: Set<string>
	onToggleExpand: (messageId: string) => void
	getDisplayMessage: (message: any) => string
	getMessageStatus: (message: any) => string
}

export function ChatContainer({
																otherUser,
																messages,
																currentUserId,
																hasPublicKey,
																onSavePublicKey,
																onSendMessage,
																expandedMessages,
																onToggleExpand,
																getDisplayMessage,
																getMessageStatus
															}: ChatContainerProps) {
	const handleSavePublicKey = (publicKey: string) => {
		onSavePublicKey(otherUser.id, publicKey)
	}

	return (
		<div className="flex-1 flex flex-col">
			<ChatHeader
				username={otherUser.username}
				userId={otherUser.id}
				hasPublicKey={hasPublicKey}
				onKeySave={handleSavePublicKey}
			/>

			<div className="flex-1 p-4 overflow-y-auto bg-gray-50">
				<MessageList
					messages={messages}
					currentUserId={currentUserId}
					otherUsername={otherUser.username}
					expandedMessages={expandedMessages}
					onToggleExpand={onToggleExpand}
					getDisplayMessage={getDisplayMessage}
					getMessageStatus={getMessageStatus}
					hasPublicKey={hasPublicKey}
				/>
			</div>

			<MessageInput
				hasPublicKey={hasPublicKey}
				onSendMessage={onSendMessage}
			/>
		</div>
	)
}