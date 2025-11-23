import {Link, useParams} from "react-router"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {useSelector} from "react-redux"
import type {RootState} from "@/store"
import {useAuth} from "@/hooks/useAuth"

export default function ChatPage() {
	const {chatId} = useParams()
	const {users, messages} = useSelector((state: RootState) => state.chat)
	const {getOtherUsers} = useAuth()

	const otherUsers = getOtherUsers()
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
	const otherUser = otherUsers.find(user => user.id === chatId)
	const chatMessages = messages[`${currentUser.id}${chatId}`] || []

	if (!otherUser) {
		return (
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
		)
	}

	return (
		<div className="flex w-full">
			<div className="w-80 border-r bg-gray-50/50">
				<div className="p-4 border-b">
					<Button variant="ghost" asChild className="pl-0">
						<Link to="/messenger">← Назад к чатам</Link>
					</Button>
				</div>
				<div className="p-4">
					<Card>
						<CardContent className="pt-6">
							<div className="space-y-4">
								<div>
									<h2 className="font-semibold">{otherUser.username}</h2>
									<div className="flex items-center gap-2 mt-1">
										<Badge variant={otherUser.isOnline ? "default" : "secondary"}>
											{otherUser.isOnline ? "online" : "offline"}
										</Badge>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			<div className="flex-1 flex flex-col">
				<div className="flex-1 p-4 overflow-y-auto">
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
									className={`flex ${message.senderId === currentUser.id ? "justify-end" : "justify-start"}`}
								>
									<Card
										className={`max-w-xs ${message.senderId === currentUser.id ? "bg-primary text-primary-foreground" : ""}`}>
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