import {useCallback, useState} from "react"
import {useNavigate} from "react-router"
import type {MockUser} from "@/mocks/users"
import {mockUsers} from "@/mocks/users"
import type {KeyPair} from "@/types/encryption"

interface StoredUser extends Omit<MockUser, 'password' | 'keyPair'> {
	keyPair?: KeyPair
}

export function useAuth() {
	const navigate = useNavigate()
	const [currentUser, setCurrentUser] = useState<StoredUser | null>(() => {
		const stored = localStorage.getItem("currentUser")
		return stored ? JSON.parse(stored) : null
	})

	const login = useCallback((username: string, password: string) => {
		const user = mockUsers.find(u => u.username === username && u.password === password)
		if (user) {
			const {password: _, ...userWithoutPassword} = user
			const storedKeyPair = localStorage.getItem(`userKeyPair_${user.id}`)
			const keyPair = storedKeyPair ? JSON.parse(storedKeyPair) : null
			const userWithKeys = keyPair ? {...userWithoutPassword, keyPair} : userWithoutPassword
			localStorage.setItem("currentUser", JSON.stringify(userWithKeys))
			setCurrentUser(userWithKeys)
			navigate("/messenger", {replace: true})
			return true
		}
		return false
	}, [navigate])

	const logout = useCallback(() => {
		localStorage.removeItem("currentUser")
		setCurrentUser(null)
		navigate("/login", {replace: true})
	}, [navigate])

	const updateKeyPair = useCallback((keyPair: KeyPair) => {
		if (!currentUser) return

		const updatedUser = {...currentUser, keyPair}
		localStorage.setItem("currentUser", JSON.stringify(updatedUser))
		setCurrentUser(updatedUser)
	}, [currentUser])

	const getOtherUsers = useCallback(() => {
		return mockUsers
			.filter(user => user.id !== currentUser?.id)
			.map(user => {
				const {password: _, ...userWithoutPassword} = user
				return userWithoutPassword
			})
	}, [currentUser])

	return {
		currentUser,
		login,
		logout,
		updateKeyPair,
		getOtherUsers,
		isAuthenticated: !!currentUser
	}
}