import {redirect} from "react-router"

export async function clientLoader() {
	const currentUser = localStorage.getItem("currentUser")
	if (!currentUser) {
		throw redirect("/login")
	}
	throw redirect("/messenger")
}

export default function Index() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="text-lg">Перенаправление...</div>
		</div>
	)
}