import { router } from "expo-router";
import { View } from "react-native";
import { Stack } from "expo-router";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";
import { colors } from "@/constants/colors";

export default function Home() {
	const { colorScheme } = useColorScheme();
	
	// Цвета в зависимости от текущей темы
	const textColor =
		colorScheme === 'dark'
			? colors.dark.foreground
			: colors.light.foreground;

	const backgroundColor =
		colorScheme === 'dark'
			? colors.dark.background
			: colors.light.background;
			
	return (
		<View 
			className="flex-1 items-center justify-center p-4 gap-y-4"
			style={{ backgroundColor }}
		>
			<Stack.Screen
				options={{
					headerShown: true,
					headerTitle: 'Главная',
					headerStyle: {
						backgroundColor,
					},
					headerTintColor: textColor,
				}}
			/>
			<H1 className="text-center" style={{ color: textColor }}>Главная</H1>
			<Muted className="text-center" style={{ color: textColor }}>
				Вы авторизованы, и эта сессия сохранится даже после
				закрытия приложения.
			</Muted>
			<Button
				className="w-full"
				variant="default"
				size="default"
				onPress={() => router.push("/(protected)/modal")}
			>
				<Text>Открыть модальное окно</Text>
			</Button>
		</View>
	);
}
