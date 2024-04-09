import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Center, Heading, Image, Input, Text } from '@chakra-ui/react';
import Navbar from '../Navbar';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const ViewBlog = () => {

    const { blogId } = useParams();
    const [blog, setBlog] = useState();
    const [blogger, setBlogger] = useState();
    const navigate = useNavigate()
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('');

    const getBlogger = async (uid) => {
        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const userData = docSnap.data();
                setBlogger(userData);
                console.log("Blogger data:", userData);
            } else {
                console.log("No such blogger found!");
            }
        } catch (err) {
            console.error("Error fetching user:", err);
        }
    }

    const getBlog = async () => {
        try {
            const res = await axios.get(`https://pawsitive-backend-seven.vercel.app/blog/${blogId}`);
            setBlog(res.data)
            console.log("blog data:-",res.data)
        } catch (err) {
            console.error('Error getting Blog:', err);
        }
    }

    const getComments = async () => {
        try {
            const res = await axios.get(`https://pawsitive-backend-seven.vercel.app/blog/${blogId}/comments`);
            setComments(res.data);
            console.log("comments data:- ",res.data);
        } catch (err) {
            console.error('Error getting Comments:', err);
        }
    };

    const handleCommentSubmit = async () => {
        try {
            await axios.post(`https://pawsitive-backend-seven.vercel.app/blog/${blogId}/comments`, {
                commenterId: blog?.createdBy, 
                content: newComment
            });
            setNewComment('');
            getComments();
            window.alert("comment posted")
        } catch (err) {
            console.error('Error submitting comment:', err);
        }
    };

    const sanitizeHtml = (html) => {
        return { __html: DOMPurify.sanitize(html) };
    };

    const handleProfileClick = (userId) => {
        navigate(`/Profile/${userId}`);
    };

    useEffect(() => {
        getBlog()
        getComments()
    }, [blogId])

    useEffect(() => {
        getBlogger(blog?.createdBy)
    }, [blog])

    return (
        <>
            <Navbar />
            {blog &&
                <Box display='flex' flexDirection='column' padding='5vw' gap='2vw' width='100vw'>
                    <Box display="flex" flexDirection={{ base: "column", md: "row" }} justifyContent="space-between" marginBottom='2vw' gap="1vw">
                        <Image src={blog.img} alt="" width={{ base: "90vw", md: "30vw" }} alignSelf='flex-start' />
                        <Center position={'relative'} flexDirection='column' justifyContent='center' alignItems='center'>
                            <Text fontSize="4xl" fontWeight={'600'} marginBottom='1vw'>{blog.title}</Text>
                            <Text>{blog.category}</Text>
                            {blogger &&
                                <div style={{ display: "flex", gap: "1vw", alignItems: "center", position: "absolute", bottom: "2vw", left: "2vw" }}>
                                    <img onClick={() => handleProfileClick(blog.createdBy)} style={{ borderRadius: "50%", cursor: "pointer", width: "2vw" }} src={blogger.photoURL} alt="profile-pic" />
                                    <Text>
                                        {blogger.displayName}
                                    </Text>
                                </div>
                            }
                            {blogger &&
                                <Text ml={"2vw"} position={"absolute"} bottom={'2vw'} right={'2vw'}>
                                    Created on:- {new Date(blog.dateCreated).toDateString()}
                                </Text>
                            }
                        </Center>
                    </Box>
                    <Box fontSize={{ base: "1xl", md: "2xl" }} maxWidth='100%' overflowWrap='break-word' dangerouslySetInnerHTML={sanitizeHtml(blog.content)} />
                    <Box>
                        <Heading as="h2" size="lg" mt="4">Comments</Heading>
                        <Box display="flex" mt="2">
                            <Input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment" />
                            <Button ml="2" onClick={handleCommentSubmit} colorScheme="blue">Comment</Button>
                        </Box>
                        {/* {comments && 
                            comments.map((comment, index) => (
                                <Box key={index} border="1px solid #ccc" borderRadius="md" p="2" mt="2">
                                    <Text fontWeight="bold">{comment.commenterId}</Text>
                                    <Text>{comment.content}</Text>
                                    <Text fontSize="sm" color="gray">{new Date(comment.dateCreated).toLocaleString()}</Text>
                                </Box>
                            ))
                        } */}
                    </Box>
                </Box>
            }
        </>
    )
}

export default ViewBlog;
