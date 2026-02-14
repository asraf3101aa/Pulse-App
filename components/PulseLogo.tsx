import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface PulseLogoProps {
    width?: number;
    height?: number;
    color?: string;
    strokeWidth?: number;
}

export const PulseLogo = ({
    width = 44,
    height = 44,
    color = "white",
    strokeWidth = 2
}: PulseLogoProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" stroke={color} strokeWidth={strokeWidth} fill="none">
        <Path
            d="M21 11.5C21 15.5867 17.866 18.9 14 18.9C13.2044 18.9 12.4431 18.7562 11.7419 18.4912L10 20L8.25814 18.4912C4.13399 18.9 1 15.5867 1 11.5C1 7.4133 4.13399 4.1 8 4.1H14C17.866 4.1 21 7.4133 21 11.5Z"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M7 11.5H9L10 13.5L12 9.5L13 11.5H15"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);
