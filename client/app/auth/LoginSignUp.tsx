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
  signUp,
  emailInputRef,
  passwordInputRef,
  numberInputRef,
  errMsg,
  loader,
  previous,
  setLogin,
  setSignUp,
  Submit,
  radioInputRef,
}: {
  radioInputRef: RefObject<HTMLInputElement | null>,
  previous: string | null,
  login: boolean,
  signUp: boolean,
  emailInputRef: RefObject<HTMLInputElement | null>,
  passwordInputRef: RefObject<HTMLInputElement | null>,
  numberInputRef: RefObject<HTMLInputElement | null>,
  errMsg: { message: string, color: string },
  loader: boolean,
  setLogin: Dispatch<SetStateAction<boolean>>,
  setSignUp: Dispatch<SetStateAction<boolean>>,
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
          <p className="text-sm text-center font-serif">{login ? "Authentication is required for proceeding further." : "Already have an account?"}</p>
          <a className="text-amber-500 cursor-pointer"
            onClick={() => {
              if (login) {
                setLogin(false);
                setSignUp(true);
              }
              else if (signUp) {
                setLogin(true);
                setSignUp(false);
              }
            }}>
            <p className="text-sm text-center font-serif"> {login ? "Don't have an account? Sign up for one-on-one consulting" : "Continue to Login with your details"} </p>
          </a>
        </h3>
      </div>

      <img src="/unlock.png" className={`animate-bounce w-15 h-15 object-fill m-3
    ${formMount ? "opacity-100" : "opacity-0"} transform duration-1000 transition delay-1000`} />

      <InputBox type="email" ref={emailInputRef} imgSrc="/mail.png" placeholder="your email goes here" />

      {signUp && <InputBox type="text" ref={numberInputRef} imgSrc="/user.png" placeholder="your number goes here" />}

      <InputBox type="password" ref={passwordInputRef} imgSrc="/globe.png" placeholder="your password goes here" />


      {signUp &&
        <div>
          <input ref={radioInputRef} type="radio" name="auth" value="customer" />
          <label htmlFor="customer" className="font-serif text-sm"> I'm a customer who would like consultance</label> <br />
          <input type="radio" name="auth" value="admin" />
          <label htmlFor="auth" className="text-sm font-serif"> Not a customer</label>

        </div>
      }
      {/*Submit*/}
      <TypeLoginButton
        display={(login ? "Login" : "SignUp")}
        doThisAsync={() => Submit()}
      />
    </div>
  )
}
