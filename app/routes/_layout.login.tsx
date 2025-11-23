import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {useAuth} from "@/hooks/useAuth"
import {mockUsers} from "@/mocks/users"

export default function LoginPage() {
	const {login} = useAuth()

	const handleUserLogin = (username: string, password: string) => {
		login(username, password)
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl text-center">Выберите аккаунт</CardTitle>
					<CardDescription className="text-center">
						Нажмите на аккаунт для входа
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{mockUsers.map(user => (
							<Button
								key={user.id}
								onClick={() => handleUserLogin(user.username, user.password)}
								className="w-full justify-start h-auto py-3"
								variant="outline"
							>
								<div className="text-left">
									<div className="font-medium">{user.username}</div>
									<div className="text-xs text-gray-500">ID: {user.id}</div>
								</div>
							</Button>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}