import Navbar from './Navbar';
// import Footer from './Footer';
import MobileNavbar from './MobileNavbar';
interface Prop {
  children: React.ReactElement;
}

function Layout({ children }: Prop) {
  return (
    <div className="flex flex-col justify-between h-auto min-h-[75vh] md:h-auto relative">
      <MobileNavbar />
      <Navbar />

      {children}
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;
