import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Alert, AlertDescription} from "@/components/ui/alert"

interface MessageInputProps {
	hasPublicKey: boolean
	onSendMessage: (message: string) => void
}

export function MessageInput({hasPublicKey, onSendMessage}: MessageInputProps) {
	const [messageText, setMessageText] = useState("")

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (messageText.trim()) {
			onSendMessage(messageText)
			setMessageText("")
		}
	}

	return (
		<div className="border-t p-4 bg-background">
			<form onSubmit={handleSubmit} className="flex gap-2 max-w-2xl mx-auto">
				<Input
					type="text"
					placeholder={hasPublicKey ? "Зашифрованное сообщение..." : "Введите публичный ключ собеседника чтобы отправлять сообщения"}
					value={messageText}
					onChange={(e) => setMessageText(e.target.value)}
					className="flex-1"
					disabled={!hasPublicKey}
				/>
				<Button type="submit" disabled={!messageText.trim() || !hasPublicKey}>
					Отправить
				</Button>
			</form>
			<div className="text-xs text-center mt-2">
				{hasPublicKey ? (
					<span className="text-green-600">Сообщения шифруются</span>
				) : (
					<Alert className="bg-yellow-50 border-yellow-200">
						<AlertDescription className="text-yellow-800 text-xs">
							Введите публичный ключ собеседника чтобы разблокировать отправку сообщений
						</AlertDescription>
					</Alert>
				)}
			</div>
		</div>
	)
}