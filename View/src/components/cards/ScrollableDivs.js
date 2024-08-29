import React, { useRef, useState, useLayoutEffect } from 'react';

const ScrollableDivs = ({ children }) => {
    const containerRef = useRef(null);
    const [isScrollable, setIsScrollable] = useState(false);
    const [maxHeight, setMaxHeight] = useState(0);

    const calculateMaxHeight = () => {
        const container = containerRef.current;
        if (container) {
            const viewportHeight = window.innerHeight * .90;
            const containerTop = container.getBoundingClientRect().top;
            const availableHeight = viewportHeight - containerTop;
            setMaxHeight(availableHeight);
            setIsScrollable(container.scrollHeight > availableHeight);
        }
    };

    useLayoutEffect(() => {
        calculateMaxHeight();

        // Add event listener for window resize
        window.addEventListener('resize', calculateMaxHeight);

        return () => {
            window.removeEventListener('resize', calculateMaxHeight);
        };
    }, []);

    return (
        <div
            style={{
                maxHeight: maxHeight + "px",
                overflowY: isScrollable ? 'scroll' : 'auto',
                overflowX: 'hidden'
            }}
            ref={containerRef}
        >
            {children}
        </div>
    );
};

export default ScrollableDivs;
