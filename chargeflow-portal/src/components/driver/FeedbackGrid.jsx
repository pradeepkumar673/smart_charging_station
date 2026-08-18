import React, { useState } from 'react';
import { Star, ThumbsUp, Sparkles } from 'lucide-react';

export default function FeedbackGrid({ onSubmit }) {
  const categories = [
    { id: 'clean', label: 'Cleanliness' },
    { id: 'access', label: 'Ease of Access' },
    { id: 'cable', label: 'Cable Condition' },
    { id: 'safety', label: 'Lighting & Safety' },
    { id: 'overall', label: 'Overall Experience' },
  ];

  const [ratings, setRatings] = useState({
    clean: 5,
    access: 5,
    cable: 4,
    safety: 5,
    overall: 5,
  });

  const [comment, setComment] = useState('');

  const handleRating = (catId, star) => {
    setRatings((prev) => ({ ...prev, [catId]: star }));
  };

  return (
    <div className="bg-[#1d1b20] border border-[#494551]/60 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2 text-xs font-bold text-[#cfbcff]">
        <Sparkles className="w-4 h-4 text-[#e7c365]" />
        <span>One-Tap Station Feedback</span>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between text-xs">
            <span className="text-[#cbc4d2] font-medium">{cat.label}</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRating(cat.id, star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-4 h-4 ${
                      star <= ratings[cat.id] ? 'text-[#e7c365] fill-current' : 'text-[#494551]'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <textarea
        rows={2}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Anything we can improve at this station? (Optional)"
        className="w-full rounded-xl bg-[#141218] border border-[#494551] p-3 text-xs text-white placeholder-[#948e9c] focus:outline-none focus:border-[#36D8FF]"
      />
    </div>
  );
}
