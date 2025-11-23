import {Link} from "react-router"
import {useSelector} from "react-redux"
import type {RootState} from "@/store"

export default function MessengerIndex() {
	const {users, chats} = useSelector((state: RootState) => state.chat)
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")

	const otherUsers = users.filter(user => user.id !== currentUser.id)

	return (
		<div className="flex w-full">
			<div className="w-80 border-r border-gray-200">
				<div className="p-4 border-b border-gray-200">
					<h1 className="text-xl font-semibold">Чаты</h1>
				</div>
				<div className="overflow-y-auto">
					{otherUsers.map(user => (
						<Link
							key={user.id}
							to={`/messenger/chat/${user.id}`}
							className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50"
						>
							<div className="flex-1">
								<div className="flex items-center justify-between">
									<span className="font-medium">{user.username}</span>
									<div className={`w-2 h-2 rounded-full ${user.isOnline ? "bg-green-500" : "bg-gray-300"}`}/>
								</div>
								<p className="text-sm text-gray-500">
									{chats.find(chat => chat.participants.includes(user.id))?.publicKeyExchanged
										? "Ключи обменены"
										: "Требуется обмен ключами"}
								</p>
							</div>
						</Link>
					))}
				</div>
			</div>
			<div className="flex-1 flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<h2 className="text-2xl font-semibold text-gray-600">Выберите чат для начала общения</h2>
				</div>
			</div>
		</div>
	)
}