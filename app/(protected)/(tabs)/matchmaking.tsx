import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import axios from 'axios';
import { Dialog } from '@headlessui/react';
import { ClipLoader } from 'react-spinners';
import { useForm, Controller } from 'react-hook-form';
import { useColorScheme } from '@/lib/useColorScheme';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon } from '@/components/ui/icons';
import { useAuth } from '@/context/supabase-provider';

// Типы для рекомендаций и фильтров
type Role = 'investor' | 'startup' | 'influencer' | 'service-provider' | 'all';

type Match = {
	id: number;
	name: string;
	role: string;
	description: string;
	reason: string;
	photo_url: string | null;
};

type ConfirmMeetingResponse = {
	success: boolean;
	tokens: number;
};

// Тестовые данные для отображения без API
const MOCK_MATCHES: Match[] = [
	{
		id: 1,
		name: 'Алексей Иванов',
		role: 'investor',
		description: 'Инвестор в Web3 и блокчейн проекты',
		reason: 'Интересуется проектами в вашей отрасли',
		photo_url: 'https://randomuser.me/api/portraits/men/1.jpg',
	},
	{
		id: 2,
		name: 'Елена Петрова',
		role: 'startup',
		description: 'CEO стартапа в сфере финтех',
		reason: 'Ищет партнеров для развития B2B направления',
		photo_url: 'https://randomuser.me/api/portraits/women/2.jpg',
	},
	{
		id: 3,
		name: 'Михаил Сидоров',
		role: 'influencer',
		description: '3M+ подписчиков в социальных сетях',
		reason: 'Может помочь с продвижением вашего продукта',
		photo_url: 'https://randomuser.me/api/portraits/men/3.jpg',
	},
	{
		id: 4,
		name: 'Анна Козлова',
		role: 'service-provider',
		description: 'Предоставляет юридические услуги для IT',
		reason: 'Специализируется на защите интеллектуальной собственности',
		photo_url: 'https://randomuser.me/api/portraits/women/4.jpg',
	},
	{
		id: 5,
		name: 'Дмитрий Новиков',
		role: 'investor',
		description: 'Венчурный инвестор, фокус на AI и ML',
		reason: 'Заинтересован в инвестициях в проекты с AI',
		photo_url: 'https://randomuser.me/api/portraits/men/5.jpg',
	},
	{
		id: 6,
		name: 'Ольга Смирнова',
		role: 'startup',
		description: 'Основатель EdTech стартапа',
		reason: 'Ищет партнерства для расширения на новые рынки',
		photo_url: 'https://randomuser.me/api/portraits/women/6.jpg',
	},
	{
		id: 7,
		name: 'Сергей Волков',
		role: 'influencer',
		description: 'Tech-блогер, 500K+ подписчиков',
		reason: 'Может рассказать о вашем продукте своей аудитории',
		photo_url: 'https://randomuser.me/api/portraits/men/7.jpg',
	},
	{
		id: 8,
		name: 'Марина Соколова',
		role: 'service-provider',
		description: 'HR-консультант для IT компаний',
		reason: 'Поможет с подбором команды для вашего проекта',
		photo_url: 'https://randomuser.me/api/portraits/women/8.jpg',
	},
	{
		id: 9,
		name: 'Антон Морозов',
		role: 'investor',
		description: 'Бизнес-ангел, 15+ инвестиций',
		reason: 'Ищет проекты на ранней стадии в вашей области',
		photo_url: 'https://randomuser.me/api/portraits/men/9.jpg',
	},
	{
		id: 10,
		name: 'Ирина Лебедева',
		role: 'startup',
		description: 'CTO платформы анализа данных',
		reason: 'Ваши технологии могут дополнять друг друга',
		photo_url: 'https://randomuser.me/api/portraits/women/10.jpg',
	},
];

