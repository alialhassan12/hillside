type AboutFeatureCardProps = {
  title: string;
  description: string;
  image: string;
  icon: string;
  reversed?: boolean;
};

export default function AboutFeatureCard({
  title,
  description,
  image,
  icon,
  reversed = false,
}: AboutFeatureCardProps) {
  return (
    <article
      className={`flex flex-col gap-4 ${reversed ? "md:flex-col-reverse" : ""}`}
    >
      <img src={image} alt={title} className="h-57.5 w-full object-cover" />

      <div className="flex flex-1 flex-col items-center justify-center rounded-[10px] bg-white p-6 text-center transition-all duration-400 hover:-translate-y-2 hover:bg-ivory hover:shadow-lift">
        <img src={icon} alt="" className="mb-4 h-20 w-20 object-contain" />

        <h3 className="mb-3 font-serif text-[28px] leading-normal text-heading">
          {title}
        </h3>

        <p className="font-sans text-base leading-[1.8] text-body">
          {description}
        </p>
      </div>
    </article>
  );
}
