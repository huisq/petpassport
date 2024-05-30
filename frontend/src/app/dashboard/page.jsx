"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import '@mysten/dapp-kit/dist/index.css';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import NftdataContainer from "../../../components/NftDataContainer";
import {useWallet} from '@suiet/wallet-kit';

const Dashboard = () => {

  const [loading, setLoading] = useState(false);
    const [nftdata, setnftdata] = useState(null);
    const wallet = useWallet();


    useEffect(() => {
        const getnft = async() => {
          setLoading(true);
          const suiClient = new SuiClient({ url: getFullnodeUrl("devnet") });
          const objects = await suiClient.getOwnedObjects({ owner: wallet?.address});

          console.log("objet", objects)
          const widgets = [];
          
          // iterate through all objects owned by address
          for (let i = 0; i < objects.data.length; i++) {
            const currentObjectId = objects.data[i].data.objectId;
          
            // get object information
            const objectInfo = await suiClient.getObject({
              id: currentObjectId,
              options: { showContent: true },
            });
    
            console.log("objectInfo", objectInfo);
          
            const packageId = '0xf87d4e1373b8c7356c9bd5c5f47005e12ea4ead0c5c81927f5c0da0de69820be';
          
            if (objectInfo?.data?.content?.type == `${packageId}::pet::PetPassport`) {
              // const widgetObjectId = objectInfo.data.content.fields.id.id;
              const widgetObjectId = objectInfo.data;
              console.log("widget spotted:", widgetObjectId);
              widgets.push(widgetObjectId);
            }
          }
          
          console.log("widgets:", widgets);
          setnftdata(widgets);
          setLoading(false);
        }
    
        getnft();
      }, [wallet.address])

  return (
    <main>
<div className="z-0" 
style={{backgroundImage: 'url(https://wallpapers.com/images/hd/brown-background-u240zdqxs8ns0qnx.jpg)', backgroundSize:'cover', backgroundRepeat:'no repeat', backgroundPosition:'center'}}
 >
      <div className="max-w-7xl mx-auto">
        <div className="justify-between flex">
          <Link href="/">
       <img src="/petpasslogo.png" className="w-24 h-34 pt-10"/>
       </Link>
       <div className="my-10 my-auto">
       <Navbar />
       </div>
       </div>
          <div className='font-bold text-5xl mt-20' style={{color:'#640D6B'}}>Pets for adoption</div>

          <NftdataContainer metaDataArray={nftdata} MyReviews={false} />
    </div>
    </div>
    </main>
  )
}

export default Dashboard