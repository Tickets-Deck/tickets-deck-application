/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
    darkMode: ["class"],
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
    	extend: {
    		fontFamily: {
    			MonaSans: [
    				'Mona-Sans"',
    				'sans-serif'
    			],
    			'Mona-Sans-Wide': [
    				'Mona-Sans-Wide"',
    				'sans-serif'
    			]
    		},
    		colors: {
    			grey: '#f2f2f2',
    			'dark-grey': '#111111',
    			'dark-grey-2': '#222222',
    			'container-grey': '#313131',
    			'container-grey-20': '#464646',
    			'text-grey': '#717171',
    			'purple-grey': '#adadbc',
    			'primary-color': '#8133f1',
    			'primary-color-sub': '#ceb0fa',
    			'primary-color-sub-50': '#efe6fd',
    			'secondary-color': '#fee755',
    			'grey-bg': '#f4f1f1',
    			'grey-3': '#828282',
    			'success-color': '#00c940',
    			'failed-color': '#dc143c',
    			'warning-color': '#d3b809',
    			peach: '#ff7875',
    			standard: '#34abae',
    			premium: '#006aff',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			bumpDown: {
    				from: {
    					top: '2.188rem',
    					opacity: 0
    				}
    			},
    			floating: {
    				'0%': {
    					transform: 'translateY(0)'
    				},
    				'50%': {
    					transform: 'translateY(-3%)'
    				},
    				'100%': {
    					transform: 'translateY(0)'
    				}
    			},
    			subtleZoom: {
    				'0%': {
    					transform: 'scale(1)'
    				},
    				'50%': {
    					transform: 'scale(1.10) translateY(-5%)'
    				},
    				'100%': {
    					transform: 'scale(1)'
    				}
    			},
    			slideUp: {
    				'0%': {
    					transform: 'translateY(0)',
    					opacity: '1'
    				},
    				'100%': {
    					transform: 'translateY(-100%)',
    					opacity: '0'
    				}
    			},
    			slideDown: {
    				'0%': {
    					transform: 'translateY(-100%)',
    					opacity: '0'
    				},
    				'100%': {
    					transform: 'translateY(0)',
    					opacity: '1'
    				}
    			},
    			slideInFromLeft: {
    				'0%': {
    					transform: 'translateX(-100%)',
    					opacity: '0'
    				},
    				'100%': {
    					transform: 'translateX(0)',
    					opacity: '1'
    				}
    			},
    			slideOutToLeft: {
    				'0%': {
    					transform: 'translateX(0)',
    					opacity: '1'
    				},
    				'100%': {
    					transform: 'translateX(-100%)',
    					opacity: '0'
    				}
    			},
    			slideInFromRight: {
    				'0%': {
    					transform: 'translateX(100%)',
    					opacity: '0'
    				},
    				'100%': {
    					transform: 'translateX(0)',
    					opacity: '1'
    				}
    			},
    			slideOutToRight: {
    				'0%': {
    					transform: 'translateX(0)',
    					opacity: '1'
    				},
    				'100%': {
    					transform: 'translateX(100%)',
    					opacity: '0'
    				}
    			},
                sqwish: {
                    '50%': {
                      transform: 'scale(0.2) translateY(-50%)'
                    },
                    '100%': {
                      transform: 'scale(0.9) translateY(-50%)'
                    }
                  }
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			bumpDown: 'bumpDown 0.4s cubic-bezier(0.65, -0.07, 0.25, 1.24)',
    			floating: 'floating 6s ease-in-out infinite',
    			subtleZoom: 'subtleZoom 10s ease-in-out infinite',
    			slideUp: 'slideUp 0.3s ease-in-out',
    			slideDown: 'slideDown 0.3s ease-in-out',
    			slideInFromLeft: 'slideInFromLeft 0.25s ease-in-out forwards',
    			slideOutToLeft: 'slideOutToLeft 0.25s ease-in-out forwards',
    			slideInFromRight: 'slideInFromRight 0.25s ease-in-out forwards',
    			slideOutToRight: 'slideOutToRight 0.25s ease-in-out forwards',
                sqwish: 'sqwish 0.5s ease-in-out forwards'
    		},
    		boxShadow: {
    			teamCard: '0px 0px 4px rgba(0, 0, 0, 0.25)',
    			'outline-button': '0px 4px 4px rgba(0, 0, 0, 0.25)'
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
    // important: true,
    // corePlugins: {
    //     preflight: false,
    // }
};
