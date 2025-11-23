import {Outlet} from "react-router"
import {Provider} from "react-redux"
import {store} from "@/store"

export default function Layout() {
	return (
		<Provider store={store}>
			<div className="h-screen">
				<Outlet/>
			</div>
		</Provider>
	)
}