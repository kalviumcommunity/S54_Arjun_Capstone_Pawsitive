import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import axios from 'axios';
import { Input, InputGroup, InputRightElement, Box, Image, Text, Flex, IconButton, Tooltip, SimpleGrid, Card, Stack, CardBody, Heading, CardFooter } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { MdThumbUp, MdComment, MdBookmarkBorder } from 'react-icons/md';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [bloggers, setBloggers] = useState({});
  const [loading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://pawsitive-backend-seven.vercel.app/blog/all');
      const data = response.data;
      const reversedBlogs = [...data].reverse();
      setBlogs(reversedBlogs);
      console.log("reversedBlogs: ", reversedBlogs);
      setFilteredBlogs(reversedBlogs);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getBlogger = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setBloggers(prevState => ({ ...prevState, [uid]: userData }));
        setIsLoading(false);
      } else {
        console.log("No such document!");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  }

  const removeHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const Cutcontent = (content, maxLength) => {
    const sanitizedContent = removeHtmlTags(content);
    if (sanitizedContent.length > maxLength) {
      return sanitizedContent.substring(0, maxLength) + "...";
    } else {
      return sanitizedContent;
    }
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    if (!searchQuery) {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(blog => blog.title.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredBlogs(filtered);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    blogs.forEach(blog => {
      getBlogger(blog.createdBy);
    });
  }, [blogs]);

  const handleBlogClick = (blogId) => {
    navigate(`/ViewBlog/${blogId}`);
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <>
      <Navbar />

      <InputGroup width={{ base: "85vw", md: "40vw" }} ml={{ base: "8vw", md: "33vw" }} _hover={{ boxShadow: '4xl' }}>
        <Input
          value={searchQuery}
          onChange={handleSearchQueryChange}
          placeholder="Search blogs by title..."
          border="1px solid grey"
          borderRadius="20px"
          onKeyDown={handleKeyPress}
        />
        <InputRightElement
          width="3rem"
          cursor="pointer"
          bg="#FBBC05"
          borderRadius="0 20px 20px 0"
          children={
            <Search2Icon
              position="absolute"
              right="0.5rem"
              top="50%"
              transform="translateY(-50%)"
              onClick={handleSearchSubmit}
            />
          }
        />
      </InputGroup>

      {loading?<img id='loader-img' src='https://dogfood2mydoor.com/static/media/dog_load.3a3190f9.gif'/>:<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="2vw" p="3vw 9vw">
        {filteredBlogs.map((blog) => (
          <Box key={blog._id} borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Image src={blog.img} alt="Blog Image" cursor={"pointer"}  onClick={() => handleBlogClick(blog._id)}/>
            <Box p="6" cursor={"pointer"}  onClick={() => handleBlogClick(blog._id)}>
              <Box d="flex" alignItems="baseline">
                <Text as="h2" fontSize="2xl" fontWeight="semibold" lineHeight="shorter" onClick={() => handleBlogClick(blog._id)} cursor="pointer">
                  {blog.title}
                </Text>
              </Box>
              <Text mt="2" color="gray.600" fontSize="lg" lineHeight="tall">
                {Cutcontent(removeHtmlTags(blog.content), 190)}
              </Text>
            </Box>
            <Flex justify="space-between" p="6">
              <Flex align="center">
                <Tooltip label="Like">
                  <IconButton aria-label="Like" icon={<MdThumbUp />} mr="4" />
                </Tooltip>
                <Text>{blog.likes.length}</Text>
              </Flex>
              <Flex align="center">
                <Tooltip label="Comments">
                  <IconButton aria-label="Comments" icon={<MdComment />} mr="4" />
                </Tooltip>
                <Text>{blog.comments.length}</Text>
              </Flex>
              <Flex align="center">
                <Tooltip label="Save">
                  <IconButton aria-label="Save" icon={<MdBookmarkBorder />} />
                </Tooltip>
              </Flex>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>}

      {/* <div style={{ width: "100vw", padding: "3vw 5vw", display: 'flex', flexDirection: 'column', justifyContent: "space-between", gap: '2vw' }}>
        {
          filteredBlogs.map((blog) => (
            <Card
              direction={{ base: 'column', sm: 'row' }}
              overflow='hidden'
              variant='outline'
              key={blog._id}
            >
              {bloggers[blog.createdBy] && (
                <>
                  <Image
                    objectFit='cover'
                    maxW={{ base: '100vw', sm: '250px' }}
                    src={blog.img}
                    alt=' img'
                  />
                  <Stack>
                    <CardBody style={{ cursor: "pointer" }} onClick={() => handleBlogClick(blog._id)}>
                      <Heading size='lg'>{blog.title}</Heading>
                      <Text py='2' fontSize={'lg'}>
                        {Cutcontent(removeHtmlTags(blog.content), 190)}
                      </Text>
                    </CardBody>
                    <CardFooter style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", gap: "1vw", alignItems: "center" }}>
                        <img onClick={() => handleProfileClick(blog.createdBy)} id='blogger-pic' style={{ borderRadius: "50%", cursor: "pointer" }} src={bloggers[blog.createdBy].photoURL} alt="profile-pic" />
                        <Text fontSize={{ base: "2xl", md: "1xl" }}>
                          {bloggers[blog.createdBy].displayName}
                        </Text>
                      </div>
                      <Text >
                        {new Date(blog.dateCreated).toDateString()}
                      </Text>
                    </CardFooter>
                  </Stack>
                </>
              )}
            </Card>
          ))
        }
      </div> */}

    </>
  );
}

export default Blog;
