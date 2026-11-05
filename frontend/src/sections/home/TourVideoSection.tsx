import { useRef } from "react";
import { Play, X } from "lucide-react";

export default function TourVideoSection() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  function openVideo() {
    dialogRef.current?.showModal();
    videoRef.current?.play().catch(() => {});
  }

  function closeVideo() {
    dialogRef.current?.close();
  }

  function stopVideo() {
    const video = videoRef.current;

    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }

  return (
    <section className="relative flex min-h-175 items-center justify-center overflow-hidden bg-forest">
      <video
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/tour-thumbnail.jpg"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/tour.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-zinc-800/45" />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-24 text-center">
        <p className="font-sans text-[13px] font-bold uppercase tracking-[2px] text-white">
          Watch Our Luxurious Hotel
        </p>

        <h2 className="font-serif text-[64px] leading-none text-white">
          Take A Tour
        </h2>

        {/* <button
          type="button"
          onClick={openVideo}
          aria-label="Play hotel tour video"
          className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-sand transition-transform hover:scale-110"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest text-sand">
            <Play size={23} fill="currentColor" />
          </span>
        </button> */}
        <button
          type="button"
          onClick={openVideo}
          aria-label="Play hotel tour video"
          className="group relative flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-sand transition-transform hover:scale-105"
        >
          <span
            className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-sand/40 motion-reduce:animate-none"
            style={{ animationDelay: "1s" }}
          />

          {/* Main play button */}
          <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-forest text-sand">
            <Play size={23} fill="currentColor" />
          </span>
        </button>
      </div>

      {/* Full video popup */}
      <dialog
        ref={dialogRef}
        onClose={stopVideo}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeVideo();
          }
        }}
        className="m-auto w-[90vw] max-w-225 border-0 bg-transparent p-0 backdrop:bg-black/85"
      >
        <div className="relative">
          <button
            type="button"
            onClick={closeVideo}
            aria-label="Close video"
            className="absolute -top-10 right-0 cursor-pointer text-white"
          >
            <X size={28} />
          </button>

          <video
            ref={videoRef}
            controls
            playsInline
            preload="none"
            poster="/images/tour-thumbnail.jpg"
            className="w-full"
          >
            <source src="/videos/tour.mp4" type="video/mp4" />
            Your browser does not support HTML video.
          </video>
        </div>
      </dialog>
    </section>
  );
}
