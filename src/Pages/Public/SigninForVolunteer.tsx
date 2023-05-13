import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalAuthContext } from '../../Context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import Spinner from '../../Assets/spinner.gif';

// From API actions
import { signInVolunteer } from '../../CustomHooks/ApiActions';

import storage from '../../CustomHooks/LocalStorage';

// Components
import IntroHeader from '../../Components/Public/SigninForm_Volunteer/IntroHeaderVolunteer';
import SigninForm from '../../Components/Public/SigninForm_Volunteer/SigninFormVolunteer';
import FormLogo from '../../Components/Public/Reusables/FormLogo';

// Types & Interface
interface FormType {
  email: string;
  password: string;
}
const initialState: FormType = {
  email: '',
  password: '',
};

// React Functional Component
function SigninForVolunteer() {
  const redirect = useNavigate();
  const {
    signInUserWithPwAndEmail,
    isLoggedIn,
    setIsLoggedIn,
    authUser,
    setUserId,
    setIsUser,
    signout,
  } = useGlobalAuthContext();
  const [form, setForm] = useState<FormType>(initialState);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Form on change
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Timeout
  const timeout = () => setTimeout(() => setErrorMsg(() => ''), 3000);

  // Form on submit - signin user and get uid from firebase
  const onSubmitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (form.email === '' || form.password === '') {
      setIsLoading(false);
      setErrorMsg('Please input all fields above');
      timeout();
      return;
    }

    setIsLoading(() => true);
    signInUserWithPwAndEmail(form.email, form.password)
      .then(() => {
        setForm(initialState);
        storage.set('isLoggedIn', true);
        setIsLoggedIn(true);
        console.log('component signin');
      })
      .catch((err) => {
        console.log('unreachable zone');
        setIsLoading(false);
        setErrorMsg(err?.message);
        timeout();
        setIsUser(false);
        window.localStorage.clear();
        signout();
      });
  };

  // React Query - Function call to signin user in Springboot
  const { mutate } = useMutation({
    mutationFn: signInVolunteer,
    onSuccess: (data) => {
      // console.log(data?.data?.volunteer.id);
      setIsUser(true);
      storage.set('isUser', true);
      const id = data?.data?.volunteer.id;
      setUserId(id);
      setIsLoading(false);
      redirect(`/volunteer/profile/${id}`);
    },
    onError: (err: any) => {
      console.log(err);
      setErrorMsg(err?.message);
      timeout();
      setIsUser(false);
      window.localStorage.clear();
      setIsLoading(false);
      signout();
    },
  });

  useEffect(() => {
    const isLoggedInStatus = storage.get('isLoggedIn') as boolean;
    if (authUser && isLoggedInStatus) {
      mutate(authUser?.uid);
    }
  }, [authUser, isLoggedIn]);

  if (isLoading) {
    return (
      <div className="h-[75vh] flex flex-col justify-center items-center">
        <img className="h-[300px] w-[300px]" src={Spinner} alt="Loading" />
        <p className="font-bold">We are processing your request...</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col py-8 mt-28 w-[100%] h-auto md:h-[75vh] justify-center items-center">
      <div className="flex flex-col justify-center items-center lg:mt-8 space-y-2 p-6 py-4 px-12 border border-gray-200 rounded-md shadow-lg">
        <IntroHeader />
        <div className="flex flex-col justify-center items-center w-full">
          <SigninForm
            onSubmitHandler={onSubmitHandler}
            onChangeHandler={onChangeHandler}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            form={form}
            errorMsg={errorMsg}
          />
          <FormLogo />
        </div>
      </div>
    </div>
  );
}

export default SigninForVolunteer;
