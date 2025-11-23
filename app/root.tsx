import {Links, Meta, Outlet, Scripts, ScrollRestoration,} from "react-router"
import "./app.css"

export default function App() {
	return (
		<>
			<Meta/>
			<Links/>
			<Outlet/>
			<ScrollRestoration/>
			<Scripts/>
		</>
	)
}