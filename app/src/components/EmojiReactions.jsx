import { useState } from 'react';
import { SoundManager } from '../utils/sounds';

const REACTIONS = [
  { emoji: '🔥', label: 'fire', count: 0 },
  { emoji: '💀', label: 'skull', count: 0 },
  { emoji: '💯', label: 'hundred', count: 0 },
  { emoji: '🤔', label: 'thinking', count: 0 },
];

export default function EmojiReactions({ articleId }) {
  const [reactions, setReactions] = useState(REACTIONS);
  const [userReactions, setUserReactions] = useState(new Set());

  const handleReaction = (index) => {
    SoundManager.play(SoundManager.Sounds.POP);

    setReactions(prev => {
      const newReactions = [...prev];
      if (userReactions.has(index)) {
        newReactions[index] = { ...newReactions[index], count: newReactions[index].count - 1 };
        setUserReactions(prev => {
          const next = new Set(prev);
          next.delete(index);
          return next;
        });
      } else {
        newReactions[index] = { ...newReactions[index], count: newReactions[index].count + 1 };
        setUserReactions(prev => new Set(prev).add(index));
      }
      return newReactions;
    });
  };

  return (
    <div className="emoji-reactions">
      {reactions.map((reaction, index) => (
        <button
          key={index}
          className={`emoji-button ${userReactions.has(index) ? 'active' : ''}`}
          onClick={() => handleReaction(index)}
          aria-label={`React with ${reaction.label}`}
        >
          <span className="emoji">{reaction.emoji}</span>
          <span className="count">{reaction.count}</span>
        </button>
      ))}
    </div>
  );
} 