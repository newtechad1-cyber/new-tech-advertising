// Content templates for structured posts
export const POST_TEMPLATES = {
  promotion: {
    name: 'Promotion/Offer',
    placeholder: `🎉 [Your headline here]

[What's the offer or promotion?]

✨ [Key benefit or detail]
💰 [Pricing or special terms]
⏰ [Deadline or urgency]

[Call to action - e.g., "Shop now", "Book today"]`,
    tips: [
      'Start with an attention-grabbing emoji or headline',
      'Clearly state the offer and value',
      'Include a deadline to create urgency',
      'End with a clear call-to-action'
    ]
  },
  tip: {
    name: 'Tip/Educational',
    placeholder: `💡 Quick Tip: [Your topic]

[Share the problem or question]

Here's what works:
• [Tip point 1]
• [Tip point 2]
• [Tip point 3]

[Optional: invite engagement]`,
    tips: [
      'Use a question to hook readers',
      'Keep tips simple and actionable',
      'Use bullet points for easy scanning',
      'Invite comments or shares'
    ]
  },
  announcement: {
    name: 'Announcement/Update',
    placeholder: `📣 [Announcement headline]

[What's new or changing?]

[Why this matters to your audience]

[What they should do next]`,
    tips: [
      'Lead with the most important news',
      'Explain why it matters to your audience',
      'Be clear about next steps',
      'Keep it brief and focused'
    ]
  },
  testimonial: {
    name: 'Testimonial/Review',
    placeholder: `⭐⭐⭐⭐⭐

"[Customer quote here]"

- [Customer name, location/title]

[Brief context: what product/service this is about]

[Call to action]`,
    tips: [
      'Use real, specific quotes',
      'Include customer attribution',
      'Add context about the experience',
      'Link to your service/product'
    ]
  },
  behind_scenes: {
    name: 'Behind the Scenes',
    placeholder: `👀 Behind the scenes...

[What you're showing them]

[Why you're sharing this / what it means]

[Optional: question to engage audience]`,
    tips: [
      'Show authenticity and personality',
      'Give insight into your process',
      'Make your audience feel included',
      'Use casual, conversational tone'
    ]
  }
};

export const IMAGE_RATIOS = {
  facebook: { width: 1200, height: 630, label: 'Facebook (1.91:1)' },
  instagram: { width: 1080, height: 1080, label: 'Instagram Square (1:1)' },
  instagram_story: { width: 1080, height: 1920, label: 'Instagram Story (9:16)' },
  twitter: { width: 1200, height: 675, label: 'Twitter (16:9)' },
  linkedin: { width: 1200, height: 627, label: 'LinkedIn (1.91:1)' },
  tiktok: { width: 1080, height: 1920, label: 'TikTok (9:16)' }
};

export const getRecommendedRatio = (channels) => {
  if (!channels || channels.length === 0) return null;
  
  // If multiple channels, recommend square (works everywhere)
  if (channels.length > 1) return IMAGE_RATIOS.instagram;
  
  // Single channel - use optimal ratio
  const channel = channels[0];
  if (channel === 'facebook') return IMAGE_RATIOS.facebook;
  if (channel === 'instagram') return IMAGE_RATIOS.instagram;
  if (channel === 'twitter') return IMAGE_RATIOS.twitter;
  if (channel === 'linkedin') return IMAGE_RATIOS.linkedin;
  if (channel === 'tiktok') return IMAGE_RATIOS.tiktok;
  
  return IMAGE_RATIOS.instagram; // Default to square
};