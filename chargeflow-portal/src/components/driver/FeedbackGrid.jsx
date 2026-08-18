import React, { useState } from 'react';
import { Star, Sparkles, Send } from 'lucide-react';
import Button from '../ui/Button';
import api from '../../services/api';
import useToast from '../../hooks/useToast';

export default function FeedbackGrid({ sessionId, onSubmitted }) {
  const { showToast } = useToast();

  const categories = [
    { id: 'cleanliness', label: 'Cleanliness' },
    { id: 'easeOfAccess', label: 'Ease of Access' },
    { id: 'cableCondition', label: 'Cable Condition' },
    { id: 'lighting', label: 'Lighting & Safety' },
    { id: 'overall', label: 'Overall Experience' },
  ];

  const [ratings, setRatings] = useState({
    cleanliness: 5,
    easeOfAccess: 5,
    cableCondition: 5,
    lighting: 5,
    overall: 5,
  });

  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRating = (catId, star) => {
    setRatings((prev) => ({ ...prev, [catId]: star }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sessionId) {
      showToast({ title: 'Session Required', message: 'No valid session for feedback.', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/feedback', {
        sessionId,
        ratings,
        comment,
      });

      setSubmitted(true);
      showToast({
        title: 'Feedback Submitted!',
        message: 'Thank you for helping improve the ChargeFlow grid.',
        type: 'success',
      });

      if (onSubmitted) onSubmitted();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Feedback submission failed.';
      showToast({
        title: 'Feedback Error',
        message: errMsg,
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[#1d1b20] border border-[#22C55E]/40 rounded-2xl p-5 text-center space-y-2">
        <div className="text-[#22C55E] font-bold text-sm">Thank You for Your Feedback!</div>
        <p className="text-xs text-[#cbc4d2]">Your review helps maintain 99.9% station reliability.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#1d1b20] border border-[#494551]/60 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2 text-xs font-bold text-[#cfbcff]">
        <Sparkles className="w-4 h-4 text-[#e7c365]" />
        <span>Rate Your Station Experience</span>
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

      <Button
        type="submit"
        variant="primary"
        fullWidth
        size="sm"
        loading={submitting}
        icon={Send}
        iconPosition="right"
      >
        Submit Station Feedback
      </Button>
    </form>
  );
}
