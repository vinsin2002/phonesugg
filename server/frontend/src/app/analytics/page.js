/* eslint-disable react-hooks/rules-of-hooks */

"use client"
import React from 'react'
import Linechart from '@/components/Linechart'
import {Chart as ChartJS} from 'chart.js/auto'
import Barchart from '@/components/Barchart'
import Doughnutchart from '@/components/Dougnutchart'
import { useState, useEffect } from 'react'
import { getpricerange, priceperf, getram, getrom, getuserdist } from '@/lib/actions'
function page() {
    let priceData =[];
    for(let i=1;i<=10;i++){
        priceData.push({
            id: i,
            price: i*10000,
            phones: i*100
        })
    }
    const[price,setprice] = useState([]);
    const [p, setp] = useState([]);
    const[ram,setram] = useState([]);
    const[rom,setrom] = useState([]);
    const [userdist, setuserdist] = useState([]);
    useEffect(() => {
      return async () => {
           const response  = await priceperf();
           const prices = await getpricerange();
           const ramArray = await getram();
           const romArray = await getrom();
           const data = await getuserdist();
            // console.log(ramArray);
            const priceRanges = [
                { min: 0, max: 10000 },
                { min: 10001, max: 20000 },
                { min: 20001, max: 30000 },
                { min: 30001, max: 40000 },
                { min: 40001, max: 50000 },
                { min: 50001, max: 60000 },
                { min: 60001, max: 70000 },
                { min: 70001, max: 80000 },
                { min: 80001, max: 90000 },
                { min: 90001, max: Infinity },
                // Add more ranges as needed
                ];
            const result = {};

            data.forEach(obj => {
            const price = obj.price;
            const nusers = obj.nusers;

            priceRanges.forEach(range => {
                if (price >= range.min && price <= range.max) {
                const key = range.max === Infinity ? '100000+ Rs':range.max.toString()+" Rs";
                result[key] = (result[key] || 0) + nusers;
                }
            });
            });
            console.log(result);
            setuserdist(result);
            let frequencyMap = {};
            let frequencyRomMap = {};
    ramArray.forEach(item => {
        const ram = item.RAM;
        if (ram !== null && ram !== undefined) {
            if (frequencyMap[ram]) {
                frequencyMap[ram]++;
            } else {
                frequencyMap[ram] = 1;
            }
        }
    });
    romArray.forEach(item => {
        const rom = item.ROM;
        if (rom !== null && rom !== undefined) {
            if (frequencyRomMap[rom]) {
                frequencyRomMap[rom]++;
            } else {
                frequencyRomMap[rom] = 1;
            }
        }
    });
    setrom(frequencyRomMap);
    setram(frequencyMap);
           const pricesAsNumbers = prices.map(price => parseInt(price.price));
           

            // Initialize an array to store counts for each range
            const priceDistribution = [];
            // Iterate over price ranges
            priceRanges.forEach(range => {
            const count = pricesAsNumbers.filter(price => price >= range.min && price <= range.max).length;
            priceDistribution.push({ maxPrice: range.max === Infinity ? '100000+ Rs':range.max+" Rs", count });
            });
            setprice(priceDistribution)
           setp(response);     
      }
    }, [])
    const pastelColors = [
        "#faae2b", // Light Salmon
        "#fa5246", // Sky Blue
        "#ffa8ba", // Pale Green
        "#00332c", // Peach Puff
        "#7f5af0", // Light Blue
        "#2cb67d", // Light Pink
        "#3da9fc", // Powder Blue
        "#004643", // Navajo White
        "#fde24f", // Honeydew
        "#00ebc7"  // Moccasin
      ];
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    let pricedata = {
        labels: price.map(data => data.maxPrice),
        datasets: [
            {
                label: "count",
                data: price?.map(data => parseInt(data.count)),
                backgroundColor: pastelColors,
            }
        ]
    };
    let ramdata = {
        labels: Object.keys(ram),
        datasets: [
            {
                label: "count",
                data: Object.values(ram),
                backgroundColor: ["#faae2b"],
            },
        ]
    };
    let userdata = {
        labels: Object.keys(userdist),
        datasets: [
            {
                label: "consumers",
                data: Object.values(userdist),
                backgroundColor: ["#3da9fc"],
            },
        ]
    };
    let romdata = {
        labels: Object.keys(rom),
        datasets: [
            {
                label: "count",
                data: Object.values(rom),
                backgroundColor: ["#ffa8ba"],
            },
        ]
    };
    let perfdata = {
        labels: p.map(data => data.perfscore),
        datasets: [
            {
                label: "price",
                data: p?.map(data => parseInt(data.price)),
                backgroundColor: ["rgba(75, 192, 192, 1)"],
            }
        ]
    };
  return (
    <div className='flex justify-center items-center flex-col'>
        <div className='m-5 p-5 w-full md:w-1/3'>
            <h1 className='text-center'>Price Distribution</h1>
            <Doughnutchart props={pricedata}/>
        </div>
        <div className='m-5 p-5 w-full md:w-1/2'>
            <h1 className='text-center'>User Distribution</h1>
            <Barchart props={userdata}/>
        </div>
        <div className='m-5 p-5 w-full md:w-1/2'>
            <h1 className='text-center'>Performance Score vs Price (Rs)</h1>
            <Linechart props={perfdata}/>
        </div>
        <div className='m-5 p-5 w-full md:w-1/2'>
            <h1 className='text-center'>RAM (GB) Distribution</h1>
            <Barchart props={ramdata}/>
        </div>
        <div className='m-5 p-5 w-full md:w-1/2'>
            <h1 className='text-center'>ROM (GB) Distribution</h1>
            <Barchart props={romdata}/>
        </div>
    </div>
  )
}

export default page