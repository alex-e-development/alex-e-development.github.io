const LikeButton = () => {
  let [liked, setLiked] = React.useState(false);

  if (liked) {
    // return React.createElement("span", null, "Liked! 👍");
    return <span>Liked! 👍</span>;
  }

  return (
    <button
      className="like-button"
      onClick={() => {
        setLiked(true);
      }}
    >
      Click to like!
    </button>
  );
};

const domContainer = document.querySelector("#app");

const ManyButtons = () => {
  return (
    <div style={{ width: "100px", display: "flex", flexDirection: "column" }}>
      <LikeButton />
      <LikeButton />
      <LikeButton />
      <LikeButton />
      <LikeButton />
    </div>
  );
};

ReactDOM.render(<ManyButtons />, domContainer);
