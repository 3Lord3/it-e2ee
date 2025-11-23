import {Link, useParams} from "react-router"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {SharePublicKeyDialog} from "@/components/KeyManagement"
import {useSelector} from "react-redux"
import type {RootState} from "@/store"
import {useAuth} from "@/hooks/useAuth"
import {useKeys} from "@/hooks/useKeys"

export default function ChatPage() {
	const {chatId} = useParams()
	const {users, messages} = useSelector((state: RootState) => state.chat)
	const {getOtherUsers, logout, currentUser} = useAuth()
	const {keyPair} = useKeys()

	const otherUsers = getOtherUsers()
	const otherUser = otherUsers.find(user => user.id === chatId)
	const chatMessages = messages[`${currentUser?.id}${chatId}`] || []
	const [e, n] = keyPair.publicKey.split(':')

	if (!otherUser) {
		return (
			<div className="flex w-full h-screen">
				<div className="w-80 border-r bg-gray-50/50 flex flex-col">
					{/* Левая панель */}
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
									<div className="flex items-center gap-2">
										<Badge variant={user.isOnline ? "default" : "secondary"}>
											{user.isOnline ? "online" : "offline"}
										</Badge>
									</div>
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
								<div className="text-sm font-medium">Мои ключи</div>
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
									<Badge variant={otherUser.isOnline ? "default" : "secondary"}>
										{otherUser.isOnline ? "online" : "offline"}
									</Badge>
								</div>
							</div>
						</div>
						<SharePublicKeyDialog userId={otherUser.id} username={otherUser.username}/>
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
											Сначала обменяйтесь публичными ключами для безопасного общения
										</p>
									</div>
								</CardContent>
							</Card>
						</div>
					) : (
						<div className="space-y-4 max-w-2xl mx-auto">
							{chatMessages.map(message => (
								<div
									key={message.id}
									className={`flex ${message.senderId === currentUser?.id ? "justify-end" : "justify-start"}`}
								>
									<Card
										className={`max-w-xs ${message.senderId === currentUser?.id ? "bg-primary text-primary-foreground" : ""}`}>
										<CardContent className="p-3">
											<p className="text-sm">{message.content}</p>
										</CardContent>
									</Card>
								</div>
							))}
						</div>
					)}
				</div>

				<div className="border-t p-4 bg-background">
					<form className="flex gap-2 max-w-2xl mx-auto">
						<Input
							type="text"
							placeholder="Введите сообщение..."
							className="flex-1"
						/>
						<Button type="submit">
							Отправить
						</Button>
					</form>
				</div>
			</div>
		</div>
	)
}