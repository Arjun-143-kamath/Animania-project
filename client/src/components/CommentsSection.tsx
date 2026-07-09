"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { User, Trash2, Edit2, Send, X, Check } from "lucide-react";
import Link from "next/link";

interface CommentType {
  _id: string;
  text: string;
  user: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function CommentsSection({ malId }: { malId: number }) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {}
    }
    fetchComments();
  }, [malId]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${malId}`);
      setComments(res.data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || newComment.length > 500) return;
    
    setIsSubmitting(true);
    try {
      const res = await api.post(`/comments/${malId}`, { text: newComment });
      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to delete comment");
    }
  };

  const startEditing = (comment: CommentType) => {
    setEditingId(comment._id);
    setEditContent(comment.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim() || editContent.length > 500) return;
    
    try {
      const res = await api.put(`/comments/${commentId}`, { text: editContent });
      setComments(comments.map(c => c._id === commentId ? res.data : c));
      setEditingId(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update comment");
    }
  };

  if (loading) {
    return <div className="py-8 text-center text-muted-foreground animate-pulse">Loading comments...</div>;
  }

  return (
    <div className="mt-12 bg-card rounded-2xl border border-border p-6 lg:p-10 shadow-lg">
      <h2 className="text-2xl font-bold mb-8 text-foreground flex items-center gap-3">
        Discussion <span className="bg-primary/20 text-primary text-sm py-1 px-3 rounded-full">{comments.length}</span>
      </h2>

      {/* Post Comment Form */}
      {currentUser ? (
        <form onSubmit={handlePostComment} className="mb-10 flex gap-4">
          <div className="flex-shrink-0 mt-1">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-border" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border">
                <User className="h-5 w-5 text-secondary-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this anime..."
              className="w-full bg-background border border-border rounded-xl p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none min-h-[100px]"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-xs ${newComment.length >= 500 ? 'text-red-500' : 'text-muted-foreground'}`}>
                {newComment.length}/500
              </span>
              <button 
                type="submit" 
                disabled={isSubmitting || !newComment.trim() || newComment.length > 500}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold text-sm hover:bg-primary/90 transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> {isSubmitting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-10 bg-muted/30 border border-border rounded-xl p-6 text-center">
          <h3 className="font-bold text-foreground mb-2">Join the Conversation</h3>
          <p className="text-sm text-muted-foreground mb-4">Log in or create an account to leave a comment.</p>
          <div className="flex justify-center gap-3">
            <Link href="/login" className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold text-sm hover:bg-primary/90 transition-transform hover:scale-105">
              Log In
            </Link>
            <Link href="/register" className="bg-background text-foreground border border-border px-6 py-2 rounded-full font-bold text-sm hover:bg-muted transition-transform hover:scale-105">
              Sign Up
            </Link>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((comment) => {
            const isOwner = currentUser && (currentUser.id === comment.user._id || currentUser._id === comment.user._id);
            const isEditing = editingId === comment._id;
            
            return (
              <div key={comment._id} className="flex gap-4 p-5 bg-background border border-border rounded-xl group transition-colors hover:border-primary/30">
                <div className="flex-shrink-0">
                  {comment.user.avatar ? (
                    <img src={comment.user.avatar} alt={comment.user.username} className="w-10 h-10 rounded-full object-cover border border-border" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border">
                      <User className="h-5 w-5 text-secondary-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <span className="font-bold text-foreground mr-2">{comment.user.username || 'User'}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        {comment.createdAt !== comment.updatedAt && ' (edited)'}
                      </span>
                    </div>
                    
                    {isOwner && !isEditing && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEditing(comment)} className="p-1.5 text-muted-foreground hover:text-primary bg-muted rounded-md transition-colors" title="Edit">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(comment._id)} className="p-1.5 text-muted-foreground hover:text-red-500 bg-muted rounded-md transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <div className="mt-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-card border border-border rounded-lg p-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none min-h-[80px] text-sm"
                        maxLength={500}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs ${editContent.length >= 500 ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {editContent.length}/500
                        </span>
                        <div className="flex gap-2">
                          <button onClick={cancelEditing} className="px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors border border-border rounded-md hover:bg-muted">
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleUpdateComment(comment._id)}
                            disabled={!editContent.trim() || editContent.length > 500}
                            className="px-3 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-foreground text-sm whitespace-pre-wrap leading-relaxed mt-2">{comment.text}</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
