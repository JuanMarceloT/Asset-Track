import React, { useRef, useEffect, useState } from 'react';

const ScrollableDivs = ({ children, maxHeight }) => {
    const containerRef = useRef(null);
    const [isScrollable, setIsScrollable] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            setIsScrollable(container.scrollHeight > maxHeight);
        }
    }, [maxHeight]);

    return (
        <div style={{ maxHeight, maxWidth: 'max-content', overflowY: isScrollable ? 'scroll' : 'auto' }} ref={containerRef}>
            {children}
        </div>
    );
};
export default ScrollableDivs;
