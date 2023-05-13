import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalAuthContext } from '../../Context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../../Assets/spinner.gif';

// Child components
import ProfileImage from '../../Components/Volunteer/Profile/ProfileImage';
import CalendarComponent from '../../Components/Volunteer/Profile/Calendar';
import InfoTable from '../../Components/Volunteer/Profile/InfoTable';
import ProfileTable from '../../Components/Volunteer/Profile/ProfileTable';
import ControlButtons from '../../Components/Volunteer/Profile/ControlButtons';

// Modals components
import AvailabilitySelectionModal from '../../Components/Volunteer/Profile/Modals/AvailabilitySelectionModal';
import ProgramsEnrolledModal from '../../Components/Volunteer/Profile/Modals/ProgramsEnrolledModal';
import AvailabilitiesOfVolunteer from '../../Components/Volunteer/Profile/Modals/AvailabilitiesOfVolunteer';

// API actions
import {
  getVolunteerById,
  getAvailabilitiesOfVolunteer,
  getEnrolmentsOfVolunteer,
  reload,
} from '../../CustomHooks/ApiActions';

// Localstorage Hook
import storage from '../../CustomHooks/LocalStorage';

function Profile() {
  const { id } = useParams();
  const [value, onChange] = useState<Date | null | (Date | null)[]>(new Date());
  const { authUser } = useGlobalAuthContext();
  const [statusMsg, setStatusMsg] = useState<string>('');

  const showStatus = (status: string, date: string) => {
    switch (status) {
      case 'mark':
        setStatusMsg(
          () =>
            `Date and timeslot has been marked on ${date}! We'll contact you if there are suitable programs.`
        );
        setTimeout(() => setStatusMsg(() => ''), 2000);
        break;
      case 'unmark':
        setStatusMsg(() => `Date and timeslot has been unmarked!`);
        setTimeout(() => setStatusMsg(() => ''), 2000);
        break;
      default:
        console.log('Something went wrong!');
    }
  };

  // API - get volunteer by id
  const {
    data: volunteer,
    isLoading: volunteerIsLoading,
    // isError: volunteerIsError,
  } = useQuery({
    queryKey: ['volunteer', id, authUser?.accessToken],
    queryFn: () => getVolunteerById(id, authUser?.accessToken),
    refetchInterval: 360000,
    onError: (err: any) => {
      reload(err, authUser);
    },
  });

  // API - get availabilities of a volunteer
  const { data: availabilities } = useQuery({
    queryKey: ['availabilities', id, authUser?.accessToken],
    queryFn: () => getAvailabilitiesOfVolunteer(id, authUser?.accessToken),
    onError: (err) => {
      console.log(err);
      // reload(err, authUser);
    },
  });

  // API - get enrolments of a volunteer
  const { data: enrolments } = useQuery({
    queryKey: ['enrolments', id, authUser?.accessToken],
    queryFn: () => getEnrolmentsOfVolunteer(id, authUser?.accessToken),
    onError: (err) => {
      console.log(err);
      // reload(err, authUser);
    },
  });

  useEffect(() => {
    storage.set('id', volunteer?.data.id || '');
  }, [volunteer?.data]);

  if (volunteerIsLoading)
    return (
      <div className="h-[75vh] flex justify-center items-center">
        <img className="h-[300px] w-[300px]" src={Spinner} alt="Loading" />
      </div>
    );

  return (
    <div className="flex flex-col h-auto lg:h-[75vh] mt-32 lg:flex-row lg:space-x-3">
      {/* Column 1 */}
      <div className="md:px-10 md:py-6">
        <ProfileImage
          photo={volunteer?.data.profilePicture}
          name={volunteer?.data.name}
          date={volunteer?.data.createdAt}
          setStatusMsg={setStatusMsg}
        />
        <CalendarComponent
          value={value}
          onChange={onChange}
          showWeekNumbers={true}
          statusMsg={statusMsg}
        />
      </div>
      {/* Column 2 */}
      <div className="px-28 lg:w-[50%] lg:px-20 space-y-4 mt-2">
        <InfoTable volunteer={volunteer?.data} />
        <ProfileTable volunteer={volunteer?.data} />
        <ControlButtons id={id as string} />
      </div>
      {/* MODALS */}
      <AvailabilitySelectionModal
        value={value}
        availabilities={availabilities?.data}
        id={id}
        showStatus={showStatus}
      />
      <ProgramsEnrolledModal enrolments={enrolments?.data} />
      <AvailabilitiesOfVolunteer availabilities={availabilities?.data} />
    </div>
  );
}

export default Profile;
