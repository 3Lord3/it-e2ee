import {useNavigate} from "react-router"

export default function LoginPage() {
	const navigate = useNavigate()

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const username = formData.get("username") as string

		const mockUsers = [
			{id: "1", username: "user1"},
			{id: "2", username: "user2"},
			{id: "3", username: "user3"},
		]

		const user = mockUsers.find(u => u.username === username)

		if (!user) {
			alert("Пользователь не найден")
			return
		}

		localStorage.setItem("currentUser", JSON.stringify(user))
		navigate("/messenger")
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Вход в мессенджер
					</h2>
				</div>
				<form onSubmit={handleSubmit} className="mt-8 space-y-6">
					<div>
						<input
							id="username"
							name="username"
							type="text"
							required
							className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							placeholder="Имя пользователя"
						/>
					</div>
					<div>
						<button
							type="submit"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
						>
							Войти
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}