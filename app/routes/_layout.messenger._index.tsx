import {Link} from "react-router"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {useAuth} from "@/hooks/useAuth"
import {useKeys} from "@/hooks/useKeys"
import {useSelector} from "react-redux"
import type {RootState} from "@/store"

export default function MessengerIndex() {
	const {getOtherUsers, logout, currentUser} = useAuth()
	const {keyPair} = useKeys()
	const {chats} = useSelector((state: RootState) => state.chat)

	const otherUsers = getOtherUsers()
	const [e, n] = keyPair.publicKey.split(':')

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
									{chats.find(chat => chat.participants.includes(user.id))?.publicKeyExchanged
										? "Ключи обменены"
										: "Требуется обмен ключами"}
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