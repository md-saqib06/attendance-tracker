import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getAllRecord } from '@/services/API';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar, Users, UserCheck, UserX, Percent, AlignRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"

const CurrentMonthStats = () => {


    const [overviewStats, setOverviewStats] = useState({
        total: 0,
        attended: 0,
        missed: 0,
        percent: 0
    });
    const [selectedMonth, setSelectedMonth] = useState("showall");
    const chartData = [
        { name: 'Classes Taken', value: overviewStats.attended },
        { name: 'Classes Missed', value: overviewStats.missed }
    ];

    const userMail = useUser().user?.primaryEmailAddress?.emailAddress;

    useEffect(() => {
        if (userMail) {
            fetchAttendanceRecords(userMail);
        }
    }, []);

    const fetchAttendanceRecords = async (userEmail: string) => {
        try {
            const response = await getAllRecord(userEmail);
            if (response.ok) {
                const data = await response.json();
                const overview = {
                    total: 0,
                    attended: 0,
                    missed: 0,
                    percent: 0
                };

                data.forEach((d: any) => {
                    overview.attended += d.attendedClasses;
                    overview.missed += d.missedClasses;
                    overview.total += d.totalClasses;
                });

                overview.percent = overview.attended / overview.total * 100

                setOverviewStats((prevState) => ({
                    ...prevState,
                    ...overview
                }));
            }
        } catch (error) {
            console.error('Error fetching attendance records:', error);
        }
    };

    return (
        <Card className="dark:bg-black ">
            <CardHeader className="">
                <CardTitle className="flex justify-between">
                    <div className='flex items-center gap-2'>

                        <Calendar className="h-6 w-6 text-blue-400" />
                        Attendance Overview
                    </div>
                    <div className='flex items-center gap-2'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <AlignRight />
                                    Open
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Select Month</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={selectedMonth} onValueChange={setSelectedMonth}>
                                    <DropdownMenuRadioItem value='showall'>Show All</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value='jan'>January</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value='feb'>February</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value='mar'>March</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardTitle>
            </CardHeader>
            <hr className="mb-6 mx-4 border" />
            <CardContent className="">
                <div className="grid grid-cols-2 gap-6">
                    {/* Left side - Stats */}
                    <div className="space-y-6">
                        {/* Total Classes */}
                        <div className="flex items-center gap-3 group">
                            <div className="p-2 rounded-lg text-blue-500 bg-gray-100 group-hover:bg-gray-200 dark:bg-black dark:group-hover:bg-gray-900 transition-all">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Total Classes</p>
                                <p className="text-xl font-bold text-blue-500">{overviewStats.total}</p>
                            </div>
                        </div>

                        {/* Classes Taken */}
                        <div className="flex items-center gap-3 group">
                            <div className="p-2 rounded-lg text-green-500 bg-gray-100 group-hover:bg-gray-200 dark:bg-black dark:group-hover:bg-gray-900 transition-all">
                                <UserCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Classes Taken</p>
                                <p className="text-xl font-bold text-green-500">{overviewStats.attended}</p>
                            </div>
                        </div>

                        {/* Classes Missed */}
                        <div className="flex items-center gap-3 group">
                            <div className="p-2 rounded-lg text-red-500 bg-gray-100 group-hover:bg-gray-200 dark:bg-black dark:group-hover:bg-gray-900 transition-all">
                                <UserX className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Classes Missed</p>
                                <p className="text-xl font-bold text-red-500">{overviewStats.missed}</p>
                            </div>
                        </div>

                        {/* Present Percentage */}
                        <div className="flex items-center gap-3 group">
                            <div className="p-2 rounded-lg text-purple-500 bg-gray-100 group-hover:bg-gray-200 dark:bg-black dark:group-hover:bg-gray-900 transition-all">
                                <Percent className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Present Percentage</p>
                                <p className="text-xl font-bold text-purple-500">{overviewStats.percent}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Chart */}
                    <div className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell
                                        fill="#22c55e"
                                        className="hover:opacity-100 opacity-80 transition-opacity"
                                    />
                                    <Cell
                                        fill="#ef4444"
                                        className="hover:opacity-100 opacity-80 transition-opacity"
                                    />
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'black',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '8px'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CurrentMonthStats