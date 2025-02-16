import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getMonthlyStats } from "@/services/API";
import { useUser } from "@clerk/clerk-react";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const MonthlyStatsChart = () => {

    const [attendanceData, setAttendanceData] = useState([]);
    const [opacity, setOpacity] = useState({
        Present: 1,
        Absent: 1,
    });
    const user = useUser().user;

    // Handle Data
    useEffect(() => {
        fetchMonthlyStats(user?.primaryEmailAddress?.emailAddress);
    }, []);

    const fetchMonthlyStats = async (userEmail: any) => {
        try {
            const response = await getMonthlyStats(userEmail);
            if (response.ok) {
                const data = await response.json();
                setAttendanceData(data);
            }
        } catch (error) {
            console.error('Error fetching monthly stats:', error);
        }
    };

    // handle Visuals
    const handleMouseEnter = (o: any) => {
        const { dataKey } = o;

        setOpacity((op: any) => ({ ...op, [dataKey]: 0.5 }));
    };

    const handleMouseLeave = (o: any) => {
        const { dataKey } = o;

        setOpacity((op: any) => ({ ...op, [dataKey]: 1 }));
    };

    return (
        <Card className="dark:bg-black ">
            <CardHeader>

                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-blue-400" />
                    Overall Stats</CardTitle>
            </CardHeader>
            <hr className="mb-6 mx-4 border" />
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>

                    <BarChart
                        width={600}
                        height={400}
                        data={attendanceData}
                        margin={{ right: 40 }}
                    >
                        <YAxis />
                        <XAxis dataKey="month" />
                        <CartesianGrid strokeDasharray="5 5" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />

                        <Bar
                            dataKey={"Present"}
                            type="monotone"
                            stroke="#004D40"
                            fill="#50C878"
                            fillOpacity={opacity.Absent}
                        />
                        <Bar
                            dataKey={"Absent"}
                            type="monotone"
                            stroke="8B0000"
                            fill="#DC143C"
                            fillOpacity={opacity.Present}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>

    )
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
                <p className="text-white text-lg">{label}</p>
                <p className="text-sm text-blue-400">
                    Present:
                    <span className="ml-2">{payload[0].value}</span>
                </p>
                <p className="text-sm text-blue-400">
                    Absent:
                    <span className="ml-2">{payload[1].value}</span>
                </p>
            </div>
        )
    }
}

export default MonthlyStatsChart