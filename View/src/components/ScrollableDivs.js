import React, { useRef, useEffect, useState } from 'react';

const ScrollableDivs = ({ children, maxHeight }) => {
    const containerRef = useRef(null);
    const [isScrollable, setIsScrollable] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            setIsScrollable(container.scrollHeight > maxHeight);
            console.log(container);
        }
    }, [maxHeight]);

    return (
        <div style={{ maxHeight: maxHeight + "vh", padding: '0px 30px', overflowY: isScrollable ? 'scroll' : 'auto' , overflowX: 'hidden'}} ref={containerRef}>
            {children}
        </div>
    );
};
export default ScrollableDivs;
