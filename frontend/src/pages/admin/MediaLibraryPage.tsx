import { useState, type FormEvent } from "react";
import { ImageIcon, Save, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import ImageUploadField from "../../components/admin/ImageUploadField";
import {
  cardClass,
  cardHeaderClass,
  cardTitleClass,
  labelClass,
  primaryButtonClass,
  activeTabClass,
  inactiveTabClass,
  tabClass,
  tabListClass,
} from "../../components/admin/adminClasses";
import {
  useDeleteGalleryImage,
  useGalleryImages,
  useTourVideo,
  useUpdateTourVideo,
  useUpdateTourVideoThumbnail,
  useUploadGalleryImage,
} from "../../hooks/useGallery";
import {
  useServicesBanner,
  useUpdateServicesBanner,
} from "../../hooks/useServiceBanner";
import {
  useContactBanner,
  useUpdateContactBanner,
} from "../../hooks/useContactBanner";
import {
  getErrorMessage,
  getValidationErrors,
  isNotFound,
  isTooLarge,
} from "../../lib/apiErrors";

const tabs = ["Gallery Images", "Tour Video", "Page Banners"] as const;

type Tab = (typeof tabs)[number];

// File limits from Laravel (kilobytes).
const GALLERY_IMAGE_MAX_KB = 1048; // gallery path max:1048
const THUMBNAIL_MAX_KB = 1048; // thumbnail update max:1048
const BANNER_MAX_KB = 5048; // banner max:5048
const VIDEO_MAX_KB = 64 * 1024; // server upload limit, 64 MB in php.ini
const VIDEO_TYPES = ["video/mp4", "video/mpeg", "video/quicktime"];

const errorTextClass = "mt-1 text-sm text-red-600";
const disabledClass = "disabled:cursor-not-allowed disabled:opacity-50";

// The first message Laravel sent for any field, if any.
function firstFieldError(error: unknown) {
  const fieldErrors = getValidationErrors(error);
  return fieldErrors ? Object.values(fieldErrors)[0]?.[0] : undefined;
}

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

      {activeTab === "Gallery Images" && <GalleryImagesTab />}
      {activeTab === "Tour Video" && <TourVideoTab />}
      {activeTab === "Page Banners" && <PageBannersTab />}
    </>
  );
}

