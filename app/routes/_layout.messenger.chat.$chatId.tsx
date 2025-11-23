import {Link, useParams} from "react-router"
import {useEffect, useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {PublicKeyInput} from "@/components/PublicKeyInput"
import {useDispatch, useSelector} from "react-redux"
import type {RootState} from "@/store"
import {addMessage, loadUserMessages} from "@/features/chat/chatSlice"
import {useAuth} from "@/hooks/useAuth"
import {useKeys} from "@/hooks/useKeys"
import {decryptWithUnscrambling, encryptWithScrambling} from "@/utils/encryption/rsa"

export default function ChatPage() {
	const {chatId} = useParams()
	const dispatch = useDispatch()
	const {messages} = useSelector((state: RootState) => state.chat)
	const {getOtherUsers, logout, currentUser} = useAuth()
	const {keyPair} = useKeys()
	const [messageText, setMessageText] = useState("")
	const [otherUserPublicKeys, setOtherUserPublicKeys] = useState<Record<string, string>>(() => {
		const stored = localStorage.getItem("otherUserPublicKeys")
		return stored ? JSON.parse(stored) : {}
	})

	const otherUsers = getOtherUsers()
	const otherUser = otherUsers.find(user => user.id === chatId)

	const participants = currentUser && chatId ? [currentUser.id, chatId].sort() : []
	const chatKey = participants.join('-')
	const chatMessages = messages[chatKey] || []

	const [e, n] = keyPair.publicKey.split(':')

	useEffect(() => {
		dispatch(loadUserMessages())
	}, [dispatch])

	const handleSavePublicKey = (publicKey: string) => {
		const updatedKeys = {...otherUserPublicKeys, [chatId!]: publicKey}
		setOtherUserPublicKeys(updatedKeys)
		localStorage.setItem("otherUserPublicKeys", JSON.stringify(updatedKeys))
	}

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault()
		if (!messageText.trim() || !chatId || !currentUser) return

		const otherUserPublicKey = otherUserPublicKeys[chatId]
		let content = messageText
		let isEncrypted = false

		if (otherUserPublicKey) {
			try {
				const encryptedData = encryptWithScrambling(messageText, otherUserPublicKey)
				content = JSON.stringify(encryptedData)
				isEncrypted = true
			} catch (error) {
				console.error("Ошибка шифрования:", error)
			}
		}

		const message = {
			id: `${Date.now()}-${currentUser.id}-${chatId}`,
			senderId: currentUser.id,
			receiverId: chatId,
			content,
			timestamp: new Date().toISOString(),
			isEncrypted
		}

		dispatch(addMessage(message))
		setMessageText("")
	}

	const getDisplayMessage = (message: any) => {
		if (message.senderId === currentUser?.id) {
			if (!message.isEncrypted) {
				return message.content
			}
			try {
				const encryptedData = JSON.parse(message.content)
				const decrypted = decryptWithUnscrambling(encryptedData, keyPair.privateKey)
				return decrypted
			} catch (error) {
				return "🔒 Мое зашифрованное сообщение"
			}
		}

		const senderPublicKey = otherUserPublicKeys[message.senderId]
		if (!senderPublicKey) {
			return "🔒 Зашифрованное сообщение"
		}

		if (!message.isEncrypted) {
			return message.content
		}

		try {
			const encryptedData = JSON.parse(message.content)
			const decrypted = decryptWithUnscrambling(encryptedData, keyPair.privateKey)
			return decrypted
		} catch (error) {
			return "🔒 Не удалось расшифровать сообщение"
		}
	}

	const getMessageStatus = (message: any) => {
		if (message.senderId === currentUser?.id) {
			return message.isEncrypted ? "sent_encrypted" : "sent_plain"
		} else {
			const senderPublicKey = otherUserPublicKeys[message.senderId]
			if (!senderPublicKey) return "encrypted"
			if (!message.isEncrypted) return "plain"
			return "decrypted"
		}
	}

	if (!otherUser) {
		return (
			<div className="flex w-full h-screen">
				<div className="w-80 border-r bg-gray-50/50 flex flex-col">
					<div className="p-4 border-b">
						<h1 className="text-xl font-semibold">Чаты</h1>
					</div>
					<div className="flex-1 overflow-y-auto">
						{otherUsers.map(user => (
							<Link
								key={user.id}
								to={`/messenger/chat/${user.id}`}
								className="block border-b hover:bg-white transition-colors"
							>
								<div className="p-4">
									<div className="flex items-center justify-between mb-2">
										<span className="font-medium">{user.username}</span>
									</div>
									<div className="text-sm text-gray-600">
										Нажмите для открытия
									</div>
								</div>
							</Link>
						))}
					</div>
					<div className="border-t p-4 space-y-4">
						<Card>
							<CardContent className="pt-4">
								<div className="space-y-2">
									<div className="text-sm font-medium">Текущий пользователь</div>
									<div className="text-sm text-gray-900 font-semibold">{currentUser?.username}</div>
									<div className="text-sm font-medium mt-4">Мои ключи</div>
									<div className="text-xs text-gray-500 font-mono">
										e: {e}, n: {n}
									</div>
									<Button variant="outline" size="sm" className="w-full" asChild>
										<Link to="/messenger/keys">Управление ключами</Link>
									</Button>
								</div>
							</CardContent>
						</Card>
						<Button variant="destructive" onClick={logout} className="w-full">
							Выход
						</Button>
					</div>
				</div>
				<div className="flex-1 flex items-center justify-center">
					<Card>
						<CardContent className="pt-6">
							<div className="text-center space-y-4">
								<h2 className="text-xl font-semibold">Пользователь не найден</h2>
								<Button asChild>
									<Link to="/messenger">Вернуться к чатам</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		)
	}

	const hasPublicKey = !!otherUserPublicKeys[chatId!]

	return (
		<div className="flex w-full h-screen">
			<div className="w-80 border-r bg-gray-50/50 flex flex-col">
				<div className="p-4 border-b">
					<h1 className="text-xl font-semibold">Чаты</h1>
				</div>

				<div className="flex-1 overflow-y-auto">
					{otherUsers.map(user => (
						<Link
							key={user.id}
							to={`/messenger/chat/${user.id}`}
							className={`block border-b hover:bg-white transition-colors ${user.id === chatId ? 'bg-white' : ''}`}
						>
							<div className="p-4">
								<div className="flex items-center justify-between mb-2">
									<span className="font-medium">{user.username}</span>
								</div>
								<div className="text-sm text-gray-600">
									{user.id === chatId ? "Активный чат" : "Нажмите для открытия"}
								</div>
							</div>
						</Link>
					))}
				</div>

				<div className="border-t p-4 space-y-4">
					<Card>
						<CardContent className="pt-4">
							<div className="space-y-2">
								<div className="text-sm font-medium">Текущий пользователь</div>
								<div className="text-sm text-gray-900 font-semibold">{currentUser?.username}</div>
								<div className="text-sm font-medium mt-4">Мои ключи</div>
								<div className="text-xs text-gray-500 font-mono">
									e: {e}, n: {n}
								</div>
								<Button variant="outline" size="sm" className="w-full" asChild>
									<Link to="/messenger/keys">Управление ключами</Link>
								</Button>
							</div>
						</CardContent>
					</Card>

					<Button variant="destructive" onClick={logout} className="w-full">
						Выход
					</Button>
				</div>
			</div>

			<div className="flex-1 flex flex-col">
				<div className="border-b p-4 bg-background">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div>
								<h2 className="font-semibold">{otherUser.username}</h2>
								<div className="flex items-center gap-2 mt-1">
									{hasPublicKey ? (
										<Badge variant="default">Ключ сохранен</Badge>
									) : (
										<Badge variant="destructive">Нет ключа</Badge>
									)}
								</div>
							</div>
						</div>
						<PublicKeyInput
							userId={otherUser.id}
							username={otherUser.username}
							onKeySave={handleSavePublicKey}
						/>
					</div>
				</div>

				<div className="flex-1 p-4 overflow-y-auto bg-gray-50">
					{chatMessages.length === 0 ? (
						<div className="h-full flex items-center justify-center">
							<Card>
								<CardContent className="pt-6">
									<div className="text-center space-y-2">
										<p className="text-gray-600">Начните общение</p>
										<p className="text-sm text-gray-500">
											{hasPublicKey
												? "Сообщения будут зашифрованы"
												: "Введите публичный ключ для безопасного общения"}
										</p>
									</div>
								</CardContent>
							</Card>
						</div>
					) : (
						<div className="space-y-4 max-w-2xl mx-auto">
							{chatMessages.map(message => {
								const isMyMessage = message.senderId === currentUser?.id
								const messageStatus = getMessageStatus(message)
								const displayText = getDisplayMessage(message)

								return (
									<div
										key={message.id}
										className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
									>
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
                            {isMyMessage ? "Вы" : otherUser.username}
                          </span>
													{messageStatus === "sent_encrypted" && (
														<Badge variant="outline" className="text-xs">
															Зашифровано
														</Badge>
													)}
													{messageStatus === "sent_plain" && (
														<Badge variant="outline" className="text-xs">
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
													<p className="text-xs mt-1 text-yellow-700">
														Введите публичный ключ пользователя для расшифровки
													</p>
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
							})}
						</div>
					)}
				</div>

				<div className="border-t p-4 bg-background">
					<form onSubmit={handleSendMessage} className="flex gap-2 max-w-2xl mx-auto">
						<Input
							type="text"
							placeholder={hasPublicKey ? "Зашифрованное сообщение..." : "Открытое сообщение..."}
							value={messageText}
							onChange={(e) => setMessageText(e.target.value)}
							className="flex-1"
						/>
						<Button type="submit" disabled={!messageText.trim()}>
							Отправить
						</Button>
					</form>
					<div className="text-xs text-center mt-2">
						{hasPublicKey ? (
							<span className="text-green-600">Сообщения шифруются</span>
						) : (
							<Alert className="bg-yellow-50 border-yellow-200">
								<AlertDescription className="text-yellow-800 text-xs">
									Собеседник не сможет расшифровать ваши сообщения. Введите его публичный ключ для безопасного общения.
								</AlertDescription>
							</Alert>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}