import React from "react";
import { Tabs } from "expo-router";

import { useColorScheme } from "@/lib/useColorScheme";
import { colors } from "@/constants/colors";

export default function TabsLayout() {
	const { colorScheme } = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				headerShown: true,
				tabBarStyle: {
					backgroundColor:
						colorScheme === "dark"
							? colors.dark.background
							: colors.light.background,
				},
				tabBarActiveTintColor:
					colorScheme === "dark"
						? colors.dark.foreground
						: colors.light.foreground,
				tabBarShowLabel: true,
			}}
		>
			<Tabs.Screen name="index" options={{ title: "Главная" }} />
			<Tabs.Screen name="matchmaking" options={{ title: "Матчмейкинг" }} />
			<Tabs.Screen name="profile" options={{ title: "Профиль" }} />
			<Tabs.Screen name="settings" options={{ title: "Настройки" }} />
		</Tabs>
	);
}
