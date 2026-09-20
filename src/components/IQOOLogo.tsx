import React from 'react';

interface IQOOLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'mark';
  accentColor?: string;
}

export const IQOOLogo: React.FC<IQOOLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  accentColor = '#FFD400',
}) => {
  const heights = {
    sm: 18,
    md: 24,
    lg: 32,
  };

  const h = heights[size];

  if (variant === 'mark') {
    return (
      <svg
        height={h}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block ${className}`}
        aria-label="iQOO Logo Mark"
      >
        {/* Background rounded squircle */}
        <rect width="40" height="40" rx="10" fill={accentColor} />
        {/* 'i' */}
        <circle cx="12.5" cy="11.5" r="2.5" fill="#08090A" />
        <rect x="10" y="17" width="5" height="15" rx="1.5" fill="#08090A" />
        {/* 'Q' */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M27 15C22.5817 15 19 18.5817 19 23C19 27.4183 22.5817 31 27 31C28.4554 31 29.8143 30.6116 30.9846 29.9348L32.7929 31.7431C33.1834 32.1337 33.8166 32.1337 34.2071 31.7431C34.5976 31.3526 34.5976 30.7194 34.2071 30.3289L32.4842 28.606C34.0416 27.0988 35 24.979 35 23C35 18.5817 31.4183 15 27 15ZM23.5 23C23.5 21.067 25.067 19.5 27 19.5C28.933 19.5 30.5 21.067 30.5 23C30.5 24.933 28.933 26.5 27 26.5C25.067 26.5 23.5 24.933 23.5 23Z"
          fill="#08090A"
        />
      </svg>
    );
  }

  // Full 'iQOO' wordmark
  return (
    <svg
      height={h}
      viewBox="0 0 110 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
      aria-label="iQOO Official Logo"
    >
      {/* 'i' */}
      <circle cx="8" cy="7.5" r="3" fill="#F5F7F8" />
      <rect x="5.2" y="13" width="5.6" height="15" rx="1.5" fill="#F5F7F8" />

      {/* 'Q' */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32 9C25.3726 9 20 14.3726 20 21C20 27.6274 25.3726 33 32 33C34.5029 33 36.8329 32.2335 38.761 30.9234L41.2929 33.4553C41.6834 33.8459 42.3166 33.8459 42.7071 33.4553C43.0976 33.0648 43.0976 32.4316 42.7071 32.0411L40.2882 29.6222C42.5937 27.4093 44 24.3315 44 21C44 14.3726 38.6274 9 32 9ZM25.8 21C25.8 17.5758 28.5758 14.8 32 14.8C35.4242 14.8 38.2 17.5758 38.2 21C38.2 24.4242 35.4242 27.2 32 27.2C28.5758 27.2 25.8 24.4242 25.8 21Z"
        fill="#F5F7F8"
      />
      {/* 'Q' accent tail in iQOO yellow */}
      <circle cx="41" cy="31" r="2.2" fill={accentColor} />

      {/* First 'O' */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M62 9C55.3726 9 50 14.3726 50 21C50 27.6274 55.3726 33 62 33C68.6274 33 74 27.6274 74 21C74 14.3726 68.6274 9 62 9ZM55.8 21C55.8 17.5758 58.5758 14.8 62 14.8C65.4242 14.8 68.2 17.5758 68.2 21C68.2 24.4242 65.4242 27.2 62 27.2C58.5758 27.2 55.8 24.4242 55.8 21Z"
        fill="#F5F7F8"
      />

      {/* Second 'O' with subtle yellow inner highlight / accent */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M92 9C85.3726 9 80 14.3726 80 21C80 27.6274 85.3726 33 92 33C98.6274 33 104 27.6274 104 21C104 14.3726 98.6274 9 92 9ZM85.8 21C85.8 17.5758 88.5758 14.8 92 14.8C95.4242 14.8 98.2 17.5758 98.2 21C98.2 24.4242 95.4242 27.2 92 27.2C88.5758 27.2 85.8 24.4242 85.8 21Z"
        fill="#F5F7F8"
      />
    </svg>
  );
};
