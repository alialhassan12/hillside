import { useState, useEffect, useMemo } from "react";
import { Save } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import ImageUploadField from "../../components/admin/ImageUploadField";
import {
  cardClass,
  cardHeaderClass,
  cardTitleClass,
  inputClass,
  labelClass,
  primaryButtonClass,
  activeTabClass,
  inactiveTabClass,
  tabClass,
  tabListClass,
  skeletonClass,
} from "../../components/admin/adminClasses";
import { useHero, useUpdateHero } from "../../hooks/useHero";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAbout, useUpdateAbout } from "../../hooks/useAbout";
import { useAboutStats, useUpdateAboutStat } from "../../hooks/useAboutStats";
import type { About } from "../../types/about";
import {
  getErrorMessage,
  getValidationErrors,
  isTooLarge,
} from "../../lib/apiErrors";

const tabs = ["Hero", "About Us", "Highlights"] as const;

type Tab = (typeof tabs)[number];

const heroSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255, "Title is too long"),
  subTitle: z
    .string()
    .trim()
    .min(1, "Subtitle is required")
    .max(255, "Subtitle is too long"),
});

type HeroFormValues = z.infer<typeof heroSchema>;

const aboutSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title is too long"),
  text: z.string().trim().min(1, "Text is required"),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

const highlightsSchema = z.object({
  stats: z.array(
    z.object({
      id: z.string(),
      title: z
        .string()
        .trim()
        .min(1, "Title is required")
        .max(255, "Title is too long"),
      description: z.string().trim().min(1, "Description is required"),
    }),
  ),
});

type HighlightsFormValues = z.infer<typeof highlightsSchema>;

const errorTextClass = "mt-1 text-sm text-red-600";
const disabledClass = "disabled:cursor-not-allowed disabled:opacity-50";