// Компонент карточки рекомендованного контакта
const MatchCard = ({
	match,
	onMeetingConfirm,
}: {
	match: Match;
	onMeetingConfirm: (id: number) => void;
}) => {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	// Функция для получения цвета роли
	const getRoleColor = (role: string) => {
		switch (role) {
			case 'investor':
				return 'bg-blue-600';
			case 'startup':
				return 'bg-green-600';
			case 'influencer':
				return 'bg-purple-600';
			case 'service-provider':
				return 'bg-orange-600';
			default:
				return 'bg-gray-600';
		}
	};

	// Функция для получения названия роли на русском
	const getRoleName = (role: string) => {
		switch (role) {
			case 'investor':
				return 'Инвестор';
			case 'startup':
				return 'Стартап';
			case 'influencer':
				return 'Инфлюенсер';
			case 'service-provider':
				return 'Сервис-провайдер';
			default:
				return role;
		}
	};

	return (
		<View
			className={`rounded-lg overflow-hidden shadow-md border border-purple-600 mb-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
		>
			<View className='p-4'>
				<View className='flex-row'>
					<Image
						source={{
							uri:
								match.photo_url ||
								'https://via.placeholder.com/100?text=No+Image',
						}}
						className='w-16 h-16 rounded-full mr-4'
					/>
					<View className='flex-1'>
						<Text
							className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}
						>
							{match.name}
						</Text>
						<View
							className={`rounded-full px-2 py-1 mt-1 self-start ${getRoleColor(match.role)}`}
						>
							<Text className='text-white text-xs'>
								{getRoleName(match.role)}
							</Text>
						</View>
						<Text
							className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
						>
							{match.description}
						</Text>
					</View>
				</View>

				<View className='mt-3'>
					<Text
						className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-600'}`}
					>
						Почему вам подходит: {match.reason}
					</Text>
				</View>

				<TouchableOpacity
					className='mt-4 bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-lg flex-row items-center justify-center'
					onPress={() => onMeetingConfirm(match.id)}
				>
					<CheckCircleIcon className='w-5 h-5 text-white mr-2' />
					<Text className='text-white font-medium'>Я встретился</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

// Компонент фильтра по ролям
const FilterDropdown = ({
	selectedRole,
	onRoleChange,
}: {
	selectedRole: Role;
	onRoleChange: (role: Role) => void;
}) => {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';
	const [isOpen, setIsOpen] = useState(false);

	const roles: { value: Role; label: string }[] = [
		{ value: 'all', label: 'Все роли' },
		{ value: 'investor', label: 'Инвесторы' },
		{ value: 'startup', label: 'Стартапы' },
		{ value: 'influencer', label: 'Инфлюенсеры' },
		{ value: 'service-provider', label: 'Сервис-провайдеры' },
	];

	return (
		<View className='mb-4'>
			<TouchableOpacity
				className={`border border-gray-300 rounded-lg p-2 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
				onPress={() => setIsOpen(!isOpen)}
			>
				<Text className={isDark ? 'text-white' : 'text-gray-900'}>
					Фильтр:{' '}
					{roles.find((r) => r.value === selectedRole)?.label ||
						'Все роли'}
				</Text>
			</TouchableOpacity>

			{isOpen && (
				<View
					className={`border border-gray-300 rounded-lg mt-1 absolute z-10 w-full ${isDark ? 'bg-gray-800' : 'bg-white'}`}
				>
					{roles.map((role) => (
						<TouchableOpacity
							key={role.value}
							className='p-2 border-b border-gray-200'
							onPress={() => {
								onRoleChange(role.value);
								setIsOpen(false);
							}}
						>
							<Text
								className={
									isDark ? 'text-white' : 'text-gray-900'
								}
							>
								{role.label}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			)}
		</View>
	);
};

// Компонент модального окна подтверждения
const ConfirmModal = ({
	isOpen,
	onClose,
	tokens,
}: {
	isOpen: boolean;
	onClose: () => void;
	tokens: number | null;
}) => {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	return (
		<Dialog open={isOpen} onClose={onClose} className='relative z-50'>
			<View className='fixed inset-0 bg-black/30' aria-hidden={true} />

			<View className='fixed inset-0 flex items-center justify-center p-4'>
				<Dialog.Panel
					className={`mx-auto max-w-sm rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
				>
					<Dialog.Title
						className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
					>
						Встреча зафиксирована!
					</Dialog.Title>

					{tokens !== null && (
						<Text
							className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}
						>
							Вы получили {tokens} токенов за эту встречу!
						</Text>
					)}

					<View className='mt-4'>
						<Button
							className='bg-purple-700 w-full'
							onPress={onClose}
						>
							<Text className='text-white'>ОК</Text>
						</Button>
					</View>
				</Dialog.Panel>
			</View>
		</Dialog>
	);
};

export default function MatchmakingScreen() {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';
	const { session } = useAuth();

	const [matches, setMatches] = useState<Match[]>([]);
	const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
	const [selectedRole, setSelectedRole] = useState<Role>('all');
	const [isLoading, setIsLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [earnedTokens, setEarnedTokens] = useState<number | null>(null);
	const [apiError, setApiError] = useState<string | null>(null);
	const [useMockData, setUseMockData] = useState(true); // Флаг для использования тестовых данных

	// Загрузка рекомендаций при монтировании компонента
	useEffect(() => {
		if (useMockData) {
			// Используем тестовые данные вместо API
			setMatches(MOCK_MATCHES);
			setFilteredMatches(MOCK_MATCHES);
			setIsLoading(false);
		} else {
			fetchMatches();
		}
	}, [useMockData]);

	// Фильтрация списка рекомендаций при изменении роли
	useEffect(() => {
		if (!Array.isArray(matches)) {
			console.error('matches не является массивом:', matches);
			setFilteredMatches([]);
			return;
		}

		if (selectedRole === 'all') {
			setFilteredMatches(matches);
		} else {
			setFilteredMatches(
				matches.filter((match) => match.role === selectedRole),
			);
		}
	}, [selectedRole, matches]);

	// Функция загрузки рекомендаций с API
	const fetchMatches = async () => {
		setIsLoading(true);
		setApiError(null);

		try {
			// Получение токена авторизации из сессии Supabase
			const token = session?.access_token;

			if (!token) {
				console.error('Нет токена авторизации');
				setApiError('Ошибка авторизации. Пожалуйста, войдите снова.');
				setIsLoading(false);
				return;
			}

			// Запрос к API для получения рекомендаций
			const response = await axios.get('/api/match', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			// Проверка, что response.data является массивом
			if (!Array.isArray(response.data)) {
				console.error('API вернул не массив:', response.data);
				setApiError('Некорректный формат данных от API.');
				setMatches([]);
				setFilteredMatches([]);
			} else {
				setMatches(response.data);
				setFilteredMatches(response.data);
			}
		} catch (error) {
			console.error('Ошибка при загрузке рекомендаций:', error);
			setApiError(
				'Не удалось загрузить рекомендации. Пожалуйста, попробуйте позже.',
			);
			setMatches([]);
			setFilteredMatches([]);
		} finally {
			setIsLoading(false);
		}
	};

	// Функция подтверждения встречи
	const handleMeetingConfirm = async (matchId: number) => {
		if (useMockData) {
			// Для тестовых данных имитируем успешное подтверждение
			setMatches((prevMatches) =>
				prevMatches.filter((match) => match.id !== matchId),
			);
			setEarnedTokens(10);
			setModalOpen(true);
			return;
		}

		try {
			// Получение токена авторизации и user_id из сессии Supabase
			const token = session?.access_token;
			const userId = session?.user?.id;

			if (!token || !userId) {
				console.error('Нет токена авторизации или ID пользователя');
				setApiError('Ошибка авторизации. Пожалуйста, войдите снова.');
				return;
			}

			// Запрос к API для подтверждения встречи
			const response = await axios.post<ConfirmMeetingResponse>(
				'/api/confirm-meeting',
				{
					user_id: userId,
					match_id: matchId,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (response.data.success) {
				// Удаление контакта из списка
				setMatches((prevMatches) =>
					prevMatches.filter((match) => match.id !== matchId),
				);

				// Отображение токенов и открытие модального окна
				setEarnedTokens(response.data.tokens);
				setModalOpen(true);
			}
		} catch (error) {
			console.error('Ошибка при подтверждении встречи:', error);
			setApiError(
				'Не удалось подтвердить встречу. Пожалуйста, попробуйте позже.',
			);
		}
	};

	// Обработчик закрытия модального окна
	const handleModalClose = () => {
		setModalOpen(false);
		setEarnedTokens(null);
	};

	return (
		<View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
			<Stack.Screen
				options={{
					headerShown: true,
					headerTitle: 'Рекомендации для нетворкинга',
					headerStyle: {
						backgroundColor: isDark ? '#111827' : '#fff',
					},
					headerTintColor: isDark ? '#fff' : '#111827',
				}}
			/>

			<ScrollView className='flex-1 p-4'>
				{/* Переключатель между тестовыми данными и API */}
				{!isLoading && (
					<View className='mb-4 flex-row items-center justify-between'>
						<Text
							className={isDark ? 'text-white' : 'text-gray-900'}
						>
							Режим: {useMockData ? 'Тестовые данные' : 'API'}
						</Text>
						<TouchableOpacity
							className='bg-purple-700 py-1 px-3 rounded-lg'
							onPress={() => setUseMockData(!useMockData)}
						>
							<Text className='text-white'>
								{useMockData
									? 'Использовать API'
									: 'Использовать тестовые данные'}
							</Text>
						</TouchableOpacity>
					</View>
				)}

				{/* Фильтр по ролям */}
				<FilterDropdown
					selectedRole={selectedRole}
					onRoleChange={setSelectedRole}
				/>

				{/* Состояние загрузки */}
				{isLoading ? (
					<View className='py-12 items-center'>
						<ClipLoader
							color={isDark ? '#818cf8' : '#4f46e5'}
							size={40}
						/>
						<Text
							className={`mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
						>
							Загрузка рекомендаций...
						</Text>
					</View>
				) : apiError ? (
					<View className='py-12 items-center'>
						<Text className={`text-red-500`}>{apiError}</Text>
						<TouchableOpacity
							className='mt-4 bg-purple-700 py-2 px-4 rounded-lg'
							onPress={fetchMatches}
						>
							<Text className='text-white'>
								Попробовать снова
							</Text>
						</TouchableOpacity>
					</View>
				) : !Array.isArray(filteredMatches) ||
				  filteredMatches.length === 0 ? (
					<View className='py-12 items-center'>
						<Text
							className={
								isDark ? 'text-gray-300' : 'text-gray-600'
							}
						>
							{selectedRole === 'all'
								? 'У вас пока нет рекомендаций для нетворкинга.'
								: 'Нет рекомендаций для выбранной роли.'}
						</Text>
					</View>
				) : (
					/* Сетка карточек */
					<View className='md:grid md:grid-cols-2 md:gap-4'>
						{filteredMatches.map((match) => (
							<MatchCard
								key={match.id}
								match={match}
								onMeetingConfirm={handleMeetingConfirm}
							/>
						))}
					</View>
				)}
			</ScrollView>

			{/* Модальное окно подтверждения */}
			<ConfirmModal
				isOpen={modalOpen}
				onClose={handleModalClose}
				tokens={earnedTokens}
			/>
		</View>
	);
}
