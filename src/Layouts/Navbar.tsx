import { Link, useNavigate } from 'react-router-dom';
import { useGlobalAuthContext } from '../Context/AuthContext';
import storage from '../CustomHooks/LocalStorage';

// API actions
import { signOutUser } from '../CustomHooks/ApiActions';

// MUI Elements
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Stack,
  Button,
  Container,
  Box,
} from '@mui/material';

// React Icons
import { SiGooglefit } from 'react-icons/si';
import { RxHamburgerMenu } from 'react-icons/rx';
import { MdOutlineMailLock } from 'react-icons/md';
import { BsFacebook } from 'react-icons/bs';
import { AiFillTwitterCircle } from 'react-icons/ai';
import { AiFillInstagram } from 'react-icons/ai';

function Navbar() {
  const redirect = useNavigate();
  const {
    signout,
    authUser,
    setIsLoggedIn,
    setIsAdmin,
    userId,
    setOpenSidebar,
    openSidebar,
  } = useGlobalAuthContext();

  // Redirect function for links
  const linkTo = (href: string) => {
    return redirect(href);
  };

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
    } catch (err) {
      console.log(err);
    }
  };

  const checkForCredentials = () => {
    if (isAdmin) {
      return (
        <>
          <Button onClick={() => linkTo('/admin/dashboard')} color="inherit">
            My Dashboard
          </Button>
          <Button onClick={() => linkTo('/admin/programs')} color="inherit">
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
            onClick={() => linkTo(`/volunteer/profile/${id}`)}
            color="inherit"
          >
            My Profile
          </Button>
          <Button onClick={logoutUser} color="inherit">
            Logout
          </Button>
        </>
      );
    }
  };

  return (
    <Container className="block z-10" disableGutters>
      <AppBar position="fixed" color={'inherit'}>
        <Box className="bg-blue-600 h-[40px] flex justify-between items-center px-5 sm:px-10 md:px-15 py-1">
          <div className="flex justify-center items-center">
            <MdOutlineMailLock color={'white'} size={20} />
            <Typography
              className="tracking-wider"
              variant="body2"
              sx={{ marginLeft: '10px', color: 'white' }}
            >
              hopeforlife@hope.sg
            </Typography>
          </div>
          <div className="flex justify-center items-baseline space-x-2">
            <BsFacebook color={'white'} size={20} />
            <AiFillTwitterCircle color={'white'} size={22} />
            <AiFillInstagram color={'white'} size={22} />
          </div>
        </Box>
        <Toolbar className="px-4">
          <IconButton
            onClick={() => linkTo('/')}
            size={'large'}
            edge="start"
            color="inherit"
            aria-label="logo"
          >
            <SiGooglefit color={'red'} size={35} />
          </IconButton>
          <Typography
            onClick={() => linkTo('/')}
            className="font-bold text-blue-600 text-3xl cursor-pointer"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Hope For Life
          </Typography>

          {/* Links on the right of Navbar */}
          <Stack direction="row" spacing={2} className="hidden md:flex">
            {(authUser && isAdmin) || (authUser && isUser) ? (
              checkForCredentials()
            ) : (
              <>
                <Button onClick={() => linkTo('/admin/signin')} color="inherit">
                  Admin
                </Button>
                <Button onClick={() => linkTo('/signin')} color="inherit">
                  Signin
                </Button>
                <Button onClick={() => linkTo('/signup')} color="inherit">
                  Signup
                </Button>
              </>
            )}
            {/* <Button onClick={logoutUser} color="inherit">
              Logout
            </Button> */}
            <div className="p-1 px-2 bg-red-500 text-white font-semibold flex justify-center items-center">
              <Link className="text-white no-underline font-normal" to="/">
                Donate
              </Link>
            </div>
          </Stack>
          <Stack
            onClick={() => setOpenSidebar(!openSidebar)}
            direction={'row'}
            className="md:hidden cursor-pointer"
          >
            <RxHamburgerMenu size={30} color={'darkblue'} />
          </Stack>
        </Toolbar>
      </AppBar>
    </Container>
  );
}

export default Navbar;
