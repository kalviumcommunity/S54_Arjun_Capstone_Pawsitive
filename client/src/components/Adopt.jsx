import React from 'react'
import Navbar from './Navbar'
import { Image } from '@chakra-ui/react'
import rect from '../assets/rect.png'
import AdoptCarousal from '../sub-components/AdoptCarousal.jsx'
import { AdoptCard } from '../sub-components/AdoptCard.jsx'
import luna from '../assets/Luna.png'

const Adopt = () => {
  
  return (
    <div>
      <Navbar />
      <AdoptCarousal />
      <AdoptCard pet={{name:"Luna",image:`${luna}`,gender:"male",location:"Hyderabad",owner:"el8a1kRzRvT7MnB2D2xHTWk55yb2"}}/>
    </div>
  )
}

export default Adopt