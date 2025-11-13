import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

interface ScrollToTopButtonProps {
    // ID-ul elementului care permite scroll-ul. 
    // În cazul tău, este containerul principal (document.body pe mobil, sau div-ul #root).
    scrollTargetId?: string;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ scrollTargetId }) => {
    const [isVisible, setIsVisible] = useState(false);
    const SCROLL_THRESHOLD = 300; // Afișează butonul după 300px de scroll

    // Logica de scroll
    useEffect(() => {
        const toggleVisibility = () => {
            let scrollTop = 0;

            if (scrollTargetId) {
                const targetElement = document.getElementById(scrollTargetId);
                if (targetElement) {
                    scrollTop = targetElement.scrollTop;
                }
            } else {
                // Fallback pentru body/window scroll (cum e cazul pe mobil la tine)
                scrollTop = window.pageYOffset;
            }

            if (scrollTop > SCROLL_THRESHOLD) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Adaugă listener pe window pentru simplitate, deoarece pe mobil
        // scroll-ul este pe `body`/`window` după modificările anterioare
        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, [scrollTargetId]);

    // Funcția care face scroll înapoi la început
    const scrollToTop = () => {
        if (scrollTargetId) {
            const targetElement = document.getElementById(scrollTargetId);
            if (targetElement) {
                targetElement.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            }
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };

    return (
        <button
            onClick={scrollToTop}
            className={`
                fixed bottom-6 right-6 z-50 
                p-4 rounded-full shadow-lg 
                bg-purple-600 hover:bg-purple-700 
                transition-opacity duration-300
                ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}
            aria-label="Scroll to top"
        >
            <ChevronUp className="w-6 h-6 text-white" />
        </button>
    );
};

export default ScrollToTopButton;