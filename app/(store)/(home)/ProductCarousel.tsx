'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
  autoPlay?: boolean;
  interval?: number;
}

export default function Carousel({ slides, autoPlay = true, interval = 5000 }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!autoPlay || slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, slides.length]);

  if (isLoading || slides.length === 0) {
    return <div className="text-center text-gray-500 py-20">Loading carousel...</div>;
  }

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  const goToPrevious = () => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrent(prev => (prev + 1) % slides.length);
  };

  const slide = slides[current];

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white py-4 sm:py-6">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Main carousel container - edge to edge */}
        <div className="relative overflow-hidden rounded-lg bg-gray-50 border border-gray-200">
          <div className="aspect-[16/4] flex items-center justify-center bg-white">
            {slide.image ? (
              <Image
                src={slide.image}
                alt={slide.title}
                width={1400}
                height={525}
                className="object-cover w-full h-full"
                priority={current === 0}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-400 text-sm">No image available</span>
              </div>
            )}
          </div>

          {/* Slide info overlay - subtle and minimal */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 sm:p-6">
            <div className="max-w-lg">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 leading-tight">
                {slide.title}
              </h3>
              {slide.description && (
                <p className="text-xs sm:text-sm text-gray-200 mb-3 line-clamp-2">
                  {slide.description}
                </p>
              )}
              <Link href={slide.buttonLink}>
                <button className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm py-2 px-5 rounded-md transition-colors duration-200 hover:shadow-md">
                  {slide.buttonText || 'Shop Now'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </Link>
            </div>
          </div>

          {/* Previous button - subtle */}
          <button
            onClick={goToPrevious}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all duration-200 z-10 hover:shadow-lg"
            aria-label="Previous slide"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Next button - subtle */}
          <button
            onClick={goToNext}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all duration-200 z-10 hover:shadow-lg"
            aria-label="Next slide"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Dots indicator - modern minimal style */}
        <div className="flex justify-center gap-1.5 mt-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === current
                  ? 'bg-gray-800 w-8 h-1.5 rounded-full'
                  : 'bg-gray-300 hover:bg-gray-400 w-2 h-1.5 rounded-full'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === current}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
