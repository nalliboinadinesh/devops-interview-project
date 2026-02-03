import React, { useEffect, useState } from 'react';
import { bannerAPI } from '../services/api';
import './BannerCarousel.css';

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // Change banner every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await bannerAPI.getActive();
      setBanners(response.data.banners || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (loading || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="banner-carousel">
      <div className="banner-container">
        <img 
          src={currentBanner.imageUrl} 
          alt={currentBanner.title}
          className="banner-image"
          onError={(e) => e.target.src = 'https://via.placeholder.com/1600x600?text=Banner'}
        />

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button 
              onClick={goToPrevious}
              className="banner-nav-btn banner-nav-prev"
              aria-label="Previous banner"
            >
              ‹
            </button>
            <button 
              onClick={goToNext}
              className="banner-nav-btn banner-nav-next"
              aria-label="Next banner"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Dot Indicators */}
      {banners.length > 1 && (
        <div className="banner-dots">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`banner-dot ${index === currentIndex ? 'active' : ''}`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;
