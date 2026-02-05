"use client";

import { useEffect, useRef, useState } from "react";

interface AnimateOnScrollProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

export default function AnimateOnScroll({
    children,
    delay = 0,
    className = "",
}: AnimateOnScrollProps) {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Apply delay before showing animation
                        setTimeout(() => {
                            setIsVisible(true);
                        }, delay * 1000);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px",
            }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [delay]);

    return (
        <div
            ref={elementRef}
            className={`transition-all duration-700 ease-out ${isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                } ${className}`}
        >
            {children}
        </div>
    );
}
