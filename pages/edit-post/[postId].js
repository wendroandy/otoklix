import Link from 'next/link'
import {useRef} from 'react'
import Router from 'next/router'

export const getStaticPaths = async () => {
  let data;
  let paths;
  try {
  const res = await fetch('https://limitless-forest-49003.herokuapp.com/posts');
  data = await res.json();
  paths = data.map(posts => { 
    return {
      params: {postId: posts.id.toString() }
    }
  })
  }
  catch (e) {
    paths = [{
      params: {postId: "0"}
    }]
  };
  return {
    paths,
    fallback: true,
  }
}


export const getStaticProps = async (context) => {
  
  try {
    const id = context.params.postId;
  const res = await fetch('https://limitless-forest-49003.herokuapp.com/posts/' + id);
  const data = await res.json();
    return {
      props: { posts: data,error: false }
    }
  }
  catch (e) {
    return { props:  {
      error : true
      } 
    };
  }
}

const EditPost = ({ posts,error }) => {
  const titleInputRef=useRef();
  const contentInputRef=useRef();
  const idInputRef=useRef();
  const warningMessage=useRef();
  let content;
  
  const submitHandler=(event)=> {
    event.preventDefault();
    warningMessage.current.textContent="Please Wait"
    const enteredTitle=titleInputRef.current.value;
    const enteredContent=contentInputRef.current.value;
    const data= {
      "title": enteredTitle,
      "content" : enteredContent
    }
    fetch('https://limitless-forest-49003.herokuapp.com/posts/' + idInputRef.current.value, {
      method: 'PUT',
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
  if(error==false) {
    content=(
      <div className="container">
        <h1>Edit Post Page</h1>
        <form onSubmit={submitHandler}> 
        <label>Title :</label><input type="text" placeholder="title" ref={titleInputRef} defaultValue={posts.title} /><br/>
        <label>Content :</label><input type="text" placeholder="content" ref={contentInputRef} defaultValue={posts.content} /><br/>
        <input type="hidden" defaultValue={posts.id} ref={idInputRef} />
        <div ref={warningMessage} className="warning-message"></div>
        <button type="submit" className="button">SUBMIT</button>
        <Link href={'/'}  ><a className="button">BACK</a></Link>
        </form>
    </div>
    );
  } else if(error==true || error==undefined) {
    content=(<div>No post or Internet Error</div>);
  }
  return (
    <div>
      {content}
    </div>
  );
}

export default EditPost;