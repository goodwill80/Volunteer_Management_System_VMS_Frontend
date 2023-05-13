import Family from '../../../Assets/family.jpg';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormLogo from '../Reusables/FormLogo';
import { BsFillSkipBackwardBtnFill } from 'react-icons/bs';
import { useGlobalAuthContext } from '../../../Context/AuthContext';
import { createNewVolunteer } from '../../../CustomHooks/ApiActions';
import Signal from '../../../Assets/signal.gif';
import {
  CredentialType,
  FormInitialState,
} from '../../../CustomHooks/TypesAndStates';

function EnterPasswordForm() {
  const redirect = useNavigate();
  const { createUserWithPwAndEmail, tempForm, setTempForm, authUser } =
    useGlobalAuthContext();
  const [form, setForm] = useState<CredentialType>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // OnChange Form
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // OnSubmit Form
  const onSubmitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (form.email === '' || form.password === '') return;
    createUserWithPwAndEmail(form.email, form.password);
    setIsProcessing(true);
  };

  // Event Listener to confirm if uid is generated
  useEffect(() => {
    if (authUser?.uid) {
      const createNew = async () => {
        await createNewVolunteer(tempForm, authUser?.uid);
      };
      createNew();
      setTempForm(FormInitialState);
      setIsProcessing(false);
      redirect('/signin');
    } else {
      console.log('UID not found');
    }
  }, [authUser]);

  if (isProcessing) {
    return (
      <div className="h-[75vh] flex flex-col justify-center items-center">
        <img className="h-[300px] w-[300px]" src={Signal} alt="Loading" />
        <p className="font-bold">Processing...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center md:flex-row md:space-x-20 w-screen">
        <div className="-z-30 hidden md:block">
          <img
            className={`rounded-tl-extraLarge h-[55vh] w-[100%] -z-30 md:max-w-lg  transition-all duration-3000 cursor-pointer filter ${
              form.email.length > 0 ? 'grayscale-0' : ''
            }  rounded-3xl`}
            src={Family}
            alt="signup"
          />
        </div>
        <div className="p-2 shadow-2xl px-4 py-1 rounded-lg flex justify-center items-center">
          <form onSubmit={onSubmitHandler} className="mt-4">
            <p className="text-center font-semibold text-xl">
              Username and Password Registration
            </p>
            <h1 className="font-semibold text-lg pb-4 md:pl-2 text-gray-500 text-center">
              Impacting lives for the better future!
            </h1>
            <div className="flex flex-col justify-center items-center space-y-8">
              <input
                type="text"
                onChange={onChangeHandler}
                name="email"
                value={form?.email}
                placeholder="Email"
                className="input input-bordered input-info w-[40vw] lg:w-[70vw] max-w-xs"
              />
              <input
                type={`${showPassword ? 'text' : 'password'}`}
                onChange={onChangeHandler}
                name="password"
                value={form?.password}
                placeholder="Password"
                className="input input-bordered input-info  w-[40vw] lg:w-[70vw] max-w-xs"
              />
            </div>
            <div className="flex text-center mt-2">
              <div className="form-group form-check flex justify-center items-center">
                <input
                  type="checkbox"
                  className="form-check-input h-4 w-4 border border-gray-500 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                  id="exampleCheck2"
                  onChange={() => setShowPassword(!showPassword)}
                />
                <label className="form-check-label inline-block text-gray-800 text-lg">
                  <p className="text-xs">Show password</p>
                </label>
              </div>
            </div>
            <div className="flex justify-center items-center mt-8">
              <button className="btn btn-info w-full text-white">
                Sign up
              </button>
            </div>
            <FormLogo />
          </form>
        </div>
      </div>
      <Link to="/signup">
        <div className="flex flex-col justify-center items-center space-x-2 cursor-pointer mt-4 md:mt-0">
          <BsFillSkipBackwardBtnFill size={30} color={'blue'} />
          <p className="hover:text-blue-600 hover:underline tracking-widest">
            Back to previous page
          </p>
        </div>
      </Link>
    </>
  );
}

export default EnterPasswordForm;
