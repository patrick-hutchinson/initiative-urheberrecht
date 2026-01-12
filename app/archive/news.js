import React from 'react';
import axios from 'axios';

export default function Newsfeed({ posts }) {
  return (
    <div>
      <h1>My Facebook Newsfeed</h1>
      {posts && posts.length > 0 ? (
        <ul>
          {posts.map((post, index) => (
            <li key={index}>
              <p>{post.message}</p>
              <small>{new Date(post.created_time).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const response = await axios.get(
        //  `https://graph.facebook.com/100066842403276/feed?access_token=${process.env.FB_ACCESS_TOKEN}`
      `https://graph.facebook.com/v16.0/me/feed?access_token=${process.env.FB_ACCESS_TOKEN}`
    );
    return {
      props: {
        posts: response.data.data,
      },
    };
  } catch (error) {
    console.error('Error fetching Facebook feed:', error);
    return {
      props: {
        posts: [],
      },
    };
  }
}


