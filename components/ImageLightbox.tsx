"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/counter.css";

interface ImageLightboxProps {
  images: {
    id: string;
    url: string;
  }[];
  maxDisplay?: number;
}

export default function ImageLightbox({ 
  images, 
  maxDisplay = 4 
}: ImageLightboxProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  
  // Handle empty image array
  if (!images || images.length === 0) {
    return null;
  }
  
  // Limit images to maxDisplay
  const displayImages = images.slice(0, maxDisplay);
  
  // Format images for lightbox
  const slides = images.map((image) => ({
    src: image.url,
    alt: `Gallery image ${image.id}`,
  }));

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {displayImages.map((image, idx) => (
          <div
            key={image.id}
            className="relative aspect-square rounded-xs overflow-hidden cursor-pointer"
            onClick={() => {
              setIndex(idx);
              setOpen(true);
            }}
          >
            <Image
              src={image.url}
              alt={`Gallery image ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-300"
              priority={idx === 0}
            />
            
            {/* Show count of remaining images if there are more than maxDisplay */}
            {idx === maxDisplay - 1 && images.length > maxDisplay && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-medium text-xl">
                  +{images.length - maxDisplay}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Thumbnails, Zoom, Counter]}
        carousel={{
          finite: images.length <= 1,
        }}
        thumbnails={{
          position: "bottom",
          width: 120,
          height: 80,
          gap: 16,
        }}
        zoom={{
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100,
          doubleClickMaxStops: 2,
          doubleClickDelay: 300,
        }}
        counter={{
          container: {
            style: { bottom: "unset", right: "unset", left: 16, top: 16 },
          },
        }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, .9)" },
        }}
        render={{
          buttonPrev: images.length <= 1 ? () => null : undefined,
          buttonNext: images.length <= 1 ? () => null : undefined,
        }}
      />
    </>
  );
} 