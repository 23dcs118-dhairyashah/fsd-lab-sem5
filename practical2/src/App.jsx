import { useState, useEffect } from 'react'

function App() {
    const [location, setLocation] = useState("nadiad");
    const [suggestions, setSuggestions] = useState([]);
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const API_BASE_URL = "https://api.weatherapi.com/v1"
    const API_KEY = "d197805c2c10421da4b70840253006"

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (location.trim().length > 2) {
                try {
                    const res = await fetch(`${API_BASE_URL}/search.json?key=${API_KEY}&q=${location}`);
                    const data = await res.json();
                    setSuggestions(data);
                    setShowSuggestions(true);
                } catch (err) {
                    console.error('Autocomplete error:', err);
                    setSuggestions([]);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [location]);

    const fetchWeather = async (selectedLocation = location) => {
        if (!selectedLocation.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_BASE_URL}/current.json?key=${API_KEY}&q=${selectedLocation}&aqi=yes`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error?.message || 'Failed to fetch weather data');
            }

            setWeatherData(data);
            setShowSuggestions(false);
        } catch (err) {
            setError('Failed to fetch weather data. Please check the location and try again.');
            console.error('Weather fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        const locationName = `${suggestion.name}, ${suggestion.country}`;
        setLocation(locationName);
        setShowSuggestions(false);
        fetchWeather(locationName);
    };

    const handleSearch = () => {
        fetchWeather();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchWeather();
        }
    };

    useEffect(() => {
        fetchWeather();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white text-center mb-8 mt-8">
                    Weather App
                </h1>

                {/* Search Section */}
                <div className="relative mb-8">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Enter a city name..."
                                className="w-full border-2 border-gray-300 px-6 py-4 rounded-full focus:border-blue-500 focus:ring-0 focus:outline-none text-lg"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                onKeyPress={handleKeyPress}
                                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                            />

                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
                                    {suggestions.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            <div className="font-medium">{suggestion.name}</div>
                                            <div className="text-sm text-gray-600">{suggestion.region}, {suggestion.country}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
                            disabled={loading}
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
                        {error}
                    </div>
                )}

                {weatherData && (
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                {weatherData.location.name}, {weatherData.location.country}
                            </h2>
                            <p className="text-gray-600">
                                {weatherData.location.region} • 
                                })}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Current Weather */}
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-4">
                                    <img
                                        src={`https:${weatherData.current.condition.icon}`}
                                        alt={weatherData.current.condition.text}
                                        className="w-16 h-16 mr-4"
                                    />
                                    <div>
                                        <div className="text-5xl font-bold text-gray-800">
                                            {Math.round(weatherData.current.temp_c)}°C
                                        </div>
                                        <div className="text-gray-600">
                                            Feels like {Math.round(weatherData.current.feelslike_c)}°C
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xl text-gray-700 font-medium">
                                    {weatherData.current.condition.text}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <div className="text-sm text-gray-600">Humidity</div>
                                        <div className="text-2xl font-bold text-blue-600">
                                            {weatherData.current.humidity}%
                                        </div>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <div className="text-sm text-gray-600">Wind Speed</div>
                                        <div className="text-2xl font-bold text-green-600">
                                            {weatherData.current.wind_kph} km/h
                                        </div>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                        <div className="text-sm text-gray-600">UV Index</div>
                                        <div className="text-2xl font-bold text-yellow-600">
                                            {weatherData.current.uv}
                                        </div>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <div className="text-sm text-gray-600">Pressure</div>
                                        <div className="text-2xl font-bold text-purple-600">
                                            {weatherData.current.pressure_mb} mb
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-600 mb-2">Wind Direction</div>
                                    <div className="text-lg font-semibold">
                                        {weatherData.current.wind_dir} ({weatherData.current.wind_degree}°)
                                    </div>
                                </div>

                                {weatherData.current.air_quality && (
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        <div className="text-sm text-gray-600 mb-2">Air Quality (CO)</div>
                                        <div className="text-lg font-semibold text-red-600">
                                            {weatherData.current.air_quality.co.toFixed(1)} μg/m³
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {loading && !weatherData && (
                    <div className="text-center py-12">
                        <div className="text-white text-xl">Loading weather data...</div>
                    </div>
                )}

                {!loading && !weatherData && !error && (
                    <div className="text-center py-12">
                        <div className="text-white text-xl">Enter a location to get weather information</div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default App
