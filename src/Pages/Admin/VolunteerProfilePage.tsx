// import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useGlobalAuthContext } from '../../Context/AuthContext';

// Child Component
import ProfileMain from '../../Components/Admin/Volunteers/SingleMemberPage/ProfileMain';
// APIs
import {
  getProfileById,
  getEnrolmentsOfVolunteer,
  getAvailabilitiesOfVolunteer,
  reload,
} from '../../CustomHooks/ApiActions';

function VolunteerProfilePage() {
  const { authUser } = useGlobalAuthContext();
  const { id } = useParams();

  // API - Get Profile by ID
  const { data: profileResponse, isLoading } = useQuery({
    queryKey: ['profile', authUser?.accessToken, id],
    queryFn: () => getProfileById(authUser?.accessToken, id as string),
    // onSuccess: (data) => {
    //   console.log(data?.data);
    // },
    onError: (err: any) => {
      reload(err, authUser);
    },
  });

  // API - Get Enrolments by ID
  const { data: enrolmenets } = useQuery({
    queryKey: ['enrolmentsOfVolunteer', id, authUser?.accessToken],
    queryFn: () => getEnrolmentsOfVolunteer(id, authUser?.accessToken),
    // onSuccess: (data) => {
    //   console.log(data);
    // },
    onError: (err: any) => {
      reload(err, authUser);
    },
  });

  // API - Get Availabilities by ID
  const { data: availabilities } = useQuery({
    queryKey: ['availabilities', id, authUser?.accessToken],
    queryFn: () => getAvailabilitiesOfVolunteer(id, authUser?.accessToken),
    // onSuccess: (data) => {
    //   console.log(data);
    // },
    onError: (err: any) => {
      reload(err, authUser);
    },
  });

  if (isLoading) {
    <div className="h-[75vh] flex justify-center items-center">
      <h1>Loading...</h1>
    </div>;
  }
  return (
    <div className="flex flex-col w-full h-auto lg:w-[75vw] px-16 mt-28">
      <ProfileMain
        volunteer={profileResponse?.data.volunteer}
        profile={profileResponse?.data}
        enrolments={enrolmenets?.data}
        availabilities={availabilities?.data}
      />
    </div>
  );
}

export default VolunteerProfilePage;
