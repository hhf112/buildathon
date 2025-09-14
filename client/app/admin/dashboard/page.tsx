"use client";
import { sessionContext } from '@/contexts/SessionContextProvider';
import { useEffect, useState, useContext, Dispatch, SetStateAction, useRef } from 'react';
import { Home } from './Home';
import AIMarketing from './Marketing';
import { useRouter } from 'next/navigation';
import Marketing from './Marketing';
import { Clients } from './Clients';

function ListItem({ title, setShow, set }: { setShow: Dispatch<SetStateAction<number>>, title: string, set: number }) {
  const [mounted, setMount] = useState(false);
  const [clientChatID, setClientChatID] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMount(true);
    return () => setMount(false);
  }, []);

  return (
    <p
      className={`${mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-20"} font-Georgia text-white font-bold text-4xl duration-500 delay-75 my-4 transition-all transform-all `}
      onClick={(e) => {
        e.stopPropagation();
        setShow(set);
      }}
    >
      {title}
    </p>
  );
}

function SideBar({ setShow }: { setShow: Dispatch<SetStateAction<number>> }) {
  const { user } = useContext(sessionContext);

  const [mounted, setMount] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => setMount(true), []);
  useEffect(() => {
    setTimeout(() => setExpanded(true), 200);
  }, []);

  return (
    <div
      className={`${mounted ? "w-5/6" : "w-0"} opacity-90 h-full bg-black fixed shadow-xl duration-100 delay-75 transform-all transition-all`}
      onClick={(e) => e.stopPropagation()} // ✅ prevents closing when clicking inside sidebar
    >
      {expanded && (
        <>
            <p className="mt-10 mb-20 mx-3.5 font-bold text-green-700 text-6xl">
              Broker Boost
            </p>

          <div className="mt-20 mx-3.5">
            <ListItem title="Dashboard" set={1} setShow={setShow} />
            <ListItem title="Marketing" set={0} setShow={setShow} />
            <ListItem title="Profile" set={2} setShow={setShow} />
            <ListItem title="Calendar" set={3} setShow={setShow} />
            <ListItem title="Clients" set={4} setShow={setShow} />
          </div>
        </>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user, setSessionToken, setUser } = useContext(sessionContext);
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(0);

  useEffect(() => console.log("show state =", show), [show]);
  useEffect(() => {

    (async () => {
      const resp = await fetch("/api/auth/token", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      });

      const resp_json = await resp.json();
      if (!resp_json.accessToken || user?.access == 1) {
        router.push('/auth');
      } else {
        setSessionToken(resp_json.accessToken);
        setUser(resp_json.user);
      }
    })();

  }, [])

  return (
    <div
      className="flex flex-col h-screen bg-neutral-100"
      onClick={() => {
        if (isOpen) setIsOpen(false);
      }}
    >
      {/* top bar */}
      <div className="flex items-center bg-white border border-neutral-400 py-2 px-2 h-9">
        <div className="flex-1 flex h-full items-center">
          <div
            className="h-full inline-block cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          >
            <img src="/menu.png" className="w-full h-full object-contain" />
          </div>
          <div className="inline-block ml-2 h-full">
            <img src="/brokerboots.jpg" className="max-h-full object-contain" />
          </div>
        </div>

        <div
          className="h-full inline-block cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
        >
          <img src="/globe.png" className="w-full h-full object-contain" />
        </div>
        <div className="inline-block ml-2 h-full">
          <img src="/man.png" className="max-h-full object-contain" />
        </div>
      </div>

      {/* ✅ show will now correctly switch components */}
      {show === 0 && <Marketing />}
      {show === 1 && <Home />}
      {show === 4 && <Clients setShow={setShow}/>}
      {isOpen && <SideBar setShow={setShow} />}
    </div>
  );
}
