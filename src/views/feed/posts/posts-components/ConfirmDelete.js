import React from "react";
import Loading from "../../../../common/helpers/Loading";

const ConfirmDelete = ({ deletePost, cancelDelete, loading, userId }) => {
  return (
    <div className="container">
      <div className="posts__delete-confirm">
        <p>Delete</p>

        <p className="text-secondary">
          Are you sure you want to permanently remove this post from Facebook?
        </p>

        <div className="flex mt-sm">
          <button
            onClick={deletePost}
            className={
              loading.value &&
              loading.type === "delete post" &&
              loading.userId === userId
                ? "btn btn--blue mr-md dark-overlay text-grey flex"
                : "btn btn--blue mr-md"
            }
          >
            {loading.value &&
            loading.type === "delete post" &&
            loading.userId === userId ? (
              <Loading />
            ) : null}{" "}
            Delete
          </button>

          <button onClick={cancelDelete} className="btn btn--light">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
