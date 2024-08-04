import { useCreateMyUser } from "@/api/MyUserApi";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const AuthCallbackpage = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const returnTo = queryParams.get('returnTo');
    const { user } = useAuth0();
    const { createUser } = useCreateMyUser();

    const hasCreatedUser = useRef(false);
    useEffect(() => {
        if(user?.sub && user?.email && !hasCreatedUser.current){
            createUser({auth0Id: user.sub, email: user.email});
            hasCreatedUser.current = true;
        }
          navigate(`/${returnTo}`);
    }, [createUser, navigate, user]);

  return <>Loading...</>
}
