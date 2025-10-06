import React, { useState } from 'react';

const Calculator = () => {
    const [display, setDisplay] = useState('0');
    const [previousValue, setPreviousValue] = useState(null);
    const [operation, setOperation] = useState(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);
    const [history, setHistory] = useState('');

    const inputNumber = (num) => {
        if (waitingForOperand) {
            setDisplay(String(num));
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? String(num) : display + num);
        }
    };

    const inputDecimal = () => {
        if (waitingForOperand) {
            setDisplay('0.');
            setWaitingForOperand(false);
        } else if (display.indexOf('.') === -1) {
            setDisplay(display + '.');
        }
    };

    const clear = () => {
        setDisplay('0');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(false);
        setHistory('');
    };

    const performOperation = (nextOperation) => {
        const inputValue = parseFloat(display);

        if (previousValue === null) {
            setPreviousValue(inputValue);
            setHistory(`${inputValue} ${nextOperation}`);
        } else if (operation) {
            const currentValue = previousValue || 0;
            const newValue = calculate(currentValue, inputValue, operation);

            setDisplay(String(newValue));
            setPreviousValue(newValue);
            setHistory(`${currentValue} ${operation} ${inputValue} = ${newValue}`);
        }

        setWaitingForOperand(true);
        setOperation(nextOperation);
    };

    const calculate = (firstValue, secondValue, operation) => {
        switch (operation) {
            case '+':
                return firstValue + secondValue;
            case '-':
                return firstValue - secondValue;
            case '*':
                return firstValue * secondValue;
            case '/':
                return firstValue / secondValue;
            default:
                return secondValue;
        }
    };

    const handleEquals = () => {
        const inputValue = parseFloat(display);

        if (previousValue !== null && operation) {
            const newValue = calculate(previousValue, inputValue, operation);
            setDisplay(String(newValue));
            setHistory(`${previousValue} ${operation} ${inputValue} = ${newValue}`);
            setPreviousValue(null);
            setOperation(null);
            setWaitingForOperand(true);
        }
    };

    const handleDelete = () => {
        if (display.length > 1) {
            setDisplay(display.slice(0, -1));
        } else {
            setDisplay('0');
        }
    };

    const Button = ({ onClick, className, children, ...props }) => (
        <button
            onClick={onClick}
            className={`h-16 text-xl font-semibold rounded-lg transition-all duration-150 active:scale-95 ${className}`}
            {...props}
        >
            {children}
        </button>
    );

    return (
        <div className="max-w-sm mx-auto mt-8 bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
            {/* Display */}
            <div className="bg-gray-800 p-6 text-right">
                <div className="text-gray-400 text-sm mb-2 h-5">
                    {history}
                </div>
                <div className="text-white text-3xl font-light break-all">
                    {display}
                </div>
            </div>

            <div className="grid grid-cols-5 gap-1 p-1 bg-red-600">
                <Button
                    onClick={() => performOperation('/')}
                    className="bg-red-600 hover:bg-red-700 text-white"
                >
                    /
                </Button>
                <Button
                    onClick={() => performOperation('*')}
                    className="bg-red-600 hover:bg-red-700 text-white"
                >
                    *
                </Button>
                <Button
                    onClick={() => performOperation('+')}
                    className="bg-red-600 hover:bg-red-700 text-white"
                >
                    +
                </Button>
                <Button
                    onClick={() => performOperation('-')}
                    className="bg-red-600 hover:bg-red-700 text-white"
                >
                    -
                </Button>
                <Button
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white"
                >
                    DEL
                </Button>
            </div>

            <div className="grid grid-cols-3 gap-1 p-1 bg-gray-900">
                {/* First row */}
                <Button
                    onClick={() => inputNumber(1)}
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                    1
                </Button>
                <Button
                    onClick={() => inputNumber(2)}
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                    2
                </Button>
                <Button
                    onClick={() => inputNumber(3)}
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                    3
                </Button>

                {/* Second row */}
                <Button
                    onClick={() => inputNumber(4)}
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                    4
                </Button>
                <Button
                    onClick={() => inputNumber(5)}
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                    5
                </Button>
                <Button
                    onClick={() => inputNumber(6)}
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                    6
                </Button>

                {/* Third row */}
                <Button
                    onClick={() => inputNumber(7)}
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                    7
                </Button>
                <Button
                    onClick={() => inputNumber(8)}
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                    8
                </Button>
                <Button
                    onClick={() => inputNumber(9)}
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                    9
                </Button>

                {/* Fourth row */}
                <Button
                    onClick={() => inputNumber(0)}
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                    0
                </Button>
                <Button
                    onClick={inputDecimal}
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                    .
                </Button>
                <Button
                    onClick={handleEquals}
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                    =
                </Button>
            </div>

            <div className="p-1 bg-gray-900">
                <Button
                    onClick={clear}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                    Clear
                </Button>
            </div>
        </div>
    );
};

export default Calculator;
