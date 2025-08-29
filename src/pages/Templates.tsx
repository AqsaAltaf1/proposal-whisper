import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Plus, 
  Edit3, 
  Trash2,
  FileText,
  Target,
  Copy,
  Save,
  BookOpen
} from "lucide-react";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  coverSnippet: string;
  milestoneSnippet: string;
  createdAt: string;
  updatedAt?: string;
}

const Templates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    coverSnippet: '',
    milestoneSnippet: ''
  });

  useEffect(() => {
    // Load templates from localStorage (in real app, this would be from Supabase)
    const savedTemplates = JSON.parse(localStorage.getItem('templates') || '[]');
    
    // Always load the new 10 professional templates (replace old ones)
    if (savedTemplates.length <= 2) {
      const defaultTemplates = [
        {
          id: '1',
          name: 'UI/UX Designer',
          coverSnippet: 'Hello!\n\nAs a seasoned UI/UX designer with 5+ years of experience, I specialize in creating intuitive, user-centered designs that drive engagement and conversions. My expertise includes user research, wireframing, prototyping, and delivering pixel-perfect designs that enhance user experience across web and mobile platforms.\n\nI focus on understanding your users and business goals to create designs that not only look great but also perform exceptionally.',
          milestoneSnippet: '1. User Research & Analysis (3-4 days)\n   - User interviews and surveys\n   - Competitor analysis\n   - User personas creation\n\n2. Design & Prototyping (7-10 days)\n   - Wireframes and mockups\n   - Interactive prototypes\n   - Design system creation\n\n3. Testing & Refinement (2-3 days)\n   - Usability testing\n   - Design iterations\n   - Final deliverables',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Website Developer',
          coverSnippet: 'Hi there!\n\nI\'m a full-stack web developer with expertise in modern technologies including React, Node.js, and cloud deployment. I build responsive, high-performance websites that are SEO-optimized and mobile-friendly. My focus is on clean code, fast loading times, and excellent user experience.\n\nI deliver websites that not only look great but also rank well in search engines and convert visitors into customers.',
          milestoneSnippet: '1. Planning & Setup (3-4 days)\n   - Requirements analysis\n   - Technical architecture\n   - Development environment\n\n2. Development (8-12 days)\n   - Responsive frontend\n   - Backend functionality\n   - Database integration\n\n3. Optimization & Launch (2-3 days)\n   - Performance optimization\n   - SEO implementation\n   - Deployment & testing',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Mobile App Developer',
          coverSnippet: 'Hello!\n\nI\'m a specialized mobile app developer with experience in React Native, Flutter, and native iOS/Android development. I create cross-platform mobile applications that deliver native performance with smooth user interfaces. My apps are optimized for app store approval and user engagement.\n\nI focus on creating apps that users love to use and that drive business results.',
          milestoneSnippet: '1. App Design & Planning (4-5 days)\n   - UI/UX design\n   - Technical architecture\n   - Feature specification\n\n2. Development Phase (12-16 days)\n   - Core functionality\n   - API integration\n   - Testing on devices\n\n3. Store Launch (3-4 days)\n   - App store optimization\n   - Submission process\n   - Launch support',
          createdAt: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Backend Developer',
          coverSnippet: 'Hi!\n\nI\'m a backend specialist with expertise in Node.js, Python, and cloud architecture. I build scalable APIs, microservices, and database solutions that handle high traffic loads. My focus is on security, performance optimization, and reliable system architecture.\n\nI create robust backend systems that support your business growth and ensure data security.',
          milestoneSnippet: '1. Architecture & Planning (3-4 days)\n   - System design\n   - Database schema\n   - API specification\n\n2. Development (10-14 days)\n   - API development\n   - Database implementation\n   - Security features\n\n3. Testing & Deployment (3-4 days)\n   - Performance testing\n   - Security audit\n   - Production deployment',
          createdAt: new Date().toISOString()
        },
        {
          id: '5',
          name: 'CMS Developer',
          coverSnippet: 'Hello!\n\nI\'m an expert in content management systems including WordPress, Drupal, and headless CMS solutions. I create custom themes, plugins, and integrations that make content management easy for clients. My solutions are secure, SEO-friendly, and easily maintainable.\n\nI help businesses manage their content efficiently while maintaining professional design and functionality.',
          milestoneSnippet: '1. CMS Setup & Configuration (3-4 days)\n   - Platform installation\n   - Initial configuration\n   - Security setup\n\n2. Customization (6-8 days)\n   - Custom theme development\n   - Plugin/module creation\n   - Content structure\n\n3. Training & Launch (2-3 days)\n   - User training\n   - Documentation\n   - Go-live support',
          createdAt: new Date().toISOString()
        },
        {
          id: '6',
          name: 'Database Developer',
          coverSnippet: 'Hi there!\n\nI\'m a database specialist with expertise in MySQL, PostgreSQL, MongoDB, and cloud databases. I design efficient database schemas, optimize queries for performance, and ensure data security and backup strategies. My solutions handle complex data relationships and high-volume operations.\n\nI create database systems that scale with your business and keep your data safe and accessible.',
          milestoneSnippet: '1. Database Design (4-5 days)\n   - Schema design\n   - Relationship mapping\n   - Performance planning\n\n2. Implementation (6-8 days)\n   - Database creation\n   - Query optimization\n   - Security implementation\n\n3. Testing & Documentation (2-3 days)\n   - Performance testing\n   - Backup procedures\n   - Technical documentation',
          createdAt: new Date().toISOString()
        },
        {
          id: '7',
          name: 'DevOps Developer',
          coverSnippet: 'Hello!\n\nI\'m a DevOps engineer specializing in CI/CD pipelines, cloud infrastructure, and automation. I work with AWS, Docker, Kubernetes, and various deployment tools to ensure smooth, automated deployments and reliable system monitoring. My focus is on scalability and system reliability.\n\nI help teams deploy faster and more reliably while reducing operational overhead.',
          milestoneSnippet: '1. Infrastructure Setup (4-5 days)\n   - Cloud environment setup\n   - Security configuration\n   - Monitoring implementation\n\n2. CI/CD Pipeline (6-8 days)\n   - Automated testing\n   - Deployment automation\n   - Environment management\n\n3. Optimization & Documentation (2-3 days)\n   - Performance optimization\n   - Team training\n   - Process documentation',
          createdAt: new Date().toISOString()
        },
        {
          id: '8',
          name: 'No-Code Developer',
          coverSnippet: 'Hi!\n\nI\'m a no-code specialist using platforms like Bubble, Webflow, Zapier, and Airtable to build powerful applications without traditional coding. I help businesses rapidly prototype and deploy solutions that are cost-effective and easily maintainable by non-technical teams.\n\nI deliver functional applications quickly while keeping costs low and maintenance simple.',
          milestoneSnippet: '1. Platform Setup & Design (3-4 days)\n   - Platform selection\n   - Initial setup\n   - UI/UX design\n\n2. Application Development (6-8 days)\n   - Core functionality\n   - Workflow automation\n   - Integration setup\n\n3. Testing & Training (2-3 days)\n   - User testing\n   - Team training\n   - Documentation',
          createdAt: new Date().toISOString()
        },
        {
          id: '9',
          name: 'AI Developer',
          coverSnippet: 'Hello!\n\nI\'m an AI/ML specialist with experience in machine learning, natural language processing, and AI integrations. I work with OpenAI APIs, TensorFlow, and other AI frameworks to build intelligent applications. My solutions include chatbots, recommendation systems, and automated data analysis.\n\nI help businesses leverage AI to automate processes and gain insights from their data.',
          milestoneSnippet: '1. AI Strategy & Planning (4-5 days)\n   - Use case analysis\n   - Model selection\n   - Data preparation\n\n2. Development & Training (10-14 days)\n   - Model implementation\n   - Training and testing\n   - Integration development\n\n3. Deployment & Optimization (3-4 days)\n   - Production deployment\n   - Performance monitoring\n   - Model optimization',
          createdAt: new Date().toISOString()
        },
        {
          id: '10',
          name: 'E-commerce Developer',
          coverSnippet: 'Hi there!\n\nI\'m an e-commerce specialist with expertise in Shopify, WooCommerce, and custom e-commerce solutions. I build online stores that drive sales with optimized checkout flows, payment integrations, and inventory management. My focus is on conversion optimization and user experience.\n\nI create online stores that not only look professional but also maximize sales and customer satisfaction.',
          milestoneSnippet: '1. Store Setup & Design (4-5 days)\n   - Platform configuration\n   - Theme customization\n   - Payment integration\n\n2. Product & Feature Development (8-10 days)\n   - Product catalog setup\n   - Checkout optimization\n   - Inventory management\n\n3. Launch & Optimization (3-4 days)\n   - Performance testing\n   - SEO optimization\n   - Go-live support',
          createdAt: new Date().toISOString()
        }
      ];
      
      setTemplates(defaultTemplates);
      localStorage.setItem('templates', JSON.stringify(defaultTemplates));
    } else {
      setTemplates(savedTemplates);
    }
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      coverSnippet: '',
      milestoneSnippet: ''
    });
  };

  const handleCreate = () => {
    if (!formData.name.trim()) {
      toast.error('Template name is required');
      return;
    }

    const newTemplate: Template = {
      id: Date.now().toString(),
      name: formData.name,
      coverSnippet: formData.coverSnippet,
      milestoneSnippet: formData.milestoneSnippet,
      createdAt: new Date().toISOString()
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem('templates', JSON.stringify(updatedTemplates));
    
    resetForm();
    setIsCreateOpen(false);
    toast.success('Template created successfully!');
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      coverSnippet: template.coverSnippet,
      milestoneSnippet: template.milestoneSnippet
    });
  };

  const handleUpdate = () => {
    if (!editingTemplate || !formData.name.trim()) {
      toast.error('Template name is required');
      return;
    }

    const updatedTemplate: Template = {
      ...editingTemplate,
      name: formData.name,
      coverSnippet: formData.coverSnippet,
      milestoneSnippet: formData.milestoneSnippet,
      updatedAt: new Date().toISOString()
    };

    const updatedTemplates = templates.map(t => 
      t.id === editingTemplate.id ? updatedTemplate : t
    );
    
    setTemplates(updatedTemplates);
    localStorage.setItem('templates', JSON.stringify(updatedTemplates));
    
    setEditingTemplate(null);
    resetForm();
    toast.success('Template updated successfully!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      const updatedTemplates = templates.filter(t => t.id !== id);
      setTemplates(updatedTemplates);
      localStorage.setItem('templates', JSON.stringify(updatedTemplates));
      toast.success('Template deleted successfully');
    }
  };

  const handleCopy = (snippet: string, type: string) => {
    navigator.clipboard.writeText(snippet);
    toast.success(`${type} snippet copied to clipboard!`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
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
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Proposal Templates</h1>
              <p className="text-muted-foreground">
                Create and manage reusable snippets for your proposals
              </p>
            </div>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="glass-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card  max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Web Development, Mobile App"
                    className="glass-input mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="coverSnippet">Cover Letter Snippet</Label>
                  <Textarea
                    id="coverSnippet"
                    value={formData.coverSnippet}
                    onChange={(e) => setFormData({...formData, coverSnippet: e.target.value})}
                    placeholder="Reusable cover letter content..."
                    className="glass-input min-h-[120px] mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="milestoneSnippet">Milestone Snippet</Label>
                  <Textarea
                    id="milestoneSnippet"
                    value={formData.milestoneSnippet}
                    onChange={(e) => setFormData({...formData, milestoneSnippet: e.target.value})}
                    placeholder="Common milestone structure..."
                    className="glass-input min-h-[120px] mt-1"
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreate} className="glass-primary">
                    <Save className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="glass-button"
                    onClick={() => {
                      setIsCreateOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Templates Grid */}
        {templates.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No templates yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first template to speed up proposal creation
              </p>
              <Button 
                onClick={() => setIsCreateOpen(true)}
                className="glass-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Template
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(template)}
                      className="glass-button"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(template.id)}
                      className="glass-button hover:bg-red-500/20 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Cover Letter Snippet */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <Label className="text-sm font-medium">Cover Letter</Label>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(template.coverSnippet, 'Cover letter')}
                        className="glass-button"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {template.coverSnippet || 'No cover letter snippet'}
                      </p>
                    </div>
                  </div>

                  {/* Milestone Snippet */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        <Label className="text-sm font-medium">Milestones</Label>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(template.milestoneSnippet, 'Milestone')}
                        className="glass-button"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-line">
                        {template.milestoneSnippet || 'No milestone snippet'}
                      </p>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <Badge variant="outline" className="bg-white/10 text-xs">
                      Created {formatDate(template.createdAt)}
                    </Badge>
                    {template.updatedAt && (
                      <Badge variant="outline" className="bg-white/10 text-xs">
                        Updated {formatDate(template.updatedAt)}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        {editingTemplate && (
          <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
            <DialogContent className="glass-card  max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Template Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="glass-input mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-coverSnippet">Cover Letter Snippet</Label>
                  <Textarea
                    id="edit-coverSnippet"
                    value={formData.coverSnippet}
                    onChange={(e) => setFormData({...formData, coverSnippet: e.target.value})}
                    className="glass-input min-h-[120px] mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-milestoneSnippet">Milestone Snippet</Label>
                  <Textarea
                    id="edit-milestoneSnippet"
                    value={formData.milestoneSnippet}
                    onChange={(e) => setFormData({...formData, milestoneSnippet: e.target.value})}
                    className="glass-input min-h-[120px] mt-1"
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleUpdate} className="glass-primary">
                    <Save className="h-4 w-4 mr-2" />
                    Update Template
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="glass-button"
                    onClick={() => {
                      setEditingTemplate(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Templates;
