import { useEffect, useState } from 'react';

const useStories = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const dummy = [
      {
        _id: '1',
        caption: 'Exploring the Mountains',
        video: 'https://res.cloudinary.com/dxbsnmr2k/video/upload/v1714380450/mountain_clip.mp4',
        author: {
          username: 'rahul',
          profilePicture: 'https://source.unsplash.com/random/150x150?mountain',
        },
      },
      {
        _id: '2',
        caption: 'Beach Walk',
        video: 'https://res.cloudinary.com/dxbsnmr2k/video/upload/v1714380450/beach_clip.mp4',
        author: {
          username: 'kallur',
          profilePicture: 'https://source.unsplash.com/random/150x150?beach',
        },
      },
      {
        _id: '3',
        caption: 'Night Drive',
        video: 'https://res.cloudinary.com/dxbsnmr2k/video/upload/v1714380450/city_drive.mp4',
        author: {
          username: 'junaid',
          profilePicture: 'https://source.unsplash.com/random/150x150?car',
        },
      },
      {
        _id: '4',
        caption: 'Nature Escape',
        video: 'https://res.cloudinary.com/dxbsnmr2k/video/upload/v1714380450/forest_walk.mp4',
        author: {
          username: 'arjun',
          profilePicture: 'https://source.unsplash.com/random/150x150?forest',
        },
      },
       {
        _id: '4',
        caption: 'Nature Escape',
        video: 'https://res.cloudinary.com/dxbsnmr2k/video/upload/v1714380450/forest_walk.mp4',
        author: {
          username: 'arjun',
          profilePicture: 'https://source.unsplash.com/random/150x150?forest',
        },
      }, {
        _id: '4',
        caption: 'Nature Escape',
        video: 'https://res.cloudinary.com/dxbsnmr2k/video/upload/v1714380450/forest_walk.mp4',
        author: {
          username: 'arjun',
          profilePicture: 'https://source.unsplash.com/random/150x150?forest',
        },
      }, {
        _id: '4',
        caption: 'Nature Escape',
        video: 'https://res.cloudinary.com/dxbsnmr2k/video/upload/v1714380450/forest_walk.mp4',
        author: {
          username: 'arjun',
          profilePicture: 'https://source.unsplash.com/random/150x150?forest',
        },
      }, {
        _id: '4',
        caption: 'Nature Escape',
        video: 'https://res.cloudinary.com/dxbsnmr2k/video/upload/v1714380450/forest_walk.mp4',
        author: {
          username: 'arjun',
          profilePicture: 'https://source.unsplash.com/random/150x150?forest',
        },
      }, {
        _id: '4',
        caption: 'Nature Escape',
        video: 'https://res.cloudinary.com/dxbsnmr2k/video/upload/v1714380450/forest_walk.mp4',
        author: {
          username: 'arjun',
          profilePicture: 'https://source.unsplash.com/random/150x150?forest',
        },
      }, {
        _id: '4',
        caption: 'Nature Escape',
        video: 'https://res.cloudinary.com/dxbsnmr2k/video/upload/v1714380450/forest_walk.mp4',
        author: {
          username: 'arjun',
          profilePicture: 'https://source.unsplash.com/random/150x150?forest',
        },
      }, {
        _id: '4',
        caption: 'Nature Escape',
        video: 'https://res.cloudinary.com/dxbsnmr2k/video/upload/v1714380450/forest_walk.mp4',
        author: {
          username: 'arjun',
          profilePicture: 'https://source.unsplash.com/random/150x150?forest',
        },
      }, {
        _id: '4',
        caption: 'Nature Escape',
        video: 'https://res.cloudinary.com/dxbsnmr2k/video/upload/v1714380450/forest_walk.mp4',
        author: {
          username: 'arjun',
          profilePicture: 'https://source.unsplash.com/random/150x150?forest',
        },
      }, {
        _id: '4',
        caption: 'Nature Escape',
        video: 'https://res.cloudinary.com/dxbsnmr2k/video/upload/v1714380450/forest_walk.mp4',
        author: {
          username: 'arjun',
          profilePicture: 'https://source.unsplash.com/random/150x150?forest',
        },
      }, {
        _id: '4',
        caption: 'Nature Escape',
        video: 'https://res.cloudinary.com/dxbsnmr2k/video/upload/v1714380450/forest_walk.mp4',
        author: {
          username: 'arjun',
          profilePicture: 'https://source.unsplash.com/random/150x150?forest',
        },
      }, {
        _id: '4',
        caption: 'Nature Escape',
        video: 'https://res.cloudinary.com/dxbsnmr2k/video/upload/v1714380450/forest_walk.mp4',
        author: {
          username: 'arjun',
          profilePicture: 'https://source.unsplash.com/random/150x150?forest',
        },
      }, {
        _id: '4',
        caption: 'Nature Escape',
        video: 'https://res.cloudinary.com/dxbsnmr2k/video/upload/v1714380450/forest_walk.mp4',
        author: {
          username: 'arjun',
          profilePicture: 'https://source.unsplash.com/random/150x150?forest',
        },
      }, {
        _id: '4',
        caption: 'Nature Escape',
        video: 'https://res.cloudinary.com/dxbsnmr2k/video/upload/v1714380450/forest_walk.mp4',
        author: {
          username: 'arjun',
          profilePicture: 'https://source.unsplash.com/random/150x150?forest',
        },
      }, {
        _id: '4',
        caption: 'Nature Escape',
        video: 'https://res.cloudinary.com/dxbsnmr2k/video/upload/v1714380450/forest_walk.mp4',
        author: {
          username: 'arjun',
          profilePicture: 'https://source.unsplash.com/random/150x150?forest',
        },
      }, {
        _id: '4',
        caption: 'Nature Escape',
        video: 'https://res.cloudinary.com/dxbsnmr2k/video/upload/v1714380450/forest_walk.mp4',
        author: {
          username: 'arjun',
          profilePicture: 'https://source.unsplash.com/random/150x150?forest',
        },
      }, {
        _id: '4',
        caption: 'Nature Escape',
        video: 'https://res.cloudinary.com/dxbsnmr2k/video/upload/v1714380450/forest_walk.mp4',
        author: {
          username: 'arjun',
          profilePicture: 'https://source.unsplash.com/random/150x150?forest',
        },
      }, {
        _id: '4',
        caption: 'Nature Escape',
        video: 'https://res.cloudinary.com/dxbsnmr2k/video/upload/v1714380450/forest_walk.mp4',
        author: {
          username: 'arjun',
          profilePicture: 'https://source.unsplash.com/random/150x150?forest',
        },
      },
    ];

    setStories(dummy);
  }, []);

  return { stories };
};

export default useStories;
