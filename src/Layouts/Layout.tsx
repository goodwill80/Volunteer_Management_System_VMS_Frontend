import Navbar from './Navbar';
// import Footer from './Footer';
import MobileNavbar from './MobileNavbar';
import { useGlobalAuthContext } from '../Context/AuthContext';
interface Prop {
  children: React.ReactElement;
}

function Layout({ children }: Prop) {
  const { setOpenSidebar } = useGlobalAuthContext();
  return (
    <div className="flex flex-col justify-between h-auto min-h-[75vh] md:h-auto relative">
      <MobileNavbar />
      <Navbar />
      <div onClick={() => setOpenSidebar(false)}>{children}</div>

      {/* <Footer /> */}
    </div>
  );
}

export default Layout;
