import KnowledgeQuestion from '../../KnowledgeQuestion';

// A native Base44 page for this exact URL, while the shared question component
// continues to handle its content and its ordinary client-side aliases.
export default function HowCanASmallBusinessUseAI() {
  return <KnowledgeQuestion questionSlugOverride="how-can-a-small-business-use-ai" />;
}
