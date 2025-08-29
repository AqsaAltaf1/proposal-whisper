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
  Briefcase,
  ExternalLink,
  Code,
  Save,
  Copy
} from "lucide-react";
import { toast } from "sonner";

interface PortfolioItem {
  id: string;
  title: string;
  techStack: string;
  resultSnippet: string;
  link: string;
  createdAt: string;
  updatedAt?: string;
}

const Portfolio = () => {
  const navigate = useNavigate();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    techStack: '',
    resultSnippet: '',
    link: ''
  });

  useEffect(() => {
    // Load portfolio items from localStorage (in real app, this would be from Supabase)
    const savedItems = JSON.parse(localStorage.getItem('portfolioItems') || '[]');
    
    // Add some default portfolio items if none exist
    if (savedItems.length === 0) {
      const defaultItems = [
        {
          id: '1',
          title: 'E-commerce Dashboard',
          techStack: 'React, Node.js, MongoDB, Stripe',
          resultSnippet: 'Increased client revenue by 40% with real-time analytics',
          link: 'https://github.com/example/ecommerce-dashboard',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Task Management App',
          techStack: 'React Native, Firebase, Redux',
          resultSnippet: 'Improved team productivity by 60% with intuitive mobile interface',
          link: 'https://apps.apple.com/app/task-manager',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          title: 'AI Content Generator',
          techStack: 'Next.js, OpenAI API, PostgreSQL',
          resultSnippet: 'Reduced content creation time by 75% for marketing teams',
          link: 'https://ai-content-generator.com',
          createdAt: new Date().toISOString()
        }
      ];
      
      setPortfolioItems(defaultItems);
      localStorage.setItem('portfolioItems', JSON.stringify(defaultItems));
    } else {
      setPortfolioItems(savedItems);
    }
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      techStack: '',
      resultSnippet: '',
      link: ''
    });
  };

  const handleCreate = () => {
    if (!formData.title.trim()) {
      toast.error('Project title is required');
      return;
    }

    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      title: formData.title,
      techStack: formData.techStack,
      resultSnippet: formData.resultSnippet,
      link: formData.link,
      createdAt: new Date().toISOString()
    };

    const updatedItems = [...portfolioItems, newItem];
    setPortfolioItems(updatedItems);
    localStorage.setItem('portfolioItems', JSON.stringify(updatedItems));
    
    resetForm();
    setIsCreateOpen(false);
    toast.success('Portfolio item created successfully!');
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      techStack: item.techStack,
      resultSnippet: item.resultSnippet,
      link: item.link
    });
  };

  const handleUpdate = () => {
    if (!editingItem || !formData.title.trim()) {
      toast.error('Project title is required');
      return;
    }

    const updatedItem: PortfolioItem = {
      ...editingItem,
      title: formData.title,
      techStack: formData.techStack,
      resultSnippet: formData.resultSnippet,
      link: formData.link,
      updatedAt: new Date().toISOString()
    };

    const updatedItems = portfolioItems.map(item => 
      item.id === editingItem.id ? updatedItem : item
    );
    
    setPortfolioItems(updatedItems);
    localStorage.setItem('portfolioItems', JSON.stringify(updatedItems));
    
    setEditingItem(null);
    resetForm();
    toast.success('Portfolio item updated successfully!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this portfolio item?')) {
      const updatedItems = portfolioItems.filter(item => item.id !== id);
      setPortfolioItems(updatedItems);
      localStorage.setItem('portfolioItems', JSON.stringify(updatedItems));
      toast.success('Portfolio item deleted successfully');
    }
  };

  const handleCopyItem = (item: PortfolioItem) => {
    const itemText = `${item.title}\nTech Stack: ${item.techStack}\nResult: ${item.resultSnippet}\nLink: ${item.link}`;
    navigator.clipboard.writeText(itemText);
    toast.success('Portfolio item copied to clipboard!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
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
              <h1 className="text-3xl font-bold">Portfolio</h1>
              <p className="text-muted-foreground">
                Showcase your best work to potential clients
              </p>
            </div>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="glass-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card  max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Portfolio Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., E-commerce Platform"
                    className="glass-input mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="techStack">Tech Stack</Label>
                  <Input
                    id="techStack"
                    value={formData.techStack}
                    onChange={(e) => setFormData({...formData, techStack: e.target.value})}
                    placeholder="e.g., React, Node.js, MongoDB"
                    className="glass-input mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="resultSnippet">Result Summary (1-line)</Label>
                  <Textarea
                    id="resultSnippet"
                    value={formData.resultSnippet}
                    onChange={(e) => setFormData({...formData, resultSnippet: e.target.value})}
                    placeholder="e.g., Increased conversion rate by 35% with optimized checkout flow"
                    className="glass-input min-h-[80px] mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="link">Project Link</Label>
                  <Input
                    id="link"
                    value={formData.link}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                    placeholder="https://github.com/username/project"
                    className="glass-input mt-1"
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreate} className="glass-primary">
                    <Save className="h-4 w-4 mr-2" />
                    Add to Portfolio
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

        {/* Portfolio Items Grid */}
        {portfolioItems.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No portfolio items yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your best projects to showcase your skills to potential clients
              </p>
              <Button 
                onClick={() => setIsCreateOpen(true)}
                className="glass-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <Card key={item.id} className="glass-card">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight mb-2">{item.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{item.techStack}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyItem(item)}
                      className="glass-button"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(item)}
                      className="glass-button"
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(item.id)}
                      className="glass-button hover:bg-red-500/20 hover:text-red-400"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Result */}
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                    <p className="text-sm text-green-400 font-medium mb-1">Impact</p>
                    <p className="text-sm">{item.resultSnippet}</p>
                  </div>

                  {/* Link */}
                  {item.link && (
                    <div>
                      {isValidUrl(item.link) ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="glass-button w-full justify-start"
                        >
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            View Project
                          </a>
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ExternalLink className="h-4 w-4" />
                          <span className="truncate">{item.link}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <Badge variant="outline" className="bg-white/10 text-xs">
                      Added {formatDate(item.createdAt)}
                    </Badge>
                    {item.updatedAt && (
                      <Badge variant="outline" className="bg-white/10 text-xs">
                        Updated {formatDate(item.updatedAt)}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        {editingItem && (
          <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
            <DialogContent className="glass-card  max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Portfolio Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Project Title</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="glass-input mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-techStack">Tech Stack</Label>
                  <Input
                    id="edit-techStack"
                    value={formData.techStack}
                    onChange={(e) => setFormData({...formData, techStack: e.target.value})}
                    className="glass-input mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-resultSnippet">Result Summary</Label>
                  <Textarea
                    id="edit-resultSnippet"
                    value={formData.resultSnippet}
                    onChange={(e) => setFormData({...formData, resultSnippet: e.target.value})}
                    className="glass-input min-h-[80px] mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-link">Project Link</Label>
                  <Input
                    id="edit-link"
                    value={formData.link}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                    className="glass-input mt-1"
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleUpdate} className="glass-primary">
                    <Save className="h-4 w-4 mr-2" />
                    Update Item
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="glass-button"
                    onClick={() => {
                      setEditingItem(null);
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

export default Portfolio;
