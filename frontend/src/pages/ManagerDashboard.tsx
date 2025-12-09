import { useEffect, useState } from "react";
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
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";
import { toast } from "sonner";
import apiClient from "@/services/apiClient";
import useAuthStore from "@/store/authStore";

const ManagerDashboard = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState<any>(null);
  const { user } = useAuthStore((state: any) => state);

  const fetchData = async () => {
    try {
      const [hotelsRes, metricsRes, bookingsRes] = await Promise.all([
        apiClient.get('/hotels'),
        apiClient.get('/metrics/manager'),
        apiClient.get('/bookings')
      ]);

      // Filter hotels by creator
      const myHotels = hotelsRes.data.filter((h: any) => h.createdBy?._id === user?._id || h.createdBy === user?._id);
      setHotels(myHotels);
      setMetrics(metricsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleDeleteHotel = async (id: string) => {
    if (confirm("Are you sure you want to delete this hotel?")) {
      try {
        await apiClient.delete(`/hotels/${id}`);
        setHotels(prev => prev.filter(h => h._id !== id));
        toast.success("Hotel deleted successfully");
        fetchData(); // Refresh metrics
      } catch (error) {
        toast.error("Failed to delete hotel");
      }
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      await apiClient.put(`/bookings/${id}/status`, { status });
      toast.success(`Booking ${status}`);
      fetchData();
    } catch (error) {
      toast.error("Failed to update booking status");
    }
  };

  const totalRevenue = metrics?.totalRevenue || 0;
  const totalBookings = metrics?.totalBookings || 0;
  const occupancyRate = metrics?.occupancyRate || 0;

  const pendingBookings = bookings.filter(b => b.status === 'pending');

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

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                label: "Total Revenue",
                value: `$${totalRevenue.toLocaleString()}`,
                change: "+12.5%",
                icon: DollarSign,
                color: "text-success",
                bgColor: "bg-success/10"
              },
              {
                label: "Total Bookings",
                value: totalBookings.toString(),
                change: "+8.2%",
                icon: Calendar,
                color: "text-primary",
                bgColor: "bg-primary/10"
              },
              {
                label: "Active Bookings",
                value: (metrics?.activeBookings || 0).toString(),
                change: "Current",
                icon: TrendingUp,
                color: "text-warning",
                bgColor: "bg-warning/10"
              },
              {
                label: "Active Properties",
                value: hotels.filter(h => h.status === "active").length.toString(),
                change: "Stable",
                icon: Building,
                color: "text-muted-foreground",
                bgColor: "bg-muted"
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="luxe-card p-6 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className="text-sm font-medium text-success">{stat.change}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Pending Bookings Section */}
          {pendingBookings.length > 0 && (
            <div className="luxe-card p-6 mb-12 animate-slide-up">
              <h3 className="text-xl font-bold text-foreground mb-4">Pending Bookings</h3>
              <div className="space-y-4">
                {pendingBookings.map((booking: any) => (
                  <div key={booking._id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                    <div>
                      <p className="font-medium text-foreground">{booking.hotelId?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.userId?.name} • {booking.nights} nights • ${booking.totalAmount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => handleUpdateBookingStatus(booking._id, 'rejected')}>
                        <X className="w-4 h-4 mr-1" /> Reject
                      </Button>
                      <Button size="sm" className="bg-success hover:bg-success/90 text-white" onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')}>
                        <Check className="w-4 h-4 mr-1" /> Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
          onHotelSaved={fetchData}
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
