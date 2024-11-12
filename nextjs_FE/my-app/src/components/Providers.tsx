"use client";

import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";

export default function Providers({ children }: { children: React.ReactNode }) {

const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN as string;
const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID as string;
const redirectUri = process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL as string;
const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE as string;

  return (
    <>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: redirectUri,
          audience: audience,
        }}
      >
        {children}
      </Auth0Provider>
    </>
  );
}
