import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Gemini AI (Free tier)
// Get your free API key from: https://aistudio.google.com/app/apikey
const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY || 'demo-key';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface JobAnalysis {
  skills: string[];
  scope: string;
  deliverables: string[];
  budget: string;
  timezone: string;
  risks: string[];
}

export interface ProposalData {
  coverLetter: string;
  milestones: Array<{
    title: string;
    duration: string;
    deliverables: string[];
  }>;
  pricing: {
    basic: { price: string; features: string[] };
    standard: { price: string; features: string[] };
    premium: { price: string; features: string[] };
  };
  questions: string[];
}

class AIService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Analyze job post and extract key information
  async analyzeJobPost(jobPostText: string): Promise<JobAnalysis> {
    if (!API_KEY || API_KEY === 'demo-key') {
      // Return demo data if no API key
      return this.getDemoAnalysis();
    }

    try {
      const prompt = `
Analyze this freelance job post and extract the following information in JSON format:

Job Post:
"""
${jobPostText}
"""

Please provide a JSON response with exactly this structure:
{
  "skills": ["skill1", "skill2", "skill3", ...],
  "scope": "Brief description of project scope and complexity",
  "deliverables": ["deliverable1", "deliverable2", ...],
  "budget": "Budget range or 'Not specified'",
  "timezone": "Client timezone or 'Not specified'", 
  "risks": ["risk1", "risk2", ...]
}

Guidelines:
- Extract 3-7 technical skills required
- Keep scope description under 100 characters
- List 3-5 main deliverables
- Identify 2-4 potential project risks
- If information is not in the post, use "Not specified"
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return this.validateAnalysis(parsed);
      }
      
      throw new Error('Invalid AI response format');
    } catch (error) {
      console.error('AI Analysis Error:', error);
      // Fallback to demo data if AI fails
      return this.getDemoAnalysis();
    }
  }

  // Generate a complete proposal based on job analysis
  async generateProposal(analysis: JobAnalysis, freelancerName = 'Your Name'): Promise<ProposalData> {
    if (!API_KEY || API_KEY === 'demo-key') {
      return this.getDemoProposal(analysis);
    }

    try {
      const prompt = `
Create a professional freelancer proposal based on this job analysis:

Skills Required: ${analysis.skills.join(', ')}
Project Scope: ${analysis.scope}
Deliverables: ${analysis.deliverables.join(', ')}
Budget: ${analysis.budget}
Timezone: ${analysis.timezone}
Risks: ${analysis.risks.join(', ')}

Generate a JSON response with this exact structure:
{
  "coverLetter": "Professional cover letter (max 180 words, friendly but professional)",
  "milestones": [
    {
      "title": "Milestone name",
      "duration": "X-Y days",
      "deliverables": ["item1", "item2", "item3"]
    }
  ],
  "pricing": {
    "basic": {
      "price": "$X,XXX",
      "features": ["feature1", "feature2", ...]
    },
    "standard": {
      "price": "$X,XXX", 
      "features": ["feature1", "feature2", ...]
    },
    "premium": {
      "price": "$X,XXX",
      "features": ["feature1", "feature2", ...]
    }
  },
  "questions": ["question1", "question2", "question3", "question4", "question5"]
}

Guidelines:
- Cover letter should be personal and reference specific project details
- Create 3 logical milestones with realistic durations
- Pricing should have 3 tiers with increasing value
- Include 5 clarifying questions
- Sign cover letter as "${freelancerName}"
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return this.validateProposal(parsed);
      }
      
      throw new Error('Invalid AI response format');
    } catch (error) {
      console.error('AI Proposal Generation Error:', error);
      return this.getDemoProposal(analysis);
    }
  }

  // Refine proposal based on user chat message
  async refineProposal(
    currentProposal: ProposalData, 
    userMessage: string,
    context?: string
  ): Promise<{ updatedProposal: ProposalData; aiResponse: string }> {
    if (!API_KEY || API_KEY === 'demo-key') {
      return {
        updatedProposal: currentProposal,
        aiResponse: "I understand you'd like to refine the proposal. In the full version with AI integration, I would analyze your request and update the proposal accordingly. For now, please edit the sections manually."
      };
    }

    try {
      const prompt = `
User wants to refine their proposal. Here's the current proposal and their request:

Current Proposal: ${JSON.stringify(currentProposal, null, 2)}

User Request: "${userMessage}"
${context ? `\nContext: ${context}` : ''}

Please:
1. Analyze the user's request
2. Make appropriate changes to the proposal
3. Provide a brief response explaining what you changed

Respond in this JSON format:
{
  "aiResponse": "Brief explanation of changes made",
  "updatedProposal": {
    // Updated proposal in same format as current proposal
  }
}
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          updatedProposal: this.validateProposal(parsed.updatedProposal),
          aiResponse: parsed.aiResponse || "I've updated your proposal based on your request."
        };
      }
      
      throw new Error('Invalid AI response format');
    } catch (error) {
      console.error('AI Refinement Error:', error);
      return {
        updatedProposal: currentProposal,
        aiResponse: "I'm having trouble processing your request right now. Please try editing the proposal manually."
      };
    }
  }

  // Validation helpers
  private validateAnalysis(data: any): JobAnalysis {
    return {
      skills: Array.isArray(data.skills) ? data.skills.slice(0, 7) : ['Web Development'],
      scope: typeof data.scope === 'string' ? data.scope : 'Project development work',
      deliverables: Array.isArray(data.deliverables) ? data.deliverables.slice(0, 5) : ['Completed project'],
      budget: typeof data.budget === 'string' ? data.budget : 'Not specified',
      timezone: typeof data.timezone === 'string' ? data.timezone : 'Not specified',
      risks: Array.isArray(data.risks) ? data.risks.slice(0, 4) : ['Timeline constraints']
    };
  }

  private validateProposal(data: any): ProposalData {
    return {
      coverLetter: typeof data.coverLetter === 'string' ? data.coverLetter : 'Dear Client,\n\nI\'m excited to work on your project...',
      milestones: Array.isArray(data.milestones) ? data.milestones.slice(0, 4) : this.getDefaultMilestones(),
      pricing: data.pricing || this.getDefaultPricing(),
      questions: Array.isArray(data.questions) ? data.questions.slice(0, 5) : this.getDefaultQuestions()
    };
  }

  // Demo/fallback data
  private getDemoAnalysis(): JobAnalysis {
    return {
      skills: ["React", "Node.js", "TypeScript", "API Integration", "UI/UX Design"],
      scope: "Medium complexity project requiring full-stack development",
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
    };
  }

  private getDemoProposal(analysis: JobAnalysis): ProposalData {
    return {
      coverLetter: `Dear Client,\n\nI'm excited about your ${analysis.scope.toLowerCase()} project. With my expertise in ${analysis.skills.slice(0, 3).join(', ')}, I can deliver exactly what you're looking for.\n\nMy approach includes thorough planning, regular communication, and high-quality deliverables. I've successfully completed similar projects and understand the importance of meeting deadlines while maintaining code quality.\n\nI'm available in your timezone (${analysis.timezone}) and can start immediately. Let's discuss how we can bring your vision to life.\n\nBest regards,\nYour Name`,
      milestones: this.getDefaultMilestones(),
      pricing: this.getDefaultPricing(),
      questions: this.getDefaultQuestions()
    };
  }

  private getDefaultMilestones() {
    return [
      { 
        title: "Project Setup & Planning", 
        duration: "3-5 days", 
        deliverables: ["Project architecture", "Development environment", "Timeline confirmation"] 
      },
      { 
        title: "Core Development", 
        duration: "7-10 days", 
        deliverables: ["Main functionality", "UI implementation", "Initial testing"] 
      },
      { 
        title: "Final Testing & Delivery", 
        duration: "2-3 days", 
        deliverables: ["Bug fixes", "Performance optimization", "Documentation"] 
      }
    ];
  }

  private getDefaultPricing() {
    return {
      basic: { price: "$2,500", features: ["Core functionality", "Basic UI", "1 revision round"] },
      standard: { price: "$3,500", features: ["Full functionality", "Responsive design", "3 revision rounds", "Basic documentation"] },
      premium: { price: "$5,000", features: ["Everything in Standard", "Advanced features", "Unlimited revisions", "Full documentation", "3 months support"] }
    };
  }

  private getDefaultQuestions() {
    return [
      "What's your preferred communication method and frequency?",
      "Are there any specific design preferences or brand guidelines?",
      "Do you have any existing systems this needs to integrate with?",
      "What's the expected user volume for this application?",
      "Are there any compliance or security requirements to consider?"
    ];
  }
}

// Export singleton instance
export const aiService = new AIService();
export default aiService;
