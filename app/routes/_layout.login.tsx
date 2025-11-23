import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {useAuth} from "@/hooks/useAuth"

export default function LoginPage() {
	const {login} = useAuth()
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError("")

		const success = login(username, password)
		if (!success) {
			setError("Неверное имя пользователя или пароль")
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl text-center">Вход в мессенджер</CardTitle>
					<CardDescription className="text-center">
						Введите свои данные для входа
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Input
								type="text"
								placeholder="Имя пользователя"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Input
								type="password"
								placeholder="Пароль"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						{error && (
							<div className="text-sm text-red-600 text-center">
								{error}
							</div>
						)}
						<Button type="submit" className="w-full">
							Войти
						</Button>
					</form>
					<div className="mt-6 text-sm text-gray-600">
						<p className="font-semibold mb-2">Тестовые пользователи:</p>
						<div className="space-y-1">
							<div>alice / password123</div>
							<div>bob / password123</div>
							<div>charlie / password123</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}