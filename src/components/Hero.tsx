import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "New Collection",
      subtitle: "Exquisite Sarees",
      description: "Discover our latest collection of handcrafted sarees that blend tradition with modern elegance",
      buttonText: "Shop Sarees",
      buttonLink: "/category/sarees",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&h=600&fit=crop"
    },
    {
      id: 2,
      title: "Festive Special",
      subtitle: "Designer Lehengas",
      description: "Make every celebration memorable with our stunning designer lehengas",
      buttonText: "Shop Lehengas",
      buttonLink: "/category/lehengas",
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=1200&h=600&fit=crop"
    },
    {
      id: 3,
      title: "Everyday Elegance",
      subtitle: "Premium Kurtas",
      description: "Comfortable yet stylish kurtas perfect for any occasion",
      buttonText: "Shop Kurtas",
      buttonLink: "/category/kurtas",
      image: "https://images.unsplash.com/photo-1601925794239-8a5a6e0ca2c3?w=1200&h=600&fit=crop"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[70vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            index === currentSlide ? "translate-x-0" : 
            index < currentSlide ? "-translate-x-full" : "translate-x-full"
          }`}
        >
          <div
            className="h-full w-full bg-cover bg-center relative"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30" />
            
            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl text-white">
                  <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <h2 className="text-2xl md:text-3xl font-light mb-6 text-accent">
                    {slide.subtitle}
                  </h2>
                  <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed">
                    {slide.description}
                  </p>
                  <Link to={slide.buttonLink}>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl text-lg px-8 py-3"
                    >
                      {slide.buttonText}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 border-white/30 backdrop-blur-sm hover:bg-white/30"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 border-white/30 backdrop-blur-sm hover:bg-white/30"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;