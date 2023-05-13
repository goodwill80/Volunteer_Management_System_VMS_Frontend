import Navbar from './Navbar';
// import Footer from './Footer';

interface Prop {
  children: React.ReactElement;
}

function Layout({ children }: Prop) {
  return (
    <div className="flex flex-col justify-between h-auto min-h-[75vh] md:h-auto relative">
      <Navbar />
      {children}
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;
