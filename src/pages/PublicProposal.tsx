import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText,
  Target,
  DollarSign,
  HelpCircle,
  Calendar,
  User,
  Globe
} from "lucide-react";

interface Milestone {
  title: string;
  duration: string;
  deliverables: string[];
}

interface PricingTier {
  price: string;
  features: string[];
}

interface PublicProposal {
  id: string;
  jobTitle: string;
  coverLetter: string;
  milestones: Milestone[];
  pricing: {
    basic: PricingTier;
    standard: PricingTier;
    premium: PricingTier;
  };
  questions: string[];
  createdAt: string;
  freelancerName?: string;
  freelancerBio?: string;
}

const PublicProposal = () => {
  const { slug } = useParams();
  const [proposal, setProposal] = useState<PublicProposal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load public proposal from localStorage (in real app, this would be from Supabase)
    const publicProposals = JSON.parse(localStorage.getItem('publicProposals') || '{}');
    const foundProposal = publicProposals[slug || ''];
    
    if (foundProposal) {
      // Add some mock freelancer info for public display
      const publicProposal = {
        ...foundProposal,
        freelancerName: 'Alex Johnson',
        freelancerBio: 'Full-stack developer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies.'
      };
      setProposal(publicProposal);
    }
    
    setLoading(false);
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading proposal...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Proposal Not Found</h2>
            <p className="text-muted-foreground">
              This proposal link may have expired or doesn't exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 pointer-events-none" />
      
      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <Card className="glass-card glass-card-hover">
              <CardContent className="p-8">
                <Badge variant="outline" className="bg-blue-100/50 border-blue-200/50 text-blue-700 mb-4">
                  <Globe className="h-3 w-3 mr-1" />
                  Public Proposal
                </Badge>
                <h1 className="text-3xl font-bold mb-2">{proposal.jobTitle}</h1>
                <p className="text-muted-foreground mb-4">
                  Professional proposal submitted on {formatDate(proposal.createdAt)}
                </p>
                
                {/* Freelancer Info */}
                <div className="bg-white/20 border border-white/30 rounded-2xl p-4 mt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">{proposal.freelancerName}</h3>
                      <p className="text-sm text-muted-foreground">{proposal.freelancerBio}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cover Letter */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Cover Letter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white/20 border border-white/30 rounded-2xl p-6">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {proposal.coverLetter}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Project Milestones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {proposal.milestones.map((milestone, index) => (
                                  <div key={index} className="border border-white/30 rounded-2xl p-6 bg-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">{milestone.title}</h4>
                    <Badge variant="outline" className="bg-blue-100/50 border-blue-200/50 text-blue-700">
                      <Calendar className="h-3 w-3 mr-1" />
                      {milestone.duration}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground mb-3">Deliverables:</p>
                    <ul className="space-y-2">
                      {milestone.deliverables.map((deliverable, dIndex) => (
                        <li key={dIndex} className="flex items-start gap-3 text-sm">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span>{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Investment Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {Object.entries(proposal.pricing).map(([tier, details]) => (
                  <div 
                    key={tier} 
                    className={`border rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
                      tier === 'standard' 
                        ? 'border-primary/50 bg-primary/10 ring-2 ring-primary/20' 
                        : 'border-white/30 bg-white/20'
                    }`}
                  >
                    <div className="text-center mb-6">
                      <h4 className="text-lg font-semibold capitalize mb-2">{tier}</h4>
                      {tier === 'standard' && (
                        <Badge className="bg-primary/20 text-primary border-primary/30 mb-2">
                          Recommended
                        </Badge>
                      )}
                      <p className="text-3xl font-bold text-primary">{details.price}</p>
                    </div>
                    <Separator className="my-4 bg-white/30" />
                    <ul className="space-y-3">
                      {details.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Clarifying Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white/20 border border-white/30 rounded-2xl p-6">
                <p className="text-sm text-muted-foreground mb-4">
                  These questions will help ensure we're aligned on project requirements:
                </p>
                <ul className="space-y-4">
                  {proposal.questions.map((question, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <Badge variant="outline" className="bg-blue-100/50 border-blue-200/50 text-blue-700 text-xs px-3 py-1 mt-1">
                        Q{index + 1}
                      </Badge>
                      <p className="text-sm flex-1">{question}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                This proposal was generated using Freelancer Proposal Generator
              </p>
              <p className="text-xs text-muted-foreground">
                Ready to get started? Contact {proposal.freelancerName} to discuss your project.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublicProposal;
