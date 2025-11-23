import {KeyManagement} from "@/components/KeyManagement"
import {Button} from "@/components/ui/button"
import {Link} from "react-router"

export default function KeysPage() {
	return (
		<div className="flex w-full">
			<div className="w-80 border-r bg-gray-50/50">
				<div className="p-4 border-b">
					<Button variant="ghost" asChild className="pl-0">
						<Link to="/messenger">← Назад к чатам</Link>
					</Button>
				</div>
			</div>

			<div className="flex-1 p-6">
				<div className="max-w-2xl mx-auto">
					<KeyManagement/>
				</div>
			</div>
		</div>
	)
}