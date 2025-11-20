import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import httpClient from '@/api/httpClient';
import { useAdminStore } from '@/store/adminStore';
import { toast } from 'sonner';
import { Check, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils'; // For styling

/**
 * OwnerCard: Displays a single owner's details and action buttons.
 */
function OwnerCard({ owner }) {
  const updateOwnerStatus = useAdminStore((state) => state.updateOwnerStatus);
  const [isMutating, setIsMutating] = useState(false);

  // Map status to badge style
  const statusColors = {
    pending: 'bg-yellow-500 hover:bg-yellow-500/80',
    approved: 'bg-emerald-500 hover:bg-emerald-500/80',
    rejected: 'bg-red-500 hover:bg-red-500/80',
  };

  /** Handles the approval or rejection of an owner */
  const handleAction = async (action) => {
    setIsMutating(true);
    const endpoint = `/api/admin/owners/${owner._id}/${action}`; // 'approve' or 'reject'
    const successMessage = action === 'approve' ? 'Owner successfully approved!' : 'Owner successfully rejected.';
    const failureMessage = `Failed to ${action} owner.`;

    try {
      const response = await httpClient.patch(endpoint);
      
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      const approvedAt = newStatus === 'approved' ? response.data.approvedAt : null;
      
      // Update the owner list in the Zustand store
      updateOwnerStatus(owner._id, newStatus, approvedAt);

      toast.success(successMessage);
    } catch (error) {
      toast.error(failureMessage);
      console.error(error);
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <Card 
      className={cn(
        "rounded-3xl border border-slate-800 bg-slate-900/50 shadow-2xl shadow-slate-900/70 backdrop-blur-lg transition-all duration-300",
        owner.status === 'approved' && 'border-l-4 border-l-emerald-600',
        owner.status === 'rejected' && 'border-l-4 border-l-red-600',
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-50">{owner.storeName}</h3>
          <p className="text-sm text-slate-400">by {owner.name}</p>
        </div>
        <Badge className={cn("text-xs uppercase", statusColors[owner.status])}>
          {owner.status}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-2 text-sm text-slate-300">
        <p><strong>Email:</strong> <span className="text-slate-200">{owner.email}</span></p>
        <p><strong>WhatsApp:</strong> <span className="text-slate-200">{owner.whatsappNumber}</span></p>
        <p className="pt-2 text-slate-400 border-t border-slate-800">
          <strong className="text-slate-50">Bio:</strong> {owner.bio || 'No bio provided.'}
        </p>
        <p className="text-xs text-slate-500">
          Joined: {new Date(owner.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
      
      {owner.status === 'pending' && (
        <CardFooter className="flex justify-end space-x-3">
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => handleAction('reject')}
            disabled={isMutating}
          >
            {isMutating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
            Reject
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => handleAction('approve')}
            disabled={isMutating}
          >
            {isMutating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
            Approve
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default OwnerCard;