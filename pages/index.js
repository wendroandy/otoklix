import styles from '../styles/Home.module.css'
import Link from 'next/link'

 const Home = ({posts,error})=> {
  let content;
  if(!error) {
    content=(posts.map((post) => (
      <div key={post.id} className={styles.child}>
        <div>ID: { post.id }</div>
        <div>TITLE: { post.title }</div>
        <div>CONTENT: { post.content }</div>
        <div>PUBLISH AT: { post.published_at}</div>
        <Link href={'/view-post/' + post.id}><a className="button">VIEW</a></Link>  
        <Link href={'/edit-post/' + post.id}><a className="button">EDIT</a></Link>  
        <Link href={'/delete-post/' + post.id}><a className="button">DELETE</a></Link>  
      </div>
    )));
  } else {
    content=(<div>No post or Internet Error</div>);
  }
  return (
    <div className="container">
      <h1>Wendroandy Otoklix Test</h1>
      <Link href={'/new-post/'}><a className="button">Create New Post</a></Link>
      <div className={styles.wrapper}>
        {content}
      </div>
    </div>
  )
}
export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  let posts;
  try {
  const res = await fetch('https://limitless-forest-49003.herokuapp.com/posts')
  posts = await res.json();
  return {
    props: {
      posts,
      error: false
    },
  }
  }
  catch (e) {
    return { props:  {
      error : true
      } 
    };
  }
  
}

export default Home
