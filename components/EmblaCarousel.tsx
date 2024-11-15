import React, { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

interface Slide {
  id: string;
  area?: string | null;
  nameOfCalamity?: string | null;
  storyText?: string | null;
  image: Buffer | null;
  Barangay?: {
    name: string;
  } | null;
  createdAt: string;
  batchNumber?: string | null;
  controlNumber?: string | null;
  transactionIds?: string | null;
  numberOfRecipients?: number | null;
}

interface EmblaCarouselProps {
  slides: Slide[];
  type: 'calamity' | 'success';
}

export function EmblaCarousel({ slides, type }: EmblaCarouselProps) {
  const autoplayOptions = {
    delay: 5000,
    stopOnInteraction: false, 
    rootNode: (emblaRoot: HTMLElement) => emblaRoot.parentElement,
  };
  
  const [emblaRef] = useEmblaCarousel(
    { loop: true, skipSnaps: false },
    [Autoplay(autoplayOptions)]
  );
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);

  const getImageSrc = (slide: Slide) => {
    if (slide.image) {
      try {
        const base64Image = Buffer.from(slide.image).toString('base64');
        return `data:image/jpeg;base64,${base64Image}`;
      } catch (error) {
        console.error('Error converting image:', error);
        return '/placeholder-image.jpg';
      }
    }
    return '/placeholder-image.jpg';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getModalTitle = (slide: Slide) => {
    if (type === 'calamity') {
      return `Impact from ${slide.nameOfCalamity} | ${slide.Barangay?.name || 'Unknown Location'}`;
    }
    return `${slide.nameOfCalamity ? `${slide.nameOfCalamity} - ` : ''}Story from ${slide.Barangay?.name}${slide.batchNumber ? `: Batch ${slide.batchNumber}` : ''}`;
  };

  return (
    <>
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container">
          {Array.isArray(slides) && slides.map((slide: Slide, index: number) => (
            <div className="embla__slide relative" key={`${slide.id}-${index}`}>
              {/* Image Container */}
              <div className="relative h-[350px] w-full">
                <Image
                  src={getImageSrc(slide)}
                  alt={slide.nameOfCalamity || `Slide ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-image.jpg';
                  }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold">
                      {getModalTitle(slide)}
                    </h3>
                    <span className="text-sm">{formatDate(slide.createdAt)}</span>
                  </div>
                  
                  <p className="text-sm mb-3">
                    {slide.area}
                  </p>
                  
                  <button 
                    onClick={() => setSelectedSlide(slide)}
                    className="btn btn-sm btn-primary text-white"
                  >
                    View Story
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <dialog 
        id="slide_modal" 
        className={`modal ${selectedSlide ? 'modal-open' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedSlide(null);
        }}
      >
        <div className="modal-box max-w-3xl" onClick={e => e.stopPropagation()}>
          {selectedSlide && (
            <>
              <h3 className="font-bold text-lg p-4 bg-primary text-white">
                {getModalTitle(selectedSlide)}
              </h3>
              
              <div className="space-y-4 p-4 rounded-lg">
                {/* Image */}
                <div className="relative h-48 w-full">
                  <Image
                    src={getImageSrc(selectedSlide)}
                    alt={selectedSlide.nameOfCalamity || 'Story Image'}
                    fill
                    className="object-cover rounded-lg shadow-lg"
                  />
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-base-200 p-2 rounded">
                    <span className="font-semibold">Location:</span>
                    <div>{selectedSlide.area}</div>
                  </div>

                  <div className="bg-base-200 p-2 rounded">
                    <span className="font-semibold">Date:</span>
                    <div>{formatDate(selectedSlide.createdAt)}</div>
                  </div>

                  {type === 'success' && (
                    <>
                      {selectedSlide.controlNumber && (
                        <div className="bg-base-200 p-2 rounded">
                          <span className="font-semibold">Control #:</span>
                          <div className="truncate">{selectedSlide.controlNumber}</div>
                        </div>
                      )}

                      {selectedSlide.numberOfRecipients && (
                        <div className="bg-base-200 p-2 rounded">
                          <span className="font-semibold">Recipients:</span>
                          <div>{selectedSlide.numberOfRecipients}</div>
                        </div>
                      )}

                      {selectedSlide.transactionIds && (
                        <div className="bg-base-200 p-2 rounded col-span-2">
                          <span className="font-semibold">Transaction ID:</span>
                          <div 
                            className="truncate hover:cursor-help"
                            title={selectedSlide.transactionIds}
                          >
                            {selectedSlide.transactionIds}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Story Text */}
                {selectedSlide.storyText && (
                  <div className="prose max-w-none">
                    <h4 className="font-semibold mb-2">Story:</h4>
                    <p className="text-sm whitespace-pre-wrap">
                      {selectedSlide.storyText}
                    </p>
                  </div>
                )}
              </div>

              <div className="modal-action mb-4 mr-4">
                <button 
                  className="btn btn-primary text-white"
                  onClick={() => setSelectedSlide(null)}
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setSelectedSlide(null)}>close</button>
        </form>
      </dialog>
    </>
  );
}
