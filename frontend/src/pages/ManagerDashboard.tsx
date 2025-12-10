import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  Plus,
  Pencil,
  Trash2,
  MoreVertical,
  Building,
  BarChart3,
  Check,
  X,
  Clock,
  XCircle,
  CreditCard,
  Percent,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";
import { toast } from "sonner";
import apiClient from "@/services/apiClient";
import useAuthStore from "@/store/authStore";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { Loader } from "@/components/ui/loader";

import hotelReceptionist from "@/assets/hotel-receptionist.mp4";
import deliverySchedule from "@/assets/delivery-schedule.mp4";
import revenue from "@/assets/revenue.mp4";
import RevenuePieChart from "@/components/RevenuePieChart";

const ManagerDashboard = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState<any>(null);
  const { user } = useAuthStore((state: any) => state);

  const [filterDays, setFilterDays] = useState("30");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterOrder, setFilterOrder] = useState("desc");
  const [filterPayment, setFilterPayment] = useState("all");
  const [filterRoomType, setFilterRoomType] = useState("all");

  const [activeTab, setActiveTab] = useState<'bookings' | 'statistics'>('bookings');
  const [statsMonths, setStatsMonths] = useState("6");
  const [metricsDays, setMetricsDays] = useState("7");
  const [chartType, setChartType] = useState<'bar' | 'pie'>('pie');

  const isFirstRender = useRef(true);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [isMetricsLoading, setIsMetricsLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingSource, setLoadingSource] = useState<'tab' | 'filter'>('filter');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  const fetchHotels = async () => {
    if (user?.email === 'manager1@gmail.com') {
      const dummyHotels = [{
        _id: 'dummy_hotel_1',
        title: 'Grand Plaza Hotel (Demo)',
        address: 'New York, USA',
        pricePerNight: 450,
        bookingsCount: 12,
        revenue: 5400,
        status: 'active',
        images: [],
        amenities: ['Free WiFi', 'Swimming Pool'],
        createdBy: 'dummy_manager_id'
      }];
      setHotels(dummyHotels);
    } else {
      try {
        const hotelsRes = await apiClient.get('/hotels');
        const myHotels = hotelsRes.data.filter((h: any) => h.createdBy?._id === user?._id || h.createdBy === user?._id);
        setHotels(myHotels);
      } catch (error) {
        console.error("Failed to fetch hotels", error);
      }
    }
  };

  const fetchMetrics = async () => {
    setIsMetricsLoading(true);
    try {
      const res = await axios.get(`https://mt-task.onrender.com/api/metrics?days=${metricsDays}`);
      if (res.data.success) {
        setMetrics(res.data.data);
        // Add a small delay to show the animation
        setTimeout(() => setIsMetricsLoading(false), 800);
      } else {
        setIsMetricsLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch metrics", error);
      toast.error("Failed to fetch metrics");
      setIsMetricsLoading(false);
    }
  };

  const fetchBookings = async () => {
    setLoadingSource('filter');
    setIsLoading(true);
    try {
      const bookingParams = new URLSearchParams();
      if (filterDays) bookingParams.append('days', filterDays);
      if (filterStatus && filterStatus !== 'all') bookingParams.append('status', filterStatus);
      if (filterOrder) bookingParams.append('order', filterOrder);

      const res = await axios.get(`https://mt-task.onrender.com/api/bookings?${bookingParams.toString()}`);
      if (res.data.success) setBookings(res.data.data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      toast.error("Failed to fetch bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrends = async () => {
    try {
      const res = await axios.get(`https://mt-task.onrender.com/api/trends?months=${statsMonths}`);
      if (res.data.success) {
        if (Array.isArray(res.data.data)) {
          setTrends(res.data.data);
        } else {
          setTrends([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch trends", error);
    }
  };

  const fetchAllData = async () => {
    const startTime = Date.now();
    try {
      await Promise.all([
        fetchHotels(),
        fetchMetrics(),
        fetchBookings(),
        fetchTrends()
      ]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch dashboard data");
    } finally {
      const elapsed = Date.now() - startTime;
      if (elapsed < 1500) {
        await new Promise(resolve => setTimeout(resolve, 1500 - elapsed));
      }
      setIsInitialLoad(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchAllData();
  }, [user]);

  useEffect(() => {
    if (isFirstRender.current) return;
    fetchMetrics();
  }, [metricsDays]);

  useEffect(() => {
    if (isFirstRender.current) return;
    fetchBookings();
  }, [filterDays, filterStatus, filterOrder]);

  useEffect(() => {
    if (isFirstRender.current) return;
    fetchTrends();
  }, [statsMonths]);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  // Effect for client-side filters to show loading animation
  useEffect(() => {
    if (isFirstRender.current) return;
    setLoadingSource('filter');
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [filterPayment, filterRoomType]);

  const handleTabChange = (tab: 'bookings' | 'statistics') => {
    if (tab === 'statistics' && activeTab !== 'statistics') {
      setIsStatsLoading(true);
      setActiveTab(tab);
      setTimeout(() => setIsStatsLoading(false), 1500); // Show animation for 1.5s
    } else if (tab === 'bookings' && activeTab !== 'bookings') {
      setLoadingSource('tab');
      setIsLoading(true);
      setActiveTab(tab);
      setTimeout(() => setIsLoading(false), 1500); // Show animation for 1.5s
    } else {
      setActiveTab(tab);
    }
  };

  const handleChartTypeChange = (type: 'bar' | 'pie') => {
    if (type !== chartType) {
      setIsChartLoading(true);
      setChartType(type);
      setTimeout(() => setIsChartLoading(false), 800);
    }
  };

  if (isInitialLoad) {
    return <Loader fullScreen videoSrc={hotelReceptionist} text="Hang tight getting your Bookings..." />;
  }

  const handleDeleteHotel = async (id: string) => {
    if (confirm("Are you sure you want to delete this hotel?")) {
      try {
        await apiClient.delete(`/hotels/${id}`);
        setHotels(prev => prev.filter(h => h._id !== id));
        toast.success("Hotel deleted successfully");
      } catch (error) {
        toast.error("Failed to delete hotel");
      }
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    // Note: This won't work for external bookings as IDs don't exist in local DB
    toast.info("This feature is disabled for demo data");
  };

  const totalRevenue = metrics?.totalRevenue || 0;
  const totalBookings = metrics?.totalBookings || 0;
  const activeBookings = (metrics?.pending || 0) + (metrics?.confirmed || 0);

  const displayedBookings = bookings.filter(booking => {
    if (filterPayment !== 'all' && booking.paymentStatus !== filterPayment) return false;
    if (filterRoomType !== 'all' && booking.roomType !== filterRoomType) return false;
    return true;
  });

  // Mock data for hotel-wise revenue since we don't have a real endpoint for it
  const hotelRevenueData = [
    { hotel: "Grand Plaza Hotel", revenue: totalRevenue * 0.45 },
    { hotel: "Seaside Resort (Partner)", revenue: totalRevenue * 0.30 },
    { hotel: "Mountain View Lodge", revenue: totalRevenue * 0.25 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12 animate-fade-in">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Manager Dashboard
              </h1>
              <p className="text-muted-foreground text-lg">
                Overview of your properties and performance.
              </p>
            </div>
            <Button variant="luxe" onClick={() => setShowAddModal(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add New Hotel
            </Button>
          </div>

          {/* Analytics Filter */}
          <div className="flex justify-end mb-6">
            <select
              value={metricsDays}
              onChange={(e) => setMetricsDays(e.target.value)}
              className="h-10 px-4 rounded-xl border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all hover:border-primary/50"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last month (30 days)</option>
              <option value="90">Last 3 months (90 days)</option>
              <option value="180">Last 6 months (180 days)</option>
              <option value="300">Last 10 months (300 days)</option>
              <option value="365">Last 12 months (365 days)</option>
            </select>
          </div>

          {/* Analytics Cards */}
          <div className="relative mb-12">
            {isMetricsLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <Loader variant="grid" />
              </div>
            )}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 ${isMetricsLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              {[
                {
                  label: "Total Bookings",
                  value: metrics?.totalBookings || 0,
                  icon: Calendar,
                  color: "text-blue-500",
                  bgColor: "bg-blue-500/10"
                },
                {
                  label: "Confirmed",
                  value: metrics?.confirmed || 0,
                  icon: Check,
                  color: "text-green-500",
                  bgColor: "bg-green-500/10"
                },
                {
                  label: "Pending",
                  value: metrics?.pending || 0,
                  icon: Clock,
                  color: "text-yellow-500",
                  bgColor: "bg-yellow-500/10"
                },
                {
                  label: "Cancelled",
                  value: metrics?.cancelled || 0,
                  icon: XCircle,
                  color: "text-red-500",
                  bgColor: "bg-red-500/10"
                },
                {
                  label: "Total Revenue",
                  value: `$${(metrics?.totalRevenue || 0).toLocaleString()}`,
                  icon: DollarSign,
                  color: "text-emerald-500",
                  bgColor: "bg-emerald-500/10"
                },
                {
                  label: "Avg. Booking Value",
                  value: `$${(metrics?.averageBookingValue || 0).toLocaleString()}`,
                  icon: CreditCard,
                  color: "text-purple-500",
                  bgColor: "bg-purple-500/10"
                },
                {
                  label: "Occupancy Rate",
                  value: `${metrics?.occupancyRate || 0}%`,
                  icon: Users,
                  color: "text-indigo-500",
                  bgColor: "bg-indigo-500/10"
                },
                {
                  label: "Conversion Rate",
                  value: `${metrics?.conversionRate || 0}%`,
                  icon: TrendingUp,
                  color: "text-pink-500",
                  bgColor: "bg-pink-500/10"
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="metrics-card animate-slide-up cursor-pointer"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="metrics-card__shine"></div>
                  <div className="metrics-card__glow"></div>
                  <div className="metrics-card__content">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1 font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex space-x-4 mb-8 border-b border-border">
            <button
              className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'bookings' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => handleTabChange('bookings')}
            >
              Bookings
            </button>
            <button
              className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'statistics' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => handleTabChange('statistics')}
            >
              Statistics
            </button>
          </div>

          {/* Bookings Tab Content */}
          {activeTab === 'bookings' && (
            <div className="luxe-card p-6 mb-12 animate-slide-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-bold text-foreground">Bookings</h3>

                <div className="flex flex-wrap gap-3">
                  <select
                    value={filterDays}
                    onChange={(e) => setFilterDays(e.target.value)}
                    className="h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 3 months</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <select
                    value={filterPayment}
                    onChange={(e) => setFilterPayment(e.target.value)}
                    className="h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Payments</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>

                  <select
                    value={filterRoomType}
                    onChange={(e) => setFilterRoomType(e.target.value)}
                    className="h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Rooms</option>
                    <option value="Suite">Suite</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Villa">Villa</option>
                  </select>

                  <select
                    value={filterOrder}
                    onChange={(e) => setFilterOrder(e.target.value)}
                    className="h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>

              {isLoading ? (
                loadingSource === 'tab' ? (
                  <Loader className="py-12" videoSrc={deliverySchedule} />
                ) : (
                  <Loader className="py-12" variant="custom" />
                )
              ) : displayedBookings.length > 0 ? (
                <div className="space-y-4">
                  {displayedBookings.map((booking: any) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                      <div>
                        <p className="font-medium text-foreground">{booking.hotelName}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.guestName} • {booking.roomType} • ${booking.amount}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={booking.status === 'confirmed' ? 'confirmed' : booking.status === 'cancelled' ? 'destructive' : 'secondary'}>
                          {booking.status}
                        </Badge>
                        {booking.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-destructive hover:bg-destructive/90 text-white" onClick={() => handleUpdateBookingStatus(booking.id, 'rejected')}>
                              <X className="w-4 h-4 mr-1" /> Reject
                            </Button>
                            <Button size="sm" className="bg-success hover:bg-success/90 text-white" onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}>
                              <Check className="w-4 h-4 mr-1" /> Approve
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No bookings found for the selected filters.
                </div>
              )}
            </div>
          )}

          {/* Statistics Tab Content */}
          {activeTab === 'statistics' && (
            <div className="luxe-card p-6 mb-12 animate-slide-up">
              {isStatsLoading ? (
                <Loader className="py-12" videoSrc={revenue} />
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-xl font-bold text-foreground">Revenue Overview</h3>
                    <div className="flex gap-3">
                      <select
                        value={chartType}
                        onChange={(e) => handleChartTypeChange(e.target.value as 'bar' | 'pie')}
                        className="h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="pie">Pie Chart</option>
                        <option value="bar">Bar Chart</option>
                      </select>

                      <select
                        value={statsMonths}
                        onChange={(e) => setStatsMonths(e.target.value)}
                        className="h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="3">3 Months</option>
                        <option value="6">6 Months</option>
                        <option value="12">12 Months</option>
                      </select>
                    </div>
                  </div>

                  <div className="w-full min-h-[400px]">
                    <h4 className="text-lg font-semibold mb-6 text-center">Month-wise Revenue Share</h4>

                    {isChartLoading ? (
                      <div className="h-[400px] w-full flex items-center justify-center">
                        <Loader variant="linear" />
                      </div>
                    ) : chartType === 'pie' ? (
                      <RevenuePieChart
                        data={trends}
                        categoryField="month"
                        valueField="revenue"
                        chartId="monthRevenueChart"
                      />
                    ) : (
                      <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={trends}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                            <XAxis
                              dataKey="month"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                              dy={10}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                              tickFormatter={(value) => `$${value / 1000}k`}
                            />
                            <Tooltip
                              cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                              }}
                              itemStyle={{ color: 'hsl(var(--foreground))' }}
                              formatter={(value: number) => [`$${value}`, 'Revenue']}
                            />
                            <Bar
                              dataKey="revenue"
                              fill="hsl(var(--primary))"
                              radius={[4, 4, 0, 0]}
                              maxBarSize={50}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
          {/* Hotels Table */}
          <div className="luxe-card overflow-hidden animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <div className="p-6 border-b border-border">
              <h3 className="text-xl font-bold text-foreground">My Hotels</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Hotel</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground hidden md:table-cell">Location</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Price/Night</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground hidden lg:table-cell">Bookings</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground hidden lg:table-cell">Revenue</th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Status</th>
                    <th className="text-right p-4 text-sm font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hotels.map((hotel) => (
                    <tr key={hotel._id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={hotel.images && hotel.images.length > 0 ? `http://localhost:5000/${hotel.images[0].replace(/\\/g, '/')}` : "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"}
                            alt={hotel.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <span className="font-medium text-foreground">{hotel.title}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">{hotel.address}</td>
                      <td className="p-4 font-semibold text-primary">${hotel.pricePerNight}</td>
                      <td className="p-4 text-muted-foreground hidden lg:table-cell">{hotel.bookingsCount || 0}</td>
                      <td className="p-4 font-semibold text-foreground hidden lg:table-cell">${(hotel.revenue || 0).toLocaleString()}</td>
                      <td className="p-4">
                        <Badge variant={"confirmed"}>
                          Active
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" onClick={() => setEditingHotel(hotel)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDeleteHotel(hotel._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Add/Edit Hotel Modal */}
      {(showAddModal || editingHotel) && (
        <HotelModal
          hotel={editingHotel}
          onClose={() => { setShowAddModal(false); setEditingHotel(null); }}
          onHotelSaved={fetchAllData}
        />
      )}
    </div>
  );
};

const HotelModal = ({ hotel, onClose, onHotelSaved }: { hotel?: any, onClose: () => void, onHotelSaved: () => void }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    price4: "",
    price6: "",
    address: "",
    otherAmenities: "",
  });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const standardAmenities = [
    "Free WiFi", "Free Parking", "Swimming Pool", "Fitness Center", "Room Service", "Smart TV", "Air Conditioning"
  ];

  useEffect(() => {
    if (hotel) {
      setFormData({
        title: hotel.title,
        description: hotel.description,
        price: hotel.pricePerNight,
        price4: hotel.guestRates?.['4'] || "",
        price6: hotel.guestRates?.['6'] || "",
        address: hotel.address,
        otherAmenities: ""
      });
      // Separate standard and other amenities
      const standard = hotel.amenities.filter((a: string) => standardAmenities.includes(a));
      const others = hotel.amenities.filter((a: string) => !standardAmenities.includes(a));
      setSelectedAmenities(standard);
      setFormData(prev => ({ ...prev, otherAmenities: others.join(', ') }));
    }
  }, [hotel]);

  const handleAmenityChange = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(prev => prev.filter(a => a !== amenity));
    } else {
      setSelectedAmenities(prev => [...prev, amenity]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const otherAmenitiesArray = formData.otherAmenities.split(',').map(a => a.trim()).filter(a => a);
      const allAmenities = [...selectedAmenities, ...otherAmenitiesArray];

      const payload = {
        title: formData.title,
        description: formData.description,
        address: formData.address,
        amenities: allAmenities,
        pricePerNight: Number(formData.price),
        guestRates: {
          2: Number(formData.price),
          4: Number(formData.price4) || Number(formData.price),
          6: Number(formData.price6) || Number(formData.price)
        }
      };

      let res;
      if (hotel) {
        res = await apiClient.put(`/hotels/${hotel._id}`, payload);
        toast.success("Hotel updated successfully!");
      } else {
        res = await apiClient.post('/hotels', payload);
        toast.success("Hotel added successfully!");
      }

      if (images && images.length > 0) {
        const imageFormData = new FormData();
        for (let i = 0; i < images.length; i++) {
          imageFormData.append('images', images[i]);
        }
        await apiClient.post(`/hotels/${res.data._id}/images`, imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      onHotelSaved();
      onClose();
    } catch (error) {
      toast.error(hotel ? "Failed to update hotel" : "Failed to add hotel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">{hotel ? "Edit Hotel" : "Add New Hotel"}</h2>
          <p className="text-muted-foreground text-sm mt-1">{hotel ? "Update property details" : "Fill in the details to list a new property"}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Hotel Name</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Grand Plaza Hotel"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
              placeholder="Describe your property..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Base Price (2 Guests)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="$450"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Location</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="City, Country"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Price (4 Guests)</label>
              <input
                type="number"
                value={formData.price4}
                onChange={(e) => setFormData({ ...formData, price4: e.target.value })}
                className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Price (6 Guests)</label>
              <input
                type="number"
                value={formData.price6}
                onChange={(e) => setFormData({ ...formData, price6: e.target.value })}
                className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Amenities</label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {standardAmenities.map(amenity => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">{amenity}</span>
                </label>
              ))}
            </div>
            <input
              type="text"
              value={formData.otherAmenities}
              onChange={(e) => setFormData({ ...formData, otherAmenities: e.target.value })}
              className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Add others (comma separated)..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Images</label>
            <div className="border-2 border-dashed border-input rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer relative">
              <input
                type="file"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setImages(e.target.files)}
              />
              <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {images && images.length > 0 ? `${images.length} files selected` : "Click to upload images"}
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="luxe" className="flex-1" disabled={loading}>
              {loading ? 'Saving...' : (hotel ? 'Update Hotel' : 'Add Hotel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagerDashboard;
