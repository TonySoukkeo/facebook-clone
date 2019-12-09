import React from "react";

const ReplyPreview = ({ toggleReply, replies }) => {
  return (
    <div onClick={toggleReply} className="posts__comments-replies">
      <div className="posts__comments-replies-image user-image user-image--sm">
        <img
          src={replies[replies.length - 1].user.profileImage.imageUrl}
          alt="Profile"
          className="profile-img"
        />
      </div>
      <div className="posts__comments-replies-name">
        {replies[replies.length - 1].user.fullName.length > 14
          ? replies[replies.length - 1].user.fullName
              .split("")
              .slice(0, 13)
              .join("") + "..."
          : replies[replies.length - 1].user.fullName}
      </div>
      <span>replied</span>
      <div className="dot"></div>
      <div className="posts__comments-replies-count">
        {replies.length === 1 ? "1 reply" : `${replies.length} replies`}
      </div>
    </div>
  );
};

export default ReplyPreview;
