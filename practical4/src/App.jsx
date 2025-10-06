import React, { useState } from 'react';

function App() {
    const [tmp, setTmp] = useState(0);
    const [count, setCount] = useState('00');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const formatCount = (num) => {
        if (num > -10 && num < 10) {
            return (num >= 0 ? '0' : '-0') + Math.abs(num);
        }
        return num.toString();
    };

    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-stone-800">
                <div className="text-neutral-200">
                    <h1 className="text-9xl font-bold tracking-wide text-center">{count}</h1>
                    <div className="flex flex-row space-x-4 mt-12">
                        <button
                            className="bg-neutral-200 w-36 font-semibold text-stone-800 cursor-pointer hover:opacity-95 transition-all px-2 py-2.5 rounded-[0.25vw]"
                            onClick={() => {
                                const newTmp = 0;
                                setTmp(newTmp);
                                setCount(formatCount(newTmp));
                            }}
                        >
                            Reset
                        </button>
                        <button
                            className="bg-neutral-200 w-36 font-semibold text-stone-800 cursor-pointer hover:opacity-95 transition-all px-2 py-2.5 rounded-[0.25vw]"
                            onClick={() => {
                                const newTmp = tmp + 1;
                                setTmp(newTmp);
                                setCount(formatCount(newTmp));
                            }}
                        >
                            Increment
                        </button>

                        <button
                            className="bg-neutral-200 w-36 font-semibold text-stone-800 cursor-pointer hover:opacity-95 transition-all px-2 py-2.5 rounded-[0.25vw]"
                            onClick={() => {
                                const newTmp = tmp - 1;
                                setTmp(newTmp);
                                setCount(formatCount(newTmp));
                            }}
                        >
                            Decrement
                        </button>
                        <button
                            className="bg-neutral-200 w-36 font-semibold text-stone-800 cursor-pointer hover:opacity-95 transition-all px-2 py-2.5 rounded-[0.25vw]"
                            onClick={() => {
                                const newTmp = tmp + 5;
                                setTmp(newTmp);
                                setCount(formatCount(newTmp));
                            }}
                        >
                            Increment 5
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center min-h-screen bg-stone-800 text-neutral-200">
                <h1 className="text-5xl font-bold tracking-wide text-center">Welcome to CHARUSAT!</h1>
                <input type="text" placeholder="First Name" className="w-96 mt-16 border-2 border-neutral-200 p-2 rounded-[0.25vw] focus:ring-2" onChange={(e) => {
                    setFirstName(e.target.value);
                }} />
                <input type="text" placeholder="Last Name" className="w-96 mt-4 border-2 border-neutral-200 p-2 rounded-[0.25vw] focus:ring-2" onChange={(e) => {
                    setLastName(e.target.value);
                }} />

                <p>First Name: {firstName}</p>
                <p>Last Name: {lastName}</p>
            </div>
        </>
    );
}

export default App;

