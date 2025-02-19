import { useState, useEffect } from 'react';
import { format as formatDate } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, LayoutDashboard, List, Trash2, Edit2, Sun, Moon, LogOut, Home, Ban, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle"
import { SignOutButton, UserButton, useUser } from "@clerk/clerk-react";
import { addRecord, getAllRecord, updateRecord, deleteRecord } from '@/services/API';
import { useNavigate } from 'react-router-dom';
import MonthlyStatsChart from '@/components/dashboard/charts/MonthlyStatsChart';
import CurrentMonthStats from '@/components/dashboard/charts/CurrentMonthStats';

const AttendanceDashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [activeView, setActiveView] = useState('dashboard');
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [currentEditRecord, setCurrentEditRecord] = useState<any>(null);
    const [currentDeleteRecord, setCurrentDeleteRecord] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [theme, setTheme] = useState('dark');
    const [canceledClasses, setCanceledClasses] = useState<string[]>([]);

    const user = useUser().user;
    const navigate = useNavigate();

    // Theme initialization and management
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    // Subject schedule by day
    const subjectSchedule = {
        Monday: ['Java Lab 1', 'Java Lab 2', 'SE', 'IMED', 'DM', 'DS/AI'],
        Tuesday: ['SE Lab 1', 'SE Lab 2', 'SE', 'IMED', 'PDS'],
        Wednesday: ['SE Lab 1', 'SE Lab 2', 'DS/AI Lab 1', 'DS/AI Lab 2', 'DM', 'DS/AI'],
        Thursday: ['Java Lab 1', 'Java Lab 2', 'SE', 'IMED', 'PDS'],
        Friday: ['SE', 'Java 1', 'Java 2', 'IMED', 'DM', 'DS/AI'],
        Saturday: ['Java 1', 'Java 2', 'DM', 'DS/AI'],
        Sunday: []
    };

    // Fetch attendance records on component mount
    useEffect(() => {
        fetchAttendanceRecords(user?.primaryEmailAddress?.emailAddress);
    }, []);

    const fetchAttendanceRecords = async (userEmail: any) => {
        try {
            const response = await getAllRecord(userEmail);
            if (response.ok) {
                const data = await response.json();
                setAttendanceRecords(data);
            }
        } catch (error) {
            console.error('Error fetching attendance records:', error);
        }
    };

    // Helper function to get day name
    const getDayName = (date: Date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    };

    const getClassesForDate = (date: Date) => {
        const dayName = getDayName(date) as keyof typeof subjectSchedule;
        return subjectSchedule[dayName];
    };

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date);
            setCalendarOpen(false);
            setSelectedClasses([]);
        }
    };

    const handleMarkAll = (type: 'present' | 'absent') => {
        const classes = getClassesForDate(selectedDate);
        if (type === 'present') {
            setSelectedClasses(classes);
        } else {
            setSelectedClasses([]);
        }
    };

    const handleClassToggle = (className: string) => {
        if (canceledClasses.includes(className)) return; // Prevent selecting canceled classes
        setSelectedClasses((prev) =>
            prev.includes(className)
                ? prev.filter((c) => c !== className)
                : [...prev, className]
        );
    };


    const handleDelete = async (id: string) => {
        setCurrentDeleteRecord(id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (currentDeleteRecord) {
            try {
                await deleteRecord(currentDeleteRecord);
                fetchAttendanceRecords(user?.primaryEmailAddress?.emailAddress); // Refresh the records
                setDeleteModalOpen(false)
                setCurrentDeleteRecord(null);
            } catch (error) {
                console.error('Error deleting record:', error);
            }
        }
    };

    const handleEdit = (record: any) => {
        setCurrentEditRecord(record);
        setSelectedClasses(record.classes);
        setCanceledClasses(record.canceledClasses);
        setSelectedDate(new Date(record.date));
        setEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        if (currentEditRecord) {
            try {
                const totalClasses = getClassesForDate(selectedDate).length - canceledClasses.length; // Deduct canceled classes
                await updateRecord(currentEditRecord._id, selectedClasses, totalClasses, canceledClasses);
                fetchAttendanceRecords(user?.primaryEmailAddress?.emailAddress); // Refresh records
                setEditModalOpen(false);
                setCurrentEditRecord(null);
                setSelectedClasses([]);
                setCanceledClasses([]);
            } catch (error) {
                console.error("Error updating record:", error);
            }
        }
    };



    const handleSaveAttendance = async () => {
        try {
            const totalClasses = getClassesForDate(selectedDate).length - canceledClasses.length; // Deduct canceled classes
            await addRecord(user?.primaryEmailAddress?.emailAddress, selectedDate, selectedClasses, totalClasses, canceledClasses);
            fetchAttendanceRecords(user?.primaryEmailAddress?.emailAddress); // Refresh records
            setModalOpen(false);
            setSelectedDate(new Date());
            setSelectedClasses([]);
            setCanceledClasses([]);
        } catch (error) {
            console.error("Error adding record:", error);
        }
    };



    const handleCancelToggle = (className: string) => {
        setCanceledClasses((prev) => {
            if (prev.includes(className)) {
                return prev.filter((c) => c !== className);
            } else {
                setSelectedClasses((prevSelected) => prevSelected.filter((c) => c !== className)); // Remove from selection
                return [...prev, className];
            }
        });
    };


    const AttendanceForm = ({ isEdit = false }) => {
        return (
            <div className="space-y-4">
                {!isEdit && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Select Date</label>
                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formatDate(selectedDate, "PPP")}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                )}
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{getDayName(selectedDate)}'s Classes</p>

                <div className="flex space-x-4 mb-4">
                    <Button variant="outline" onClick={() => handleMarkAll("present")} className="flex-1">
                        Mark All Present
                    </Button>
                    <Button variant="outline" onClick={() => handleMarkAll("absent")} className="flex-1">
                        Mark All Absent
                    </Button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {getClassesForDate(selectedDate).map((cls) => (
                        <div key={cls} className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                            {/* Attendance Checkbox */}
                            <Checkbox
                                id={cls}
                                checked={selectedClasses.includes(cls)}
                                onCheckedChange={() => handleClassToggle(cls)}
                                className="dark:border-gray-600"
                                disabled={canceledClasses.includes(cls)} // Disable if canceled
                            />
                            <label htmlFor={cls} className={`flex-1 dark:text-gray-200 cursor-pointer ${canceledClasses.includes(cls) ? "line-through text-gray-500" : ""}`}>
                                {cls}
                            </label>

                            {/* Class Canceled Toggle */}
                            <Toggle
                                id={`cancel-${cls}`}
                                variant="outline"
                                defaultPressed={canceledClasses.includes(cls)}
                                onPressedChange={() => handleCancelToggle(cls)}
                                className="hover:bg-red-500 data-[state=on]:bg-red-500"
                            >
                                <Ban />
                            </Toggle>
                        </div>
                    ))}
                </div>
            </div>
        );
    };


    return (
        <div className={`flex h-screen`}>
            {/* Sidebar */}
            <div className={`${theme === 'dark' ? 'bg-black text-gray-200' : 'bg-white'} shadow-lg ${isSidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 ease-in-out h-full flex flex-col`}>
                <div className={`flex items-center ${isSidebarOpen ? "p-4 justify-between" : 'justify-center py-4'}`}>
                    <button
                        className={`font-bold text-xl ${!isSidebarOpen && 'hidden'}`}
                        onClick={() => {
                            navigate('/')
                        }}
                    >Attendance</button>
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!isSidebarOpen)} className='p-6'>
                        {isSidebarOpen ? <ChevronsLeft /> : <ChevronsRight />}
                    </Button>
                </div>
                <hr className={`${isSidebarOpen ? 'mx-4' : 'mx-2'}`} />

                <nav className="flex-1 flex flex-col justify-between">
                    <div className={`space-y-2 mt-8 ${isSidebarOpen ? 'px-4' : "px-2"}`}>

                        <button
                            onClick={() => setActiveView('dashboard')}
                            className={`${isSidebarOpen ? "w-full" : "w-fit"}  flex items-center space-x-3 p-4 transition-colors rounded-lg 
                            ${activeView === 'dashboard'
                                    ? (theme === 'dark' ? 'bg-[#1A1A1A]' : 'bg-gray-200')
                                    : ''} 
                            ${theme === 'dark' ? 'hover:bg-[#1A1A1A]' : 'hover:bg-gray-100'}`}
                        >
                            <LayoutDashboard className="h-5 w-5" />
                            {isSidebarOpen && <span>Dashboard</span>}
                        </button>

                        <button
                            onClick={() => setActiveView('details')}
                            className={`${isSidebarOpen ? "w-full" : "w-fit"} flex items-center space-x-3 p-4 transition-colors rounded-lg 
                            ${activeView === 'details'
                                    ? (theme === 'dark' ? 'bg-[#1A1A1A]' : 'bg-gray-200')
                                    : ''} 
                            ${theme === 'dark' ? 'hover:bg-[#1A1A1A]' : 'hover:bg-gray-100'}`}
                        >
                            <List className="h-5 w-5" />
                            {isSidebarOpen && <span>Detail View</span>}
                        </button>
                    </div>

                    {/* User Details */}
                    <div className='shadow-t-md dark:shadow-[#222222] dark:bg-black rounded-t-2xl'>
                        <div className=' flex flex-col gap-2'>
                            <div className={`flex items-center justify-center ${isSidebarOpen && "gap-4"} rounded-lg mx-2 mt-2 p-2 bg-gray-200 dark:bg-[#1a1a1a]`}>
                                <div>
                                    <UserButton />
                                </div>
                                <div>
                                    <div>
                                        {isSidebarOpen && user?.fullName}
                                    </div>
                                    <div className='text-gray-500 text-sm'>
                                        {isSidebarOpen && user?.primaryEmailAddress?.emailAddress}
                                    </div>

                                </div>
                            </div>
                            <div className={`${isSidebarOpen ? "grid grid-cols-2 gap-2 mx-2" : "flex justify-center"} mb-4`}>
                                <Button
                                    // className={`${!isSidebarOpen && 'p-2 w-full'}`}
                                    className=''
                                    variant={'outline'} onClick={() => { navigate("/") }}>
                                    <Home />
                                    {isSidebarOpen && <span>Home</span>}
                                </Button>
                                {isSidebarOpen &&
                                    <Button variant={'outline'} className='w-full'>
                                        <LogOut />
                                        <SignOutButton />
                                    </Button>
                                }
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Attendance Dashboard</h1>
                        <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
                            <div>
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
                                <DialogTrigger asChild>
                                    <Button className="dark:bg-gray-50 dark:hover:bg-gray-300 dark:text-black">
                                        Add Attendance
                                    </Button>
                                </DialogTrigger>
                            </div>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Mark Attendance</DialogTitle>
                                </DialogHeader>
                                <AttendanceForm />
                                <div className="flex justify-end mt-4">
                                    <Button onClick={handleSaveAttendance}>Save Attendance</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {activeView === 'dashboard' ? (
                        // Dashboard
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <MonthlyStatsChart />
                            <CurrentMonthStats />
                        </div>
                    ) : (
                        // Detail View
                        <Card className='dark:bg-black'>
                            <CardHeader>
                                <CardTitle>Detailed Attendance Record</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-4">Date</th>
                                                <th className="text-left p-4">Status</th>
                                                <th className="text-left p-4">Classes Attended</th>
                                                <th className="text-left p-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attendanceRecords.map((record: any) => (
                                                <tr key={record._id} className="border-b hover:bg-gray-200 dark:hover:bg-[#1A1A1A] transition-colors duration-300">
                                                    <td className="p-4">{formatDate(new Date(record.date), 'PPP')}</td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded-full text-sm ${record.classes.length > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {record.classes.length > 0 ? 'Present' : 'Absent'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">{record.classes.join(', ') || '-'}</td>
                                                    <td className="p-4">
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleEdit(record)}
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDelete(record._id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Attendance Record</DialogTitle>
                    </DialogHeader>
                    <AttendanceForm isEdit />
                    <div className="flex justify-end mt-4">
                        <Button onClick={handleSaveEdit}>Save Changes</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Attendance Record?</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-between mt-4 gap-4">
                        <Button onClick={handleConfirmDelete} className='flex-1'>Delete Record</Button>
                        <Button
                            onClick={() => {
                                setDeleteModalOpen(false)
                                handleConfirmDelete
                            }}
                            variant={'outline'}
                            className='flex-1'
                        >Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AttendanceDashboard;