import {type RouteConfig} from "@react-router/dev/routes"

const routes: RouteConfig = [
	{
		path: "/",
		file: "routes/_layout.tsx",
		children: [
			{
				index: true,
				file: "routes/_layout._index.tsx",
			},
			{
				path: "login",
				file: "routes/_layout.login.tsx",
			},
			{
				path: "messenger",
				file: "routes/_layout.messenger.tsx",
				children: [
					{
						index: true,
						file: "routes/_layout.messenger._index.tsx",
					},
					{
						path: "chat/:chatId",
						file: "routes/_layout.messenger.chat.$chatId.tsx",
					},
				],
			},
		],
	},
]

export default routes;