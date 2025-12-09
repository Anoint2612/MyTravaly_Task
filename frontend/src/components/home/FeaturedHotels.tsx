import { useEffect, useState } from "react";
import apiClient from "@/services/apiClient";
import HotelCard from "./HotelCard";

const FeaturedHotels = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await apiClient.get('/hotels');
        setHotels(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchHotels();
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Featured Properties
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Discover Our Finest Stays
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked luxury accommodations offering exceptional experiences and world-class amenities.
          </p>
        </div>

        {/* Hotel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels.map((hotel: any, index) => (
            <div
              key={hotel._id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <HotelCard
                id={hotel._id}
                title={hotel.title}
                location={hotel.address}
                price={hotel.pricePerNight}
                rating={4.8}
                image={hotel.images && hotel.images.length > 0 ? `http://localhost:5000/${hotel.images[0].replace(/\\/g, '/')}` : "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"}
              />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a href="/hotels">
            <button className="px-8 py-4 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              View All Hotels
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedHotels;
