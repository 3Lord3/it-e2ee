import {Card, CardContent} from "@/components/ui/card"

interface EmptyChatProps {
	hasPublicKey: boolean
}

export function EmptyChat({hasPublicKey}: EmptyChatProps) {
	return (
		<div className="h-full flex items-center justify-center">
			<Card>
				<CardContent className="pt-6">
					<div className="text-center space-y-2">
						<p className="text-gray-600">Начните общение</p>
						<p className="text-sm text-gray-500">
							{hasPublicKey
								? "Сообщения будут зашифрованы"
								: "Введите публичный ключ для безопасного общения"}
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}