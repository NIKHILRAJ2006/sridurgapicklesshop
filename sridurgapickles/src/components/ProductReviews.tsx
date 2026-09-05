import { useCallback, useEffect, useState } from 'react';
import { Star, Send, UserRound } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ProductReviewsProps {
  productId: string;
}

interface Review {
  id: string;
  rating: number;
  review: string;
  created_at: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [session, setSession] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadReviews = useCallback(async () => {
    const { data } = await supabase
      .from('product_reviews')
      .select('id, rating, review, created_at')
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    setReviews((data as Review[]) || []);
    setLoading(false);
  }, [productId]);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setSession(!!data.session);
    });
    const { data: auth } = supabase.auth.onAuthStateChange((_event, next) => setSession(!!next));
    void loadReviews();
    return () => {
      active = false;
      auth.subscription.unsubscribe();
    };
  }, [loadReviews, productId]);

  const average = reviews.length ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length : 0;

  async function submitReview() {
    setMessage('');
    if (!session) {
      setMessage('Please sign in before submitting a review.');
      return;
    }
    if (!reviewText.trim()) {
      setMessage('Please write a short review.');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('product_reviews').insert({
      product_id: productId,
      rating,
      review: reviewText.trim(),
    });
    if (error) {
      setMessage(error.code === '23505' ? 'You already reviewed this item.' : 'Could not submit your review.');
    } else {
      setReviewText('');
      setRating(5);
      setMessage('Thanks! Your review has been submitted.');
      await loadReviews();
    }
    setSubmitting(false);
  }

  return (
    <div className="mt-4 border-t border-stone-100 pt-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">Reviews</span>
        <span className="flex items-center gap-1 text-xs text-amber-700">
          <Star className="h-3.5 w-3.5 fill-current" /> {average ? average.toFixed(1) : 'No rating'} ({reviews.length})
        </span>
      </div>

      {reviews.slice(0, 3).map((item) => (
        <div key={item.id} className="mt-2 rounded-lg bg-amber-50/70 p-2.5">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className={`h-3 w-3 ${index < item.rating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'}`} />
            ))}
          </div>
          <p className="mt-1 text-xs text-stone-600">{item.review}</p>
          <p className="mt-1 text-[10px] text-stone-400">{new Date(item.created_at).toLocaleDateString()}</p>
        </div>
      ))}

      {loading && <p className="mt-2 text-xs text-stone-400">Loading reviews...</p>}

      <div className="mt-3 rounded-lg border border-stone-200 bg-white p-2.5">
        <div className="mb-2 flex items-center gap-1">
          <UserRound className="h-3.5 w-3.5 text-stone-400" />
          <span className="text-xs font-medium text-stone-600">Share your experience</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <button key={index} type="button" onClick={() => setRating(index + 1)} aria-label={`${index + 1} stars`}>
              <Star className={`h-4 w-4 ${index < rating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'}`} />
            </button>
          ))}
        </div>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={2}
          placeholder={session ? 'Write your review...' : 'Sign in to write a review'}
          disabled={!session}
          className="mt-2 w-full rounded-lg border border-stone-200 px-2.5 py-2 text-xs outline-none focus:border-amber-400 disabled:bg-stone-50"
        />
        <button
          type="button"
          onClick={submitReview}
          disabled={submitting || !session}
          className="mt-2 flex items-center gap-1.5 rounded-full bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          <Send className="h-3 w-3" /> {submitting ? 'Sending...' : 'Submit review'}
        </button>
        {message && <p className="mt-2 text-[11px] text-stone-500">{message}</p>}
      </div>
    </div>
  );
}
