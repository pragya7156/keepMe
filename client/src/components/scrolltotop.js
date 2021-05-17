import React, { useEffect, useState } from 'react'
import '../styles/scrollTop.css'
import { RiArrowUpSLine } from 'react-icons/ri'

function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    //Top: 0 takes us all the way back to the top of the page
    //Behaviour: smooth keeps it smooth
    const ScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        const toggleVisibility = () => {
            if(window.pageYOffset > 300) {
                setIsVisible(true);
            }
            else {
                setIsVisible(false);
            }
        };
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <div className="scroll-to-top">
            {
                isVisible && (
                    <div onClick={ScrollToTop}>
                    <RiArrowUpSLine className="icon" />
                    </div>
                )
            }
        </div>
    );
}

export default ScrollToTop
