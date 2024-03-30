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
            <VStack w={'20vw'} p={'2vw'} gap={'2vw'} justifyContent={'center'} display={{ base: "none", md: "flex" }}>
                <Button onClick={() => setCommunity('explore')} display={'flex'} justifyContent={'space-between'} gap={'1vw'} bg={community == 'explore' ? "#FBBC05" : 'white'} size="lg" border={'3px solid #FBBC05'} borderRadius={"30px"} _hover={'none'} color={'black'} outline={'none'}>
                    <img width={'30vw'} src={explore} alt="" />
                    <Text fontSize={'2xl'} paddingRight={'2vw'}>Explore</Text>
                </Button>
                <Button onClick={() => setCommunity('message')} display={'flex'} justifyContent={'space-between'} gap={'1vw'} bg={community == 'message' ? "#FBBC05" : 'white'} size="lg" border={'3px solid #FBBC05'} borderRadius={"30px"} _hover={'none'} color={'black'} outline={'none'}>
                    <img width={'30vw'} src={message} alt="" />
                    <Text fontSize={'2xl'} paddingRight={'1vw'}>Message</Text>
                </Button>
                <Button onClick={() => setCommunity('create')} display={'flex'} justifyContent={'space-between'} gap={'1vw'} bg={community == 'create' ? "#FBBC05" : 'white'} size="lg" border={'3px solid #FBBC05'} borderRadius={"30px"} _hover={'none'} color={'black'} outline={'none'}>
                    <img width={'30vw'} src={create} alt="" />
                    <Text fontSize={'2xl'} paddingRight={'2.5vw'}>Create</Text>
                </Button>
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