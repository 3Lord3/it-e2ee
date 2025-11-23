import {Badge} from "@/components/ui/badge"
import {PublicKeyInput} from "@/components/PublicKeyInput"

interface ChatHeaderProps {
	username: string
	userId: string
	hasPublicKey: boolean
	onKeySave: (publicKey: string) => void
}

export function ChatHeader({username, userId, hasPublicKey, onKeySave}: ChatHeaderProps) {
	return (
		<div className="border-b p-4 bg-background">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div>
						<h2 className="font-semibold">{username}</h2>
						<div className="flex items-center gap-2 mt-1">
							{hasPublicKey ? (
								<Badge variant="default">Ключ сохранён</Badge>
							) : (
								<Badge variant="destructive">Нет ключа</Badge>
							)}
						</div>
					</div>
				</div>
				<PublicKeyInput
					userId={userId}
					username={username}
					onKeySave={onKeySave}
				/>
			</div>
		</div>
	)
}