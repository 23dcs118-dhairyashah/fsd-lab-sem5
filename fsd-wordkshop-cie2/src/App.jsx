import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, UserPlus, LogIn, Shield, Eye, EyeOff } from 'lucide-react';

const App = () => {
    const [currentView, setCurrentView] = useState('login');
    const [user, setUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        userType: 'user'
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Check for existing session on component mount
    useEffect(() => {
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Get users from localStorage
    const getUsers = () => {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    };

    // Save users to localStorage
    const saveUsers = (users) => {
        localStorage.setItem('users', JSON.stringify(users));
    };

    // Validate form data
    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (currentView === 'signup') {
            if (!formData.fullName) {
                newErrors.fullName = 'Full name is required';
            }
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle sign up
    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const users = getUsers();
        const existingUser = users.find(u => u.email === formData.email);

        if (existingUser) {
            setErrors({ email: 'User with this email already exists' });
            setLoading(false);
            return;
        }

        const newUser = {
            id: Date.now(),
            email: formData.email,
            fullName: formData.fullName,
            userType: formData.userType,
            password: formData.password, // In real app, this would be hashed
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        // Auto login after signup
        const userSession = { ...newUser };
        delete userSession.password;
        setUser(userSession);
        sessionStorage.setItem('currentUser', JSON.stringify(userSession));

        setLoading(false);
    };

    // Handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const users = getUsers();
        const user = users.find(u =>
            u.email === formData.email && u.password === formData.password
        );

        if (!user) {
            setErrors({ general: 'Invalid email or password' });
            setLoading(false);
            return;
        }

        const userSession = { ...user };
        delete userSession.password;
        setUser(userSession);
        sessionStorage.setItem('currentUser', JSON.stringify(userSession));

        setLoading(false);
    };

    // Handle logout
    const handleLogout = () => {
        setUser(null);
        sessionStorage.removeItem('currentUser');
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            fullName: '',
            userType: 'user'
        });
        setCurrentView('login');
    };

    // Dashboard Component
    const Dashboard = () => (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <nav className="bg-white shadow-lg border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Shield className="h-8 w-8 text-indigo-600 mr-3" />
                            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-700">
                                <span className="font-medium">{user.fullName}</span>
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${user.userType === 'admin'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-green-100 text-green-800'
                                    }`}>
                                    {user.userType === 'admin' ? 'Admin' : 'User'}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Welcome Card */}
                    <div className="bg-white overflow-hidden shadow-lg rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome!</h3>
                            <p className="text-gray-600">
                                You are successfully logged in as {user.userType === 'admin' ? 'an Admin' : 'a User'}.
                            </p>
                        </div>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white overflow-hidden shadow-lg rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Profile</h3>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Name:</span> {user.fullName}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Email:</span> {user.email}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Role:</span> {user.userType}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Admin Only Card */}
                    {user.userType === 'admin' && (
                        <div className="bg-white overflow-hidden shadow-lg rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Admin Panel</h3>
                                <p className="text-gray-600 mb-4">
                                    You have admin privileges and can access additional features.
                                </p>
                                <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                    Manage Users
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Lazy Load Simulation */}
                <div className="mt-8">
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Dashboard Modules</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                <div className="animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">Module loading...</p>
                            </div>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                <div className="animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">Module loading...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // If user is logged in, show dashboard
    if (user) {
        return <Dashboard />;
    }

    // Auth forms
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Shield className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
                        <h2 className="text-3xl font-bold text-gray-900">
                            {currentView === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="mt-2 text-gray-600">
                            {currentView === 'login'
                                ? 'Please sign in to your account'
                                : 'Please fill in your information'}
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setCurrentView('login')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${currentView === 'login'
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <LogIn className="w-4 h-4 inline mr-1" />
                            Login
                        </button>
                        <button
                            onClick={() => setCurrentView('signup')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${currentView === 'signup'
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <UserPlus className="w-4 h-4 inline mr-1" />
                            Sign Up
                        </button>
                    </div>

                    {/* Error Message */}
                    {errors.general && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{errors.general}</p>
                        </div>
                    )}

                    {/* Form */}
                    <div onSubmit={currentView === 'login' ? handleLogin : handleSignUp}>
                        <div className="space-y-4">
                            {/* Full Name (Sign Up Only) */}
                            {currentView === 'signup' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.fullName ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    {errors.fullName && (
                                        <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                                    )}
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.email ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your email"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.password ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password (Sign Up Only) */}
                            {currentView === 'signup' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="Confirm your password"
                                        />
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </div>
                            )}

                            {/* User Type (Sign Up Only) */}
                            {currentView === 'signup' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        User Type
                                    </label>
                                    <select
                                        name="userType"
                                        value={formData.userType}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="user">Normal User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                onClick={currentView === 'login' ? handleLogin : handleSignUp}
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        {currentView === 'login' ? 'Signing In...' : 'Creating Account...'}
                                    </div>
                                ) : (
                                    currentView === 'login' ? 'Sign In' : 'Create Account'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
