import { Button, HStack, Text, VStack } from '@chakra-ui/react'
import React, { useContext, useEffect } from 'react'
import explore from '../assets/explore.png'
import message from '../assets/message.png'
import create from '../assets/create.png'
import { AuthContext } from '../context/AuthContext'

const SideCom = () => {
    const { community, setCommunity } = useContext(AuthContext);

    return (
        <>
            <VStack w={'15vw'} p={'2vw'} gap={'2vw'} justifyContent={'center'} display={{ base: "none", md: "flex" }}>
                <button onClick={() => setCommunity('explore')} style={{display:'flex',gap:'1vw',border:'2px solid #FBBC05',borderRadius:'30px',backgroundColor:community=='explore'?'#FBBC05':'Transparent',justifyContent:'center',alignItems:'center',padding:'5px 10px',outline:'none',paddingLeft:'10px'}}>
                    <img width={'30vw'} src={explore} alt="" />
                    <Text fontSize={'2xl'} paddingRight={'1vw'}>Explore</Text>
                </button>
                <button onClick={() => setCommunity('message')} style={{display:'flex',gap:'1vw',border:'2px solid #FBBC05',borderRadius:'30px',backgroundColor:community=='message'?'#FBBC05':'Transparent',justifyContent:'center',alignItems:'center',padding:'5px 10px',outline:'none',paddingLeft:'10px'}}>
                    <img width={'30vw'} src={message} alt="" />
                    <Text fontSize={'2xl'} paddingRight={'0.7vw'}>Message</Text>
                </button>
                <button onClick={() => setCommunity('create')} style={{display:'flex',gap:'1vw',border:'2px solid #FBBC05',borderRadius:'30px',backgroundColor:community=='create'?'#FBBC05':'Transparent',justifyContent:'center',alignItems:'center',padding:'5px 10px',outline:'none',paddingLeft:'10px'}}>
                    <img width={'30vw'} src={create} alt="" />
                    <Text fontSize={'2xl'} paddingRight={'2vw'}>Create</Text>
                </button>
            </VStack>

            <HStack w={'90%'} position={'absolute'} bottom={'5px'} border={'2px solid #FBBC05'} borderRadius={'30px'} display={{ base: 'flex', md: 'none' }} h={'12vw'} justifyContent={'space-around'}>
                <button  onClick={()=>setCommunity('message')} outline='none' style={{backgroundColor:community=='message'?'#FBBC05':'transparent', padding:'1vw',borderRadius:'50%',}}>
                    <img width={'34vw'} src={message} alt="" />
                </button>
                <button onClick={()=>setCommunity('explore')} outline='none' style={{backgroundColor:community=='explore'?'#FBBC05':'transparent', padding:'1vw',borderRadius:'50%',}}>
                    <img width={'40vw'} src={explore} alt="" />
                </button>
                <button onClick={()=>setCommunity('create')} outline='none' style={{backgroundColor:community=='create'?'#FBBC05':'transparent', padding:'1vw',borderRadius:'50%',}} >
                    <img width={'30vw'} src={create} alt="" />
                </button>
            </HStack>
        </>
    )
}

export default SideCom