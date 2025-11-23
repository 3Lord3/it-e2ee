import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"

export function PublicKeyInput({userId, username, onKeySave}: {
	userId: string;
	username: string;
	onKeySave: (key: string) => void
}) {
	const [isOpen, setIsOpen] = useState(false)
	const [publicKey, setPublicKey] = useState("")

	const handleSave = () => {
		if (publicKey.trim() && publicKey.includes(':')) {
			onKeySave(publicKey.trim())
			setIsOpen(false)
			setPublicKey("")
		}
	}

	const [e, n] = publicKey.split(':')

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					Ввести ключ
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Ввести публичный ключ</DialogTitle>
					<DialogDescription>
						Введите публичный ключ пользователя {username} для расшифровки сообщений
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div className="space-y-2">
						<label className="text-sm font-medium">Публичный ключ</label>
						<Input
							value={publicKey}
							onChange={(e) => setPublicKey(e.target.value)}
							placeholder="17:3233"
							className="font-mono text-xs"
						/>
						{publicKey.includes(':') && (
							<div className="text-xs text-gray-500">
								e: {e}, n: {n}
							</div>
						)}
					</div>
					<div className="flex gap-2">
						<Button onClick={handleSave} disabled={!publicKey.trim() || !publicKey.includes(':')}>
							Сохранить ключ
						</Button>
						<Button variant="outline" onClick={() => setIsOpen(false)}>
							Отмена
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}