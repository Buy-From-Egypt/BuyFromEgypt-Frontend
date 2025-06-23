'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  productId: string;
}

interface ProductGalleryProps {
  images: ProductImage[];
  className?: string;
}

export function ProductGallery({ images, className }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // If no images, show a placeholder
  if (!images || images.length === 0) {
    return (
      <div className={cn("bg-gray-100 rounded-lg flex items-center justify-center aspect-square", className)}>
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  // Ensure we have at least one image (use the first one as fallback if none is marked as primary)
  const primaryImage = images.find(img => img.isPrimary) || images[0];
  const currentImage = images[currentImageIndex] || primaryImage;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={currentImage.url}
          alt="Product image"
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                "relative h-16 w-16 min-w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all",
                currentImageIndex === index ? "border-primary" : "border-transparent"
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                width={64}
                height={64}
                className="h-full w-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
