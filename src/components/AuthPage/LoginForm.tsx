import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { validateEmail, validatePassword } from "../../utils/validations";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";
import { clearError, signIn } from "../../redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import Loading from "../../shared/Loading";
import { useNavigate } from "react-router-dom";

const LoginForm: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: authError } = useSelector(
    (state: RootState) => state.auth
  );
  // const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    if (authError && authError !== "") {
      toast.error(authError);
    }

    return () => {
      dispatch(clearError()); // Clear the error message when the component is unmounted
    };
  }, [authError]);

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      toast.error("Invalid email address");
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    await dispatch(signIn({ email, password })).then((result) => {
      if (signIn.fulfilled.match(result)) {
        toast.success("Login successful!");
        navigate("/dashboard/home");
      }
    });
  };

  return (
    <div className=" flex flex-col gap-7 items-center justify-center">
      {/* the below div contains the login text and the cross button */}
      <div className="flex justify-between items-center w-full py-4 px-5 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-lg font-poppins text-teal-950 dark:text-teal-200">
          LOGIN
        </h1>
      </div>

      {/* the below div contains the login form */}
      <div className="w-full flex flex-col px-5 py-1 dark:bg-gray-800">
        <label className="block text-base font-normal text-teal-900 dark:text-gray-300 pb-1.5">
          Email <span className="text-red-400 text-lg">*</span>
        </label>
        <motion.input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 border border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-100 rounded-sm p-2 w-full outline-none bg-white dark:bg-gray-700"
          whileFocus={{
            borderColor: "#374191",
          }}
          transition={{ duration: 0.3 }}
        />

        <label className="block text-base font-normal text-teal-900 dark:text-gray-300 pb-1.5 pt-4">
          Password <span className="text-red-400 text-lg">*</span>
        </label>
        <div className="relative mb-4">
          <motion.input
            id="password"
            type={passwordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 border border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-100 rounded-sm p-2 w-full outline-none bg-white dark:bg-gray-700"
            whileFocus={{
              borderColor: "#374191",
            }}
            transition={{ duration: 0.3 }}
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute right-3 top-4 text-teal-600 dark:text-teal-300"
          >
            {passwordVisible ? (
              <EyeIcon className="h-5 w-5" />
            ) : (
              <EyeSlashIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        <button
          onClick={handleLogin}
          className="bg-slate-700 rounded-3xl text-white font-semibold hover:bg-opacity-75 transition-colors duration-300 p-2 w-full mb-2 dark:bg-teal-600 dark:hover:bg-teal-700"
        >
          {loading ? <Loading className="text-white mx-auto" /> : "SIGN IN"}{" "}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
