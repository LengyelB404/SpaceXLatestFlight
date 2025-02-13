'use client'
import { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card';
import { format } from 'date-fns';
import { stringify } from "querystring";
import { type } from "os";

export default function SpaceXCard(){
    const [ dataInfo, setDataInfo ]:any = useState();

    useEffect(()=>{
      const axios = require('axios');
      const fetchData = async () => {
        const result = await axios.get('https://api.spacexdata.com/v5/launches/latest')
        return result
      }
      fetchData().then(res => setDataInfo(res.data))
    },[])
    

    console.log(dataInfo)
    if (dataInfo) {
      
      let link:string = dataInfo.links.reddit.launch
      return (
        <div className="grid grid-cols-2 gap-3 justify-items-stretch max-w-fit bg-slate-600 rounded p-3 font-[family-name:var(--font-geist-sans)]">
          <div className="bg-yellow-500 p-2 rounded"><small className="font-2xl font-medium text-black bg-yellow-400 w-min pl-2 pr-2 pt-1 pb-1 rounded">Flight_number</small> <br/> <p className="font-bold text-2xl ">{dataInfo.flight_number}</p></div>
          <div className="bg-fuchsia-600 font-medium p-2 rounded break-keep"><Time upcoming={dataInfo.upcoming} launchTime={dataInfo.date_local} /></div>
          <IsSuccess success={dataInfo.success as boolean}/>
          <IsUpcoming upcoming={dataInfo.upcoming as boolean} />
          <div className="p-2 rounded break-keep"><a href={dataInfo.links.wikipedia}><img src={dataInfo.links.patch.small} alt={dataInfo.name} className="object-cover"></img></a></div>
          <div className="p-2 rounded break-keep"><RedditListElement link={dataInfo.links.reddit.launch}/></div>
        </div>
      )  
    }else{
      return(
        <div className="bg-slate-600 rounded w-min p-3">
          <Spinner/>
        </div>
      )
    }
    
}

function Spinner(){
  return(
    <div role="status">
        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span className="sr-only">Loading...</span>
    </div>
  )
}

type RedditProps = {
  link: string;
};

function RedditListElement(link:RedditProps){
  
  if (link) {
    //const u = stringify(url).replace("url=","")
    return <a href={link.link} ><img className="w-60" src="https://redditinc.com/hs-fs/hubfs/Reddit%20Inc/Brand/Reddit_Logo.png?width=800&height=800&name=Reddit_Logo.png"></img></a>
  }
  else{
    return <></>
  }
}

type IsSuccessPorps = {
  success: boolean;
};

const IsSuccess =(props:IsSuccessPorps) =>{
  if (props.success) {
    return(<div className="p-2 bg-emerald-500 rounded break-keep"><div className="text-center">Launch successfull</div></div>)
  }else{
    return(<div className="p-2 bg-rose-500 rounded break-keep"><div className="text-center">Fail</div></div>)
  }
}

type IsUpcomingProps = {
  upcoming: boolean;
};

const IsUpcoming =(props:IsUpcomingProps) =>{
  if (props.upcoming) {
    return(<div className="bg-sky-500 p-2 rounded text-center break-keep">Upcoming</div>)
  }else{
    return(<div className="bg-teal-600 p-2 rounded text-center break-keep">Launched</div>)
  }
}

type TimeProps = {
  upcoming: boolean;
  launchTime:string
};

const Time = (props:TimeProps) =>{

  if (!props.launchTime) {
    return<></>
  }
  const localDate = format(props.launchTime, 'yyyy-MM-dd HH:mm:ss');

  if (props.upcoming) {
    if (!props.launchTime) {
      return<></>
    }
    const differenceInMilliseconds =Date.parse(props.launchTime)- Date.now()
    const differenceInSeconds = differenceInMilliseconds / 1000;
    const differenceInMinutes = differenceInSeconds / 60;
    const differenceInHours = differenceInMinutes / 60;
    const differenceInDays = differenceInHours / 24;
    var time = ""
    if (differenceInDays>=1) {
      time = "Days: "+Math.round(differenceInDays)
    }else if(differenceInHours>=1){
      time = "Hours: "+Math.round(differenceInHours)
    }else if(differenceInMinutes>=1){
      time = "Minutes: "+Math.round(differenceInMinutes)
    }

    
    return (
      <div>
         <small className="font-2xl text-black bg-fuchsia-500 w-min pl-2 pr-2 pt-1 pb-1 rounded">Time till launch</small> <br/>{time}
      </div>
    )
  }else{
    return (
      <div>
         <small className="font-2xl text-black bg-fuchsia-500 w-min pl-2 pr-2 pt-1 pb-1 rounded">Launched At</small> <br/>{localDate}
      </div>
    )
  }
}

