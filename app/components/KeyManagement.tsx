import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
import {Badge} from "@/components/ui/badge"
import {useKeys} from "@/hooks/useKeys"
import {useAuth} from "@/hooks/useAuth"

export function KeyManagement() {
	const {keyPair, generateNewKeyPair} = useKeys()
	const {updateKeyPair} = useAuth()
	const [showPrivateKey, setShowPrivateKey] = useState(false)

	const handleGenerateKeys = () => {
		const newKeyPair = generateNewKeyPair()
		updateKeyPair(newKeyPair)
	}

	const [e, n] = keyPair.publicKey.split(':')

	return (
		<Card>
			<CardHeader>
				<CardTitle>Ключи шифрования</CardTitle>
				<CardDescription>
					Управление вашими ключами для безопасного общения
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-4">
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium">Публичный ключ</label>
							<Badge variant="secondary">Можно делиться</Badge>
						</div>
						<Input
							value={keyPair.publicKey}
							readOnly
							className="font-mono text-xs"
						/>
						<div className="text-xs text-gray-500">
							e: {e}, n: {n}
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium">Приватный ключ</label>
							<div className="flex items-center gap-2">
								<Badge variant="destructive">Секретно</Badge>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setShowPrivateKey(!showPrivateKey)}
								>
									{showPrivateKey ? "Скрыть" : "Показать"}
								</Button>
							</div>
						</div>
						<Input
							value={showPrivateKey ? keyPair.privateKey : "••••••••••••••••"}
							readOnly
							className="font-mono text-xs"
						/>
					</div>

					<Button variant="outline" onClick={handleGenerateKeys}>
						Пересоздать ключи
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}

export function SharePublicKeyDialog({userId, username}: { userId: string; username: string }) {
	const {keyPair} = useKeys()
	const [isOpen, setIsOpen] = useState(false)

	const [e, n] = keyPair.publicKey.split(':')

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					Отправить ключ
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Отправить публичный ключ</DialogTitle>
					<DialogDescription>
						Отправьте ваш публичный ключ пользователю {username} для начала безопасного общения
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div className="space-y-2">
						<label className="text-sm font-medium">Публичный ключ</label>
						<Input
							value={keyPair.publicKey}
							readOnly
							className="font-mono text-xs"
						/>
						<div className="text-xs text-gray-500">
							e: {e}, n: {n}
						</div>
					</div>
					<div className="flex gap-2">
						<Button
							onClick={() => {
								navigator.clipboard.writeText(keyPair.publicKey)
							}}
						>
							Скопировать ключ
						</Button>
						<Button variant="outline" onClick={() => setIsOpen(false)}>
							Закрыть
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}