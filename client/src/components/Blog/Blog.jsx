import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import axios from 'axios';
import { Input, InputGroup, InputRightElement, SimpleGrid, Button, HStack } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import BlogCard from './BlogCard';
import { MdArrowBack,MdArrowForward } from "react-icons/md";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [bloggers, setBloggers] = useState({});
  const [loading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(9);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://pawsitive-backend-seven.vercel.app/blog/all');
      const data = response.data;
      const reversedBlogs = [...data].reverse();
      setBlogs(reversedBlogs);
      setFilteredBlogs(reversedBlogs);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBlogger = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setBloggers(prevState => ({ ...prevState, [uid]: userData }));
      } else {
        console.log("No such document!");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    if (!searchQuery) {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(blog => blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || blog.category.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredBlogs(filtered);
      setCurrentPage(1);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredBlogs.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    blogs.forEach(blog => {
      getBlogger(blog.createdBy);
    });
  }, [blogs]);

  const totalPages = Math.ceil(filteredBlogs.length / postsPerPage);

  return (
    <>
      <Navbar />

      <InputGroup width={{ base: "90vw", md: "40vw" }} ml={{ base: "6vw", md: "33vw" }} _hover={{ boxShadow: '4xl' }}>
        <Input
          value={searchQuery}
          onChange={handleSearchQueryChange}
          placeholder="Search blogs by title, category..."
          border="1px solid grey"
          borderRadius="20px"
          onKeyDown={handleKeyPress}
        />
        <InputRightElement
          width="3rem"
          cursor="pointer"
          bg="#FBBC05"
          border='solid 1px grey'
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

      {loading ? <img id='loader-img' src='https://dogfood2mydoor.com/static/media/dog_load.3a3190f9.gif' /> : (
        <>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="2vw" p={{ base: "4vw", md: "3vw 9vw" }}>
            {currentPosts.map((blog) => (
              <BlogCard key={blog._id} blog={blog} bloggers={bloggers} />
            ))}
          </SimpleGrid>

          <HStack justifyContent="center" my={6}>
            <Button leftIcon={<MdArrowBack/>} variant={"outline"}
              onClick={() =>currentPage!=1 && paginate(currentPage - 1)}
            >
            </Button>
            {[...Array(totalPages).keys()].map(number => (
              <Button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                variant={currentPage === number + 1 ? 'solid' : 'outline'}
                // colorScheme={currentPage === number + 1 ? 'blue' : 'inherit'}
              >
                {number + 1}
              </Button>
            ))}
            <Button rightIcon={<MdArrowForward/>} variant={"outline"}
              onClick={() =>currentPage!=totalPages && paginate(currentPage + 1)}
            >
            </Button>
          </HStack>
        </>
      )}
    </>
  );
};

export default Blog;
