"use client"
import React, { useEffect, useState } from 'react';
import { toreview, discard, approve } from '@/lib/actions';
import { redirect } from 'next/navigation';

function Page() {
  const [response, setResponse] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await toreview();
      setResponse(res);
    };

    fetchData();
  }, []);

  const discardHandler = async (id) => {
    const res = await discard(id);
    setResponse(res);
  };

  const approveHandler = async (id) => {
    const res = await approve(id);
    setResponse(res);
  };

  return (
    <div className="flex justify-center items-center overflow-x-auto">
      {response.length === 0 ? (
        <h1 className="text-center mt-10 text-3xl text-gray-400">No approvals pending</h1>
      ) : (
        <>
          <div className="hidden md:block mt-10">
            <table className="p-5 table-auto border-collapse border">
              <thead>
                <tr className="bg-teal-500 text-white">
                  <th className="p-2 m-2">Phone name</th>
                  <th className="p-2 m-2">Price</th>
                  <th className="p-2 m-2">RAM</th>
                  <th className="p-2 m-2">ROM</th>
                  <th className="p-2 m-2">Display Size</th>
                  <th className="p-2 m-2">Display Resolution</th>
                  <th className="p-2 m-2">Battery</th>
                  <th className="p-2 m-2">Front Camera</th>
                  <th className="p-2 m-2">Back Camera</th>
                  <th className="p-2 m-2">Processor Name</th>
                  <th className="p-2 m-2">Approve</th>
                  <th className="p-2 m-2">Discard</th>
                </tr>
              </thead>
              <tbody>
                {response.map((data) => (
                  <tr key={data.id}>
                    <th className="font-normal text-gray-600 p-2 m-2">{data.pname}</th>
                    <th className="font-normal text-gray-600 p-2 m-2">{data.price}</th>
                    <th className="font-normal text-gray-600 p-2 m-2">{data.RAM}</th>
                    <th className="font-normal text-gray-600 p-2 m-2">{data.ROM}</th>
                    <th className="font-normal text-gray-600 p-2 m-2">{data.DisplaySize}</th>
                    <th className="font-normal text-gray-600 p-2 m-2">{data.DisplayType}</th>
                    <th className="font-normal text-gray-600 p-2 m-2">{data.Battery}</th>
                    <th className="font-normal text-gray-600 p-2 m-2">{data.FrontCamera}</th>
                    <th className="font-normal text-gray-600 p-2 m-2">{data.RearCamera}</th>
                    <th className="font-normal text-gray-600 p-2 m-2">{data.ProcessorName}</th>
                    <th className="font-normal text-gray-600 p-2 m-2">
                      <button onClick={() => approveHandler(data.id)}>✅</button>
                    </th>
                    <th className="font-normal text-gray-600 p-2 m-2">
                      <button onClick={() => discardHandler(data.id)}>❌</button>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden mt-10 p-5 border-collapse border">
            {response.map((data) => (
              <div key={data.id} className="mb-5 border-b">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="p-2 m-2">Phone name: {data.pname}</div>
                  <div className="p-2 m-2">Price: {data.price}</div>
                  <div className="p-2 m-2">RAM: {data.RAM}</div>
                  <div className="p-2 m-2">ROM: {data.ROM}</div>
                  <div className="p-2 m-2">Display Size: {data.DisplaySize}</div>
                  <div className="p-2 m-2">Display Resolution: {data.DisplayType}</div>
                  <div className="p-2 m-2">Battery: {data.Battery}</div>
                  <div className="p-2 m-2">Front Camera: {data.FrontCamera}</div>
                  <div className="p-2 m-2">Back Camera: {data.RearCamera}</div>
                  <div className="p-2 m-2">Processor Name: {data.ProcessorName}</div>
                </div>
                <div className="flex justify-center mt-3">
                  <button className="p-2 m-2" onClick={() => approveHandler(data.id)}>
                    ✅ Approve
                  </button>
                  <button className="p-2 m-2" onClick={() => discardHandler(data.id)}>
                    ❌ Discard
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Page;
