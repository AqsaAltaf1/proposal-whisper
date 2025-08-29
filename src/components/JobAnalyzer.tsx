import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Target, AlertTriangle, DollarSign, Clock, User, FileText, Briefcase, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { aiService, type JobAnalysis } from "@/lib/aiService";

// JobAnalysis interface is now imported from aiService

const JobAnalyzer = () => {
  const navigate = useNavigate();
  const [jobPost, setJobPost] = useState("");
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const analyzeJobPost = async () => {
    if (!jobPost.trim()) {
      toast.error("Please paste a job post to analyze");
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Real AI analysis using Google Gemini (free)
      const result = await aiService.analyzeJobPost(jobPost);
      setAnalysis(result);
      toast.success("Job post analyzed successfully!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze job post. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateProposal = async () => {
    if (!analysis) return;
    
    setIsGenerating(true);
    
    try {
      // Real AI proposal generation using Google Gemini (free)
      const proposalData = await aiService.generateProposal(analysis, 'Your Name');
      
      // Create a new proposal with unique ID
      const proposalId = Date.now().toString();
      const newProposal = {
        id: proposalId,
        jobTitle: analysis.scope.split(' ').slice(0, 5).join(' ') + ' Project',
        ...proposalData,
        status: 'draft' as const,
        createdAt: new Date().toISOString(),
      };
      
      // Save to proposals list
      const savedProposals = JSON.parse(localStorage.getItem('proposals') || '[]');
      savedProposals.push(newProposal);
      localStorage.setItem('proposals', JSON.stringify(savedProposals));
      
      // Store current proposal for immediate viewing
      localStorage.setItem('currentProposal', JSON.stringify(proposalData));
      
      toast.success('AI-powered proposal generated successfully!');
      
      // Navigate to the proposal view
      navigate(`/proposal/${proposalId}`);
    } catch (error) {
      console.error("Proposal generation error:", error);
      toast.error("Failed to generate proposal. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="glass-card glass-card-hover p-8 mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
              Freelancer Proposal Generator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Paste any Upwork job post and get an AI-powered analysis with professional proposal generation
            </p>
            
            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4 flex-wrap">
              <Button 
                onClick={() => navigate('/proposals')}
                className="glass-button"
                size="sm"
              >
                <FileText className="h-4 w-4 mr-2" />
                My Proposals
              </Button>
              <Button 
                onClick={() => navigate('/templates')}
                className="glass-button"
                size="sm"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Templates
              </Button>
              <Button 
                onClick={() => navigate('/portfolio')}
                className="glass-button"
                size="sm"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Portfolio
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Job Post Analysis
                </CardTitle>
                <CardDescription>
                  Paste the complete job posting from Upwork or any freelance platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste the job post here..."
                  value={jobPost}
                  onChange={(e) => setJobPost(e.target.value)}
                  className="glass-input min-h-[300px] resize-none text-sm"
                />
                
                <Button 
                  onClick={analyzeJobPost}
                  disabled={!jobPost.trim() || isAnalyzing}
                  className="glass-primary w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing Job Post...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Analyze Job Post
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          <div className="space-y-6">
            {analysis && (
              <>
                {/* Skills & Requirements */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="h-5 w-5" />
                      Required Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysis.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100/50 text-blue-700 border-blue-200/50 hover:bg-blue-100/70">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Project Details */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Project Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <DollarSign className="h-4 w-4 mt-1 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Budget Range</p>
                          <p className="text-sm text-muted-foreground">{analysis.budget}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Clock className="h-4 w-4 mt-1 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Timezone</p>
                          <p className="text-sm text-muted-foreground">{analysis.timezone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <User className="h-4 w-4 mt-1 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Project Scope</p>
                          <p className="text-sm text-muted-foreground">{analysis.scope}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Risks & Notes */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <AlertTriangle className="h-5 w-5" />
                      Risks & Considerations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.risks.map((risk, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Generate Proposal Button */}
                <Button 
                  onClick={generateProposal}
                  disabled={isGenerating}
                  className="glass-primary w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                      Generating Proposal...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate Professional Proposal
                    </>
                  )}
                </Button>
              </>
            )}
            
            {!analysis && !isAnalyzing && (
              <Card className="glass-card">
                <CardContent className="flex items-center justify-center h-40">
                  <p className="text-muted-foreground text-center">
                    Paste a job post and click "Analyze" to see the breakdown
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobAnalyzer;