import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { carouselAPI } from '../services/api';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export const Carousel = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await carouselAPI.getAll();
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching carousel images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false
        }
      }
    ]
  };

  if (loading) {
    return <div className="h-96 bg-gray-200 animate-pulse"></div>;
  }

  if (images.length === 0) {
    return (
      <div className="h-96 bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold">Welcome to Polytechnic College</h2>
          <p className="text-xl mt-2">Excellence in Technical Education</p>
        </div>
      </div>
    );
  }

  return (
    <div className="carousel-container h-96 overflow-hidden rounded-lg shadow-lg">
      <Slider {...settings}>
        {images.map((image) => (
          <div key={image._id} className="relative h-96">
            <img
              src={image.imageUrl}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="w-full px-8 py-6 text-white">
                <h3 className="text-3xl font-bold">{image.title}</h3>
                {image.description && (
                  <p className="text-lg mt-2 text-gray-100">{image.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
