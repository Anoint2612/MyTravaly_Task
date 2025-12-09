import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Star,
  Wifi,
  Car,
  Waves,
  Dumbbell,
  Coffee,
  Tv,
  Wind,
  Users,
  Calendar,
  ChevronLeft,
  Heart,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";
import { toast } from "sonner";
import apiClient from "@/services/apiClient";
import useAuthStore from "@/store/authStore";

const amenities = [
  { icon: Wifi, label: "Free WiFi" },
  { icon: Car, label: "Free Parking" },
  { icon: Waves, label: "Swimming Pool" },
  { icon: Dumbbell, label: "Fitness Center" },
  { icon: Coffee, label: "Room Service" },
  { icon: Tv, label: "Smart TV" },
  { icon: Wind, label: "Air Conditioning" },
];

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const { user } = useAuthStore((state: any) => state);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await apiClient.get(`/hotels/${id}`);
        setHotel(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchHotel();
  }, [id]);

  if (!hotel) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const images = hotel.images && hotel.images.length > 0
    ? hotel.images.map((img: string) => `http://localhost:5000/${img.replace(/\\/g, '/')}`)
    : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"];

  // Determine price based on guests
  const getPriceForGuests = (count: number) => {
    if (!hotel.guestRates) return hotel.pricePerNight;
    // Map 1-2 -> 2, 3-4 -> 4, 5-6 -> 6
    if (count <= 2) return hotel.guestRates['2'] || hotel.pricePerNight;
    if (count <= 4) return hotel.guestRates['4'] || hotel.pricePerNight;
    return hotel.guestRates['6'] || hotel.pricePerNight;
  };

  const pricePerNight = getPriceForGuests(guests);

  // Calculate nights
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const nights = calculateNights();
  const subtotal = pricePerNight * nights;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + serviceFee;

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      toast.error("Check-in date cannot be in the past");
      return;
    }

    if (end <= start) {
      toast.error("Check-out date must be after check-in date");
      return;
    }
    if (!user) {
      toast.error("Please login to book");
      navigate('/login');
      return;
    }

    try {
      await apiClient.post('/bookings', {
        hotelId: id,
        checkIn,
        checkOut,
        guests
      });
      toast.success("Booking requested! Waiting for approval.");
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Hotels
          </Link>
        </div>

        {/* Gallery */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Main Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
              <img
                src={images[selectedImage]}
                alt="Hotel view"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="w-10 h-10 rounded-full luxe-glass flex items-center justify-center hover:scale-110 transition-transform">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full luxe-glass flex items-center justify-center hover:scale-110 transition-transform">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 gap-4">
              {images.slice(1).map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index + 1)}
                  className={`relative aspect-[4/3] rounded-2xl overflow-hidden transition-all duration-300 ${selectedImage === index + 1 ? "ring-4 ring-primary" : "hover:opacity-90"
                    }`}
                >
                  <img
                    src={img}
                    alt={`Hotel view ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              <button
                onClick={() => setSelectedImage(0)}
                className={`relative aspect-[4/3] rounded-2xl overflow-hidden transition-all duration-300 ${selectedImage === 0 ? "ring-4 ring-primary" : "hover:opacity-90"
                  }`}
              >
                <img
                  src={images[0]}
                  alt="Hotel view 1"
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div className="animate-fade-in">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                      {hotel.title}
                    </h1>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{hotel.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning fill-warning" />
                        <span className="font-semibold text-foreground">4.9</span>
                        <span>(256 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">${pricePerNight}</span>
                  <span className="text-muted-foreground">/ night</span>
                </div>
              </div>

              {/* Description */}
              <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <h2 className="text-xl font-bold text-foreground mb-4">About this property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {hotel.description || "Experience the ultimate luxury getaway. Nestled in a prime location, our hotel offers breathtaking views, world-class amenities, and unparalleled service. Each room is thoughtfully designed with modern elegance and comfort in mind."}
                </p>
              </div>

              {/* Amenities */}
              <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <h2 className="text-xl font-bold text-foreground mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {hotel.amenities && hotel.amenities.length > 0 ? (
                    hotel.amenities.map((amenity: string, index: number) => {
                      const Icon = amenities.find(a => a.label === amenity)?.icon || Star;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 transition-colors hover:bg-secondary"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-medium text-foreground">{amenity}</span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-muted-foreground">No amenities listed.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Booking Widget */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 luxe-card p-6 animate-slide-up">
                <h3 className="text-xl font-bold text-foreground mb-6">Book Your Stay</h3>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Check-in</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="w-full h-11 pl-10 pr-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Check-out</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full h-11 pl-10 pr-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Guests</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full h-11 pl-10 pr-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm appearance-none"
                      >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? "guest" : "guests"}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                {nights > 0 && (
                  <div className="space-y-3 py-4 border-t border-b border-border mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>${pricePerNight} × {nights} nights</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Service fee</span>
                      <span>${serviceFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-foreground pt-2">
                      <span>Total</span>
                      <span className="text-primary">${total.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <Button variant="hero" className="w-full" onClick={handleBooking}>
                  Request Booking
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  You won't be charged yet
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HotelDetails;
