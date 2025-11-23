import {Outlet, redirect} from "react-router"
import {useEffect} from "react"
import {useDispatch} from "react-redux"
import {loadUserMessages, setChats, setUsers} from "@/features/chat/chatSlice"
import type {Chat, User} from "@/types/chat"

export async function clientLoader() {
	const currentUser = localStorage.getItem("currentUser")
	if (!currentUser) {
		throw redirect("/login")
	}
	return null
}

export default function MessengerLayout() {
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(loadUserMessages())

		const mockUsers: User[] = [
			{id: "1", username: "alice"},
			{id: "2", username: "bob"},
			{id: "3", username: "charlie"},
		]

		const mockChats: Chat[] = [
			{id: "1-2", participants: ["1", "2"], publicKeyExchanged: false},
			{id: "1-3", participants: ["1", "3"], publicKeyExchanged: false},
			{id: "2-3", participants: ["2", "3"], publicKeyExchanged: false},
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