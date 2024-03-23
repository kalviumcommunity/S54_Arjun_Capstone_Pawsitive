import React from 'react'
import Navbar from './Navbar'
import { Image } from '@chakra-ui/react'
import rect from '../assets/rect.png'
import AdoptCarousal from '../sub-components/AdoptCarousal.jsx'
const Adopt = () => {
  return (
    <div>
      <Navbar />
      <AdoptCarousal />
      {/* <Image src={rect} w={'100vw'}/> */}
    </div>
  )
}

export default Adopt