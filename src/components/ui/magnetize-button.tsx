"use client" 

import * as React from "react"

import { cn } from "@/lib/utils";
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";

interface MagnetizeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    particleCount?: number;
    attractRadius?: number;
}

interface Particle {
    id: number;
    x: number;
    y: number;
}

function MagnetizeButton({
    className,
    particleCount = 15,
    attractRadius = 60,
    children,
    ...props
}: MagnetizeButtonProps) {
    const [isAttracting, setIsAttracting] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);
    const particlesControl = useAnimation();
    const buttonRef = useRef<HTMLButtonElement>(null);
    
    // Mouse position tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    // Spring animations for smooth magnetic effect
    const springConfig = { damping: 25, stiffness: 150 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);
    
    // Transform values for magnetic attraction
    const rotateX = useTransform(y, [-100, 100], [15, -15]);
    const rotateY = useTransform(x, [-100, 100], [-15, 15]);

    useEffect(() => {
        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            x: Math.random() * 360 - 180,
            y: Math.random() * 360 - 180,
        }));
        setParticles(newParticles);
    }, [particleCount]);

    const handleMouseMove = useCallback((event: React.MouseEvent) => {
        if (!buttonRef.current) return;
        
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = event.clientX - centerX;
        const deltaY = event.clientY - centerY;
        
        // Apply magnetic effect within attract radius
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance < attractRadius) {
            const strength = 1 - distance / attractRadius;
            mouseX.set(deltaX * strength * 0.3);
            mouseY.set(deltaY * strength * 0.3);
        } else {
            mouseX.set(0);
            mouseY.set(0);
        }
    }, [attractRadius, mouseX, mouseY]);

    const handleInteractionStart = useCallback(async () => {
        setIsAttracting(true);
        await particlesControl.start({
            x: 0,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 80,
                damping: 12,
            },
        });
    }, [particlesControl]);

    const handleInteractionEnd = useCallback(async () => {
        setIsAttracting(false);
        mouseX.set(0);
        mouseY.set(0);
        await particlesControl.start((i) => ({
            x: particles[i]?.x || 0,
            y: particles[i]?.y || 0,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 18,
            },
        }));
    }, [particlesControl, particles, mouseX, mouseY]);

    return (
        <motion.div
            style={{ x, y, rotateX, rotateY }}
            onMouseMove={handleMouseMove}
            className="inline-block"
        >
            <Button
                ref={buttonRef}
                className={cn(
                    "relative touch-none rounded-full overflow-hidden",
                    "bg-gradient-to-r from-brand-accent-start to-brand-accent-end",
                    "text-white font-manrope font-medium",
                    "transition-all duration-300 ease-out",
                    "transform-gpu perspective-1000",
                    "hover:shadow-[0_10px_25px_rgba(254,206,10,0.3)]",
                    "hover:-translate-y-0.5",
                    className
                )}
                onMouseEnter={handleInteractionStart}
                onMouseLeave={handleInteractionEnd}
                onTouchStart={handleInteractionStart}
                onTouchEnd={handleInteractionEnd}
                {...props}
            >
                {particles.map((_, index) => (
                    <motion.div
                        key={index}
                        custom={index}
                        initial={{ x: particles[index]?.x || 0, y: particles[index]?.y || 0 }}
                        animate={particlesControl}
                        className={cn(
                            "absolute w-1.5 h-1.5 rounded-full pointer-events-none",
                            "transition-opacity duration-300",
                            isAttracting ? "opacity-100" : "opacity-0"
                        )}
                        style={{
                            background: index % 2 === 0 
                                ? 'radial-gradient(circle, #fece0a 0%, #fece0a 100%)'
                                : 'radial-gradient(circle, #fece0a 0%, #fece0a 100%)',
                            boxShadow: '0 0 8px rgba(254, 206, 10, 0.6)',
                        }}
                    />
                ))}
                <span className="relative w-full flex items-center justify-center gap-2 brand-ui">
                    {children}
                </span>
            </Button>
        </motion.div>
    );
}

export { MagnetizeButton }