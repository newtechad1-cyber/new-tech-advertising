import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Check, X, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function OutputsAwaitingReview() {
  const [outputs, setOutputs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOutputs = async () => {
      try {
        const data = await base44.asServiceRole.entities.AIOutputs.filter(
          { approval_status: 'pending_review' },
          '-created_date',
          20
        );
        setOutputs(data);
      } catch (error) {
        console.error('Error loading outputs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOutputs();
  }, []);

  const handleApprove = async (outputId) => {
    try {
      await base44.asServiceRole.entities.AIOutputs.update(outputId, {
        approval_status: 'approved',
        approved_by: (await base44.auth.me()).email,
        approved_at: new Date().toISOString(),
      });
      toast.success('Output approved');
      setOutputs(outputs.filter((o) => o.id !== outputId));
    } catch (error) {
      toast.error(`Approval failed: ${error.message}`);
    }
  };

  const handleReject = async (outputId) => {
    try {
      await base44.asServiceRole.entities.AIOutputs.update(outputId, {
        approval_status: 'rejected',
      });
      toast.success('Output rejected');
      setOutputs(outputs.filter((o) => o.id !== outputId));
    } catch (error) {
      toast.error(`Rejection failed: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (outputs.length === 0) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6 text-center">
          <p className="text-green-800 font-semibold">No Outputs Pending Review</p>
          <p className="text-green-600 text-sm mt-1">All AI outputs have been approved or archived.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <p className="text-orange-800 font-semibold">{outputs.length} Output(s) Awaiting Approval</p>
        <p className="text-orange-600 text-sm mt-1">
          Review AI-generated content below and approve or reject.
        </p>
      </div>

      {outputs.map((output) => (
        <Card key={output.id}>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{output.title || 'Untitled'}</h3>
                <p className="text-sm text-gray-600 mt-1">{output.function_name}</p>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-blue-100 text-blue-800">{output.output_type}</Badge>
                  {output.school_slug && (
                    <Badge className="bg-purple-100 text-purple-800">
                      School: {output.school_slug}
                    </Badge>
                  )}
                </div>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
            </div>

            {output.summary && (
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <p className="text-sm text-gray-700">{output.summary}</p>
              </div>
            )}

            {output.quality_score && (
              <div className="text-xs text-gray-600">
                Quality Score: {output.quality_score}/100
              </div>
            )}

            <div className="text-xs text-gray-600">
              Created: {new Date(output.created_date).toLocaleString()}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => handleApprove(output.id)}
                size="sm"
                className="gap-1 bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4" />
                Approve
              </Button>
              <Button
                onClick={() => handleReject(output.id)}
                variant="outline"
                size="sm"
                className="gap-1"
              >
                <X className="w-4 h-4" />
                Reject
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Eye className="w-4 h-4" />
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}