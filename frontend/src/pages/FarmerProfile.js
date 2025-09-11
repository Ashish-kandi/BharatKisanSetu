import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FarmerProfile.css';

// Helper functions for localStorage
function getFarmerData(farmerId) {
  return JSON.parse(localStorage.getItem(`farmer_${farmerId}`)) || null;
}

function saveFarmerData(farmerId, data) {
  localStorage.setItem(`farmer_${farmerId}`, JSON.stringify(data));
}

const defaultFarmer = {
  name: 'Ramesh Kumar',
  phone: '9876543210',
  address: 'Nalgonda, Telangana',
  avatar: 'https://thumbs.dreamstime.com/z/happy-indian-farmer-holding-sickle-paddy-crop-hand-concept-good-yields-due-to-monsoon-rains-217982627.jpg',
  posts: [],
  followers: 340,
  following: 185,
  bio: 'Organic farmer. Passionate about sustainable agriculture and fresh produce.',
};

function FarmerProfile() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get farmer info from location or localStorage
  const farmer =
    location.state?.farmer ||
    JSON.parse(localStorage.getItem('farmer')) ||
    defaultFarmer;

  const farmerId = farmer.phone; // Use phone as unique ID

  // Load farmer data or initialize if new
  const [farmerData, setFarmerData] = useState(() => {
    const data = getFarmerData(farmerId);
    if (data) return data;
    // If new farmer, initialize
    const initialData = {
      ...farmer,
      posts: [],
      followers: farmer.followers || 0,
      following: farmer.following || 0,
    };
    saveFarmerData(farmerId, initialData);
    return initialData;
  });

  // Persist farmerData to localStorage on change
  useEffect(() => {
    saveFarmerData(farmerId, farmerData);
  }, [farmerData, farmerId]);

  // For new post form
  const [newPost, setNewPost] = useState({ file: null, caption: '', type: 'image' });

  // For comment inputs
  const [commentInputs, setCommentInputs] = useState({});

  // Handle file input change (image/video)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const type = file.type.startsWith('video') ? 'video' : 'image';
    setNewPost({ ...newPost, file, type });
  };

  // Handle posting new image/video
  const handlePost = () => {
    if (!newPost.file || !newPost.caption.trim()) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      const post = {
        id: Date.now(),
        image: newPost.type === 'image' ? url : undefined,
        video: newPost.type === 'video' ? url : undefined,
        caption: newPost.caption,
        likes: 0,
        liked: false,
        comments: [],
      };
      setFarmerData(data => ({
        ...data,
        posts: [post, ...data.posts],
      }));
      setNewPost({ file: null, caption: '', type: 'image' });
    };
    reader.readAsDataURL(newPost.file);
  };

  // Like/unlike a post
  const handleLike = (postId) => {
    setFarmerData(data => ({
      ...data,
      posts: data.posts.map(post =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      ),
    }));
  };

  // Handle comment input change
  const handleCommentInput = (postId, value) => {
    setCommentInputs(inputs => ({
      ...inputs,
      [postId]: value,
    }));
  };

  // Add a comment to a post
  const handleAddComment = (postId) => {
    const comment = (commentInputs[postId] || '').trim();
    if (!comment) return;
    setFarmerData(data => ({
      ...data,
      posts: data.posts.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post
      ),
    }));
    setCommentInputs(inputs => ({ ...inputs, [postId]: '' }));
  };

  // Navigation handlers
  const handleMessage = () => {
    navigate('/chat', { state: { farmer: farmerData } });
  };
  const handleCall = () => {
    window.open(`tel:${farmerData.phone}`);
  };

  return (
    <div className="farmer-profile-bg">
      <div className="farmer-profile-container">
        <div className="profile-card-glass">
          <div className="avatar-ring">
            <div className="avatar-photo-container">
              <img src={farmerData.avatar} alt={farmerData.name} className="profile-avatar" />
              {/* Farmer name centered in white, no black text */}
              <div className="avatar-center-text">{farmerData.name}</div>
            </div>
          </div>
          <div className="profile-info">
            <div className="profile-location">📍 {farmerData.address}</div>
            <div className="profile-phone">📞 {farmerData.phone}</div>
            <div className="profile-stats-row">
              <div className="profile-stat">
                <div className="profile-stat-num">{farmerData.posts.length}</div>
                <div className="profile-stat-label">Posts</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-num">{farmerData.followers}</div>
                <div className="profile-stat-label">Followers</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-num">{farmerData.following}</div>
                <div className="profile-stat-label">Following</div>
              </div>
            </div>
            <div className="profile-bio">{farmerData.bio}</div>
            <div className="profile-action-row">
              <button className="profile-btn msg" onClick={handleMessage}>💬 Message</button>
              <button className="profile-btn call" onClick={handleCall}>📞 Call</button>
            </div>
          </div>
        </div>
        {/* Add Post Form */}
        <div className="profile-add-post">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
          <input
            type="text"
            placeholder="Enter a caption..."
            value={newPost.caption}
            onChange={e => setNewPost({ ...newPost, caption: e.target.value })}
          />
          <button
            onClick={handlePost}
            disabled={!newPost.file || !newPost.caption.trim()}
          >
            Post
          </button>
        </div>
        <h3 className="profile-posts-title">Posts</h3>
        <div className="profile-posts-grid">
          {farmerData.posts.length === 0 && (
            <div style={{ color: '#888', margin: '24px auto' }}>
              No posts yet. Share your first photo or video!
            </div>
          )}
          {farmerData.posts.map(post => (
            <div key={post.id} className="profile-post-card">
              {post.video ? (
                <video src={post.video} controls className="profile-post-media" />
              ) : (
                <img src={post.image} alt="post" className="profile-post-img" />
              )}
              <div className="profile-post-caption">{post.caption}</div>
              <div className="profile-post-stats">
                <button
                  className={`like-btn${post.liked ? ' liked' : ''}`}
                  onClick={() => handleLike(post.id)}
                >
                  {post.liked ? '❤️ Unlike' : '🤍 Like'} {post.likes}
                </button>
              </div>
              <div className="profile-comments-section">
                <div className="profile-comments-list">
                  {post.comments.map((c, idx) => (
                    <div key={idx} className="profile-comment-item">💬 {c}</div>
                  ))}
                </div>
                <div className="profile-comment-input-row">
                  <input
                    className="profile-comment-input"
                    type="text"
                    placeholder="Add a comment..."
                    value={commentInputs[post.id] || ''}
                    onChange={e => handleCommentInput(post.id, e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddComment(post.id); }}
                  />
                  <button
                    className="add-comment-btn"
                    onClick={() => handleAddComment(post.id)}
                    disabled={!commentInputs[post.id]?.trim()}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FarmerProfile;
