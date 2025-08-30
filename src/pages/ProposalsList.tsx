import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ArrowLeft, 
  FileText, 
  Plus, 
  Eye, 
  Trash2,
  Calendar,
  User
} from "lucide-react";
import { toast } from "sonner";

interface Proposal {
  id: string;
  jobTitle: string;
  clientSummary?: string;
  status: 'draft' | 'shared';
  createdAt: string;
  updatedAt?: string;
}

const ProposalsList = () => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    // Load proposals from localStorage (in real app, this would be from Supabase)
    const savedProposals = JSON.parse(localStorage.getItem('proposals') || '[]');
    setProposals(savedProposals);
  }, []);

  const handleDeleteProposal = (id: string) => {
    if (confirm('Are you sure you want to delete this proposal?')) {
      const updatedProposals = proposals.filter(p => p.id !== id);
      setProposals(updatedProposals);
      localStorage.setItem('proposals', JSON.stringify(updatedProposals));
      toast.success('Proposal deleted successfully');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'shared' ? 'bg-green-100/70 text-green-700 border-green-200/50' : 'bg-yellow-100/70 text-yellow-700 border-yellow-200/50';
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="glass-button self-start"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">My Proposals</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Manage and track your freelancer proposals
              </p>
            </div>
          </div>
          
          <Button 
            onClick={() => navigate('/')}
            className="glass-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Proposal
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card className="glass-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100/50 rounded-2xl">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">{proposals.length}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Proposals</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100/70 rounded-2xl">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">
                    {proposals.filter(p => p.status === 'shared').length}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Shared</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100/70 rounded-2xl">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">
                    {proposals.filter(p => p.status === 'draft').length}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Drafts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Proposals Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>All Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            {proposals.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No proposals yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first proposal by analyzing a job post
                </p>
                <Button 
                  onClick={() => navigate('/')}
                  className="glass-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Proposal
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/30 hover:bg-white/20">
                      <TableHead className="text-foreground min-w-[200px]">Job Title</TableHead>
                      <TableHead className="text-foreground hidden sm:table-cell">Status</TableHead>
                      <TableHead className="text-foreground hidden md:table-cell">Created</TableHead>
                      <TableHead className="text-foreground hidden lg:table-cell">Updated</TableHead>
                      <TableHead className="text-foreground text-right min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proposals.map((proposal) => (
                      <TableRow 
                        key={proposal.id}
                        className="border-white/30 hover:bg-white/20 cursor-pointer"
                        onClick={() => navigate(`/proposal/${proposal.id}`)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-2 bg-blue-100/50 rounded-lg hidden sm:block">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm sm:text-base truncate">{proposal.jobTitle}</p>
                              <div className="flex flex-col sm:hidden gap-1 mt-1">
                                <Badge 
                                  className={`${getStatusColor(proposal.status)} border-none w-fit text-xs`}
                                >
                                  {proposal.status.toUpperCase()}
                                </Badge>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(proposal.createdAt)}
                                </p>
                              </div>
                              {proposal.clientSummary && (
                                <p className="text-sm text-muted-foreground truncate max-w-[200px] hidden sm:block">
                                  {proposal.clientSummary}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="hidden sm:table-cell">
                          <Badge 
                            className={`${getStatusColor(proposal.status)} border-none`}
                          >
                            {proposal.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        
                        <TableCell className="text-muted-foreground hidden md:table-cell">
                          {formatDate(proposal.createdAt)}
                        </TableCell>
                        
                        <TableCell className="text-muted-foreground hidden lg:table-cell">
                          {proposal.updatedAt ? formatDate(proposal.updatedAt) : '-'}
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center justify-end gap-1 sm:gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/proposal/${proposal.id}`);
                              }}
                              className="glass-button p-2"
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProposal(proposal.id);
                              }}
                              className="glass-button hover:bg-red-500/20 hover:text-red-400 p-2"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProposalsList;
