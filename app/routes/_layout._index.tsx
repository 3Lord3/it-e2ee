import { useEffect } from "react"
import { useNavigate } from "react-router"

export default function Index() {
	const navigate = useNavigate()

	useEffect(() => {
		const currentUser = localStorage.getItem("currentUser")
		if (!currentUser) {
			navigate("/login")
		} else {
			navigate("/messenger")
		}
	}, [navigate])

	return null
}