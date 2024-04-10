import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Center, Heading, Image, Input, Text } from '@chakra-ui/react';
import Navbar from '../Navbar';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const ViewBlog = () => {
    const { blogId } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState();
    const [blogger, setBlogger] = useState();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commenters, setCommenters] = useState({});

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
            setBlog(res.data);
            console.log("blog data:-", res.data);
        } catch (err) {
            console.error('Error getting Blog:', err);
        }
    }

    const getComments = async () => {
        try {
            const res = await axios.get(`https://pawsitive-backend-seven.vercel.app/blog/${blogId}/comments`);
            setComments(res.data);
            console.log("comments data:- ", res.data);
        } catch (err) {
            console.error('Error getting Comments:', err);
        }
    };

    const getCommenterDetails = async (uid) => {
        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const userData = docSnap.data();
                return userData;
            } else {
                console.log("No such document!");
                return null;
            }
        } catch (err) {
            console.error("Error fetching commenter details:", err);
            return null;
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
        getBlog();
        getComments();
    }, [blogId]);

    useEffect(() => {
        getBlogger(blog?.createdBy);
    }, [blog]);

    useEffect(() => {
        if (comments && Array.isArray(comments.comments)) {
            const uniqueCommenterIds = [...new Set(comments.comments.map(comment => comment.commenterId))];
            const fetchCommenters = async () => {
                const commenterDetailsPromises = uniqueCommenterIds.map(uid => getCommenterDetails(uid));
                const commenterDetails = await Promise.all(commenterDetailsPromises);
                const commentersData = {};
                commenterDetails.forEach((userData, index) => {
                    commentersData[uniqueCommenterIds[index]] = userData;
                });
                setCommenters(commentersData);
            };
            fetchCommenters();
        }
    }, [comments]);

    return (
        <>
            <Navbar />
            {blog &&
                <Box display='flex' flexDirection='column' padding={{ base: "5vw", md: "2vw 12vw" }} gap='2vw' width='100vw'>
                    <Box display="flex" flexDirection={{ base: "column", md: "row" }} justifyContent="space-between" marginBottom='2vw' gap="3vw">
                        <Image src={blog.img} display={{base:"block",md:"none"}} alt="" borderRadius={{ base: "10px", md: "0" }} width={{ base: "90vw", md: "30vw" }} alignSelf='flex-start' />
                            <Center position={'relative'} flexDirection='column' justifyContent='center' alignItems='flex-start' minW={"25vw"} minH={"20vw"}>
                                <Text fontSize="4xl" fontWeight={'600'} marginBottom='1vw'>{blog.title}</Text>
                                <Text  mb={{ base: "8vw", md: "3vw" }}>{blog.category}</Text>
                                {blogger &&
                                    <div style={{ display: "flex", gap: "1vw", alignItems: "center", position: "absolute", bottom: "2vw", left: "0" }}>
                                        <img id='blogger-pic' onClick={() => handleProfileClick(blog.createdBy)} style={{ borderRadius: "50%", cursor: "pointer", width: "2vw" }} src={blogger.photoURL} alt="profile-pic" />
                                        <Text fontWeight={"500"} fontSize={"2vw"}>
                                            {blogger.displayName}
                                        </Text>
                                    </div>
                                }
                                {blogger &&
                                    <Text ml={"2vw"} position={"absolute"} bottom={'2vw'} right={'0'}>
                                        {new Date(blog.dateCreated).toDateString()}
                                    </Text>
                                }
                            </Center>
                        <Image src={blog.img} display={{base:"none",md:"block"}} alt="" borderRadius={{ base: "10px", md: "0" }} width={{ base: "90vw", md: "30vw" }} alignSelf='flex-start' />
                    </Box>

                    <Box fontSize={{ base: "1xl", md: "2xl" }} maxWidth='100%' overflowWrap='break-word' dangerouslySetInnerHTML={sanitizeHtml(blog.content)} />

                    <Box padding={{md:"0 5vw",base:"0"}} >
                        <Heading as="h2" size="lg" mt="4">Comments</Heading>
                        <Box display="flex" mt="2">
                            <Input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment" />
                            <Button ml="2" onClick={handleCommentSubmit} colorScheme="blue">Comment</Button>
                        </Box>
                        {comments && comments.comments &&
                            comments.comments.slice().reverse().map((comment, index) => (
                                <Box key={index} borderBottom="1px solid #ccc" p="2" mt="2">
                                    {commenters[comment.commenterId] && (
                                        <Box display="flex" alignItems="center">
                                            <Image src={commenters[comment.commenterId].photoURL} alt="commenter-photo" borderRadius="50%" width="30px" height="30px" />
                                            <Text ml="2">{commenters[comment.commenterId].displayName}</Text>
                                        </Box>
                                    )}
                                    <Text>{comment.content}</Text>
                                    <Text fontSize="sm" color="gray">{new Date(comment.dateCreated).toLocaleString()}</Text>
                                </Box>
                            ))
                        }
                    </Box>
                </Box>
            }
        </>
    )
}

export default ViewBlog;
