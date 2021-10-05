"use strict";

const LikeButton = () => {
  let [liked, setLiked] = React.useState(false);

  if (liked) {
    // return React.createElement("span", null, "Liked! 👍");
    return /*#__PURE__*/React.createElement("span", null, "Liked! \uD83D\uDC4D");
  }

  return /*#__PURE__*/React.createElement("button", {
    className: "like-button",
    onClick: () => {
      setLiked(true);
    }
  }, "Click to like!");
};

const domContainer = document.querySelector("#app");

const ManyButtons = () => {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100px",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(LikeButton, null), /*#__PURE__*/React.createElement(LikeButton, null), /*#__PURE__*/React.createElement(LikeButton, null), /*#__PURE__*/React.createElement(LikeButton, null), /*#__PURE__*/React.createElement(LikeButton, null));
};

ReactDOM.render( /*#__PURE__*/React.createElement(ManyButtons, null), domContainer);
