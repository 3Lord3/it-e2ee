import {Link, useParams} from "react-router"
import {useSelector} from "react-redux"
import type {RootState} from "@/store"

export default function ChatPage() {
	const {chatId} = useParams()
	const {users, messages} = useSelector((state: RootState) => state.chat)
	const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")

	const otherUser = users.find(user => user.id === chatId)
	const chatMessages = messages[`${currentUser.id}${chatId}`] || []

	if (!otherUser) {
		return (
			<div className="flex-1 flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-xl font-semibold">Пользователь не найден</h2>
					<Link to="/messenger" className="text-indigo-600 hover:text-indigo-500">
						Вернуться к чатам
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className="flex w-full">
			<div className="w-80 border-r border-gray-200">
				<div className="p-4 border-b border-gray-200">
					<Link to="/messenger" className="text-indigo-600 hover:text-indigo-500">
						← Назад к чатам
					</Link>
				</div>
				<div className="p-4">
					<h2 className="text-lg font-semibold">{otherUser.username}</h2>
					<p className={`text-sm ${otherUser.isOnline ? "text-green-600" : "text-gray-500"}`}>
						{otherUser.isOnline ? "В сети" : "Не в сети"}
					</p>
				</div>
			</div>

			<div className="flex-1 flex flex-col">
				<div className="flex-1 p-4 overflow-y-auto">
					{chatMessages.length === 0 ? (
						<div className="text-center text-gray-500 mt-8">
							<p>Начните общение с обмена публичными ключами</p>
						</div>
					) : (
						<div className="space-y-4">
							{chatMessages.map(message => (
								<div
									key={message.id}
									className={`flex ${message.senderId === currentUser.id ? "justify-end" : "justify-start"}`}
								>
									<div
										className={`max-w-xs px-4 py-2 rounded-lg ${
											message.senderId === currentUser.id
												? "bg-indigo-600 text-white"
												: "bg-gray-200 text-gray-900"
										}`}
									>
										<p>{message.content}</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				<div className="border-t border-gray-200 p-4">
					<form className="flex space-x-4">
						<input
							type="text"
							placeholder="Введите сообщение..."
							className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
						<button
							type="submit"
							className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
						>
							Отправить
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}