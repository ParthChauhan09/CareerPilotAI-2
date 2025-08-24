// Force dynamic rendering to avoid SSG issues
export const dynamic = 'force-dynamic'

import { LandingHeader } from "@/components/landing-header"
import { LandingFooter } from "@/components/landing-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, Calendar, User, ArrowRight, Search, TrendingUp, FileText, Users, Lightbulb, Target } from "lucide-react"
import Link from "next/link"

export default function BlogPage() {
  const featuredPost = {
    title: "10 AI-Powered Resume Tips That Will Get You Hired in 2024",
    excerpt: "Discover how artificial intelligence is revolutionizing resume writing and learn the latest strategies to make your application stand out in today's competitive job market.",
    author: "Sarah Johnson",
    date: "December 15, 2024",
    readTime: "8 min read",
    category: "Resume Tips",
    image: "/api/placeholder/600/300"
  }

  const blogPosts = [
    {
      title: "The Future of Cover Letters: AI vs Human Touch",
      excerpt: "Exploring the balance between AI efficiency and personal authenticity in modern cover letter writing.",
      author: "Michael Chen",
      date: "December 12, 2024",
      readTime: "6 min read",
      category: "Cover Letters",
      icon: FileText
    },
    {
      title: "LinkedIn Profile Optimization: A Complete Guide",
      excerpt: "Transform your LinkedIn presence with these proven strategies for professional networking success.",
      author: "Emily Rodriguez",
      date: "December 10, 2024",
      readTime: "10 min read",
      category: "LinkedIn",
      icon: Users
    },
    {
      title: "Career Pivot Success Stories: Real People, Real Results",
      excerpt: "Inspiring stories of professionals who successfully changed careers using AI-powered tools.",
      author: "David Kim",
      date: "December 8, 2024",
      readTime: "12 min read",
      category: "Career Change",
      icon: TrendingUp
    },
    {
      title: "ATS-Friendly Resume Formats: What Really Works",
      excerpt: "Understanding Applicant Tracking Systems and how to optimize your resume for automated screening.",
      author: "Lisa Thompson",
      date: "December 5, 2024",
      readTime: "7 min read",
      category: "Resume Tips",
      icon: Target
    },
    {
      title: "Remote Work Resume: Highlighting Digital Skills",
      excerpt: "Essential tips for showcasing remote work capabilities and digital collaboration skills.",
      author: "James Wilson",
      date: "December 3, 2024",
      readTime: "9 min read",
      category: "Remote Work",
      icon: Lightbulb
    },
    {
      title: "Industry-Specific Resume Templates: Which One is Right for You?",
      excerpt: "Choosing the perfect resume template based on your industry and career level.",
      author: "Anna Martinez",
      date: "December 1, 2024",
      readTime: "5 min read",
      category: "Templates",
      icon: FileText
    }
  ]

  const categories = [
    "All Posts",
    "Resume Tips",
    "Cover Letters", 
    "LinkedIn",
    "Career Change",
    "Remote Work",
    "Templates",
    "Interview Prep"
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <Badge variant="outline" className="animate-fade-in">
                <BookOpen className="w-3 h-3 mr-1" />
                CareerPilotAI Blog
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-slide-in-from-bottom">
                Career{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Insights
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in [animation-delay:200ms]">
                Expert advice, industry insights, and practical tips to accelerate your career journey. 
                Stay ahead with the latest trends in AI-powered career development.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto relative animate-fade-in [animation-delay:400ms]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search articles..." 
                  className="pl-10 pr-4 py-3 border-primary/20 focus:border-primary/40"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  size="sm"
                  className={index === 0 ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Article</h2>
                <p className="text-xl text-muted-foreground">Our most popular and impactful career advice</p>
              </div>
              
              <Card className="overflow-hidden border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-xl">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <div className="h-64 md:h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <FileText className="w-16 h-16 text-primary mx-auto" />
                        <p className="text-muted-foreground">Featured Article Image</p>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="space-y-4">
                      <Badge variant="secondary">{featuredPost.category}</Badge>
                      <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                        {featuredPost.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{featuredPost.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{featuredPost.date}</span>
                        </div>
                        <span>{featuredPost.readTime}</span>
                      </div>
                      <Button variant="gradient" size="lg" className="group">
                        Read Article
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Articles</h2>
                <p className="text-xl text-muted-foreground">Stay updated with our newest career insights and tips</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post, index) => (
                  <Card key={index} className="overflow-hidden border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg group cursor-pointer">
                    <CardHeader className="p-6 pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline">{post.category}</Badge>
                        <post.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{post.author}</span>
                        </div>
                        <span>{post.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                        <Calendar className="w-3 h-3" />
                        <span>{post.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Load More Button */}
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Articles
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 md:p-12 text-center border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-0 space-y-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <BookOpen className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold">Stay Updated</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                      Get the latest career tips, industry insights, and AI-powered job search strategies 
                      delivered straight to your inbox.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <Input 
                      placeholder="Enter your email" 
                      type="email"
                      className="flex-1"
                    />
                    <Button variant="gradient" size="lg">
                      Subscribe
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No spam, unsubscribe anytime. We respect your privacy.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  )
}
