import { useRef, useState } from "react";
import type { KeyboardEvent, TouchEvent } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Temporary: the 18 photos shown on the live site (hillside-hotel.com).
// Replace with the Laravel gallery API once the real photos are uploaded there.
const galleryImages = [
  "https://hillside-hotel.com/images/img_6a259cf95f7402.81583771.jpeg",
  "https://hillside-hotel.com/images/img_6a259d093b42c5.01664599.jpeg",
  "https://hillside-hotel.com/images/img_6a259d251d72e3.63503449.jpeg",
  "https://hillside-hotel.com/images/img_6a259d3810c5b1.44242852.jpeg",
  "https://hillside-hotel.com/images/img_6a259d46a41167.67067248.jpeg",
  "https://hillside-hotel.com/images/img_6a259d53daadc5.23564029.jpeg",
  "https://hillside-hotel.com/images/img_6a9d6a78882619.25769893.jpeg",
  "https://hillside-hotel.com/images/img_6a9d6a866b03e9.02375788.jpeg",
  "https://hillside-hotel.com/images/img_6a9d6a9e351856.94708288.jpeg",
  "https://hillside-hotel.com/images/img_6a9d6ad366dad0.72054845.jpeg",
  "https://hillside-hotel.com/images/img_6a9d6af93da1d2.63609993.jpeg",
  "https://hillside-hotel.com/images/img_6a9d6b09555059.39661170.jpeg",
  "https://hillside-hotel.com/images/img_6a9d6b1a78a122.79420521.jpeg",
  "https://hillside-hotel.com/images/img_6a9d6b26d030d1.61065604.jpeg",
  "https://hillside-hotel.com/images/img_6a9d6b38dfb9d4.81454455.jpeg",
  "https://hillside-hotel.com/images/img_6a9d6b539dd7d8.62523818.jpeg",
  "https://hillside-hotel.com/images/img_6a9d6ba81a42a4.58606854.jpg",
  "https://hillside-hotel.com/images/img_6a9d6c09cc86a4.45719727.jpeg",
];

const SWIPE_DISTANCE = 50;

export default function GallerySection() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const total = galleryImages.length;

  function openImage(index: number) {
    setSelectedIndex(index);
    dialogRef.current?.showModal();
  }

  function closeImage() {
    dialogRef.current?.close();
  }

  function showPrevious() {
    setSelectedIndex((current) =>
      current === null ? current : (current - 1 + total) % total,
    );
  }

  function showNext() {
    setSelectedIndex((current) =>
      current === null ? current : (current + 1) % total,
    );
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowLeft") {
      showPrevious();
    } else if (event.key === "ArrowRight") {
      showNext();
    }
  }

  function handleTouchStart(event: TouchEvent<HTMLDialogElement>) {
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDialogElement>) {
    if (touchStartX.current === null) return;

    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (distance > SWIPE_DISTANCE) {
      showPrevious();
    } else if (distance < -SWIPE_DISTANCE) {
      showNext();
    }
  }

  return (
    <section aria-label="Hotel gallery" className="mb-12 px-6">
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {galleryImages.map((image, index) => (
          <li key={image}>
            <button
              type="button"
              onClick={() => openImage(index)}
              aria-label={`Open photo ${index + 1} of ${total}`}
              className="group block h-80 w-full cursor-pointer overflow-hidden rounded-[10px] bg-forest/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <img
                src={image}
                alt={`Hillside Hotel photo ${index + 1} of ${total}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-103"
              />
            </button>
          </li>
        ))}
      </ul>

      {/* Full-screen photo viewer */}
      <dialog
        ref={dialogRef}
        aria-label="Photo viewer"
        onClose={() => setSelectedIndex(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeImage();
          }
        }}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="h-dvh max-h-none w-screen max-w-none items-center justify-center border-0 bg-black/85 p-0 open:flex"
      >
        {selectedIndex !== null && (
          <img
            src={galleryImages[selectedIndex]}
            alt={`Hillside Hotel photo ${selectedIndex + 1} of ${total}`}
            className="max-h-[80dvh] max-w-[90vw] rounded-[10px] object-contain"
          />
        )}

        <p
          aria-live="polite"
          className="absolute top-6 left-6 font-sans text-sm text-white"
        >
          {selectedIndex !== null && `${selectedIndex + 1} / ${total}`}
        </p>

        <button
          type="button"
          onClick={closeImage}
          aria-label="Close photo viewer"
          className="absolute top-4 right-4 cursor-pointer p-2 text-white hover:text-sand"
        >
          <X size={32} />
        </button>

        <button
          type="button"
          onClick={showPrevious}
          aria-label="Previous photo"
          className="absolute bottom-6 left-4 cursor-pointer p-2 text-white hover:text-sand md:top-1/2 md:bottom-auto md:-translate-y-1/2"
        >
          <ChevronLeft size={40} />
        </button>

        <button
          type="button"
          onClick={showNext}
          aria-label="Next photo"
          className="absolute right-4 bottom-6 cursor-pointer p-2 text-white hover:text-sand md:top-1/2 md:bottom-auto md:-translate-y-1/2"
        >
          <ChevronRight size={40} />
        </button>
      </dialog>
    </section>
  );
}
