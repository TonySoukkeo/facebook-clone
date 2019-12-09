import React from "react";
import CommentsInput from "../comments/CommentsInput";
import CommentsContent from "./CommentsContent";
import ReplyPreview from "./ReplyPreview";

const PostComments = ({
  fullName,
  content,
  toggleReply,
  reply,
  profileImage,
  postImage,
  onChange,
  postReply,
  removeImage,
  selectedPostId,
  currentUserProfileImage,
  commentId,
  image,
  selectImage,
  replyImagePreview,
  isReplying,
  replies,
  userId,
  creatorId,
  mainPostId,
  timestamp,
  likes,
  selectComment,
  selectedCommentId,
  selectReply,
  selectedReplyId,
  loading
}) => {
  return (
    <div key={commentId} className="posts__comments-wrapper container">
      {/*** Main comment ****/}
      <CommentsContent
        selectComment={selectComment}
        profileImage={profileImage}
        fullName={fullName}
        postImage={postImage}
        content={content}
        toggleReply={toggleReply}
        userId={userId}
        creatorId={creatorId}
        commentId={commentId}
        mainPostId={mainPostId}
        timestamp={timestamp}
        likes={likes}
        selectedCommentId={selectedCommentId}
      />

      {/**** Show any replies to that comment ****/}
      {replies.length > 0 && selectedPostId !== commentId ? (
        <ReplyPreview toggleReply={toggleReply} replies={replies} />
      ) : isReplying && selectedPostId === commentId ? (
        replies.map(reply => (
          <CommentsContent
            key={reply._id.toString()}
            profileImage={reply.user.profileImage.imageUrl}
            fullName={reply.user.fullName}
            postImage={reply.postImage}
            addedClass="user-image--sm"
            content={reply.content}
            replying={true}
            replyId={reply._id.toString()}
            commentId={commentId}
            userId={userId}
            creatorId={reply.user._id.toString()}
            type="reply"
            mainPostId={mainPostId}
            timestamp={reply.createdAt}
            likes={reply.likes}
            selectReply={selectReply}
            selectedReplyId={selectedReplyId}
          />
        ))
      ) : null}

      {/**** Add a reply to a comment ****/}
      {selectedPostId === commentId && isReplying ? (
        <form onSubmit={postReply}>
          <div className="posts__comments--reply">
            <CommentsInput
              classname="form__input--comment"
              placeholder="Write a reply..."
              name="reply"
              isReplying={isReplying}
              onChange={onChange}
              replyImagePreview={replyImagePreview}
              value={reply}
              currentUserProfileImage={currentUserProfileImage}
              removeImage={removeImage}
              selectImage={() => selectImage}
              image={image}
              loading={loading}
              userId={userId}
            />
          </div>
        </form>
      ) : null}
    </div>
  );
};

export default PostComments;
