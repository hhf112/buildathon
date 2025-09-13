"use client";
import React, { useEffect } from "react";
import { useRef, useState, useContext } from "react"
import { sessionContext, SessionContextProvider, type sessionContextType } from "@/contexts/SessionContextProvider";
import { dataContext } from "@/contexts/DataContextProvider";

import { Disclaimer, TypeLoginButton } from "./components";
import { useRouter } from "next/navigation";
import { Submitted } from "./Submitted";
import { LoginSignUp } from "./LoginSignUp";

const authentication: string = "api/auth";

export default function Auth() {
  /* use */
  const { Logout, setUser, setSessionToken, Fetch, sessionToken, user } = useContext<sessionContextType>(sessionContext);
  const router = useRouter();

  const { data }: { data: any } = useContext(dataContext);
  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const usernameInputRef = useRef<HTMLInputElement>(null)


  /* states */
  const [login, setLogin] = useState<boolean>(true);
  const [signUp, setSignUp] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<{
    message: string,
    color: string,
  }>({
    message: "",
    color: "amber",
  });
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    if (sessionToken) router.push(data || '/');
  }, [sessionToken]);

  /*functions*/
  async function Submit() {
    const username = usernameInputRef.current?.value;
    const email = emailInputRef.current?.value;
    const password = passwordInputRef.current?.value;

    const req = authentication + (login ? "" : "/register");
    setTimeout(() => setErrMsg({ message: "It is taking longer than usual please wait!", color: "amber" }),
      5000)
    setErrMsg({
      message: "Loading ...",
      color: "amber",
    })

    console.log("username:", username);
    const post = await fetch(req, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "authorization": `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
      credentials: "include",
    })

    const postJSON = await post.json();
    // console.log(postJSON);
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
      const user = postJSON.user;
      setSessionToken(postJSON.accessToken);
      // console.log("user: ", postJSON.user);
      setUser(postJSON.user);
      setSubmitted(true);
    } if (signUp) {
      setSubmitted(true);
    }
  }

  /* component */
  // console.log(sessionToken);
  return (
    <div> {/*BG*/}

      <div className="fixed flex justify-center items-center w-full">
        <button className="m-5 text-4xl rounded-full p-5 bg-white text-neutral-800 
           font-bold border-4 font-Inter z-5 shadow cursor-pointer
           hover:bg-red-400 hover:-translate-x-5
          transition-all transform duration-100 delay-75"
          onClick={() => router.push(data || "/")}>
          NO. TAKE ME BACK.
        </button>
      </div>

      <div className="flex w-full h-screen justify-center items-center">
        {submitted || sessionToken ? <Submitted
          login={login}
          previous={data}
          signUp={signUp}
          setSignUp={setSignUp}
          setLogin={setLogin}
          setSubmitted={setSubmitted}
          Submit={Submit}
          Logout={Logout}

        /> : <LoginSignUp
          previous={data}
          login={login}
          signUp={signUp}
          emailInputRef={emailInputRef}
          passwordInputRef={passwordInputRef}
          usernameInputRef={usernameInputRef}
          errMsg={errMsg}
          loader={loader}
          setLogin={setLogin}
          setSignUp={setSignUp}
          Submit={Submit}
        />}

        {errMsg.message.length != 0 && <Disclaimer display={errMsg.message} colorClass={errMsg.color} />}
      </div>
    </div>
  )
}

