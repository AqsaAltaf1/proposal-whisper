import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Target, AlertTriangle, DollarSign, Clock, User } from "lucide-react";

interface JobAnalysis {
  skills: string[];
  scope: string;
  deliverables: string[];
  budget: string;
  timezone: string;
  risks: string[];
}

const JobAnalyzer = () => {
  const [jobPost, setJobPost] = useState("");
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showProposal, setShowProposal] = useState(false);

  const analyzeJobPost = async () => {
    if (!jobPost.trim()) return;
    
    setIsAnalyzing(true);
    
    // Mock analysis - in real app this would call AI API
    setTimeout(() => {
      setAnalysis({
        skills: ["React", "Node.js", "TypeScript", "API Integration", "UI/UX Design"],
        scope: "Medium complexity project requiring full-stack development with modern technologies",
        deliverables: [
          "Responsive web application",
          "REST API backend", 
          "User authentication system",
          "Admin dashboard",
          "Documentation and testing"
        ],
        budget: "$3,000 - $5,000",
        timezone: "EST (UTC-5)",
        risks: [
          "Tight deadline may require overtime",
          "Third-party API dependencies unclear",
          "Design requirements need clarification"
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateProposal = () => {
    if (!analysis) return;
    
    // Mock proposal generation - in real app this would call AI API
    const mockProposal = {
      coverLetter: `Dear Client,\n\nI'm excited about your ${analysis.scope} project. With my expertise in ${analysis.skills.slice(0, 3).join(', ')}, I can deliver exactly what you're looking for.\n\nMy approach includes thorough planning, regular communication, and high-quality deliverables. I've successfully completed similar projects and understand the importance of meeting deadlines while maintaining code quality.\n\nI'm available in your timezone (${analysis.timezone}) and can start immediately. Let's discuss how we can bring your vision to life.\n\nBest regards,\n[Your Name]`,
      milestones: [
        { title: "Project Setup & Planning", duration: "3-5 days", deliverables: ["Project architecture", "Development environment", "Timeline confirmation"] },
        { title: "Core Development", duration: "7-10 days", deliverables: ["Main functionality", "UI implementation", "Initial testing"] },
        { title: "Final Testing & Delivery", duration: "2-3 days", deliverables: ["Bug fixes", "Performance optimization", "Documentation"] }
      ],
      pricing: {
        basic: { price: "$2,500", features: ["Core functionality", "Basic UI", "1 revision round"] },
        standard: { price: "$3,500", features: ["Full functionality", "Responsive design", "3 revision rounds", "Basic documentation"] },
        premium: { price: "$5,000", features: ["Everything in Standard", "Advanced features", "Unlimited revisions", "Full documentation", "3 months support"] }
      },
      questions: [
        "What's your preferred communication method and frequency?",
        "Are there any specific design preferences or brand guidelines?",
        "Do you have any existing systems this needs to integrate with?",
        "What's the expected user volume for this application?",
        "Are there any compliance or security requirements to consider?"
      ]
    };
    
    // Store in localStorage for demo purposes
    localStorage.setItem('currentProposal', JSON.stringify(mockProposal));
    
    setShowProposal(true);
    alert('Proposal generated! (In a real app, this would navigate to the proposal page)');
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="glass-card glass-card-hover p-8 mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Freelancer Proposal Generator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Paste any Upwork job post and get an AI-powered analysis with professional proposal generation
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="glass-card border-white/30 bg-white/20 backdrop-blur-md">
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
                <Card className="glass-card border-white/30 bg-white/20 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="h-5 w-5" />
                      Required Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysis.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-white/30 border-white/30 hover:bg-white/40">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Project Details */}
                <Card className="glass-card border-white/30 bg-white/20 backdrop-blur-md">
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
                <Card className="glass-card border-white/30 bg-white/20 backdrop-blur-md">
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
                  className="glass-primary w-full"
                  size="lg"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Professional Proposal
                </Button>
              </>
            )}
            
            {!analysis && !isAnalyzing && (
              <Card className="glass-card border-white/30 bg-white/20 backdrop-blur-md">
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