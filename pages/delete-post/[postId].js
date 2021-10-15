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
      method: 'DELETE',
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
        <form onSubmit={submitHandler}>
        <h1>Delete Post Page</h1>
        <div>POST ID : { posts.id }</div>
        <div>POST TITLE: { posts.title }</div>
        <div>POST CONTENT : { posts.content }</div>
        <div>POST PUBLISHED AT: { posts.published_at}</div>
        <div>POST CREATED AT: { posts.created_at}</div>
        <div>POST UPDATED AT: { posts.updated_at}</div>
        <div>Are you sure you want to delete this page?</div>
        <input type="hidden" ref={titleInputRef} defaultValue={posts.title} />
        <input type="hidden" ref={contentInputRef} defaultValue={posts.content} />
        <input type="hidden" defaultValue={posts.id} ref={idInputRef} />
        <div ref={warningMessage} className="warning-message"></div>
        <button type="submit" className="button">YES</button>
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