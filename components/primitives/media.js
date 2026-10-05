import React from 'react';

/* Shared by Image and Avatar: the "did this src load" question, asked once.

   Both components had their own copy as `const [failed, setFailed] =
   useState(false)`, and both carried the same defect — useState seeds only on
   mount, so once a src 404'd the component showed its fallback for the rest of
   its life. Any later src on the same element (a table row recycled to another
   operator, a photo re-fetched after a token refresh) never got a chance to
   paint. Keying the failure on the URL rather than a boolean fixes it for both:
   a new src is simply not the src that failed.

   Deliberately NOT a component. The two fallbacks are different designs — Image
   swaps in a striped placeholder, Avatar layers a photo OVER initials that were
   already drawn so a 404 reveals them with no flash — and merging them would
   force one of those to change. Only the detection is common. */
export function useImageFallback(src) {
  const [failedSrc, setFailedSrc] = React.useState(null);
  const failed = !!src && failedSrc === src;
  const onError = React.useCallback(() => setFailedSrc(src || null), [src]);
  return { show: !!src && !failed, failed, onError };
}
