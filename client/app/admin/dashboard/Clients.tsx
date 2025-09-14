import { ClientType, PolicyType, ReferralType, Client } from "@/lib/client.model"
import { Dispatch, SetStateAction, useEffect, useState, useContext } from "react"
import { Disclaimer } from "../../auth/components"
import { Combo } from "next/font/google";
import { ComboBox } from "./ComboBox";
import { ClientSegmentRoot } from "next/dist/client/components/client-segment";
import { SearchClients } from "./SearchClients";
import { useRouter } from "next/navigation";
import { dataContext } from "@/contexts/DataContextProvider";


export function Clients({ setShow }: { setShow: Dispatch<SetStateAction<number>> }) {
  const { data, setData } = useContext(dataContext);
  const router = useRouter();
  const [errMsg, setErrMsg] = useState({
    message: "",
    color: "amber",
  })


  const [clients, setClients] = useState<ClientType[]>([{
    name: "soemfjew",
    number: "+91831233123",
    gender: "male",
    email: "asdf@asdf.com",
    lang: "en",
    enrolled_policies: [
      {
        policy_id: "asdf",
        name: "asdf",
        contract_end_date: "asdf",
        payment_status: "asdf",
        premium: "asdf",
      },
    ],
    other_available_policies: [
      "asdf",
    ],
    referral_details: {
      has_referred: false,
      referral_code: "asdf",
      reward_program_details: "asdf",
    },
  },
  {
    name: "soemfjew",
    number: "+91831233123",
    gender: "male",
    email: "asdf@asdf.com",
    lang: "en",
    enrolled_policies: [
      {
        policy_id: "asdf",
        name: "asdf",
        contract_end_date: "asdf",
        payment_status: "asdf",
        premium: "asdf",
      },
    ],
    other_available_policies: [
      "asdf",
    ],
    referral_details: {
      has_referred: false,
      referral_code: "asdf",
      reward_program_details: "asdf",
    },
  },
  {
    name: "soemfjew",
    number: "+91831233123",
    gender: "male",
    email: "asdf@asdf.com",
    lang: "en",
    enrolled_policies: [
      {
        policy_id: "asdf",
        name: "asdf",
        contract_end_date: "asdf",
        payment_status: "asdf",
        premium: "asdf",
      },
    ],
    other_available_policies: [
      "asdf",
    ],
    referral_details: {
      has_referred: false,
      referral_code: "asdf",
      reward_program_details: "asdf",
    },
  },

  {
    name: "soemfjew",
    number: "+91831233123",
    gender: "male",
    email: "asdf@asdf.com",
    lang: "en",
    enrolled_policies: [
      {
        policy_id: "asdf",
        name: "asdf",
        contract_end_date: "asdf",
        payment_status: "asdf",
        premium: "asdf",
      },
    ],
    other_available_policies: [
      "asdf",
    ],
    referral_details: {
      has_referred: false,
      referral_code: "asdf",
      reward_program_details: "asdf",
    },
  },

  {
    name: "soemfjew",
    number: "+91831233123",
    gender: "male",
    email: "asdf@asdf.com",
    lang: "en",
    enrolled_policies: [
      {
        policy_id: "asdf",
        name: "asdf",
        contract_end_date: "asdf",
        payment_status: "asdf",
        premium: "asdf",
      },
    ],
    other_available_policies: [
      "asdf",
    ],
    referral_details: {
      has_referred: false,
      referral_code: "asdf",
      reward_program_details: "asdf",
    },
  },
  {
    name: "soemfjew",
    number: "+91831233123",
    gender: "male",
    email: "asdf@asdf.com",
    lang: "en",
    enrolled_policies: [
      {
        policy_id: "asdf",
        name: "asdf",
        contract_end_date: "asdf",
        payment_status: "asdf",
        premium: "asdf",
      },
    ],
    other_available_policies: [
      "asdf",
    ],
    referral_details: {
      has_referred: false,
      referral_code: "asdf",
      reward_program_details: "asdf",
    },
  },
  ]);

  // filter
  const [clientSearch, setClientSearch] = useState([
    {
      label: "All",
      value: "All"
    }
  ]);

  const [filter, setFilter] = useState("All");
  const [clientSearchArr, setClientSearchArr] = useState<{ label: string, value: string }[]>([])
  const [searchedClient, setSearchedClient] = useState("");



  useEffect(() => {
    (async () => {
      const resp = await fetch("/api/clients", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });

      const resp_json = await resp.json();
      if (!resp_json.success) {
        errMsg.message = resp_json.message;
        errMsg.color = "red";
      } else {
        setClients(prev_clients => resp_json.clients);
        setClientSearch(prev =>
          resp_json.clients.map((client: ClientType) => {
            return {
              label: client.name,
              value: client.name,
            }
          })
        )

        setClientSearchArr(prev => resp_json.clients.map((client: ClientType) => {
          return { label: client.name, value: client.name }
        }));
        errMsg.message = "";
        errMsg.color = "green";
      }
    })();
  }, [])

  return (
    <div className="flex flex-col h-screen overflow-y-auto items-center">
      <button className="fixed bottom-0 mb-1 rounded-full bg-gradient-to-b from-green-400 to-green-600 p-4 text-white shadow-xl border-neutral-200 font-semibold text-lg">
        Add Client +
      </button>

      <div className="flex justify-between items-center">
        <ComboBox
          frameworks={clientSearch}
          value={filter}
          setValue={setFilter}
          notOpened={`Show:${filter}`}
          opened={filter}
        />

        <ComboBox
          frameworks={clientSearchArr}
          value={filter}
          setValue={setFilter}
          opened={"Search by name ..."}
          notOpened={searchedClient}
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {clients.map((client, index) => {
          {/* client card */ }
          return <div
            key={index}
            className="m-1 p-1 flex flex-col justify-center items-center w-full border-neutral-200 rounded-lg shadow-xl border py-2"
            onClick={() => {
              setData({
                route: "/admin/dashboard",
                client: client,
              });
              router.push(`/client/${client.email}`)

            }
            }>
            <div className="m-1 w-10 h-10">
              <img
                src={client.gender === "male" ? "/man.png" : "/woman.png"}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="grow flex flex-col justify-center items-center m-1">
              <p>
                {client.name}
              </p>
              <p className="text-neutral-400">
                {client.number}
              </p>
            </div>
          </div>
        })}
      </div>

      {errMsg.message.length > 0 && <Disclaimer
        display={errMsg.message}
        colorClass={errMsg.color}
      />}


    </div>
  )
}
