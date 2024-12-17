import { FC, useLayoutEffect } from "react";
import LoginForm from "../components/AuthPage/LoginForm";
import { motion } from "framer-motion";
import DarkLogo from "../assets/Psytech.svg";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useNavigate } from "react-router-dom";

const AuthPage: FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  useLayoutEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-800 dark:bg-gray-900 ">
      <img src={DarkLogo} alt="Psytech logo" className="h-12 m-4" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        <LoginForm />
      </motion.div>
    </div>
  );
};

export default AuthPage;
