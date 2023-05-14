// Components - in public folder
import HomeHeroImage from '../../Components/Public/Home/HomeHeroImage';
import HomeHeroHeader from '../../Components/Public/Home/HomeHeroHeader';
import Footer from '../../Layouts/Footer';

function Home() {
  return (
    <>
      <div className="w-auto h-full py-24 px-12 border border-black">
        <div className="flex flex-col space-x-12 xl:flex-row justify-center items-center">
          <HomeHeroHeader />
          <HomeHeroImage />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
