import {Link} from "react-router"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {useAuth} from "@/hooks/useAuth"
import {useSelector} from "react-redux"
import type {RootState} from "@/store"

export default function MessengerIndex() {
	const {getOtherUsers} = useAuth()
	const {chats} = useSelector((state: RootState) => state.chat)

	const otherUsers = getOtherUsers()

	return (
		<div className="flex w-full">
			<div className="w-80 border-r bg-gray-50/50">
				<div className="p-4 border-b">
					<h1 className="text-xl font-semibold">Чаты</h1>
				</div>
				<div className="overflow-y-auto">
					{otherUsers.map(user => (
						<Link
							key={user.id}
							to={`/messenger/chat/${user.id}`}
							className="block border-b hover:bg-white transition-colors"
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
									{chats.find(chat => chat.participants.includes(user.id))?.publicKeyExchanged
										? "Ключи обменены"
										: "Требуется обмен ключами"}
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>

			<div className="flex-1 flex items-center justify-center bg-background">
				<Card className="w-80">
					<CardHeader>
						<CardTitle>Добро пожаловать</CardTitle>
						<CardDescription>
							Выберите чат для начала общения
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-gray-600">
							Начните безопасное общение с обменом ключами шифрования
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}