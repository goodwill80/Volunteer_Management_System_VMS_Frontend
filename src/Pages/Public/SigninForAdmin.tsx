import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalAuthContext } from '../../Context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import Spinner from '../../Assets/spinner.gif';

// From API actions
import { signinAdmin } from '../../CustomHooks/ApiActions';
import storage from '../../CustomHooks/LocalStorage';

// Components
import IntroHeader from '../../Components/Public/SigninForm_Admin/IntroHeaderAdmin';
import FormLogo from '../../Components/Public/Reusables/FormLogo';
import SigninAdminForm from '../../Components/Public/SigninForm_Admin/SigninFormAdmin';

// Types & Interface
interface FormType {
  email: string;
  password: string;
}
const initialState: FormType = {
  email: '',
  password: '',
};

function SigninForAdmin() {
  const redirect = useNavigate();
  const {
    signInUserWithPwAndEmail,
    isLoggedIn,
    setIsLoggedIn,
    authUser,
    setIsAdmin,
    signout,
  } = useGlobalAuthContext();
  const [form, setForm] = useState<FormType>(initialState);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Timeout
  const timeout = () => setTimeout(() => setErrorMsg(() => ''), 3000);

  const onSubmitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (form.email === '' || form.password === '') {
      setErrorMsg('Please input all fields above');
      timeout();
      return;
    }

    setIsLoading(true);
    signInUserWithPwAndEmail(form.email, form.password)
      .then(() => {
        storage.set('isLoggedIn', true);
        setIsLoggedIn(true);
      })
      .then(() => setForm(initialState))
      .catch((err) => {
        setErrorMsg(err?.message);
        timeout();
        setIsLoggedIn(false);
        setIsAdmin(false);
        setIsLoading(false);
        window.localStorage.clear();
        signout();
      });
  };

  // React Query
  const { mutate } = useMutation({
    mutationFn: signinAdmin,
    onSuccess: (data) => {
      // console.log(data?.data.role);
      if (data?.data.role === 'ADMIN') {
        storage.set('isAdmin', true);
        setIsAdmin(true);
        setIsLoading(false);
        redirect('/admin/dashboard');
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setIsLoading(false);
        window.localStorage.clear();
        signout();
      }
    },
    onError: (err: any) => {
      setErrorMsg(err?.message);
      timeout();
      setIsLoading(false);
      setIsLoggedIn(false);
      setIsAdmin(false);
      window.localStorage.clear();
      signout();
    },
  });

  useEffect(() => {
    const loggedInStatus = storage.get('isLoggedIn') as boolean;
    if (authUser && loggedInStatus) {
      mutate(authUser?.uid);
    }
    // else {
    //   console.log('There is no uid');
    // }
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
      <div className="flex flex-col justify-center items-center lg:mt-8 space-y-4 p-6 py-10 px-12 border border-gray-200 rounded-md shadow-lg">
        <IntroHeader />
        <SigninAdminForm
          form={form}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          onChangeHandler={onChangeHandler}
          onSubmitHandler={onSubmitHandler}
          errorMsg={errorMsg}
        />
        <div className="flex flex-col justify-center items-center w-full">
          <FormLogo />
        </div>
      </div>
    </div>
  );
}

export default SigninForAdmin;
