import Spinner from '../../../Assets/spinner.gif';
import { useState, useEffect, useCallback } from 'react';

// Child
import ProgramItem from './ProgramItem';

// Type
import { EnrolmentType } from '../../../CustomHooks/TypesAndStates';

type Props = {
  enrolments: EnrolmentType[];
  enrolmentsCopy: EnrolmentType[];
  setEnrolmentsCopy: React.Dispatch<React.SetStateAction<EnrolmentType[]>>;
  isFetched: boolean;
};

function ProgramsListing({
  enrolments,
  enrolmentsCopy,
  setEnrolmentsCopy,
  isFetched,
}: Props) {
  const [loading, setLoading] = useState(false as boolean);
  const [loadingMsg, setLoadingMsg] = useState('' as string);
  const dateReformatter = (date: string) => {
    return new Date(date.split('-').reverse().join('-'));
  };

  const loadMessage = () => {
    setLoadingMsg(() => 'Processing...');
    setTimeout(() => {
      setLoadingMsg(() => 'Still processing and cannot any results!');
    }, 5000);
  };

  const today = new Date();

  const filterOptions = useCallback((option: string) => {
    switch (option) {
      case 'ALL':
        setEnrolmentsCopy(enrolments);
        break;
      case 'ACTIVE':
        const activeEnrolments = enrolments.filter(
          (enrolment) => dateReformatter(enrolment.date as string) >= today
        );
        setEnrolmentsCopy(activeEnrolments);
        break;
      case 'CLOSED':
        const closeEnrolments = enrolments.filter(
          (enrolment) => dateReformatter(enrolment.date as string) <= today
        );
        setEnrolmentsCopy(closeEnrolments);
        break;
      default:
        return;
    }
  }, []);

  useEffect(() => {
    setLoading(() => true);
    const timer = setTimeout(() => {
      setLoading(() => !loading);
    }, 1500);
    return clearTimeout(timer);
  }, [filterOptions]);

  if (!isFetched) {
    return (
      <div className="h-[50vh] flex justify-center items-center">
        <img className="h-[300px] w-[300px]" src={Spinner} alt="Loading" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center items-center pb-4 space-x-2">
        <button
          onClick={() => {
            loadMessage();
            filterOptions('ALL');
          }}
          className="btn btn-primary btn-sm"
        >
          All Programs
        </button>
        <button
          onClick={() => {
            loadMessage();
            filterOptions('ACTIVE');
          }}
          className="btn btn-success text-white btn-sm"
        >
          Active Programs
        </button>
        <button
          onClick={() => {
            loadMessage();
            filterOptions('CLOSED');
          }}
          className="btn text-white btn-error btn-sm"
        >
          Closed Programs
        </button>
      </div>

      {enrolments?.length !== 0 && enrolmentsCopy.length === 0 ? (
        <>
          <div
            className={`${
              !loading ? 'hidden' : 'flex'
            } h-[50vh] flex flex-col justify-center items-center`}
          >
            <img className="h-[300px] w-[300px]" src={Spinner} alt="Loading" />
            <p className="font-bold text-md text-purple-400">{loadingMsg}</p>
          </div>
          <div
            className={`${
              loading ? 'hidden' : 'flex'
            } h-[50vh] justify-center items-center`}
          >
            <h3>No search results</h3>
          </div>
        </>
      ) : (
        // <div className="h-[50vh] flex justify-center items-center">
        //   <img className="h-[300px] w-[300px]" src={Spinner} alt="Loading" />
        // </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
          {enrolmentsCopy?.map((enrolment, index) => (
            <ProgramItem enrolment={enrolment} key={index} />
          ))}
        </div>
      )}
    </>
  );
}

export default ProgramsListing;
