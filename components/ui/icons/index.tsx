import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type IconProps = {
	className?: string;
	color?: string;
	size?: number;
};

export const CheckCircleIcon = ({
	className = '',
	color = 'currentColor',
	size = 24,
}: IconProps) => {
	return (
		<View className={className}>
			<Svg
				width={size}
				height={size}
				viewBox='0 0 24 24'
				fill='none'
				stroke={color}
				strokeWidth={2}
				strokeLinecap='round'
				strokeLinejoin='round'
			>
				<Path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
				<Path d='M22 4 12 14.01l-3-3' />
			</Svg>
		</View>
	);
};
