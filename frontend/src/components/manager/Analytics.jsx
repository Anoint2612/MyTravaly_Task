import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = ({ data }) => {
    const chartData = [
        { name: 'Revenue', value: data.totalRevenue },
        { name: 'Bookings', value: data.totalBookings },
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Analytics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <h3 className="font-semibold text-blue-800 mb-2">Total Revenue</h3>
                    <p className="text-3xl font-bold text-blue-900">${data.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                    <h3 className="font-semibold text-green-800 mb-2">Total Bookings</h3>
                    <p className="text-3xl font-bold text-green-900">{data.totalBookings}</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                    <h3 className="font-semibold text-purple-800 mb-2">Occupancy Rate</h3>
                    <p className="text-3xl font-bold text-purple-900">{data.occupancyRate}%</p>
                </div>
            </div>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
export default Analytics;
