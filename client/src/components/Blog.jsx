import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import axios from 'axios';
import { Button, Card, CardBody, CardFooter, Heading, Image, Stack, Text } from '@chakra-ui/react';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setIsLoading] = useState(false)
  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://pawsitive-backend-seven.vercel.app/blog/all');
      const data = response.data;
      console.log("data: ", data);
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchBlogs();
  }, []);
  return (
    <>
      <Navbar />
      <div style={{padding:" 3vw 8vw",display:'flex',flexDirection:'column',justifyContent:"space-between",gap:'2vw'}}>
        {
          blogs.map((blog) => (
            <Card
              direction={{ base: 'column', sm: 'row' }}
              overflow='hidden'
              variant='outline'
              key={blog._id}
            >
              <Image
                objectFit='cover'
                maxW={{ base: '100%', sm: '200px' }}
                src={blog.img}
                alt='Caffe Latte'
              />

              <Stack>
                <CardBody>
                  <Heading size='md'>{blog.headline}</Heading>
                  <Text py='2'>
                    {blog.content}
                  </Text>
                </CardBody>

                <CardFooter>
                  <Button variant='solid' colorScheme='blue'>
                    View
                  </Button>
                  <Text ml={"2vw"} >
                    {new Date(blog.dateCreated).toLocaleDateString()}
                  </Text>
                </CardFooter>
              </Stack>
            </Card>
          ))
        }
      </div>
    </>
  )
}

export default Blog