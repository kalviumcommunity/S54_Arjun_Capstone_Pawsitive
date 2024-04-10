import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Navbar'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axios from 'axios';
import { Button, Text } from '@chakra-ui/react'
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const CreateBlog = () => {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['clean']
        ],
    }
    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet',
        'link'
    ]
    const {currentUser}=useContext(AuthContext)
    const [input, setInput] = useState({})
    const navigate=useNavigate()
    function handleInput(e) {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const createNewBlog= async ()=>{
        try {
            console.log("input: ", input);
            let res = await axios.post('https://pawsitive-backend-seven.vercel.app/blog', input);
            if (res.status === 201) {
                navigate("/Blog")
            } else {
                window.alert("error")
                console.log(res)
            }
        } catch (err) {
            console.error('Error posting Blog:', err);
        }
    }

    useEffect(()=>{
        setInput({'createdBy': currentUser.uid})
    }, [currentUser])
    return (
        <div>
            <Navbar />
            <div style={{ width: '100w', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2vw' }}>
                <Text fontSize={'3xl'} fontWeight={'600'} mb={'1vw'}>Create a Blog Post</Text>
                <form id='create-blog' style={{ display: 'flex', flexDirection: 'column', width: '50vw', gap: '1vw' }}>
                    <input type="title" placeholder='Title' name='title' onChange={(e) => handleInput(e)} style={{ border: '1px solid grey', borderRadius: '5px', padding: '10px' }} />
                    <input type='summary' placeholder='Headline' name='headline' onChange={(e) => handleInput(e)} style={{ border: '1px solid grey', borderRadius: '5px', padding: '10px' }} />
                    <input type="url" placeholder='Image link' name='img' onChange={(e) => handleInput(e)} style={{ border: '1px solid grey', borderRadius: '5px', padding: '10px' }} />
                    <input type="text" placeholder='Category' name='category' onChange={(e) => handleInput(e)} style={{ border: '1px solid grey', borderRadius: '5px', padding: '10px' }} />
                    <ReactQuill className='quill' style={{borderRadius: '10px', height:'20vh'}} name='content' onChange={newValue => setInput({...input,'content':newValue})} theme='snow' modules={modules} formats={formats} />
                </form>
                
                <Button type='submit' onClick={()=>createNewBlog()} mt={20}>
                    Create blog
                </Button>
            </div>
        </div>
    )
}

export default CreateBlog