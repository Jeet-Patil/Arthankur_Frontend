import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Import icons for like/dislike
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Community = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: '', content: '' });
    const [communities, setCommunities] = useState([]);
    const [newCommunity, setNewCommunity] = useState({ name: '', description: '' });
    const [showCreateCommunity, setShowCreateCommunity] = useState(false);
    const [userId, setUserId] = useState(null);
    const userType = localStorage.getItem('userType');
    const token = localStorage.getItem('token');
    const [newComment, setNewComment] = useState('');
    const [activeCommentPost, setActiveCommentPost] = useState(null);

    // Configure axios with default headers
    const axiosConfig = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    // Function to generate a consistent avatar URL based on author name
    const getAvatarUrl = (author) => {
        const name = author?.name || 'Anonymous';
        // Use the author's name as the seed, and style it with a nice background color
        return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=6d28d9,4c1d95,7c3aed&textColor=ffffff`;
    };

    useEffect(() => {
        // Get user ID from token
        const fetchUserId = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/me', axiosConfig);
                setUserId(response.data._id);
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        fetchUserId();
        fetchPosts();
        fetchCommunities();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/posts/all`,
                axiosConfig
            );
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const fetchCommunities = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/communities/all`,
                axiosConfig
            );
            setCommunities(response.data);
        } catch (error) {
            console.error('Error fetching communities:', error);
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                'http://localhost:5000/api/posts',
                {
                    title: newPost.title,
                    content: newPost.content
                },
                axiosConfig
            );
            setNewPost({ title: '', content: '' });
            fetchPosts();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCommunityInputChange = (e) => {
        const { name, value } = e.target;
        setNewCommunity(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateCommunity = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                'http://localhost:5000/api/communities',
                newCommunity,
                axiosConfig
            );
            setNewCommunity({ name: '', description: '' });
            setShowCreateCommunity(false);
            fetchCommunities();
        } catch (error) {
            console.error('Error creating community:', error);
        }
    };

    const handleJoinCommunity = async (communityId) => {
        try {
            await axios.post(
                `http://localhost:5000/api/communities/${communityId}/join`,
                {},
                axiosConfig
            );
            fetchCommunities();
        } catch (error) {
            console.error('Error joining community:', error);
        }
    };

    const handleLike = async (postId, isLike) => {
        try {
            await axios.post(
                `http://localhost:5000/api/posts/${postId}/${isLike ? 'like' : 'dislike'}`,
                {},
                axiosConfig
            );
            fetchPosts(); // Refresh posts to update like counts
        } catch (error) {
            console.error('Error updating post like/dislike:', error);
        }
    };

    const isLiked = (post) => {
        return post.likes?.includes(userId);
    };

    const isDisliked = (post) => {
        return post.dislikes?.includes(userId);
    };

    const handleCommentSubmit = async (postId) => {
        try {
            const response = await axios.post(
                `http://localhost:5000/api/posts/${postId}/comments`,
                { content: newComment },
                axiosConfig
            );
            
            // Update the posts state with the new comment
            setPosts(posts.map(post => 
                post._id === postId ? response.data : post
            ));
            
            // Reset comment form
            setNewComment('');
            setActiveCommentPost(null);
        } catch (error) {
            console.error('Error posting comment:', error);
            toast.error('Failed to post comment');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-3 gap-8">
                {/* Posts Section */}
                <div className="col-span-2">
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
                        <form onSubmit={handlePostSubmit}>
                            <input
                                type="text"
                                name="title"
                                className="w-full p-3 border rounded-lg mb-4"
                                value={newPost.title}
                                onChange={handleInputChange}
                                placeholder="Post Title"
                                required
                            />
                            <textarea
                                name="content"
                                className="w-full p-3 border rounded-lg mb-4"
                                rows="4"
                                value={newPost.content}
                                onChange={handleInputChange}
                                placeholder="What's on your mind?"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700"
                            >
                                Post
                            </button>
                        </form>
                    </div>

                    <div className="space-y-6">
                        {posts.map((post) => (
                            <div key={post._id} className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center mb-4">
                                    <img
                                        src={getAvatarUrl(post.author)}
                                        alt={`${post.author?.name || 'Anonymous'}'s profile`}
                                        className="w-10 h-10 rounded-full mr-4"
                                    />
                                    <div>
                                        <h3 className="font-semibold">{post.author?.name || 'Anonymous'}</h3>
                                        <p className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                                <p className="text-gray-700 mb-4">{post.content}</p>
                                
                                {/* Like/Dislike Section */}
                                <div className="flex items-center space-x-4 mt-4 border-t pt-4">
                                    <button
                                        onClick={() => handleLike(post._id, true)}
                                        className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                                            isLiked(post)
                                                ? 'bg-violet-100 text-violet-600'
                                                : 'hover:bg-gray-100'
                                        }`}
                                    >
                                        <FaThumbsUp className="mr-2" />
                                        <span>{post.likes?.length || 0}</span>
                                    </button>
                                    <button
                                        onClick={() => handleLike(post._id, false)}
                                        className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                                            isDisliked(post)
                                                ? 'bg-red-100 text-red-600'
                                                : 'hover:bg-gray-100'
                                        }`}
                                    >
                                        <FaThumbsDown className="mr-2" />
                                        <span>{post.dislikes?.length || 0}</span>
                                    </button>
                                </div>

                                {/* Comments Section */}
                                <div className="mt-4 border-t pt-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-semibold text-gray-700">
                                            Comments ({post.comments?.length || 0})
                                        </h4>
                                        <button
                                            onClick={() => setActiveCommentPost(post._id)}
                                            className="text-sm text-violet-600 hover:text-violet-700"
                                        >
                                            Add Comment
                                        </button>
                                    </div>

                                    {/* Comment Form */}
                                    {activeCommentPost === post._id && (
                                        <form 
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleCommentSubmit(post._id);
                                            }}
                                            className="mb-4"
                                        >
                                            <textarea
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                className="w-full p-2 border rounded-lg mb-2"
                                                placeholder="Write your comment..."
                                                rows="2"
                                                required
                                            />
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setActiveCommentPost(null);
                                                        setNewComment('');
                                                    }}
                                                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-3 py-1 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                                                >
                                                    Post Comment
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {/* Comments List */}
                                    <div className="space-y-4">
                                        {post.comments?.map((comment, index) => (
                                            <div key={index} className="flex space-x-3">
                                                <img
                                                    src={getAvatarUrl(comment.author)}
                                                    alt={`${comment.author?.name || 'Anonymous'}'s avatar`}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm font-medium">
                                                            {comment.author?.name || 'Anonymous'}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(comment.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-700">{comment.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Communities Section */}
                <div className="col-span-1">
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Communities</h2>
                            <button
                                onClick={() => setShowCreateCommunity(!showCreateCommunity)}
                                className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 text-sm"
                            >
                                {showCreateCommunity ? 'Cancel' : 'Create Community'}
                            </button>
                        </div>

                        {showCreateCommunity && (
                            <form onSubmit={handleCreateCommunity} className="mb-6">
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full p-3 border rounded-lg mb-4"
                                    value={newCommunity.name}
                                    onChange={handleCommunityInputChange}
                                    placeholder="Community Name"
                                    required
                                />
                                <textarea
                                    name="description"
                                    className="w-full p-3 border rounded-lg mb-4"
                                    rows="3"
                                    value={newCommunity.description}
                                    onChange={handleCommunityInputChange}
                                    placeholder="Community Description"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 text-sm"
                                >
                                    Create
                                </button>
                            </form>
                        )}

                        {/* Communities List */}
                        <div className="space-y-4 mt-6">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold">Available Communities</h3>
                                <span className="text-sm text-gray-500">{communities.length} communities</span>
                            </div>
                            
                            {communities.map((community) => (
                                <div key={community._id} 
                                    className={`border rounded-lg p-4 transition-all ${
                                        community.joined ? 'border-violet-500 bg-violet-50' : 'border-gray-200 hover:border-violet-500'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-lg">{community.name}</h3>
                                        <span className="text-sm text-gray-500">
                                            {community.members?.length || 0} members
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4">{community.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex -space-x-2">
                                            {/* Display member avatars (up to 3) */}
                                            {[...Array(Math.min(3, community.members?.length || 0))].map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className="w-8 h-8 rounded-full bg-violet-200 border-2 border-white flex items-center justify-center"
                                                >
                                                    <span className="text-xs text-violet-600">
                                                        {String.fromCharCode(65 + idx)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => handleJoinCommunity(community._id)}
                                            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                                                community.joined
                                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    : 'bg-violet-600 text-white hover:bg-violet-700'
                                            }`}
                                        >
                                            {community.joined ? 'Leave Community' : 'Join Community'}
                                        </button>
                                    </div>
                                    
                                    {/* Community Stats */}
                                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-500">Posts</p>
                                            <p className="font-semibold">{community.posts?.length || 0}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-500">Discussions</p>
                                            <p className="font-semibold">{community.discussions?.length || 0}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-500">Active</p>
                                            <p className="font-semibold text-green-600">Now</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community; 