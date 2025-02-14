import { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, BookOpen, Users, BarChart2, Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut, useUser } from '@clerk/clerk-react'

const LandingPage = () => {

    const user = useUser();

    useEffect(() => {
        if (user.isSignedIn) {
            localStorage.setItem("isLoggedIn", "true");
        } else {
            localStorage.setItem("isLoggedIn", "false");
        }
    }, [])

    const [visible, setVisible] = useState<{ [key: string]: boolean }>({});
    const [theme, setTheme] = useState('dark');

    const navigate = useNavigate();

    useEffect(() => {
        // Initialize theme based on localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
            document.body.className = savedTheme;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisible(prev => ({ ...prev, [entry.target.id]: true }));
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.body.className = newTheme;
        localStorage.setItem('theme', newTheme);
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
            <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
                {/* Header */}
                <header className="fixed top-0 w-full bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-2">
                                <LayoutDashboard className="h-8 w-8 text-black dark:text-gray-50" />
                                <span className="text-xl font-bold dark:text-white">AttendanceHub</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleTheme}
                                    className="mr-2"
                                >
                                    {theme === 'dark' ? (
                                        <Sun className="h-5 w-5" />
                                    ) : (
                                        <Moon className="h-5 w-5" />
                                    )}
                                </Button>

                                {/* SignIn / SignOut Buttons */}
                                <SignedOut>
                                    <Button variant="outline">
                                        <SignInButton />
                                    </Button>
                                    <Button>
                                        <SignUpButton />
                                    </Button>
                                </SignedOut>

                                {/* UserProfile Button */}
                                <SignedIn>
                                    <UserButton />
                                </SignedIn>

                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center space-y-8">
                            <h1 className="text-5xl md:text-6xl font-bold text-black dark:text-gray-50 animate-on-scroll" id="hero-title">
                                Streamline Your Attendance Management
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-on-scroll" id="hero-subtitle">
                                Track, analyze, and optimize attendance with our intuitive dashboard. Perfect for educators and institutions.
                            </p>
                            <div className="flex justify-center space-x-4 animate-on-scroll" id="hero-cta">
                                <SignedOut>
                                    <Button size="lg">
                                        <SignInButton>
                                            Get Started Free
                                        </SignInButton>
                                    </Button>
                                </SignedOut>
                                <SignedIn>
                                    <Button onClick={() => { navigate("/dashboard") }} size="lg">
                                        <SignInButton>
                                            Go To Dashboard
                                        </SignInButton>
                                    </Button>
                                </SignedIn>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    icon: <Calendar className="h-8 w-8 text-black dark:text-white" />,
                                    title: "Easy Logging",
                                    description: "Quick and intuitive attendance marking with just a few clicks"
                                },
                                {
                                    icon: <BarChart2 className="h-8 w-8 text-black dark:text-white" />,
                                    title: "Visual Analytics",
                                    description: "Comprehensive charts and graphs for attendance insights"
                                },
                                {
                                    icon: <BookOpen className="h-8 w-8 text-black dark:text-white" />,
                                    title: "Detailed Reports",
                                    description: "Generate and export detailed attendance reports"
                                },
                                {
                                    icon: <Users className="h-8 w-8 text-black dark:text-white" />,
                                    title: "Multi-class Support",
                                    description: "Manage multiple classes and subjects efficiently"
                                }
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className={`p-6 bg-white dark:bg-black rounded-xl shadow-sm hover:shadow-md dark:hover:shadow-[#454545] transition-all duration-300 animate-on-scroll ${visible[`feature-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                        }`}
                                    id={`feature-${index}`}
                                >
                                    <div className="space-y-4">
                                        {feature.icon}
                                        <h3 className="text-xl font-semibold dark:text-white">{feature.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-white dark:bg-black py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <div className="flex items-center space-x-2">
                                    <LayoutDashboard className="h-6 w-6 text-black dark:text-white" />
                                    <span className="text-lg font-bold dark:text-white">AttendanceHub</span>
                                </div>
                                <p className="mt-4 text-gray-600 dark:text-gray-300">
                                    Making attendance management simple and efficient.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4 dark:text-white">Quick Links</h4>
                                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                    <li className="hover:text-black dark:hover:text-white cursor-pointer">Features</li>
                                    <li className="hover:text-black dark:hover:text-white cursor-pointer">Pricing</li>
                                    <li className="hover:text-black dark:hover:text-white cursor-pointer">Documentation</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4 dark:text-white">Contact</h4>
                                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                    <li>support@attendancehub.com</li>
                                    <li>+1 (555) 123-4567</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400">
                            <p>&copy; 2025 AttendanceHub. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;