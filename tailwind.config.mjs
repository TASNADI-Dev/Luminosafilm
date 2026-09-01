/** @type {import('tailwindcss').Config} */
export default {
	theme: {
		extend: {
			colors: {
				azure: {
					DEFAULT: '#3f60ad',
					50: '#f2f6fc',
					100: '#e2ecf7',
					200: '#cbddf2',
					300: '#a8c8e8',
					400: '#7eacdc',
					500: '#5f8fd2',
					600: '#4c76c4',
					700: '#3f60ad',
					800: '#3a5293',
					900: '#334775',
					950: '#232c48',
				},
				bunting: {
					DEFAULT: '#1c2252',
					50: '#f0f4fe',
					100: '#dde6fc',
					200: '#c3d4fa',
					300: '#9abaf6',
					400: '#6b96ef',
					500: '#4872e9',
					600: '#3354dd',
					700: '#2a41cb',
					800: '#2836a5',
					900: '#263382',
					950: '#1c2252',
				},
				woodsmoke: {
					DEFAULT: '#09090b',
					50: '#f4f5f7',
					100: '#e4e5e9',
					200: '#cbcdd6',
					300: '#a7aab9',
					400: '#7b7f95',
					500: '#60637a',
					600: '#525468',
					700: '#474957',
					800: '#3f3f4b',
					900: '#383941',
					950: '#09090b',
				},
			},
			fontFamily: {
				sans: ['Poppins', 'sans-serif'],
				heading: ['Cabinet Grotesk', 'sans-serif'],
			},
			maxWidth: {
				container: '90rem', // 1440px
			},
			container: {
				center: true,
				screens: {
					sm: '40rem',
					md: '48rem',
					lg: '64rem',
					xl: '80rem',
					'2xl': '90rem', // 1440px
				},
			},
		},
	},
};
