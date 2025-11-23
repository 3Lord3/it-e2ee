import {Outlet} from "react-router"
import {useEffect} from "react"
import {useDispatch} from "react-redux"
import {setChats, setUsers} from "@/features/chat/chatSlice"
import type {Chat, User} from "@/types/chat"

export default function MessengerLayout() {
	const dispatch = useDispatch()

	useEffect(() => {
		const currentUser = localStorage.getItem("currentUser")
		if (!currentUser) {
			window.location.href = "/login"
			return
		}

		const mockUsers: User[] = [
			{id: "1", username: "user1", isOnline: true},
			{id: "2", username: "user2", isOnline: false},
			{id: "3", username: "user3", isOnline: true},
		]

		const mockChats: Chat[] = [
			{id: "1-2", participants: ["1", "2"], publicKeyExchanged: false},
			{id: "1-3", participants: ["1", "3"], publicKeyExchanged: false},
		]

		dispatch(setUsers(mockUsers))
		dispatch(setChats(mockChats))
	}, [dispatch])

	return (
		<div className="flex h-screen bg-white">
			<Outlet/>
		</div>
	)
}