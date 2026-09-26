import Pricing from './Pricing';

// A native Base44 page key gives this public pricing alias its own crawler HTML.
// The shared Pricing component keeps the visitor experience in sync with /pricing.
export default function FindYourPlan() {
  return <Pricing />;
}
