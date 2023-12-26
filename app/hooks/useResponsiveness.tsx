import { useState, useEffect } from 'react';

const useResponsiveness = () => {
	const isSSR = typeof window === 'undefined';

	const [windowSize, setWindowSize] = useState<{width: number | undefined, height: number | undefined}>({
		width: isSSR ? undefined : window.innerWidth,
		height: isSSR ? undefined : window.innerHeight,
	});

	const changeWindowSize = () => {
		setWindowSize({ width: window.innerWidth, height: window.innerHeight });
	};

	useEffect(() => {
        if(isSSR) return;
        
        // If the document is loaded
        if(document.readyState) {
            changeWindowSize();
        }

		window.addEventListener('load', changeWindowSize);
		window.addEventListener('resize', changeWindowSize);

		return () => {
            window.removeEventListener('load', changeWindowSize);
			window.removeEventListener('resize', changeWindowSize);
		};
	}, [isSSR]);

	return windowSize;
};

export default useResponsiveness;