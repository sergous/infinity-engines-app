import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { Stack } from 'expo-router';

import { useColorScheme } from '@/lib/useColorScheme';
import { colors } from '@/constants/colors';

export default function ProfileScreen() {
	const { colorScheme } = useColorScheme();
	// Состояние для переключателя матчмейкинга
	const [matchmakingEnabled, setMatchmakingEnabled] = useState(false);

	// Цвета в зависимости от текущей темы
	const textColor =
		colorScheme === 'dark'
			? colors.dark.foreground
			: colors.light.foreground;

	const backgroundColor =
		colorScheme === 'dark'
			? colors.dark.background
			: colors.light.background;

	// Обработчик переключения матчмейкинга
	const handleToggleMatchmaking = (value: boolean) => {
		setMatchmakingEnabled(value);
		// Здесь можно добавить логику для сохранения настройки на сервере
		console.log('Matchmaking enabled:', value);
	};

	return (
		<View style={[styles.container, { backgroundColor }]}>
			<Stack.Screen
				options={{
					headerShown: true,
					headerTitle: 'Профиль',
					headerStyle: {
						backgroundColor,
					},
					headerTintColor: textColor,
				}}
			/>

			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.section}>
					<Text style={[styles.sectionTitle, { color: textColor }]}>
						Личная информация
					</Text>
					<View style={styles.profileItem}>
						<Text style={[styles.profileLabel, { color: textColor }]}>
							Имя пользователя
						</Text>
						<Text style={[styles.profileValue, { color: textColor }]}>
							JohnDoe
						</Text>
					</View>
					<View style={styles.profileItem}>
						<Text style={[styles.profileLabel, { color: textColor }]}>
							Email
						</Text>
						<Text style={[styles.profileValue, { color: textColor }]}>
							user@example.com
						</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={[styles.sectionTitle, { color: textColor }]}>
						Настройки матчмейкинга
					</Text>
					<View style={styles.toggleContainer}>
						<Text style={[styles.toggleLabel, { color: textColor }]}>
							Включить матчмейкинг
						</Text>
						<Switch
							value={matchmakingEnabled}
							onValueChange={handleToggleMatchmaking}
							trackColor={{ false: '#767577', true: '#81b0ff' }}
							thumbColor={matchmakingEnabled ? '#f5dd4b' : '#f4f3f4'}
							style={styles.switch}
						/>
					</View>
					<Text style={[styles.description, { color: textColor }]}>
						При включении матчмейкинга вы сможете быть сопоставлены с другими
						игроками для совместной игры.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={[styles.sectionTitle, { color: textColor }]}>
						Статистика
					</Text>
					<View style={styles.profileItem}>
						<Text style={[styles.profileLabel, { color: textColor }]}>
							Рейтинг
						</Text>
						<Text style={[styles.profileValue, { color: textColor }]}>
							1250
						</Text>
					</View>
					<View style={styles.profileItem}>
						<Text style={[styles.profileLabel, { color: textColor }]}>
							Сыграно игр
						</Text>
						<Text style={[styles.profileValue, { color: textColor }]}>
							42
						</Text>
					</View>
					<View style={styles.profileItem}>
						<Text style={[styles.profileLabel, { color: textColor }]}>
							Победы/Поражения
						</Text>
						<Text style={[styles.profileValue, { color: textColor }]}>
							25/17
						</Text>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		padding: 16,
	},
	section: {
		marginBottom: 24,
		padding: 16,
		borderRadius: 8,
		backgroundColor: 'rgba(150, 150, 150, 0.1)',
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 16,
	},
	profileItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(150, 150, 150, 0.2)',
	},
	profileLabel: {
		fontSize: 16,
	},
	profileValue: {
		fontSize: 16,
		fontWeight: '500',
	},
	toggleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	toggleLabel: {
		fontSize: 16,
	},
	switch: {
		transform: [{ scale: 0.8 }],
	},
	description: {
		fontSize: 14,
		opacity: 0.7,
		marginTop: 8,
	},
});
