import { useState } from "react";
import { ImageIcon, Save, Trash2 } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import ImageUploadField from "../../components/admin/ImageUploadField";
import {
  cardClass,
  cardHeaderClass,
  cardTitleClass,
  labelClass,
  primaryButtonClass,
  sampleBadgeClass,
  activeTabClass,
  inactiveTabClass,
  tabClass,
  tabListClass,
} from "../../components/admin/adminClasses";

const tabs = ["Gallery Images", "Tour Video", "Page Banners"] as const;

type Tab = (typeof tabs)[number];

// Sample thumbnails using images that already exist in the project.
const sampleGalleryImages = [
  "/images/about/luxury-rooms.jpeg",
  "/images/about/exclusive-amenities.jpeg",
  "/images/tour-thumbnail.jpg",
  "",
  "",
  "",
];

export default function MediaLibraryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Gallery Images");

  return (
    <>
      <AdminPageHeader
        title="Media Library"
        description="Manage gallery photos, the tour video and page banner images"
      />

      <div className={tabListClass}>
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            aria-pressed={activeTab === tab}
            className={`${tabClass} ${
              activeTab === tab ? activeTabClass : inactiveTabClass
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Gallery Images" && (
        <div className="space-y-6">
          <section className={`${cardClass} p-5`} aria-label="Upload photos">
            <ImageUploadField
              label="Upload new photos"
              hint="JPG, PNG or WebP, several files at once"
              multiple
            />
          </section>

          <section className={cardClass} aria-labelledby="gallery-title">
            <div className={cardHeaderClass}>
              <div className="flex items-center gap-3">
                <h2 id="gallery-title" className={cardTitleClass}>
                  Gallery photos
                </h2>
                <span className={sampleBadgeClass}>Sample</span>
              </div>
            </div>

            <ul className="grid grid-cols-2 gap-4 p-5 md:grid-cols-3 xl:grid-cols-4">
              {sampleGalleryImages.map((image, index) => (
                <li
                  key={index}
                  className="group relative aspect-4/3 overflow-hidden rounded-lg border border-stone-200 bg-stone-100"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={`Sample gallery photo ${index + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon size={28} className="text-stone-400" aria-hidden="true" />
                    </div>
                  )}

                  <button
                    type="button"
                    aria-label={`Delete sample gallery photo ${index + 1}`}
                    className="absolute top-2 right-2 inline-flex cursor-pointer items-center justify-center rounded-lg bg-white/90 p-2 text-stone-600 shadow-sm transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {activeTab === "Tour Video" && (
        <form
          onSubmit={(event) => event.preventDefault()}
          className={cardClass}
          aria-labelledby="video-title"
        >
          <div className={cardHeaderClass}>
            <h2 id="video-title" className={cardTitleClass}>
              Tour video
            </h2>
          </div>

          <div className="grid gap-6 p-5 lg:grid-cols-2">
            <div>
              <span className={labelClass}>Current video</span>
              <video
                controls
                preload="none"
                poster="/images/tour-thumbnail.jpg"
                className="aspect-video w-full rounded-lg bg-black"
              >
                <source src="/videos/tour.mp4" type="video/mp4" />
              </video>
            </div>

            <div className="space-y-5">
              <ImageUploadField
                label="Video file"
                hint="MP4 video"
                accept="video/mp4"
              />
              <ImageUploadField
                label="Thumbnail"
                hint="Shown before the video plays"
                previewSrc="/images/tour-thumbnail.jpg"
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-stone-200 px-5 py-4">
            <button type="submit" className={primaryButtonClass}>
              <Save size={16} aria-hidden="true" />
              Save video
            </button>
          </div>
        </form>
      )}

      {activeTab === "Page Banners" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {["Services page banner", "Contact page banner"].map((banner) => (
            <form
              key={banner}
              onSubmit={(event) => event.preventDefault()}
              className={cardClass}
            >
              <div className={cardHeaderClass}>
                <h2 className={cardTitleClass}>{banner}</h2>
              </div>

              <div className="p-5">
                <ImageUploadField
                  label="Banner image"
                  hint="Wide landscape photo, JPG, PNG or WebP"
                />
              </div>

              <div className="flex justify-end border-t border-stone-200 px-5 py-4">
                <button type="submit" className={primaryButtonClass}>
                  <Save size={16} aria-hidden="true" />
                  Save banner
                </button>
              </div>
            </form>
          ))}
        </div>
      )}
    </>
  );
}
