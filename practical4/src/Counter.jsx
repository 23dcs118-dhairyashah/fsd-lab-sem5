import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Counter = () => {
    const [count, setCount] = useState(0);
    const [direction, setDirection] = useState(1);

    const increment = () => {
        setDirection(1);
        setCount(prev => prev + 1);
    };

    const decrement = () => {
        setDirection(-1);
        setCount(prev => prev - 1);
    };

    const slideVariants = {
        enter: (direction) => ({
            y: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            y: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            y: direction < 0 ? 50 : -50,
            opacity: 0
        })
    };

    const transition = {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
            <div className="relative flex items-center justify-center">
                {/* Decrement Button */}
                <motion.button
                    onClick={decrement}
                    className="text-white text-8xl font-light hover:text-gray-300 transition-colors duration-200 select-none"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    −
                </motion.button>

                {/* Counter Display */}
                <div className="mx-16 relative w-32 h-32 flex items-center justify-center">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={count}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={transition}
                            className="absolute text-white text-8xl font-light select-none"
                        >
                            {count}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Increment Button */}
                <motion.button
                    onClick={increment}
                    className="text-white text-8xl font-light hover:text-gray-300 transition-colors duration-200 select-none"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    +
                </motion.button>
            </div>

            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/4 left-1/4 w-px h-32 bg-white rotate-45"></div>
                <div className="absolute top-1/3 right-1/3 w-px h-24 bg-white rotate-12"></div>
                <div className="absolute bottom-1/4 left-1/3 w-px h-28 bg-white -rotate-12"></div>
                <div className="absolute bottom-1/3 right-1/4 w-px h-20 bg-white rotate-45"></div>
            </div>

            {/* Reset Button */}
            <motion.button
                onClick={() => {
                    setDirection(count > 0 ? -1 : 1);
                    setCount(0);
                }}
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white text-sm font-light border border-white border-opacity-30 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                RESET
            </motion.button>

            {/* Keyboard Instructions */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-white text-opacity-50 text-sm text-center">
                <p>Use arrow keys ↑ ↓ or click buttons</p>
            </div>
        </div>
    );
};

// Keyboard event handler
const CounterWithKeyboard = () => {
    const [count, setCount] = useState(0);
    const [direction, setDirection] = useState(1);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowUp') {
                setDirection(1);
                setCount(prev => prev + 1);
            } else if (e.key === 'ArrowDown') {
                setDirection(-1);
                setCount(prev => prev - 1);
            } else if (e.key === ' ' || e.key === 'Escape') {
                setDirection(count > 0 ? -1 : 1);
                setCount(0);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [count]);

    const slideVariants = {
        enter: (direction) => ({
            y: direction > 0 ? 50 : -50,
            opacity: 0,
            scale: 0.8
        }),
        center: {
            zIndex: 1,
            y: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            y: direction < 0 ? 50 : -50,
            opacity: 0,
            scale: 0.8
        })
    };

    const transition = {
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.5
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-5">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-px bg-white"
                        style={{
                            height: Math.random() * 100 + 50,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            transform: `rotate(${Math.random() * 360}deg)`
                        }}
                        animate={{
                            opacity: [0.1, 0.3, 0.1],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    />
                ))}
            </div>

            <div className="relative flex items-center justify-center">
                {/* Decrement Button */}
                <motion.button
                    onClick={() => {
                        setDirection(-1);
                        setCount(prev => prev - 1);
                    }}
                    className="text-white text-8xl font-light hover:text-gray-300 transition-colors duration-200 select-none mr-16"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    −
                </motion.button>

                {/* Counter Display */}
                <div className="relative w-40 h-40 flex items-center justify-center">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={count}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={transition}
                            className="absolute text-white text-8xl font-light select-none"
                        >
                            {count}
                        </motion.div>
                    </AnimatePresence>

                    {/* Circular progress indicator */}
                    <motion.div
                        className="absolute inset-0 rounded-full border border-white border-opacity-10"
                        animate={{
                            rotate: count * 36
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 15
                        }}
                    >
                        <div className="absolute top-0 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-30"></div>
                    </motion.div>
                </div>

                {/* Increment Button */}
                <motion.button
                    onClick={() => {
                        setDirection(1);
                        setCount(prev => prev + 1);
                    }}
                    className="text-white text-8xl font-light hover:text-gray-300 transition-colors duration-200 select-none ml-16"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    +
                </motion.button>
            </div>

            {/* Reset Button */}
            <motion.button
                onClick={() => {
                    setDirection(count > 0 ? -1 : 1);
                    setCount(0);
                }}
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white text-sm font-light border border-white border-opacity-30 px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                RESET
            </motion.button>

            {/* Keyboard Instructions */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-white text-opacity-50 text-sm text-center">
                <p>↑ ↓ arrow keys • space/esc to reset</p>
            </div>

            {/* Value indicator */}
            <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-white text-opacity-30 text-xs">
                {count > 0 ? `+${count}` : count < 0 ? count : '0'}
            </div>
        </div>
    );
};

export default CounterWithKeyboard;
