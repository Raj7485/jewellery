import Hero from "../components/Hero";
import FeaturedCategories from "../components/FeaturedCategories";
import FeaturedProducts from "../components/FeaturedProducts";
import NewCollection from "../components/NewCollection";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import InstagramGallery from "../components/InstagramGallery";
import Newsletter from "../components/Newsletter";

export default function HomePage({ onNavigateLogin, onNavigateProduct }) {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts
        onNavigateLogin={onNavigateLogin}
        onNavigateProduct={onNavigateProduct}
      />
      <NewCollection />
      <WhyChooseUs />
      <Testimonials />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
