import React, { useRef, useState } from 'react';
import { Star, ShoppingCart } from 'lucide-react';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

function ImageWithFallback(props) {
  const [didError, setDidError] = useState(false)
  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, ...rest } = props

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  )
}


export function App() { 
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const customStyles = `
    .preserve-3d {
      transform-style: preserve-3d;
    }
  `;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateYValue = ((x - centerX) / centerX) * 20;
    const rotateXValue = ((centerY - y) / centerY) * 20;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovering(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <style>{customStyles}</style>
      <div className="perspective-[1000px]">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${isHovering ? 'scale(1.05)' : 'scale(1)'}`,
            transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
          }}
          className="w-[300px] sm:w-[350px] bg-white rounded-2xl shadow-2xl overflow-hidden cursor-pointer preserve-3d"
        >
          <div className="relative h-[250px] bg-linear-to-br from-purple-100 to-pink-100 overflow-hidden">
            <div
              style={{
                transform: `translateZ(40px) scale(0.95)`,
              }}
              className="w-full h-full flex items-center justify-center"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
                alt="Premium Wireless Headphones"
                className="w-full h-full object-cover"
              />
            </div>
    
            <div
              style={{
                transform: `translateZ(60px)`,
              }}
              className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md"
            >
              Sale
            </div>
          </div>

          <div className="p-6">
            <div
              style={{
                transform: `translateZ(20px)`,
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-gray-800 flex-1 text-lg font-semibold">
                  Premium Wireless Headphones
                </h2>
                <div className="flex items-center gap-1 ml-2 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-600">4.8</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">
                Experience studio-quality sound with active noise cancellation and 30-hour battery life.
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2 text-xl font-bold">
                  <span className="text-purple-600">$299</span>
                  <span className="text-gray-400 line-through text-sm font-normal">$399</span>
                </div>
                <button
                  style={{
                    transform: `translateZ(30px)`,
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-95 text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}