import Link from 'next/link'

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

const ViewPost = ({ posts,error }) => {
  let content;
  if(error==false) {
    content=(
      <div className="container">
        <h1>Post Detail Page</h1>
        <div>POST ID : { posts.id }</div>
        <div>POST TITLE: { posts.title }</div>
        <div>POST CONTENT : { posts.content }</div>
        <div>POST PUBLISHED AT: { posts.published_at}</div>
        <div>POST CREATED AT: { posts.created_at}</div>
        <div>POST UPDATED AT: { posts.updated_at}</div>
        <Link href={'/'}  ><a className="button">BACK</a></Link>
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

export default ViewPost;