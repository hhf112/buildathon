"use client";
import React, { useEffect } from "react";
import { useRef, useState, useContext } from "react"
import { sessionContext, SessionContextProvider, type sessionContextType } from "@/contexts/SessionContextProvider";
import { dataContext } from "@/contexts/DataContextProvider";

import { Disclaimer, TypeLoginButton } from "./components";
import { useRouter } from "next/navigation";
import { LoginSignUp } from "./LoginSignUp";
import Link from "next/link";

const authentication: string = "api/auth";

export default function Auth() {
  /* use */
  const { Logout, setUser, setSessionToken, Fetch, sessionToken, user } = useContext<sessionContextType>(sessionContext);
  const router = useRouter();

  const { data }: { data: any } = useContext(dataContext);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const numberInputRef = useRef<HTMLInputElement>(null);
  const radioInputRef = useRef<HTMLInputElement>(null);


  /* states */
  const [login, setLogin] = useState<boolean>(true);
  const [signUp, setSignUp] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<{
    message: string,
    color: string,
  }>({
    message: "",
    color: "amber",
  });
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    if (sessionToken) router.push(data || '/profile');
  }, [sessionToken]);

  /*functions*/
  async function Submit() {
    const number = numberInputRef.current?.value;
    const email = emailInputRef.current?.value;
    const password = passwordInputRef.current?.value;

    const req = authentication + (login ? "" : "/register");
    const timeout = setTimeout(() => setErrMsg({ message: "It is taking longer than usual please wait!", color: "amber" }),
      5000)
    setErrMsg({
      message: "Loading ...",
      color: "amber",
    })

    const post = await fetch(req, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "authorization": `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        number: number,
        email: email,
        password: password,
        access: radioInputRef.current?.value == "customer" ? 1 : 0
      }),
      credentials: "include",
    })

    clearTimeout(timeout);
    const postJSON = await post.json();

    if (!post.ok) {
      setErrMsg({
        message: postJSON.message,
        color: "amber"
      });
      return;
    }
    setErrMsg({
      message: "",
      color: "amber",
    });

    if (login) {
      if (postJSON.user.access == 1) {
        router.push("/admin");
      } else router.push(data || '/');
      setSessionToken(postJSON.accessToken);
      setUser(postJSON.user);
    } if (signUp) {
      setErrMsg({
        message: "Account successfully created. Login to continue.",
        color: "green",
      })
    }
  }

  /* component */
  // console.log(sessionToken);
  return (
    <div className="flex flex-col justify-center items-center h-screen"> {/*BG*/}
      <div className="fixed w-auto h-auto top-0  my-2.5 mx-2.5">
        <img src="/brokerboots.jpg" className="w-full h-full object-fill" />
      </div>

      {/*
      <div className="flex justify-center items-center w-full">
        <Link href="/" className="font-serif text-sm text-center text-red-900 underline">
          I'm not interested and don't wish to continue. <br />
        </Link>
      </div>
      */}

      <div className="flex w-full  justify-center items-center">
        <LoginSignUp
          radioInputRef={radioInputRef}
          previous={data}
          login={login}
          signUp={signUp}
          emailInputRef={emailInputRef}
          passwordInputRef={passwordInputRef}
          numberInputRef={numberInputRef}
          errMsg={errMsg}
          loader={loader}
          setLogin={setLogin}
          setSignUp={setSignUp}
          Submit={Submit}
        />
      </div>

      {errMsg.message.length != 0 && <Disclaimer display={errMsg.message} colorClass={errMsg.color} />}
    </div>
  )
}