export default function HomepageManagementPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Hero");
  const { data: hero, isPending, isError } = useHero();
  const updateHero = useUpdateHero();
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImageError, setHeroImageError] = useState("");
  // Changing the key remounts the file input so it clears.
  const [heroFileKey, setHeroFileKey] = useState(0);

  const {
    data: about = [],
    isPending: isAboutPending,
    isError: isAboutError,
  } = useAbout();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<HeroFormValues>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      title: "",
      subTitle: "",
    },
  });

  useEffect(() => {
    if (!hero) return;

    reset({
      title: hero.title,
      subTitle: hero.subTitle,
    });
  }, [hero, reset]);

  async function onSubmitHero(values: HeroFormValues) {
    // Laravel: hero image max:2048 (KB).
    if (isTooLarge(heroImageFile, 2048)) {
      setHeroImageError("Image must be 2 MB or smaller");
      return;
    }
    setHeroImageError("");

    try {
      await updateHero.mutateAsync({
        title: values.title,
        subTitle: values.subTitle,
        ...(heroImageFile ? { image: heroImageFile } : {}),
      });

      setHeroImageFile(null);
      setHeroFileKey((key) => key + 1);
      toast.success("Hero updated successfully");
    } catch (error) {
      const fieldErrors = getValidationErrors(error);
      if (fieldErrors?.title)
        setError("title", { message: fieldErrors.title[0] });
      if (fieldErrors?.subTitle)
        setError("subTitle", { message: fieldErrors.subTitle[0] });
      if (fieldErrors?.image) setHeroImageError(fieldErrors.image[0]);
      toast.error(getErrorMessage(error, "Failed to update hero"));
    }
  }

  return (
    <>
      <AdminPageHeader
        title="Homepage"
        description="Edit the hero, About Us cards and highlights shown on the homepage"
      />

      <div className={tabListClass}>
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveTab(tab);
              // The hero file input unmounts, so forget its file too.
              setHeroImageFile(null);
              setHeroImageError("");
            }}
            aria-pressed={activeTab === tab}
            className={`${tabClass} ${
              activeTab === tab ? activeTabClass : inactiveTabClass
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Hero" &&
        (isPending ? (
          <div role="status" aria-label="Loading hero" className={cardClass}>
            <div className={cardHeaderClass}>
              <div className={`${skeletonClass} h-5 w-32`} />
            </div>
            <div className="grid gap-5 p-5">
              <div>
                <div className={`${skeletonClass} mb-2 h-4 w-20`} />
                <div className={`${skeletonClass} h-11 w-full rounded-lg`} />
              </div>
              <div>
                <div className={`${skeletonClass} mb-2 h-4 w-20`} />
                <div className={`${skeletonClass} h-11 w-full rounded-lg`} />
              </div>
              <div>
                <div className={`${skeletonClass} mb-2 h-4 w-36`} />
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className={`${skeletonClass} w-full shrink-0 rounded-lg aspect-video sm:w-44`} />
                  <div className={`${skeletonClass} h-24 flex-1 rounded-lg`} />
                </div>
              </div>
            </div>
            <div className="flex justify-end border-t border-stone-200 px-5 py-4">
              <div className={`${skeletonClass} h-10 w-32 rounded-lg`} />
            </div>
          </div>
        ) : isError || !hero ? (
          <p role="alert" className="text-sm text-red-600">
            Failed to load hero information
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmitHero)} className={cardClass}>
            <div className={cardHeaderClass}>
              <h2 className={cardTitleClass}>Hero section</h2>
            </div>

            <div className="grid gap-5 p-5">
              <div>
                <label htmlFor="hero-title" className={labelClass}>
                  Title
                </label>
                <input
                  id="hero-title"
                  {...register("title")}
                  placeholder="Main heading shown over the hero image"
                  className={inputClass}
                />
                {errors.title && (
                  <p className={errorTextClass}>{errors.title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="hero-subtitle" className={labelClass}>
                  Subtitle
                </label>
                <input
                  id="hero-subtitle"
                  {...register("subTitle")}
                  placeholder="Short line shown above the heading"
                  className={inputClass}
                />
                {errors.subTitle && (
                  <p className={errorTextClass}>{errors.subTitle.message}</p>
                )}
              </div>

              <div>
                <ImageUploadField
                  key={heroFileKey}
                  label="Background image"
                  hint="JPG, PNG or WebP, wide landscape photo, up to 2 MB"
                  previewSrc={hero.image_url}
                  onFileChange={setHeroImageFile}
                  selectedFileName={heroImageFile?.name}
                />
                {heroImageError && (
                  <p role="alert" className={errorTextClass}>
                    {heroImageError}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end border-t border-stone-200 px-5 py-4">
              <button
                type="submit"
                disabled={updateHero.isPending}
                className={`${primaryButtonClass} ${disabledClass}`}
              >
                <Save size={16} aria-hidden="true" />
                {updateHero.isPending ? "Saving..." : "Save hero"}
              </button>
            </div>
          </form>
        ))}

      {activeTab === "About Us" && (
        <div className="space-y-6">
          {isAboutPending ? (
            <div role="status" aria-label="Loading About Us cards" className="space-y-6">
              {[0, 1].map((card) => (
                <div key={card} className={cardClass}>
                  <div className={cardHeaderClass}>
              <div className={`${skeletonClass} h-5 w-32`} />
            </div>
                  <div className="grid gap-5 p-5 lg:grid-cols-2">
                    <div className="space-y-5">
                      <div>
                <div className={`${skeletonClass} mb-2 h-4 w-20`} />
                <div className={`${skeletonClass} h-11 w-full rounded-lg`} />
              </div>
                      <div>
                <div className={`${skeletonClass} mb-2 h-4 w-20`} />
                <div className={`${skeletonClass} h-32 w-full rounded-lg`} />
              </div>
                    </div>
                    <div className="space-y-5">
                      <div>
                <div className={`${skeletonClass} mb-2 h-4 w-28`} />
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className={`${skeletonClass} w-full shrink-0 rounded-lg aspect-video sm:w-44`} />
                  <div className={`${skeletonClass} h-24 flex-1 rounded-lg`} />
                </div>
              </div>
                      <div>
                <div className={`${skeletonClass} mb-2 h-4 w-16`} />
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className={`${skeletonClass} w-full shrink-0 rounded-lg aspect-square sm:w-24`} />
                  <div className={`${skeletonClass} h-24 flex-1 rounded-lg`} />
                </div>
              </div>
                    </div>
                  </div>
                  <div className="flex justify-end border-t border-stone-200 px-5 py-4">
              <div className={`${skeletonClass} h-10 w-32 rounded-lg`} />
            </div>
                </div>
              ))}
            </div>
          ) : isAboutError ? (
            <p role="alert" className="text-sm text-red-600">
              Failed to load About Us cards
            </p>
          ) : about.length === 0 ? (
            <p className="text-sm text-stone-500">No About Us cards found</p>
          ) : (
            about.map((item, index) => (
              <AboutCardForm key={item.id} item={item} number={index + 1} />
            ))
          )}
        </div>
      )}

      {activeTab === "Highlights" && <HighlightsForm />}
    </>
  );
}

// One form per card, because each card is saved on its own.
function AboutCardForm({ item, number }: { item: About; number: number }) {
  const updateAbout = useUpdateAbout();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  // Changing the key remounts the file inputs so they clear.
  const [fileInputKey, setFileInputKey] = useState(0);

  const values = useMemo(
    () => ({ title: item.title, text: item.text }),
    [item.title, item.text],
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
    values,
    resetOptions: { keepDirtyValues: true },
  });

  async function onSubmit(formValues: AboutFormValues) {
    if (isTooLarge(imageFile, 2048)) {
      setFileError("Image must be 2 MB or smaller");
      return;
    }
    if (isTooLarge(iconFile, 1048)) {
      setFileError("Icon must be about 1 MB or smaller");
      return;
    }
    setFileError("");

    try {
      await updateAbout.mutateAsync({
        id: item.id,
        title: formValues.title,
        text: formValues.text,
        ...(imageFile ? { image: imageFile } : {}),
        ...(iconFile ? { icon: iconFile } : {}),
      });

      setImageFile(null);
      setIconFile(null);
      setFileInputKey((key) => key + 1);
      toast.success(`Feature card ${number} updated`);
    } catch (error) {
      const fieldErrors = getValidationErrors(error);
      if (fieldErrors?.title)
        setError("title", { message: fieldErrors.title[0] });
      if (fieldErrors?.text) setError("text", { message: fieldErrors.text[0] });
      const fileMessage = fieldErrors?.image?.[0] ?? fieldErrors?.icon?.[0];
      if (fileMessage) setFileError(fileMessage);
      toast.error(
        getErrorMessage(error, `Failed to update feature card ${number}`),
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cardClass}>
      <div className={cardHeaderClass}>
        <h2 className={cardTitleClass}>Feature card {number}</h2>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-2">
        <div className="space-y-5">
          <div>
            <label htmlFor={`about-title-${item.id}`} className={labelClass}>
              Title
            </label>
            <input
              id={`about-title-${item.id}`}
              {...register("title")}
              className={inputClass}
            />
            {errors.title && (
              <p className={errorTextClass}>{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor={`about-text-${item.id}`} className={labelClass}>
              Text
            </label>
            <textarea
              id={`about-text-${item.id}`}
              {...register("text")}
              rows={5}
              className={`${inputClass} resize-y`}
            />
            {errors.text && (
              <p className={errorTextClass}>{errors.text.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <ImageUploadField
            key={`image-${fileInputKey}`}
            label="Image"
            hint="JPG, PNG or WebP, up to 2 MB"
            previewSrc={item.image_url}
            onFileChange={setImageFile}
            selectedFileName={imageFile?.name}
          />

          <ImageUploadField
            key={`icon-${fileInputKey}`}
            label="Icon"
            hint="PNG, SVG or WebP, up to 1 MB"
            previewSrc={item.icon_url}
            previewClassName="aspect-square sm:w-24"
            accept="image/png,image/svg+xml,image/webp"
            onFileChange={setIconFile}
            selectedFileName={iconFile?.name}
          />

          {fileError && (
            <p role="alert" className={errorTextClass}>
              {fileError}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end border-t border-stone-200 px-5 py-4">
        <button
          type="submit"
          disabled={updateAbout.isPending}
          className={`${primaryButtonClass} ${disabledClass}`}
        >
          <Save size={16} aria-hidden="true" />
          {updateAbout.isPending ? "Saving..." : "Save card"}
        </button>
      </div>
    </form>
  );
}

function HighlightsForm() {
  const { data: stats = [], isPending, isError } = useAboutStats();
  const updateAboutStat = useUpdateAboutStat();

  const values = useMemo(
    () => ({
      stats: stats.map(({ id, title, description }) => ({
        id,
        title,
        description,
      })),
    }),
    [stats],
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<HighlightsFormValues>({
    resolver: zodResolver(highlightsSchema),
    values,
    resetOptions: { keepDirtyValues: true },
  });

  async function onSubmit(formValues: HighlightsFormValues) {
    // Only send the highlights that actually changed.
    const changed = formValues.stats
      .map((stat, index) => ({ stat, index }))
      .filter(({ stat }) => {
        // Match by id, never by position.
        const original = stats.find((item) => item.id === stat.id);
        return (
          original &&
          (stat.title !== original.title ||
            stat.description !== original.description)
        );
      });

    if (changed.length === 0) {
      toast.info("No changes to save");
      return;
    }

    const results = await Promise.allSettled(
      changed.map(({ stat }) => updateAboutStat.mutateAsync(stat)),
    );

    results.forEach((result, i) => {
      if (result.status === "fulfilled") return;
      const { index } = changed[i];
      const fieldErrors = getValidationErrors(result.reason);
      if (fieldErrors?.title) {
        setError(`stats.${index}.title`, { message: fieldErrors.title[0] });
      }
      if (fieldErrors?.description) {
        setError(`stats.${index}.description`, {
          message: fieldErrors.description[0],
        });
      }
    });

    const failed = results.filter((r) => r.status === "rejected").length;

    if (failed === 0) {
      toast.success("Highlights updated successfully");
    } else {
      toast.error(`Failed to update ${failed} of ${changed.length} highlights`);
    }
  }

  if (isPending) {
    return (
      <div role="status" aria-label="Loading highlights" className={cardClass}>
        <div className={cardHeaderClass}>
          <div className="space-y-2">
            <div className={`${skeletonClass} h-5 w-32`} />
            <div className={`${skeletonClass} h-4 w-64`} />
          </div>
        </div>
        <ul className="divide-y divide-stone-100">
          {[0, 1, 2, 3].map((row) => (
            <li key={row} className="grid gap-4 p-5 md:grid-cols-[1fr_2fr]">
              <div>
                <div className={`${skeletonClass} mb-2 h-4 w-12`} />
                <div className={`${skeletonClass} h-11 w-full rounded-lg`} />
              </div>
              <div>
                <div className={`${skeletonClass} mb-2 h-4 w-24`} />
                <div className={`${skeletonClass} h-11 w-full rounded-lg`} />
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-end border-t border-stone-200 px-5 py-4">
              <div className={`${skeletonClass} h-10 w-32 rounded-lg`} />
            </div>
      </div>
    );
  }

  if (isError) {
    return (
      <p role="alert" className="text-sm text-red-600">
        Failed to load highlights
      </p>
    );
  }

  if (stats.length === 0) {
    return <p className="text-sm text-stone-500">No highlights found</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cardClass}>
      <div className={cardHeaderClass}>
        <div>
          <h2 className={cardTitleClass}>Highlights bar</h2>
          <p className="mt-1 text-sm text-stone-500">
            The short facts shown in the dark bar under the hero
          </p>
        </div>
      </div>

      <ul className="divide-y divide-stone-100">
        {stats.map((stat, index) => (
          <li
            key={stat.id}
            className="grid gap-4 p-5 md:grid-cols-[1fr_2fr] md:items-start"
          >
            <div>
              <label
                htmlFor={`highlight-title-${stat.id}`}
                className={labelClass}
              >
                Title
              </label>
              <input
                id={`highlight-title-${stat.id}`}
                {...register(`stats.${index}.title`)}
                className={inputClass}
              />
              {errors.stats?.[index]?.title && (
                <p className={errorTextClass}>
                  {errors.stats[index].title.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={`highlight-description-${stat.id}`}
                className={labelClass}
              >
                Description
              </label>
              <input
                id={`highlight-description-${stat.id}`}
                {...register(`stats.${index}.description`)}
                className={inputClass}
              />
              {errors.stats?.[index]?.description && (
                <p className={errorTextClass}>
                  {errors.stats[index].description.message}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-end border-t border-stone-200 px-5 py-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`${primaryButtonClass} ${disabledClass}`}
        >
          <Save size={16} aria-hidden="true" />
          {isSubmitting ? "Saving..." : "Save highlights"}
        </button>
      </div>
    </form>
  );
}
