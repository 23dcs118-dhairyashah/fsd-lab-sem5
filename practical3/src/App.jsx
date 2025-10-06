import React from 'react'
import 'animate.css';


function App() {
    const [time, setTime] = React.useState("Welcome to CHARUSAT");
    const [date, setDate] = React.useState([])
    React.useEffect(() => {
        setTimeout(() => {
            const interval = setInterval(() => {
                setTime(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: "numeric", second: "numeric", hour12: false }))
                setDate(new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' }))
            }, 1000)
            return () => clearInterval(interval)
        }, 800)
    })
    return (
        <div className="dark:bg-black dark:text-white duration-300">
            <div className="flex justify-center items-center h-screen flex-col ">
                <h3 className="font-black text-5xl">Welcome to CHARUSAT</h3>
                <h1 className="text-[19vw] font-black
        dark:selection:bg-white dark:selection:text-black selection:bg-black selection:text-white">
                    {time === "Welcome to CHARUSAT" ? "Welcome to CHARUSAT" : time}
                </h1>
                <h3 className="text-black text-[6vw] 
        dark:text-white dark:selection:bg-white dark:selection:text-black selection:bg-black selection:text-white">{date}</h3>
            </div>
        </div>
    )
}

export default App;
