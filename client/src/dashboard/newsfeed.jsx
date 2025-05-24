import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./dashboard-style.css";

const Newsfeed = () => {
  const [posts, setPosts] = useState([]);
  const [postImage, setPostImage] = useState(null);
  const [editingImage, setEditingImage] = useState(null);
  const [editingImagePreview, setEditingImagePreview] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `
          ${process.env.REACT_APP_API_URL}/api/dashboard`,
          {
            withCredentials: true,
          }
        );
        setCurrentUserId(response.data.user.id);
        setCurrentUser(response.data.user); // Save user object
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `
        ${process.env.REACT_APP_API_URL}/api/getnewsfeed`,
        {
          withCredentials: true,
        }
      );
      if (Array.isArray(response.data)) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!postContent.trim() && !postImage) return; // must have at least one

    try {
      const formData = new FormData();
      formData.append("content", postContent);
      if (postImage) {
        formData.append("image", postImage);
      }
      const response = await axios.post(
        `
        ${process.env.REACT_APP_API_URL}/api/postnewsfeed`,
        formData, // send formData here, not JSON object
        {
          withCredentials: true,
        }
      );
      setPostContent("");
      setPostImage(null);
      setPosts([response.data, ...posts]);
      if (fileInputRef.current) {
        fileInputRef.current.value = null; // Reset file input
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error(
          "Error posting content:",
          error.response.data.error || error.response.data.message
        );
      } else {
        console.error("Error posting content:", error.message);
      }
    }
  };

  const startEditing = (post) => {
    setEditingPostId(post._id);
    setEditingContent(post.content);
    setEditingImage(null); // reset to null (no new image selected yet)
    setEditingImagePreview(post.image?.url || null); // show existing image as preview
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditingContent("");
    setEditingImage(null);
    setEditingImagePreview(null);
  };

  const saveEdit = async (postId) => {
    const trimmedContent = (editingContent || "").trim();

    try {
      const formData = new FormData();
      formData.append("content", trimmedContent);
      if (editingImage) {
        formData.append("image", editingImage);
      }

      const response = await axios.put(
        `
        ${process.env.REACT_APP_API_URL}/api/editpost/${postId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                content: response.data.content,
                image: response.data.image,
              }
            : post
        )
      );
      setEditingPostId(null);
      setEditingContent("");
      setEditingImage(null);
      setEditingImagePreview(null);
    } catch (error) {
      console.error("Error updating post", error);
      console.error("Full error response:", error.response?.data);
    }
  };

  const openDeleteModal = (postId) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async (postId) => {
    if (!postId) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/deletepost/${postId}`,
        {
          withCredentials: true,
        }
      );
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post", error.response?.data?.message);
    } finally {
      setShowDeleteModal(false);
      setPostToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  return (
    <div className=" py-4 dashboard">
      {currentUser && (
        <div className="d-flex align-items-center justify-content-start pb-4 ps-4 mt-2 mb-4 newsfeedDIV">
          {currentUser.image?.url ? (
            <img
              src={currentUser.image.url}
              alt={currentUser.name}
              className="rounded-circle"
              style={{ width: "64px", height: "64px", objectFit: "cover" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-profile.png";
              }}
            />
          ) : (
            <div
              className="rounded-circle bg-secondary d-flex justify-content-center align-items-center text-white fw-bold"
              style={{ width: "64px", height: "64px", fontSize: "24px" }}
            >
              {currentUser.name ? currentUser.name[0].toUpperCase() : "U"}
            </div>
          )}
          <h5 className="ms-3 mb-0 fw-bold">{currentUser.name}</h5>
        </div>
      )}
      <form
        encType="multipart/form-data"
        onSubmit={handlePostSubmit}
        className="mb-4 p-3 bg-white rounded shadow-sm"
        style={{ maxWidth: "600px", margin: "auto" }}
      >
        <textarea
          className="form-control mb-3 rounded-3"
          placeholder="What's on your mind?"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          rows={3}
          style={{ resize: "vertical" }}
        />
        <input
          type="file"
          accept="image/*"
          className="form-control mb-3"
          onChange={(e) => setPostImage(e.target.files[0])}
          ref={fileInputRef}
        />
        <button type="submit" className="btn btn-primary w-100 rounded-pill">
          Post
        </button>
      </form>

      <div className="mb-5" style={{ maxWidth: "600px", margin: "auto" }}>
        <h5 className="mb-4 fw-bold text-center">Newsfeed</h5>
        {posts.map((post) => {
          const user = post.user;

          return (
            <div
              className="card mb-4"
              key={post._id}
              style={{
                borderRadius: "10px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              {/* Post Header */}
              <div className="d-flex align-items-center p-3">
                {user?.image?.url ? (
                  <img
                    src={user.image.url}
                    alt={user.name}
                    className="rounded-circle"
                    style={{
                      width: "48px",
                      height: "48px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-profile.png";
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-secondary d-flex justify-content-center align-items-center text-white fw-bold"
                    style={{
                      width: "48px",
                      height: "48px",
                      fontSize: "20px",
                    }}
                  >
                    {user?.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                )}
                <div className="ms-3">
                  <h6 className="mb-0 fw-bold">
                    {user?.name || "Unknown User"}
                  </h6>
                  <small className="text-muted">
                    {new Date(post.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-3 pb-3">
                {editingPostId === post._id ? (
                  <>
                    <textarea
                      className="form-control mb-2 rounded-3"
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      rows={3}
                      style={{ resize: "vertical" }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control mb-2"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setEditingImage(file);
                        if (file)
                          setEditingImagePreview(URL.createObjectURL(file));
                        else setEditingImagePreview(null);
                      }}
                    />
                    {editingImagePreview && (
                      <div
                        style={{
                          width: "100%",
                          overflow: "hidden",
                          borderRadius: "0.375rem", // Bootstrap's default .rounded
                        }}
                      >
                        <img
                          src={editingImagePreview}
                          alt="Editing Preview"
                          className="img-fluid mb-2 d-block"
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    )}
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-success btn-sm flex-grow-1"
                        onClick={() => saveEdit(post._id)}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm flex-grow-1"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="pre-wrap">{post.content}</p>
                    {post.image?.url && (
                      <div
                        style={{
                          width: "100%",
                          overflow: "hidden",
                          borderRadius: "0.375rem", // Bootstrap's default .rounded
                        }}
                      >
                        <img
                          src={post.image.url}
                          alt="Post"
                          className="img-fluid"
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Post Actions */}
              {user?._id === currentUserId && editingPostId !== post._id && (
                <div className="d-flex justify-content-end p-3 pb-3 gap-2 border-top">
                  <button
                    className="btn btn-outline-primary btn-sm rounded-pill"
                    onClick={() => startEditing(post)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm rounded-pill"
                    onClick={() => openDeleteModal(post._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showDeleteModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={cancelDelete}
                ></button>
              </div>
              <div>
                <p>Are you sure you want to delete this post?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => confirmDelete(postToDelete)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Link
        to="/home"
        className="btn btn-primary position-fixed text-decoration-none"
        style={{ bottom: "20px", left: "20px", zIndex: 1000 }}
        aria-label="Go to Home"
      >
        Home <i className="fas fa-arrow-left ms-2"></i>
      </Link>
    </div>
  );
};

export default Newsfeed;
