import { AppState, Auth0Provider } from '@auth0/auth0-react';
import React from 'react'
import { useNavigate } from 'react-router-dom';

type Props = {
    children: React.ReactNode;
}

const Auth0ProviderWithNavigate = ({children}: Props) => {
    
    const navigate = useNavigate();
    //const { getAccessTokenSilently } = useAuth0();
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL;
    const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

    if(!domain || !clientId || !redirectUri || !audience){
        throw new Error('unable to initialize auth0');
    }

    const onRedirectcallback = async (appState?: AppState) => {
        navigate(appState?.returnTo || '/auth_callback');
    }

    return(
        <Auth0Provider 
            domain={domain} 
            clientId={clientId} 
            authorizationParams={{
                redirect_uri: redirectUri,
                audience: audience
            }}
            onRedirectCallback={onRedirectcallback}
            >
                {children}
            </Auth0Provider>
    )

}

export default Auth0ProviderWithNavigate