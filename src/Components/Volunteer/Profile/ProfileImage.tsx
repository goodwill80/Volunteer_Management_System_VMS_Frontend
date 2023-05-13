import { useEffect, useState } from 'react';
// import { MdAddAPhoto } from 'react-icons/md';
import { useGlobalAuthContext } from '../../../Context/AuthContext';

type Props = {
  photo: string;
  name: string;
  date: string;
  setStatusMsg: React.Dispatch<React.SetStateAction<string>>;
};

function Profile_image({ photo, name, date, setStatusMsg }: Props) {
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://st4.depositphotos.com/4329009/19956/v/450/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg'
  );
  const [photoImg, setPhotoImg] = useState<any>(null);
  const { authUser, uploadProfileImage, isImageLoading } =
    useGlobalAuthContext();

  useEffect(() => {
    if (authUser?.photoURL) {
      setPhotoUrl(() => authUser?.photoURL);
    } else {
      setPhotoUrl(() =>
        photo === '' || !photo
          ? 'https://st4.depositphotos.com/4329009/19956/v/450/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg'
          : photo
      );
    }
  }, [authUser]);

  const handleChange = (e: any) => {
    if (e.target.files[0]) {
      setPhotoImg(e.target.files[0]);
    }
  };
  const handleClick = (e: any) => {
    uploadProfileImage(photoImg, authUser, true);
    setStatusMsg('Processing photo upload...');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative -z-10 w-[170px] h-[170px] rounded-full bg-slate-200">
        <img
          className="w-[170px] h-[170px] rounded-full"
          src={photoUrl}
          alt="profile"
        />
      </div>
      <div className="flex justify-center items-center w-[230px]">
        <input type="file" onChange={handleChange} />
        <button
          disabled={isImageLoading || !photoImg}
          className="cursor-pointer btn btn-secondary btn-xs"
          onClick={handleClick}
        >
          Upload
        </button>
      </div>

      <h1 className="text-2xl font-semibold tracking-wider">{name}</h1>
      <p className="text-md text-purple-700 text-center mt-[-15px]">
        Member since {date?.substring(0, 10)}
      </p>
    </div>
  );
}

export default Profile_image;
