"use client";

import { BigNumber, ethers } from "ethers";
import { SmartContractAddress } from "./config";
import abi from "./abi.json";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [balance, setBalance] = useState(0);
  const router = useRouter();

  // This function will be called when the button is clicked
  // it will call the awardItem function from the smart contract
  const awardItem = async () => {
    //@ts-expect-error
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(SmartContractAddress, abi, signer);

    const tx = await contract.awardItem(
      signer.getAddress(),
      "https://files.etdchain.net/mynft.png"
    );
    await tx.wait();
    router.refresh();
  };

  // This function will be called when the page loads
  // it will call the balanceOf function from the smart contract
  const getMyBalance = async () => {
    //@ts-expect-error
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(SmartContractAddress, abi, signer);

    const balance = await contract.balanceOf(signer.getAddress());

    return balance;
  };

  useEffect(() => {
    (async () => {
      const balance: BigNumber = await getMyBalance();
      const balanceStr = balance.toString();
      setBalance(parseInt(balanceStr));
    })();
  }, []);

  return (
    <main className="w-96 mx-auto pt-10">
      <h1 className=" text-2xl font-bold text-red-500 animate-bounce">
        My NFT
      </h1>
      <p>My balance: {balance}</p>
      <button
        type="button"
        onClick={awardItem}
        className="rounded-md bg-indigo-50 px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
      >
        Award Item
      </button>
    </main>
  );
}
