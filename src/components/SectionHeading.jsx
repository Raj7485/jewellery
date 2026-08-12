export default function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-gold-700">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-sm leading-7 text-stone-600 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
