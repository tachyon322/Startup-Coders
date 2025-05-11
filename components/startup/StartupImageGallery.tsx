"use client";

import { useState, memo } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface StartupImageGalleryProps {
  images: {
    id: string;
    url: string;
  }[];
  maxDisplay?: number;
}

// Memoize component to prevent unnecessary re-renders
const StartupImageGallery = memo(function StartupImageGallery({ 
  images, 
  maxDisplay = 4 
}: StartupImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  
  // Early return for empty images
  if (!images || images.length === 0) {
    return null;
  }
  
  // Only display up to maxDisplay images
  const displayImages = images.slice(0, maxDisplay);
  
  // Format images for lightbox
  const slides = images.map((image) => ({
    src: image.url,
    alt: `Image ${image.id}`,
  }));

  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {displayImages.map((image, idx) => (
          <div
            key={image.id}
            className="relative aspect-[16/9] rounded-xs overflow-hidden cursor-pointer"
            onClick={() => {
              setIndex(idx);
              setOpen(true);
            }}
          >
            <Image
              src={image.url}
              alt={`Image ${idx + 1}`}
              fill
              className="object-cover"
              loading={idx === 0 ? "eager" : "lazy"}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            
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
        plugins={[Thumbnails, Zoom]}
        carousel={{
          finite: images.length <= 1,
        }}
        render={{
          buttonPrev: images.length <= 1 ? () => null : undefined,
          buttonNext: images.length <= 1 ? () => null : undefined,
        }}
      />
    </>
  );
});

export default StartupImageGallery; 