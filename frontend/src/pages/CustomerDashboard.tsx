import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";
import { toast } from "sonner";
import apiClient from "@/services/apiClient";
import useAuthStore from "@/store/authStore";

interface Booking {
  id: string;
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: "confirmed" | "pending" | "cancelled";
  totalPrice: number;
  image: string;
}

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const { user } = useAuthStore((state: any) => state);

  const fetchBookings = async () => {
    try {
      const res = await apiClient.get('/bookings');
      setBookings(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id: string) => {
    try {
      await apiClient.put(`/bookings/${id}/cancel`);
      toast.success("Booking cancelled successfully");
      fetchBookings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  const upcomingBookings = bookings.filter((b: any) => b.status !== "cancelled");
  const pastBookings = bookings.filter((b: any) => b.status === "cancelled");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome back, <span className="text-primary">{user?.name}</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your bookings and explore new destinations.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              { label: "Active Bookings", value: upcomingBookings.length, color: "bg-primary/10 text-primary" },
              { label: "Total Spent", value: `$${bookings.reduce((sum, b) => b.status !== "cancelled" ? sum + b.totalAmount : sum, 0).toLocaleString()}`, color: "bg-success/10 text-success" },
              { label: "Loyalty Points", value: "2,450", color: "bg-warning/10 text-warning" },
            ].map((stat, index) => (
              <div
                key={index}
                className="luxe-card p-6 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Bookings Section */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">My Bookings</h2>
              <Link to="/">
                <Button variant="luxe">Book New Stay</Button>
              </Link>
            </div>

            {/* Upcoming Bookings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Upcoming & Active</h3>
              {upcomingBookings.length === 0 ? (
                <div className="luxe-card p-8 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No upcoming bookings</p>
                  <Link to="/">
                    <Button variant="luxe" className="mt-4">Explore Hotels</Button>
                  </Link>
                </div>
              ) : (
                upcomingBookings.map((booking: any, index: number) => (
                  <BookingCard
                    key={booking._id}
                    booking={{
                      id: booking._id,
                      hotelName: booking.hotelId?.title || "Unknown Hotel",
                      location: booking.hotelId?.address || "Unknown Location",
                      checkIn: booking.checkIn,
                      checkOut: booking.checkOut,
                      guests: 2,
                      status: booking.status,
                      totalPrice: booking.totalAmount,
                      image: booking.hotelId?.images?.[0] ? `http://localhost:5000/${booking.hotelId.images[0].replace(/\\/g, '/')}` : "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                    }}
                    onCancel={() => handleCancelBooking(booking._id)}
                    delay={index * 0.1}
                  />
                ))
              )}
            </div>

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-muted-foreground">Past & Cancelled</h3>
                {pastBookings.map((booking, index) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

interface BookingCardProps {
  booking: Booking;
  onCancel?: () => void;
  delay?: number;
}

const BookingCard = ({ booking, onCancel, delay = 0 }: BookingCardProps) => {
  return (
    <div
      className="luxe-card overflow-hidden animate-slide-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-64 h-48 md:h-auto flex-shrink-0">
          <img
            src={booking.image}
            alt={booking.hotelName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div>
              <h4 className="text-xl font-bold text-foreground mb-1">{booking.hotelName}</h4>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{booking.location}</span>
              </div>
            </div>
            <Badge variant={booking.status}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Check-in</p>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{new Date(booking.checkIn).toLocaleDateString()}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Check-out</p>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{new Date(booking.checkOut).toLocaleDateString()}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Guests</p>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{booking.guests} guests</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total</p>
              <span className="text-lg font-bold text-primary">${booking.totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {booking.status !== "cancelled" && onCancel && (
            <div className="flex gap-3">
              <Link to={`/hotel/${booking.id}`}>
                <Button variant="outline" size="sm">View Details</Button>
              </Link>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={onCancel}>
                <X className="w-4 h-4 mr-1" />
                Cancel Booking
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
