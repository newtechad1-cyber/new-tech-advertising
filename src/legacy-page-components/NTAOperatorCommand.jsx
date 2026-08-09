/**
 * The daily working dashboard is the canonical private-office view.
 *
 * The older Operator Command screen read legacy pipeline tables, which made
 * an otherwise healthy workspace appear empty. Keep this route as the
 * familiar entry point, but render the same live SalesLead-backed dashboard
 * used by the operations center.
 */
import OpsDashboard from '@/pages/ops/OpsDashboard';

export default function NTAOperatorCommand() {
  return <OpsDashboard />;
}
