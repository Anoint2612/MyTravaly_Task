import { MapPin, Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HotelCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  isFavorite?: boolean;
}

const HotelCard = ({ id, title, location, price, rating, image, isFavorite = false }: HotelCardProps) => {
  return (
    <div className="group luxe-card overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Favorite button */}
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full luxe-glass flex items-center justify-center transition-all duration-300 hover:scale-110">
          <Heart className={cn(
            "w-5 h-5 transition-colors",
            isFavorite ? "fill-destructive text-destructive" : "text-foreground"
          )} />
        </button>

        {/* Rating badge */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-foreground/80 backdrop-blur-sm flex items-center gap-1">
          <Star className="w-4 h-4 text-warning fill-warning" />
          <span className="text-sm font-semibold text-primary-foreground">{rating}</span>
        </div>

        {/* Price tag - visible on hover */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <Link to={`/hotel/${id}`}>
            <Button variant="glass" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>
        
        <div className="flex items-center gap-1 text-muted-foreground mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">${price}</span>
            <span className="text-sm text-muted-foreground"> / night</span>
          </div>
          <Link to={`/hotel/${id}`}>
            <Button variant="luxe" size="sm">
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
