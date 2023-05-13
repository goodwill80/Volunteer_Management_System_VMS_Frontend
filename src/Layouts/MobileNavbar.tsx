import { useNavigate, Link } from 'react-router-dom';
import { useGlobalAuthContext } from '../Context/AuthContext';
import storage from '../CustomHooks/LocalStorage';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { SiGooglefit } from 'react-icons/si';

import { Button } from '@mui/material';

// API actions
import { signOutUser } from '../CustomHooks/ApiActions';

function MobileNavbar() {
  const redirect = useNavigate();
  const {
    openSidebar,
    setOpenSidebar,
    signout,
    authUser,
    setIsLoggedIn,
    setIsAdmin,
    userId,
  } = useGlobalAuthContext();

  const id: number | string = storage.get('id') || userId || '';
  const isAdmin: boolean = (storage.get('isAdmin') as boolean) || false;
  const isUser: boolean = (storage.get('isUser') as boolean) || false;

  // Signout User
  const logoutUser = async () => {
    try {
      await signOutUser(authUser?.uid)
        .then(() => setIsLoggedIn(false))
        .then(() => setIsAdmin(false))
        .then(() => signout())
        .then(() => window.localStorage.clear())
        .then(() => {
          if (isAdmin) {
            redirect('/admin/signin');
          } else {
            redirect('/signin');
          }
        });
      setOpenSidebar(false);
    } catch (err) {
      console.log(err);
    }
  };

  // Dynamic user menu
  const checkForCredentials = () => {
    if (isAdmin) {
      return (
        <>
          <Button onClick={() => redirect('/admin/dashboard')} color="inherit">
            My Dashboard
          </Button>
          <Button onClick={() => redirect('/admin/programs')} color="inherit">
            Programs
          </Button>
          <Button onClick={logoutUser} color="inherit">
            Logout
          </Button>
        </>
      );
    }
    if (isUser) {
      return (
        <>
          <Button
            onClick={() => redirect(`/volunteer/profile/${id}`)}
            color="inherit"
          >
            My Profile
          </Button>
          <button onClick={logoutUser} className="btn btn-sucess btn-sm">
            Sign out
          </button>
        </>
      );
    }
  };

  return (
    <div className="absolute sidebar top-0 min-h-full z-[100] shadow-lg">
      {/* Sidebar */}
      <div
        className={`${
          openSidebar ? 'visible translate-x-0 ' : 'invisible translate-x-full'
        } px-6 overflow-scroll ease-in duration-500 fixed top-0 z-[30] right-0 min-h-full h-[100vh] bg-blue-400 text-teal-50 text-md w-[150px] md:hidden md:z-[50] opacity-90`}
      >
        <div className="flex justify-between items-center mt-4">
          <SiGooglefit size={35} color={'red'} />
          <h2>Hope</h2>
          <AiOutlineCloseCircle
            onClick={() => setOpenSidebar(false)}
            size={25}
            className="hover:text-red-500 cursor-pointer"
          />
        </div>

        {/* Nav */}
        <nav className="mt-12">
          <div className="flex flex-col">
            <div className="flex flex-col justify-center items-center space-y-4">
              {(authUser && isAdmin) || (authUser && isUser) ? (
                checkForCredentials()
              ) : (
                <>
                  <Button
                    onClick={() => redirect('/admin/signin')}
                    color="inherit"
                  >
                    Admin
                  </Button>
                  <Button onClick={() => redirect('/signin')} color="inherit">
                    Signin
                  </Button>
                  <Button onClick={() => redirect('/signup')} color="inherit">
                    Signup
                  </Button>
                </>
              )}
              {/* <Button onClick={logoutUser} color="inherit">
              Logout
            </Button> */}
            </div>
            {/* <button onClick={logoutUser} className="btn btn-sucess btn-sm">
              Sign out
            </button> */}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default MobileNavbar;
