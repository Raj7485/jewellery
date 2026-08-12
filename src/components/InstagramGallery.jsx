import SectionHeading from "./SectionHeading";
import { galleryImages } from "../data";

export default function InstagramGallery() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Instagram gallery"
          title="A Visual Story of Shine"
          description="A polished grid of jewelry imagery with soft zoom interactions for a premium social-style presentation."
        />

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:auto-rows-[220px]">
          {galleryImages.map((image, index) => (
            <div
              key={image}
              className={`group overflow-hidden rounded-[1.25rem] border border-black/5 bg-white shadow-sm ${
                index === 0 || index === 3 ? "md:row-span-2" : ""
              }`}
            >
              <img
                src={image}
                alt={`Jewelry gallery ${index + 1}`}
                className="h-full min-h-[220px] w-full object-cover transition duration-500 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
