import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { X } from 'lucide-react';
import type { CourseImage } from '@/types/course.types';

interface CourseImageGalleryProps {
  images: CourseImage[];
  open: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export function CourseImageGallery({
  images,
  open,
  onClose,
  initialIndex = 0,
}: CourseImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={image.id}>
                  <div className="flex items-center justify-center bg-black">
                    <img
                      src={image.imageUrl}
                      alt={`Course image ${index + 1}`}
                      className="max-h-[80vh] w-auto object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </>
            )}
          </Carousel>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
