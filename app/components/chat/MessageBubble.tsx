import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"

interface MessageBubbleProps {
	message: any
	isMyMessage: boolean
	otherUsername: string
	messageStatus: string
	displayText: string
	isExpanded: boolean
	onToggleExpand: () => void
}

export function MessageBubble({
																message,
																isMyMessage,
																otherUsername,
																messageStatus,
																displayText,
																isExpanded,
																onToggleExpand
															}: MessageBubbleProps) {
	return (
		<div className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}>
			<Card className={`max-w-xs ${
				isMyMessage
					? "bg-primary text-primary-foreground"
					: messageStatus === "encrypted"
						? "border-yellow-400 border-2 bg-yellow-50"
						: ""
			}`}>
				<CardContent className="p-3">
					<div className="flex items-center gap-2 mb-1">
            <span className="text-xs opacity-70">
              {isMyMessage ? "Вы" : otherUsername}
            </span>
						{messageStatus === "sent_encrypted" && (
							<Badge variant="secondary" className="text-xs bg-primary-foreground text-primary">
								Зашифровано
							</Badge>
						)}
						{messageStatus === "sent_plain" && (
							<Badge variant="secondary" className="text-xs bg-primary-foreground text-primary">
								Отправлено
							</Badge>
						)}
						{messageStatus === "encrypted" && (
							<Badge variant="outline" className="text-xs">
								Зашифровано
							</Badge>
						)}
						{messageStatus === "decrypted" && (
							<Badge variant="secondary" className="text-xs">
								Расшифровано
							</Badge>
						)}
					</div>
					<p className="text-sm">{displayText}</p>

					{messageStatus === "encrypted" && (
						<div>
							<p className="text-xs mt-1 text-yellow-700">
								Введите публичный ключ пользователя для расшифровки
							</p>
							<Button
								variant="outline"
								size="sm"
								className="w-full text-xs mt-2"
								onClick={onToggleExpand}
							>
								{isExpanded ? "Скрыть" : "Показать зашифрованные данные"}
							</Button>
							{isExpanded && (
								<div className="mt-2 p-2 bg-black text-green-400 rounded text-xs font-mono break-all">
									{message.encryptedContent}
								</div>
							)}
						</div>
					)}
					<p className={`text-xs mt-1 ${
						isMyMessage ? "text-primary-foreground/70" : "text-gray-500"
					}`}>
						{new Date(message.timestamp).toLocaleTimeString()}
					</p>
				</CardContent>
			</Card>
		</div>
	)
}