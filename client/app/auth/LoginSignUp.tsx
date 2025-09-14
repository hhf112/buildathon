import React, { useEffect, useState, type Dispatch, type RefObject, type SetStateAction } from "react";
import { TypeLoginButton } from "./components";

function InputBox({ ref,
  imgSrc,
  placeholder,
  type,
}: {
  type: string,
  ref: RefObject<HTMLInputElement | null>,
  imgSrc: string,
  placeholder: string
}) {
  return <div className="flex justify-center h-12">
    <img src={imgSrc} className=" my-1 mx-1 " />
    <input ref={ref} type={type} id="email" placeholder={placeholder}
      className="p-3 border border-neutral-500 my-1 mx-1 font-serif text-sm rounded-xl focus:border-cyan-100" />
  </div>
}

export function LoginSignUp({
  login,
  emailInputRef,
  passwordInputRef,
  numberInputRef,
  errMsg,
  loader,
  previous,
  setLogin,
  Submit,
  radioInputRef,
}: {
  radioInputRef: RefObject<HTMLInputElement | null>,
  previous: string | null,
  login: boolean,
  emailInputRef: RefObject<HTMLInputElement | null>,
  passwordInputRef: RefObject<HTMLInputElement | null>,
  numberInputRef: RefObject<HTMLInputElement | null>,
  errMsg: { message: string, color: string },
  loader: boolean,
  setLogin: Dispatch<SetStateAction<boolean>>,
  Submit: () => Promise<void>;
}) {

  const [formMount, setFormMount] = useState<boolean>(false);
  useEffect(() => {
    setFormMount(true);
  }, [])

  return (
    <div className={`bg-white flex flex-col items-center justify-center 
    p-5
${formMount ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} transform duration-500
 transition delay-100 `}>

      {/*Top Text*/}
      <div className="m-4">
        <h3 className={`hover:-translate-y-1 transition delay-75 text-neutral-700
          transform duration-1000 
${formMount ? "opacity-100" : "opacity-0"}`}>
        </h3>
      </div>

      <img src="/unlock.png" className={`w-15 h-15 object-fill m-3
    ${formMount ? "opacity-100" : "opacity-0"} transform duration-1000 transition delay-1000`} />

      <InputBox type="email" ref={emailInputRef} imgSrc="/mail.png" placeholder="your email goes here" />
      <InputBox type="password" ref={passwordInputRef} imgSrc="/globe.png" placeholder="your password goes here" />

      {/*Submit*/}
      <TypeLoginButton
        display={(login ? "Login" : "SignUp")}
        doThisAsync={() => Submit()}
      />
    </div>
  )
}
