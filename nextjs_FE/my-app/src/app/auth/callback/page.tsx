"use client";

import { useEffect, useRef } from "react";
import { PageLoader } from "@/components/PageLoader";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";

export default function page() {
  const { error, user, getAccessTokenSilently, logout } = useAuth0();
  const isRegistering = useRef(false);

  const router = useRouter();
  if (error) {
    return (
      <div>
        <h1 id="page-title">Error</h1>
        <div>
          <p id="page-description">
            <span>{error.message}</span>
          </p>
        </div>
      </div>
    );
  }

  const registerUser = async (token: string, name: string, email: string, image: string) => {
    console.log("token", token, "name", name, "email", email, "image", image);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        email: email,
        image: image,
      }),
    });
    return await response.json();
  }

  useEffect(() => {
    const afterLoginFunc = async () => {
        if (!user || isRegistering.current) return;  // Prevent duplicate calls
        isRegistering.current = true;

        try {
        const token = await getAccessTokenSilently();
        const response = await registerUser(token, user?.name!, user?.email!, user?.picture!);
        console.log("response from BE: ", response);
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user_id", response.user_data.id.toString() || "");
        localStorage.setItem("name", response.user_data.name);
        router.replace("/jobsearch");
      } catch (error) {
        logout({
          logoutParams: {
            returnTo: window.location.origin,
          },
        });
      } finally {
        isRegistering.current = false;
      }
    };
    afterLoginFunc();

    return () => {
        isRegistering.current = false;
    };
  }, [user, getAccessTokenSilently, logout, router]);

  return (
    <div className="ml-8">
      <PageLoader />
    </div>
  );
};
