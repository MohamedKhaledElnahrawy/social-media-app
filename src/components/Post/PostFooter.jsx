import React from "react";
import { Link } from "react-router-dom";
export default function PostFooter({ onCommentClick }) {
  return (
    <div className="flex justify-between border-t border-b py-1 mt-3">
      <Button variant="light" className="flex-1 gap-2 text-gray-600">
        <ThumbsUp size={18} /> Like
      </Button>
      <Button
        onClick={onCommentClick}
        variant="light"
        className="flex-1 gap-2 text-gray-600"
      >
        <MessageSquare size={18} /> Comment
      </Button>

      <Button variant="light" className="flex-1 gap-2 text-gray-600">
        <Share2 size={18} /> Share
      </Button>
    </div>
  );
}
