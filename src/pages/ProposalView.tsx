import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Copy, 
  Download, 
  Share2, 
  ArrowLeft, 
  MessageCircle, 
  Edit3, 
  Check, 
  X,
  FileText,
  Target,
  DollarSign,
  HelpCircle
} from "lucide-react";
import { toast } from "sonner";
import { exportProposalToPDF } from "@/lib/pdfExport";
import { aiService } from "@/lib/aiService";

interface Milestone {
  title: string;
  duration: string;
  deliverables: string[];
}

interface PricingTier {
  price: string;
  features: string[];
}

interface Proposal {
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
  status: 'draft' | 'shared';
  publicSlug?: string;
  chatHistory?: any[];
  createdAt: string;
}

const ProposalView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [showChatBox, setShowChatBox] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  useEffect(() => {
    // Load proposal from localStorage (in real app, this would be from Supabase)
    const savedProposals = JSON.parse(localStorage.getItem('proposals') || '[]');
    const foundProposal = savedProposals.find((p: Proposal) => p.id === id);
    
    if (foundProposal) {
      setProposal(foundProposal);
    } else {
      // Try to load from current proposal (temporary)
      const currentProposal = localStorage.getItem('currentProposal');
      if (currentProposal) {
        const mockProposal = {
          id: id || '1',
          jobTitle: 'Full Stack Web Application Development',
          ...JSON.parse(currentProposal),
          status: 'draft' as const,
          createdAt: new Date().toISOString(),
        };
        setProposal(mockProposal);
      }
    }
  }, [id]);

  const handleEdit = (section: string, currentValue: string) => {
    setEditingSection(section);
    setEditValue(currentValue);
  };

  const handleSaveEdit = () => {
    if (!proposal || !editingSection) return;

    const updatedProposal = { ...proposal };
    
    if (editingSection === 'coverLetter') {
      updatedProposal.coverLetter = editValue;
    } else if (editingSection === 'jobTitle') {
      updatedProposal.jobTitle = editValue;
    }

    setProposal(updatedProposal);
    
    // Save to localStorage (in real app, this would be Supabase)
    const savedProposals = JSON.parse(localStorage.getItem('proposals') || '[]');
    const updatedProposals = savedProposals.map((p: Proposal) => 
      p.id === proposal.id ? updatedProposal : p
    );
    
    if (!savedProposals.some((p: Proposal) => p.id === proposal.id)) {
      updatedProposals.push(updatedProposal);
    }
    
    localStorage.setItem('proposals', JSON.stringify(updatedProposals));
    
    setEditingSection(null);
    setEditValue("");
    toast.success("Changes saved!");
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditValue("");
  };

  const handleCopyProposal = () => {
    if (!proposal) return;
    
    const proposalText = `
${proposal.jobTitle}

COVER LETTER:
${proposal.coverLetter}

MILESTONES:
${proposal.milestones.map((m, i) => `
${i + 1}. ${m.title} (${m.duration})
Deliverables: ${m.deliverables.join(', ')}
`).join('')}

PRICING:
Basic: ${proposal.pricing.basic.price}
Features: ${proposal.pricing.basic.features.join(', ')}

Standard: ${proposal.pricing.standard.price}
Features: ${proposal.pricing.standard.features.join(', ')}

Premium: ${proposal.pricing.premium.price}
Features: ${proposal.pricing.premium.features.join(', ')}

QUESTIONS:
${proposal.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(proposalText);
    toast.success("Proposal copied to clipboard!");
  };

  const handleExportPDF = () => {
    if (!proposal) return;
    
    try {
      const pdfData = {
        jobTitle: proposal.jobTitle,
        coverLetter: proposal.coverLetter,
        milestones: proposal.milestones,
        pricing: proposal.pricing,
        questions: proposal.questions,
        createdAt: proposal.createdAt,
        freelancerName: 'Alex Johnson' // In real app, this would come from user profile
      };
      
      exportProposalToPDF(pdfData);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error("Failed to export PDF. Please try again.");
    }
  };

  const handleShare = () => {
    if (!proposal) return;
    
    const publicSlug = proposal.publicSlug || Math.random().toString(36).substr(2, 9);
    const shareUrl = `${window.location.origin}/p/${publicSlug}`;
    
    // Update proposal with public slug and change status to 'shared'
    const updatedProposal = { 
      ...proposal, 
      publicSlug,
      status: 'shared' as const,
      updatedAt: new Date().toISOString()
    };
    setProposal(updatedProposal);
    
    // Save public proposal
    const publicProposals = JSON.parse(localStorage.getItem('publicProposals') || '{}');
    publicProposals[publicSlug] = updatedProposal;
    localStorage.setItem('publicProposals', JSON.stringify(publicProposals));
    
    // Update proposal in the main proposals list
    const savedProposals = JSON.parse(localStorage.getItem('proposals') || '[]');
    const proposalIndex = savedProposals.findIndex((p: any) => p.id === proposal.id);
    if (proposalIndex !== -1) {
      savedProposals[proposalIndex] = updatedProposal;
      localStorage.setItem('proposals', JSON.stringify(savedProposals));
    }
    
    navigator.clipboard.writeText(shareUrl);
    toast.success("Share link copied to clipboard! Status updated to 'Shared'");
  };

  const handleChatMessage = async () => {
    if (!chatMessage.trim() || !proposal) return;
    
    try {
      // Convert proposal to the format expected by AI service
      const proposalData = {
        coverLetter: proposal.coverLetter,
        milestones: proposal.milestones,
        pricing: proposal.pricing,
        questions: proposal.questions
      };

      // Real AI refinement using Google Gemini (free)
      const { updatedProposal, aiResponse } = await aiService.refineProposal(
        proposalData,
        chatMessage,
        `Job Title: ${proposal.jobTitle}`
      );

      // Update chat history
      const newChatHistory = [
        ...(proposal.chatHistory || []),
        { role: 'user', message: chatMessage },
        { role: 'assistant', message: aiResponse }
      ];

      // Update proposal with AI changes and chat history
      const finalUpdatedProposal = {
        ...proposal,
        ...updatedProposal,
        chatHistory: newChatHistory
      };

      setProposal(finalUpdatedProposal);
      
      // Save updated proposal
      const savedProposals = JSON.parse(localStorage.getItem('proposals') || '[]');
      const updatedProposals = savedProposals.map((p: any) => 
        p.id === proposal.id ? finalUpdatedProposal : p
      );
      localStorage.setItem('proposals', JSON.stringify(updatedProposals));

      setChatMessage("");
      toast.success("AI refined your proposal!");
    } catch (error) {
      console.error("AI chat error:", error);
      
      // Fallback to simple chat without proposal updates
      const newChatHistory = [
        ...(proposal.chatHistory || []),
        { role: 'user', message: chatMessage },
        { role: 'assistant', message: "I understand your request. Please try refining the proposal manually, or check your AI service connection." }
      ];

      const updatedProposal = { ...proposal, chatHistory: newChatHistory };
      setProposal(updatedProposal);
      setChatMessage("");
      toast.info("Response added - manual editing may be needed");
    }
  };

  if (!proposal) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Proposal not found</p>
            <Button onClick={() => navigate('/')} className="glass-primary mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="glass-button"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              {editingSection === 'jobTitle' ? (
                <div className="flex items-center gap-2">
                  <Textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="glass-input min-h-[40px] text-xl font-bold"
                    autoFocus
                  />
                  <Button size="sm" onClick={handleSaveEdit} className="glass-primary">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{proposal.jobTitle}</h1>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleEdit('jobTitle', proposal.jobTitle)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <Badge variant={proposal.status === 'shared' ? 'default' : 'secondary'} className="mt-1">
                {proposal.status.toUpperCase()}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button onClick={handleCopyProposal} className="glass-button">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button onClick={handleExportPDF} className="glass-button">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={handleShare} className="glass-button">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Cover Letter */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Cover Letter
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => handleEdit('coverLetter', proposal.coverLetter)}
                className="ml-auto"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingSection === 'coverLetter' ? (
              <div className="space-y-4">
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="glass-input min-h-[200px]"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveEdit} className="glass-primary">
                    <Check className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="ghost" onClick={handleCancelEdit}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {proposal.coverLetter}
              </p>
            )}
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
              <div key={index} className="border border-white/30 rounded-2xl p-4 bg-white/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{milestone.title}</h4>
                  <Badge variant="outline" className="bg-blue-100/50 border-blue-200/50 text-blue-700">
                    {milestone.duration}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground mb-2">Deliverables:</p>
                  <ul className="text-sm space-y-1">
                    {milestone.deliverables.map((deliverable, dIndex) => (
                      <li key={dIndex} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {deliverable}
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
              Pricing Tiers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(proposal.pricing).map(([tier, details]) => (
                <div key={tier} className="border border-white/30 rounded-2xl p-4 bg-white/20">
                  <div className="text-center mb-4">
                    <h4 className="font-semibold capitalize mb-2">{tier}</h4>
                    <p className="text-2xl font-bold">{details.price}</p>
                  </div>
                  <Separator className="my-4" />
                  <ul className="space-y-2 text-sm">
                    {details.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                        {feature}
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
            <ul className="space-y-3">
              {proposal.questions.map((question, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Badge variant="outline" className="bg-blue-100/50 border-blue-200/50 text-blue-700 text-xs px-2 py-1 mt-1">
                    {index + 1}
                  </Badge>
                  <p className="text-sm">{question}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* AI Chat Box */}
      <div className={`glass-floating transition-transform duration-300 ${showChatBox ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="w-80 max-h-96 flex flex-col">
                      <div className="flex items-center justify-between p-4 border-b border-white/30">
            <h3 className="font-semibold">AI Assistant</h3>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setShowChatBox(!showChatBox)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 p-4 space-y-3 max-h-48 overflow-y-auto">
            {proposal.chatHistory?.map((chat, index) => (
              <div key={index} className={`text-sm p-2 rounded-lg ${
                chat.role === 'user' 
                  ? 'bg-blue-100/30 ml-4 border border-blue-200/50' 
                  : 'bg-purple-100/30 mr-4 border border-purple-200/50'
              }`}>
                <p className="text-xs text-muted-foreground mb-1">
                  {chat.role === 'user' ? 'You' : 'AI'}
                </p>
                <p>{chat.message}</p>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-white/30">
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask me to refine your proposal..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="glass-input flex-1 min-h-[40px] text-sm"
              />
              <Button 
                onClick={handleChatMessage}
                disabled={!chatMessage.trim()}
                className="glass-primary"
                size="sm"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Toggle Button */}
      {!showChatBox && (
        <Button
          onClick={() => setShowChatBox(true)}
          className="glass-floating"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default ProposalView;
