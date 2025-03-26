import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Center, Heading, Image, Input, Text, useToast } from '@chakra-ui/react';
import Navbar from '../Navbar';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { AuthContext } from '../../context/AuthContext';
import { ThumbUpOutlined as ThumbUpOutlinedIcon, DeleteOutline as DeleteOutlineIcon } from '@mui/icons-material';
import Loader from '../../assets/loader-img.gif';

const ViewBlog = () => {
    const { currentUser } = useContext(AuthContext);
    const { blogId } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState();
    const [blogger, setBlogger] = useState();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commenters, setCommenters] = useState({});
    const [likesCount, setLikesCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(false)
    const toast = useToast();

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
            setLoading(true)
            const res = await axios.get(`${import.meta.env.VITE_backendURL}/blog/${blogId}`);
            setBlog(res.data);
            setLikesCount(res.data.likes.length);
            const didUserLike = res.data.likes.includes(currentUser?.uid);
            console.log("didUserLike: ", didUserLike);
            setIsLiked(didUserLike);
            console.log("blog data:-", res.data);
        } catch (err) {
            console.error('Error getting Blog:', err);
        }
    }

    const getComments = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_backendURL}/blog/${blogId}/comments`);
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
            await axios.post(`${import.meta.env.VITE_backendURL}/blog/${blogId}/comments`, {
                commenterId: currentUser.uid,
                content: newComment
            });
            setNewComment('');
            getComments();
        } catch (error) {
            console.error('Error submitting comment:', error);
            if (error.response && error.response.status === 429) {
                toast({
                    title: "Too Many Requests",
                    description: "You have commented on this blog too many times. Please try again later.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    };
    const handleLikeBlog = async () => {
        try {
            const res = await axios.put(`${import.meta.env.VITE_backendURL}/blog/${blogId}/like`, {
                userId: currentUser.uid,
            });
            console.log("res: ", res);

            setIsLiked(res.data.blog.likes.includes(currentUser.uid));
            setLikesCount(res.data.blog.likes.length);
        } catch (error) {
            console.error('Error liking/unliking Blog:', error);

            if (error.response && error.response.status === 429) {
                toast({
                    title: "Too Many Requests",
                    description: "You have liked this blog too many times. Please try again later.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "An error occurred",
                    description: "Unable to like the blog at this moment. Please try again later.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
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
            {blog ?
                <Box display='flex' flexDirection='column' padding={{ base: "5vw", md: "2vw 12vw" }} gap='2vw' width='100vw'>
                    <Box display="flex" flexDirection={{ base: "column", md: "row" }} justifyContent="space-between" marginBottom='2vw' gap="3vw">
                        <Image src={blog.img} display={{ base: "block", md: "none" }} alt="" borderRadius={"10px"} width={{ base: "90vw", md: "30vw" }} alignSelf='flex-start' />
                        <Center flexDirection='column' justifyContent='center' alignItems='flex-start' minW={"25vw"} minH={"20vw"} gap={'2vw'} p={'1vw'}>
                            <Text fontSize={{ base: "4xl", md: "5xl" }} fontWeight={'600'} marginBottom='1vw'>{blog.title}</Text>
                            <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                                <Text color={"red"}>{blog.category}</Text>
                                <Button leftIcon={<ThumbUpOutlinedIcon />} onClick={() => handleLikeBlog()} cursor="pointer" border="none" color={isLiked ? "blue" : "black"} backgroundColor="white" outline={"none"} _active={{ border: "none" }} _hover={{ border: "none", outline: "none" }}>
                                    <Text as='b'>{likesCount}</Text>
                                </Button>
                            </div>
                            <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                                {blogger &&
                                    <div style={{ display: "flex", gap: "1vw", alignItems: "center" }}>
                                        <img id='blogger-pic' onClick={() => handleProfileClick(blog.createdBy)} style={{ borderRadius: "50%", cursor: "pointer" }} src={blogger.photoURL} alt="profile-pic" />
                                        <Text fontWeight={"500"} fontSize={"2xl"}>
                                            {blogger.displayName}
                                        </Text>
                                    </div>
                                }
                                {blogger &&
                                    <Text ml={"2vw"} fontStyle={"italic"}>
                                        {new Date(blog.dateCreated).toDateString()}
                                    </Text>
                                }
                            </div>
                        </Center>
                        <Image src={blog.img} display={{ base: "none", md: "block" }} alt="" borderRadius={"10px"} minW={{ base: "90vw", md: "30vw" }} alignSelf='center' />
                    </Box>

                    <Box mt={{ base: "6vw", md: "0" }} fontSize={{ base: "1.3rem", md: "2xl" }} maxWidth='100%' overflowWrap='break-word' dangerouslySetInnerHTML={sanitizeHtml(blog.content)} />

                    <Box padding={{ md: "0 5vw", base: "0" }} >
                        <Heading as="h2" size="lg" mt="4">Comments</Heading>
                        <Box display="flex" mt="2">
                            <Input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment" />
                            <Button ml="2" onClick={handleCommentSubmit} colorScheme="blue">Comment</Button>
                        </Box>
                        {comments && comments.comments && comments.comments.length > 0 ? (
                            comments.comments.slice().reverse().map((comment, index) => (
                                <Box key={index} borderBottom="1px solid #ccc" p="2" mt="2">
                                    {commenters[comment.commenterId] && (
                                        <Box display="flex" alignItems="center" >
                                            <Image src={commenters[comment.commenterId].photoURL} alt="commenter-photo" borderRadius="50%" mt={"15px"} width="40px" height="40px" />
                                            <Text fontSize={"2xl"} fontWeight={'500'} mx="2">{commenters[comment.commenterId].displayName}</Text>
                                            <Text fontSize="sm" color="gray" fontStyle={"italic"}>{new Date(comment.dateCreated).toDateString()}</Text>
                                        </Box>
                                    )}
                                    <Text ml={"50px"} fontSize={"1xl"}>{comment.content}</Text>
                                </Box>
                            ))
                        ) : (
                            <Text mt="2" ml={3} fontSize={"xl"} textAlign={"center"}>---- Be the first one to comment ----</Text>
                        )}
                    </Box>
                </Box> : <img id='loader-img' src={Loader} />
            }
        </>
    )
}

export default ViewBlog;
