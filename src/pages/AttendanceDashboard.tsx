import { useState, useEffect } from 'react';
import { format as formatDate } from 'date-fns'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, LayoutDashboard, List, Menu, Trash2, Edit2, Sun, Moon } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { addRecord, getAllRecord, getMonthlyStats, updateRecord, deleteRecord } from '@/services/API';

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
    const [monthlyStats, setMonthlyStats] = useState([]);
    const [theme, setTheme] = useState('dark');


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
        Saturday: ['Java', 'Java', 'DM', 'DS/AI'],
        Sunday: []
    };

    // Fetch attendance records and monthly stats on component mount
    useEffect(() => {
        fetchAttendanceRecords();
        fetchMonthlyStats();
    }, []);

    const fetchAttendanceRecords = async () => {
        try {
            const response = await getAllRecord();
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setAttendanceRecords(data);
            }
        } catch (error) {
            console.error('Error fetching attendance records:', error);
        }
    };

    const fetchMonthlyStats = async () => {
        try {
            const response = await getMonthlyStats();
            if (response.ok) {
                const data = await response.json();
                setMonthlyStats(data);
            }
        } catch (error) {
            console.error('Error fetching monthly stats:', error);
        }
    };

    // Helper function to get day name
    const getDayName = (date: Date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    };

    // Helper function to format date
    // const formatDate = (date: Date) => {
    //     return date.toLocaleDateString('en-US', {
    //         year: 'numeric',
    //         month: '2-digit',
    //         day: '2-digit'
    //     });
    // };

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
        setSelectedClasses(prev =>
            prev.includes(className)
                ? prev.filter(c => c !== className)
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
                console.log(currentDeleteRecord)
                await deleteRecord(currentDeleteRecord);
                fetchAttendanceRecords(); // Refresh the records
                fetchMonthlyStats(); // Refresh the stats
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
        setEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        if (currentEditRecord) {
            try {
                await updateRecord(currentEditRecord._id);
                fetchAttendanceRecords(); // Refresh the records
                fetchMonthlyStats(); // Refresh the stats
                setEditModalOpen(false);
                setCurrentEditRecord(null);
                setSelectedClasses([]);
            } catch (error) {
                console.error('Error updating record:', error);
            }
        }
    };

    const handleSaveAttendance = async () => {
        try {
            await addRecord(selectedDate, selectedClasses);
            fetchAttendanceRecords(); // Refresh the records
            fetchMonthlyStats(); // Refresh the stats
            setModalOpen(false);
            setSelectedDate(new Date());
            setSelectedClasses([]);
        } catch (error) {
            console.error('Error adding record:', error);
        }
    };

    const AttendanceForm = ({ isEdit = false }) => (
        <div className="space-y-4">
            {!isEdit && (
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Select Date</label>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formatDate(selectedDate, 'PPP')}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateSelect}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {getDayName(selectedDate)}'s Classes
                    </p>
                </div>
            )}

            <div className="flex space-x-4 mb-4">
                <Button
                    variant="outline"
                    onClick={() => handleMarkAll('present')}
                    className="flex-1"
                >
                    Mark All Present
                </Button>
                <Button
                    variant="outline"
                    onClick={() => handleMarkAll('absent')}
                    className="flex-1"
                >
                    Mark All Absent
                </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
                {getClassesForDate(selectedDate).map((cls) => (
                    <div key={cls} className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                        <Checkbox
                            id={cls}
                            checked={selectedClasses.includes(cls)}
                            onCheckedChange={() => handleClassToggle(cls)}
                            className="dark:border-gray-600"
                        />
                        <label htmlFor={cls} className="flex-1 dark:text-gray-200 cursor-pointer">{cls}</label>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className={`flex h-screen`}>
            {/* Sidebar */}
            <div className={`${theme === 'dark' ? 'bg-black text-gray-200' : 'bg-white'} shadow-lg ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
                <div className="p-4 flex justify-between items-center">
                    <h2 className={`font-bold text-xl ${!isSidebarOpen && 'hidden'}`}>Attendance</h2>
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!isSidebarOpen)}>
                        <Menu className="h-6 w-6 " />
                    </Button>
                </div>

                <nav className="mt-8 px-4 space-y-2">
                    <button
                        onClick={() => setActiveView('dashboard')}
                        className={`w-full p-4 flex items-center space-x-3 transition-colors rounded-lg 
                            ${activeView === 'dashboard'
                                ? (theme === 'dark' ? 'bg-[#1A1A1A]' : 'bg-gray-100')
                                : ''} 
                            ${theme === 'dark' ? 'hover:bg-[#1A1A1A]' : 'hover:bg-gray-100'}`}
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        {isSidebarOpen && <span>Dashboard</span>}
                    </button>

                    <button
                        onClick={() => setActiveView('details')}
                        className={`w-full p-4 flex items-center space-x-3 transition-colors rounded-lg 
                            ${activeView === 'details'
                                ? (theme === 'dark' ? 'bg-[#1A1A1A]' : 'bg-gray-100')
                                : ''} 
                            ${theme === 'dark' ? 'hover:bg-[#1A1A1A]' : 'hover:bg-gray-100'}`}
                    >
                        <List className="h-5 w-5" />
                        {isSidebarOpen && <span>Detail View</span>}
                    </button>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card className="col-span-1 dark:bg-black">
                                <CardHeader>
                                    <CardTitle>Present Classes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={monthlyStats}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="present" fill="#4CAF50" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="col-span-1 dark:bg-black">
                                <CardHeader>
                                    <CardTitle>Absent Classes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={monthlyStats}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="absent" fill="#f44336" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="col-span-1 dark:bg-black">
                                <CardHeader>
                                    <CardTitle>Total Classes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={monthlyStats}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="total" fill="#2196F3" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
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
                                                <tr key={record._id} className="border-b cursor-pointer hover:bg-[#1A1A1A] transition-colors duration-300">
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
                    {/* <AttendanceForm isEdit /> */}
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