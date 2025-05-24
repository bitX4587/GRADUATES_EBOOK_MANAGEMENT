import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, default: "", required: false },
  image: {
    url: { type: String, required: false },
    public_id: { type: String, required: false },
  },
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);
export default Post;
