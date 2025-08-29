# Freelancer Proposal & Brief Generator

A professional web application for freelancers to analyze job posts and generate compelling proposals with AI assistance.

## 🚀 Features

### ✨ Core Functionality
- **AI-Powered Job Analysis**: Paste any job post and get instant analysis of required skills, scope, deliverables, budget, timezone, and potential risks
- **Smart Proposal Generation**: Generate professional proposals with cover letters, milestones, pricing tiers, and clarifying questions
- **Interactive AI Chat**: Refine proposals in real-time with an AI assistant
- **PDF Export**: Export proposals as professionally formatted PDFs
- **Public Sharing**: Share proposals via public read-only links

### 📋 Pages & Features

#### 1. **Home / Generate** (`/`)
- Paste Upwork job posts for instant analysis
- AI extracts: skills, scope, deliverables, budget, timezone, risks
- Generate complete proposals with one click
- Navigation to all app sections

#### 2. **Proposal View** (`/proposal/[id]`)
- **Sections**: Cover Letter, Milestones, Pricing Tiers, Clarifying Questions
- **Inline Editing**: Edit any section directly
- **Actions**: Copy to clipboard, Export PDF, Share public link
- **AI Chat Box**: Floating glass interface for real-time proposal refinement
- **Chat Commands**: "Make tone formal", "Add milestone", "Rewrite pricing"

#### 3. **Proposals List** (`/proposals`)
- Dashboard with all saved proposals
- Status tracking (Draft/Sent)
- Quick actions and statistics
- Search and filter capabilities

#### 4. **Templates** (`/templates`)
- CRUD operations for reusable snippets
- Cover letter and milestone templates
- Copy and paste functionality
- Default templates included

#### 5. **Portfolio** (`/portfolio`)
- Showcase projects with tech stack and results
- Link to live projects or repositories
- Copy portfolio items for proposals
- Professional presentation cards

#### 6. **Public Sharing** (`/p/[slug]`)
- Beautiful read-only proposal view
- Professional layout for client viewing
- No authentication required
- Mobile-responsive design

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom glassmorphism design
- **UI Components**: Radix UI + Shadcn/ui
- **Routing**: React Router v6
- **State Management**: React Hooks + localStorage (database-ready)
- **PDF Export**: jsPDF with custom formatting
- **Icons**: Lucide React
- **Notifications**: Sonner

## 🎨 Design System

### Glassmorphism Styling
- **Glass Cards**: `bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl`
- **Hover Effects**: Scale animations and glowing borders
- **Consistent Spacing**: Airy layout with responsive padding
- **Dark Theme**: Professional dark background with glass overlays
- **Mobile-First**: Responsive design across all devices

### Color Palette
- **Background**: Dark gradient with subtle patterns
- **Glass Elements**: Semi-transparent white overlays
- **Text**: High contrast for accessibility
- **Accents**: Primary colors for CTAs and highlights

## 🚦 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and Install**
```bash
git clone <repository-url>
cd proposal-whisper
npm install
```

2. **Start Development Server**
```bash
npm run dev
```

3. **Build for Production**
```bash
npm run build
npm run preview
```

## 📖 Usage Guide

### Creating Your First Proposal

1. **Navigate to Home Page**
   - Paste a job post in the textarea
   - Click "Analyze Job Post"
   - Review the extracted information

2. **Generate Proposal**
   - Click "Generate Professional Proposal"
   - Wait for AI processing
   - Automatically navigate to proposal view

3. **Refine Your Proposal**
   - Use inline editing for quick changes
   - Open AI chat box for intelligent refinements
   - Export to PDF when ready

### Managing Templates

1. **Create Templates**
   - Go to Templates page
   - Click "Create Template"
   - Add reusable cover letter and milestone snippets

2. **Use Templates**
   - Copy snippets to clipboard
   - Paste into proposals
   - Customize as needed

### Building Your Portfolio

1. **Add Projects**
   - Navigate to Portfolio
   - Click "Add Project"
   - Include title, tech stack, results, and links

2. **Showcase Work**
   - Copy portfolio items for proposals
   - Link to live projects
   - Highlight key achievements

## 🔧 Configuration

### Environment Setup
The app uses localStorage for data persistence, making it simple and self-contained with no database required.

**Environment Variables**
```env
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key
```

To activate AI features:
1. Get free API key from: https://aistudio.google.com/app/apikey
2. Add to your `.env` file
3. Restart development server

## 📊 Data Models

### Proposals
```typescript
{
  id: string,
  job_title: string,
  cover_letter: string,
  milestones_json: Milestone[],
  pricing_json: PricingTiers,
  questions_json: string[],
  status: 'draft' | 'sent',
  public_slug?: string,
  chat_history_json?: ChatMessage[],
  created_at: string
}
```

### Templates
```typescript
{
  id: string,
  name: string,
  cover_snippet: string,
  milestone_snippet: string,
  created_at: string
}
```

### Portfolio Items
```typescript
{
  id: string,
  title: string,
  tech_stack: string,
  result_snippet: string,
  link: string,
  created_at: string
}
```

## 🎯 Roadmap

- [x] **AI Integration**: Real Google Gemini AI (FREE)
- [x] **Browser Storage**: localStorage for simplicity
- [ ] **User Authentication**: Add user accounts (optional)
- [ ] **Cloud Storage**: Database integration (optional)
- [ ] **Collaboration**: Team proposals and client feedback
- [ ] **Analytics**: Proposal performance tracking
- [ ] **Integrations**: Upwork, Fiverr, LinkedIn connections

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline comments
- **Issues**: Report bugs via GitHub Issues
- **Features**: Request features via GitHub Discussions

---

**Built with ❤️ for freelancers worldwide**  
