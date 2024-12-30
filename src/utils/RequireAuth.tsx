import { FC, ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { Navigate, useLocation } from "react-router-dom";

interface RequireAuthProps {
    children: ReactNode;
}

const RequireAuth: FC<RequireAuthProps> = ({ children }) => {
    const { user } = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    if (!user) {
        // Redirect to login with a state preserving the intended destination.
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default RequireAuth;
