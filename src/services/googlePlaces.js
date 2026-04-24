/**
 * Google Places API Service
 * Fetches business ratings and reviews from Google Maps using Places REST API through a backend proxy
 *
 * Setup:
 * 1. Get a Google API key from https://console.cloud.google.com/
 * 2. Enable "Places API"
 * 3. Get your Place ID from https://developers.google.com/maps/documentation/places/web-service/place-id
 * 4. Add to .env file:
 *    VITE_GOOGLE_PLACES_API_KEY=your_api_key
 *    VITE_GOOGLE_PLACE_ID=your_place_id
 *
 * Note: This uses a CORS proxy to bypass browser restrictions.
 */

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACE_ID = import.meta.env.VITE_GOOGLE_PLACE_ID;

// Using a CORS proxy - you can also set up your own backend proxy
const PROXY_URL = 'https://corsproxy.io/?';
const GOOGLE_API_URL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=rating,reviews,user_ratings_total,name,formatted_address&key=${GOOGLE_API_KEY}`;

/**
 * Fetch place details including rating and reviews from Google Places API
 * @returns {Promise<{rating: number, reviews: Array, totalUserRatings: number, placeName: string, address: string}>}
 */
export const fetchGoogleReviews = async () => {
  if (!GOOGLE_API_KEY || !GOOGLE_PLACE_ID) {
    console.warn('Google Places API credentials not configured');
    return null;
  }

  try {
    const encodedUrl = encodeURIComponent(GOOGLE_API_URL);
    const response = await fetch(`${PROXY_URL}${encodedUrl}`);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    const result = data.result;

    return {
      placeName: result.name,
      address: result.formatted_address,
      rating: result.rating,
      totalRatings: result.user_ratings_total || 0,
      reviews: (result.reviews || []).map((review, index) => ({
        id: `google-${index}`,
        authorName: review.author_name,
        profilePhotoUrl: review.profile_photo_url,
        relativeTime: review.relative_time_description,
        text: review.text,
        rating: review.rating,
        time: new Date(review.time * 1000).toISOString()
      }))
    };
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return null;
  }
};

/**
 * Format Google reviews to match existing testimonial structure
 * @param {Object} googleData - Raw Google Places data
 * @param {number} maxReviews - Maximum number of reviews to return
 * @returns {Array} Formatted testimonials
 */
export const formatGoogleReviews = (googleData, maxReviews = 3) => {
  if (!googleData?.reviews) return [];

  return googleData.reviews
    .slice(0, maxReviews)
    .map((review) => ({
      name: review.authorName,
      location: googleData.address?.split(',').pop()?.trim() || 'Google Review',
      text: review.text,
      initial: review.authorName?.charAt(0)?.toUpperCase() || 'G',
      rating: review.rating,
      source: 'google',
      googleProfilePhoto: review.profilePhotoUrl,
      googleRelativeTime: review.relativeTime
    }));
};

export { GOOGLE_PLACE_ID };
