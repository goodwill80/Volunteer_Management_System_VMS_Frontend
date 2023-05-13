import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { SiGooglefit } from 'react-icons/si';
import { useGlobalAuthContext } from '../../../Context/AuthContext';

function HomeHeroHeader() {
  const { authUser } = useGlobalAuthContext();
  const redirect = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center w-[50%]">
      <SiGooglefit className="sm:hidden mt-4" color={'red'} size={120} />
      <h1 className="text-center text-5xl md:text-7xl">
        <span className="text-yellow-400 tracking-wider">Hope </span>
        <span className="text-blue-400 tracking-wider">Center </span>
        <span className="text-red-400 tracking-wider">Singapore</span>
      </h1>
      <p className="text-gray-500 text-lg lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400 text-center">
        To serve all in need and share compassion in hope of a better future! Be
        a volunteer, and join our big family!
      </p>
      {!authUser && (
        <Button
          onClick={() => redirect('/signup')}
          variant="contained"
          size="large"
        >
          Join us!
        </Button>
      )}
    </div>
  );
}

export default HomeHeroHeader;
