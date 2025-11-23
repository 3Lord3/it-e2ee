import {MessageBubble} from "./MessageBubble"
import {EmptyChat} from "./EmptyChat"

interface MessageListProps {
	messages: any[]
	currentUserId?: string
	otherUsername: string
	expandedMessages: Set<string>
	onToggleExpand: (messageId: string) => void
	getDisplayMessage: (message: any) => string
	getMessageStatus: (message: any) => string
	hasPublicKey: boolean
}

export function MessageList({
															messages,
															currentUserId,
															otherUsername,
															expandedMessages,
															onToggleExpand,
															getDisplayMessage,
															getMessageStatus,
															hasPublicKey
														}: MessageListProps) {
	if (messages.length === 0) {
		return <EmptyChat hasPublicKey={hasPublicKey}/>
	}

	return (
		<div className="space-y-4 max-w-2xl mx-auto">
			{messages.map(message => {
				const isMyMessage = message.senderId === currentUserId
				const messageStatus = getMessageStatus(message)
				const displayText = getDisplayMessage(message)
				const isExpanded = expandedMessages.has(message.id)

				return (
					<MessageBubble
						key={message.id}
						message={message}
						isMyMessage={isMyMessage}
						otherUsername={otherUsername}
						messageStatus={messageStatus}
						displayText={displayText}
						isExpanded={isExpanded}
						onToggleExpand={() => onToggleExpand(message.id)}
					/>
				)
			})}
		</div>
	)
}