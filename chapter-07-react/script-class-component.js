class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return React.createElement("h1", null, "Liked!");
    }

    return React.createElement(
      "button",
      {
        className: "like-button",
        onClick: () => this.setState({ liked: true }),
      },
      "Click to like!"
    );
  }
}

const domContainer = document.querySelector("#app");

ReactDOM.render(React.createElement(LikeButton), domContainer);
