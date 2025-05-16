import '../styling/scrollButton.css';

export default function Button({ direction, scroll }) {
  return (
    <button
      onClick={() => scroll(direction)}
      className={`scrollButton ${direction}`}
    >
      {direction === "left" ? "◀" : "▶"}
    </button>
  );
}