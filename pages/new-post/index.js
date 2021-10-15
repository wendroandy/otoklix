
import Link from 'next/link'
import {useRef} from 'react'
import Router from 'next/router'

const AddPost = () => {
  const titleInputRef=useRef();
  const contentInputRef=useRef();
  const warningMessage=useRef();

  const submitHandler=(event)=> {
    event.preventDefault();
    warningMessage.current.textContent="Please Wait"
    const enteredTitle=titleInputRef.current.value;
    const enteredContent=contentInputRef.current.value;
    const data= {
      "title": enteredTitle,
      "content" : enteredContent
    }
    fetch('https://limitless-forest-49003.herokuapp.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      warningMessage.current.textContent="success, back to home";
      Router.push('/')
    })
    .catch((error) => {
      warningMessage.current.textContent=error;
    });
  }
   return (
    <div className="container">
      <h1>Add New Post Page</h1>
      <form onSubmit={submitHandler}>
        <label>Title :</label><input type="text" placeholder="title" ref={titleInputRef}/><br/>
        <label>Content :</label><input type="text" placeholder="content" ref={contentInputRef}/><br/>
        <div ref={warningMessage} className="warning-message"></div>
        <button type="submit" className="button">SUBMIT</button>
        <Link href={'/'}  ><a className="button">BACK</a></Link>
      </form>
    </div>
  );
}

export default AddPost;