function GalleryImagesTab() {
  const { data: images = [], isPending, isError, error } = useGalleryImages();
  const uploadImage = useUploadGalleryImage();
  const deleteImage = useDeleteGalleryImage();

  const [files, setFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  // Changing the key remounts the file input so it clears.
  const [fileInputKey, setFileInputKey] = useState(0);

  async function onUpload() {
    if (files.length === 0) {
      setUploadError("Choose at least one photo");
      return;
    }

    const tooLarge = files.filter((file) =>
      isTooLarge(file, GALLERY_IMAGE_MAX_KB),
    );
    if (tooLarge.length > 0) {
      setUploadError(
        `Each photo must be about 1 MB or smaller: ${tooLarge
          .map((file) => file.name)
          .join(", ")}`,
      );
      return;
    }
    setUploadError("");

    setIsUploading(true);
    const results = await Promise.allSettled(
      files.map((file) => uploadImage.mutateAsync(file)),
    );
    setIsUploading(false);

    // Keep only the files that failed, so they can be retried.
    const failedFiles = files.filter(
      (_, index) => results[index].status === "rejected",
    );
    const uploaded = files.length - failedFiles.length;

    if (uploaded > 0) {
      toast.success(
        uploaded === 1 ? "Photo uploaded" : `${uploaded} photos uploaded`,
      );
    }

    if (failedFiles.length > 0) {
      const firstFailure = results.find(
        (result) => result.status === "rejected",
      ) as PromiseRejectedResult;
      const message =
        firstFieldError(firstFailure.reason) ??
        getErrorMessage(firstFailure.reason, "Upload failed");
      setUploadError(
        `${failedFiles.length} photo(s) failed: ${message}. Choose them again to retry.`,
      );
      toast.error(`${failedFiles.length} photo(s) failed to upload`);
    }

    setFiles([]);
    setFileInputKey((key) => key + 1);
  }

  async function onDelete(id: string, number: number) {
    if (!window.confirm(`Delete gallery photo ${number}?`)) return;

    try {
      await deleteImage.mutateAsync(id);
      toast.success("Photo deleted");
    } catch (deleteError) {
      toast.error(getErrorMessage(deleteError, "Failed to delete photo"));
    }
  }

  // The API answers 404 when the gallery is empty.
  const isEmpty = images.length === 0 || isNotFound(error);

  return (
    <div className="space-y-6">
      <section className={`${cardClass} p-5`} aria-label="Upload photos">
        <ImageUploadField
          key={fileInputKey}
          label="Upload new photos"
          hint="JPG, PNG or WebP, up to 1 MB each, several files at once"
          multiple
          onFilesChange={setFiles}
          selectedFileName={
            files.length === 0
              ? undefined
              : files.length === 1
                ? files[0].name
                : `${files.length} photos selected`
          }
        />

        {uploadError && (
          <p role="alert" className={errorTextClass}>
            {uploadError}
          </p>
        )}

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onUpload}
            disabled={isUploading || files.length === 0}
            className={`${primaryButtonClass} ${disabledClass}`}
          >
            <Upload size={16} aria-hidden="true" />
            {isUploading ? "Uploading..." : "Upload photos"}
          </button>
        </div>
      </section>

      <section className={cardClass} aria-labelledby="gallery-title">
        <div className={cardHeaderClass}>
          <h2 id="gallery-title" className={cardTitleClass}>
            Gallery photos
          </h2>
          {!isPending && !isEmpty && (
            <span className="text-sm text-stone-500 tabular-nums">
              {images.length} photos
            </span>
          )}
        </div>

        {isPending ? (
          <p className="p-5 text-sm text-stone-500">Loading photos...</p>
        ) : isError && !isNotFound(error) ? (
          <p role="alert" className="p-5 text-sm text-red-600">
            Failed to load gallery photos
          </p>
        ) : isEmpty ? (
          <p className="p-5 text-sm text-stone-500">No gallery photos yet</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 p-5 md:grid-cols-3 xl:grid-cols-4">
            {images.map((image, index) => {
              const isDeleting =
                deleteImage.isPending && deleteImage.variables === image.id;

              return (
                <li
                  key={image.id}
                  className="group relative aspect-4/3 overflow-hidden rounded-lg border border-stone-200 bg-stone-100"
                >
                  {image.path_url ? (
                    <img
                      src={image.path_url}
                      alt={`Gallery photo ${index + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon
                        size={28}
                        className="text-stone-400"
                        aria-hidden="true"
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => onDelete(image.id, index + 1)}
                    disabled={isDeleting}
                    aria-label={`Delete gallery photo ${index + 1}`}
                    className={`absolute top-2 right-2 inline-flex cursor-pointer items-center justify-center rounded-lg bg-white/90 p-2 text-stone-600 shadow-sm transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-red-600 ${disabledClass}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function TourVideoTab() {
  const { data: video, isPending, isError, error } = useTourVideo();
  const updateVideo = useUpdateTourVideo();
  const updateThumbnail = useUpdateTourVideoThumbnail();

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoError, setVideoError] = useState("");
  const [thumbnailError, setThumbnailError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!video) return;

    let hasError = false;
    if (videoFile && !VIDEO_TYPES.includes(videoFile.type)) {
      setVideoError("Video must be MP4, MPEG or MOV");
      hasError = true;
    } else if (isTooLarge(videoFile, VIDEO_MAX_KB)) {
      setVideoError("Video must be 64 MB or smaller");
      hasError = true;
    } else {
      setVideoError("");
    }
    if (isTooLarge(thumbnailFile, THUMBNAIL_MAX_KB)) {
      setThumbnailError("Thumbnail must be about 1 MB or smaller");
      hasError = true;
    } else {
      setThumbnailError("");
    }
    if (hasError) return;

    if (!videoFile && !thumbnailFile) {
      toast.info("Choose a new video or thumbnail first");
      return;
    }

    setIsSaving(true);

    // Two separate endpoints; send only what was chosen.
    if (videoFile) {
      try {
        await updateVideo.mutateAsync({ id: video.id, video: videoFile });
        setVideoFile(null);
        toast.success("Video updated");
      } catch (saveError) {
        setVideoError(firstFieldError(saveError) ?? "");
        toast.error(getErrorMessage(saveError, "Failed to update video"));
      }
    }

    if (thumbnailFile) {
      try {
        await updateThumbnail.mutateAsync({
          id: video.id,
          thumbnail: thumbnailFile,
        });
        setThumbnailFile(null);
        toast.success("Thumbnail updated");
      } catch (saveError) {
        setThumbnailError(firstFieldError(saveError) ?? "");
        toast.error(getErrorMessage(saveError, "Failed to update thumbnail"));
      }
    }

    setIsSaving(false);
  }

  if (isPending) {
    return <p className="text-sm text-stone-500">Loading tour video...</p>;
  }

  if (isError || !video) {
    return (
      <p role="alert" className="text-sm text-stone-500">
        {isNotFound(error)
          ? "No tour video has been uploaded yet"
          : "Failed to load the tour video"}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cardClass} aria-labelledby="video-title">
      <div className={cardHeaderClass}>
        <h2 id="video-title" className={cardTitleClass}>
          Tour video
        </h2>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-2">
        <div>
          <span className={labelClass}>Current video</span>
          <video
            // Reload the player when the video or thumbnail changes.
            key={`${video.video_url}-${video.thumbnail_url}`}
            controls
            preload="none"
            poster={video.thumbnail_url}
            className="aspect-video w-full rounded-lg bg-black"
          >
            <source src={video.video_url} />
          </video>
        </div>

        <div className="space-y-5">
          <div>
            <ImageUploadField
              key={`video-${video.video_url}`}
              label="Video file (optional)"
              hint="MP4, MPEG or MOV, up to 64 MB. Leave empty to keep the current video"
              accept={VIDEO_TYPES.join(",")}
              onFileChange={setVideoFile}
              selectedFileName={videoFile?.name}
            />
            {videoError && (
              <p role="alert" className={errorTextClass}>
                {videoError}
              </p>
            )}
          </div>

          <div>
            <ImageUploadField
              key={`thumb-${video.thumbnail_url}`}
              label="Thumbnail (optional)"
              hint="JPG, PNG or WebP, up to 1 MB. Shown before the video plays"
              previewSrc={video.thumbnail_url}
              onFileChange={setThumbnailFile}
              selectedFileName={thumbnailFile?.name}
            />
            {thumbnailError && (
              <p role="alert" className={errorTextClass}>
                {thumbnailError}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t border-stone-200 px-5 py-4">
        <button
          type="submit"
          disabled={isSaving}
          className={`${primaryButtonClass} ${disabledClass}`}
        >
          <Save size={16} aria-hidden="true" />
          {isSaving
            ? videoFile
              ? "Uploading video..."
              : "Saving..."
            : "Save video"}
        </button>
      </div>
    </form>
  );
}

function PageBannersTab() {
  const servicesBanner = useServicesBanner();
  const contactBanner = useContactBanner();
  const updateServices = useUpdateServicesBanner();
  const updateContact = useUpdateContactBanner();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <BannerForm
        title="Services page banner"
        imageUrl={servicesBanner.data?.services_banner_img_url}
        isPending={servicesBanner.isPending}
        loadError={servicesBanner.error}
        isSaving={updateServices.isPending}
        onSave={(file) => updateServices.mutateAsync(file)}
      />
      <BannerForm
        title="Contact page banner"
        imageUrl={contactBanner.data?.contact_banner_img_url}
        isPending={contactBanner.isPending}
        loadError={contactBanner.error}
        isSaving={updateContact.isPending}
        onSave={(file) => updateContact.mutateAsync(file)}
      />
    </div>
  );
}

function BannerForm({
  title,
  imageUrl,
  isPending,
  loadError,
  isSaving,
  onSave,
}: {
  title: string;
  imageUrl?: string;
  isPending: boolean;
  loadError: unknown;
  isSaving: boolean;
  onSave: (file: File) => Promise<unknown>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  // Changing the key remounts the file input so it clears.
  const [fileInputKey, setFileInputKey] = useState(0);

  // Update needs an existing banner record (Laravel returns 404 otherwise).
  const missing = isNotFound(loadError);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setFileError("Choose a new banner image first");
      return;
    }
    if (isTooLarge(file, BANNER_MAX_KB)) {
      setFileError("Banner must be about 5 MB or smaller");
      return;
    }
    setFileError("");

    try {
      await onSave(file);
      setFile(null);
      setFileInputKey((key) => key + 1);
      toast.success(`${title} updated`);
    } catch (saveError) {
      setFileError(firstFieldError(saveError) ?? "");
      toast.error(getErrorMessage(saveError, `Failed to update ${title.toLowerCase()}`));
    }
  }

  return (
    <form onSubmit={onSubmit} className={cardClass}>
      <div className={cardHeaderClass}>
        <h2 className={cardTitleClass}>{title}</h2>
      </div>

      <div className="p-5">
        {isPending ? (
          <p className="text-sm text-stone-500">Loading banner...</p>
        ) : missing ? (
          <p className="text-sm text-stone-500">
            No banner exists yet, so it can't be updated here
          </p>
        ) : loadError ? (
          <p role="alert" className="text-sm text-red-600">
            Failed to load the banner
          </p>
        ) : (
          <>
            <ImageUploadField
              key={fileInputKey}
              label="Banner image"
              hint="Wide landscape photo, JPG, PNG or WebP, up to 5 MB"
              previewSrc={imageUrl || undefined}
              onFileChange={setFile}
              selectedFileName={file?.name}
            />
            {fileError && (
              <p role="alert" className={errorTextClass}>
                {fileError}
              </p>
            )}
          </>
        )}
      </div>

      <div className="flex justify-end border-t border-stone-200 px-5 py-4">
        <button
          type="submit"
          disabled={isSaving || isPending || Boolean(loadError)}
          className={`${primaryButtonClass} ${disabledClass}`}
        >
          <Save size={16} aria-hidden="true" />
          {isSaving ? "Saving..." : "Save banner"}
        </button>
      </div>
    </form>
  );
}
