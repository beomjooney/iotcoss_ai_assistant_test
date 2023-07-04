import LatestNewsOne from '../../components/blogs/LatestNewsOne';
import Contact from '../../components/contact/Contact';
import FeatureImgThree from '../../components/features/FeatureImgThree';
import Features from '../../components/features/Features';
import Footer from '../../components/layout/footer/Footer';
import Navbar from '../../components/layout/header/Navbar';
import Layout from '../../components/layout/Layout';
import Subsribe from '../../components/newsletter/Subsribe';
import Price from '../../components/prices/Price';
import Promo from '../../components/promo/Promo';
import VideoPromo from '../../components/promo/VideoPromo';
import Screenshot from '../../components/screenshot/Screenshot';
import Team from '../../components/team/Team';
import BrandCarousel from '../../components/testimonial/BrandCarousel';
import HeroThree from './HeroThree';

export default function HomeThree() {
  return (
    <Layout>
      <Navbar />
      <HeroThree />
      <Promo />
      <Features />
      <FeatureImgThree />
      <VideoPromo />
      <Price />
      <Screenshot hasBg />
      <LatestNewsOne bgColor="primary-bg" />
      <Team />
      <Contact bgColor />
      <BrandCarousel />
      <Subsribe />
      <Footer space />
    </Layout>
  );
}
