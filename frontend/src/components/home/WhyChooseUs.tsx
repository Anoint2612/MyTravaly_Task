import { Shield, Clock, Award, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Booking",
    description: "Your payments and personal information are always protected with enterprise-grade security.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Our dedicated concierge team is available around the clock to assist with any needs.",
  },
  {
    icon: Award,
    title: "Best Price Guarantee",
    description: "Find a lower price? We'll match it and give you an additional 10% off.",
  },
  {
    icon: HeartHandshake,
    title: "Verified Properties",
    description: "Every hotel is personally inspected to ensure it meets our luxury standards.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Why LuxeStay
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Experience Excellence
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We go above and beyond to ensure every stay exceeds your expectations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-card border border-border/50 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 rounded-2xl luxe-gradient flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
