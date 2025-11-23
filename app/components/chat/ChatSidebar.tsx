import {Link} from "react-router"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {useAuth} from "@/hooks/useAuth"
import {useKeys} from "@/hooks/useKeys"

interface ChatSidebarProps {
	activeChatId?: string
	onLogout: () => void
}

export function ChatSidebar({activeChatId, onLogout}: ChatSidebarProps) {
	const {getOtherUsers, currentUser} = useAuth()
	const {keyPair} = useKeys()
	const otherUsers = getOtherUsers()
	const [e, n] = keyPair.publicKey.split(':')

	return (
		<div className="w-80 border-r bg-gray-50/50 flex flex-col">
			<div className="p-4 border-b">
				<h1 className="text-xl font-semibold">Чаты</h1>
			</div>

			<div className="flex-1 overflow-y-auto">
				{otherUsers.map(user => (
					<Link
						key={user.id}
						to={`/messenger/chat/${user.id}`}
						className={`block border-b transition-colors ${
							user.id === activeChatId
								? 'bg-blue-50 border-blue-200'
								: 'hover:bg-white'
						}`}
					>
						<div className="p-4">
							<div className="flex items-center justify-between mb-2">
                <span className={`font-medium ${
									user.id === activeChatId ? 'text-blue-700' : ''
								}`}>
                  {user.username}
                </span>
							</div>
							<div className={`text-sm ${
								user.id === activeChatId ? 'text-blue-600' : 'text-gray-600'
							}`}>
								{user.id === activeChatId ? "Активный чат" : "Нажмите для открытия"}
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

				<Button variant="destructive" onClick={onLogout} className="w-full">
					Выход
				</Button>
			</div>
		</div>
	)
}