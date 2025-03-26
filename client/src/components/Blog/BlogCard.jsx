import React, { useContext, useEffect, useState } from 'react';
import { Box, Image, Text, IconButton, useToast } from '@chakra-ui/react';
import { MdBookmarkBorder,MdBookmarks } from 'react-icons/md';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../firebase/firebase';

const BlogCard = ({ blog, bloggers }) => {
    const [hovered, setHovered] = useState(false);
    const [saved, setSaved] = useState(false);
    const navigate = useNavigate();
    const toast=useToast()
    const { currentUser } = useContext(AuthContext)
    const handleBlogClick = () => {
        navigate(`/ViewBlog/${blog._id}`);
    };
    useEffect(()=>{
        checkSaved()
    })
    const handleSaveBlog = async () => {
        try {
            const userRef = doc(db, 'users', currentUser.uid);
            if (saved) {
                await updateDoc(userRef, {
                    savedBlogs: arrayRemove(blog._id),
                });
            } else {
                await updateDoc(userRef, {
                    savedBlogs: arrayUnion(blog._id),
                });
                blogSaved()
            }
            setSaved(!saved);
        } catch (err) {
            console.error('Error saving blog:', err);
        }
    };
    const checkSaved = async () => {
        try {
            const userRef = doc(db, 'users', currentUser.uid);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                const userData = docSnap.data();
                const isSaved = userData.savedBlogs.includes(blog._id);
                setSaved(isSaved);
            }
        } catch (err) {
            console.error('Error checking savedBlogs:', err);
        }
    };
    const blogSaved = () => {
        toast({
            title: 'Blog saved successfully',
            position: 'top-right',
            status: 'success',
            duration: 3000
        })
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
    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            position="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className='text-focus-in'
        >
            <Image src={blog.img} alt="Blog Image" cursor="pointer" onClick={handleBlogClick} />
            <Box p="6" cursor="pointer" onClick={handleBlogClick}>
                <Box d="flex" alignItems="baseline">
                    <Text as="h2" fontSize="2xl" fontWeight="semibold" lineHeight="shorter">
                        {blog.title}
                    </Text>
                </Box>
                <Text mt="2" color="gray.600" fontSize="lg" lineHeight="tall">
                    {Cutcontent(removeHtmlTags(blog.content), 150)}
                </Text>
            </Box>
            <IconButton
                className='text-focus-in'
                boxShadow={"3xl"}
                position={"absolute"}
                variant={"solid"}
                colorScheme='blackAlpha'
                right={2}
                top={2}
                aria-label='Save'
                icon={saved?<MdBookmarks/>:<MdBookmarkBorder />}
                display={{base:"inline-flex",md:hovered || saved ? "inline-flex" : "none"}}
                // display={}
                onClick={handleSaveBlog}
            />
        </Box>
    );
};

export default BlogCard;
