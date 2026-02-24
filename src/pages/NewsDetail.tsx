import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Building2, MapPin, ExternalLink, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Layout from "@/components/Layout";
import { newsArticles } from "@/data/newsData";
import { communityMembers, partners } from "@/data/mockData";
import ReactMarkdown from "react-markdown";
import CommentsThreads from "@/components/CommentsThreads";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

import imgFpgaWorkshop from "@/assets/news/fpga-workshop.jpg";
import imgAsicTapeout from "@/assets/news/asic-tapeout.jpg";
import imgDesignComp from "@/assets/news/design-competition.jpg";
import imgRiscvSummit from "@/assets/news/riscv-summit.jpg";
import imgMlAccel from "@/assets/news/ml-accelerator.jpg";
import imgOpenEda from "@/assets/news/open-eda.jpg";
import imgDvfs from "@/assets/news/dvfs-power.jpg";

const articleImages: Record<string, string> = {
  "nanosoc-fpga-workshop-2026": imgFpgaWorkshop,
  "ecosoc-tapeout-tsmc-28nm": imgAsicTapeout,
  "design-competition-2026": imgDesignComp,
  "risc-v-summit-talk": imgRiscvSummit,
  "ml-accelerator-tinyml-benchmark": imgMlAccel,
  "open-eda-flow-yosys": imgOpenEda,
  "dvfs-controller-results": imgDvfs,
};

const NewsDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  // Check if this is a DB article (id starts with "db-" from the listing, or route is /news/db-:id)
  const isDbArticle = location.pathname.startsWith("/news/db-") || (id && id.startsWith("db-"));
  const dbId = id?.startsWith("db-") ? id.slice(3) : id;

  // Mock article lookup
  const mockArticle = !isDbArticle ? newsArticles.find((a) => a.id === id) : null;

  // DB article state
  const [dbArticle, setDbArticle] = useState<any>(null);
  const [dbSections, setDbSections] = useState<any[]>([]);
  const [authorProfile, setAuthorProfile] = useState<any>(null);
  const [loading, setLoading] = useState(isDbArticle);

  useEffect(() => {
    if (!isDbArticle || !dbId) return;

    const fetchArticle = async () => {
      setLoading(true);
      // Fetch article
      const { data: article } = await supabase
        .from("news_articles")
        .select("*")
        .eq("id", dbId)
        .single();

      if (!article) {
        setLoading(false);
        return;
      }
      setDbArticle(article);

      // Fetch content sections
      const { data: sections } = await supabase
        .from("news_article_content")
        .select("*")
        .eq("article_id", dbId)
        .order("sort_order", { ascending: true });
      setDbSections(sections || []);

      // Fetch author profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", article.user_id)
        .single();
      setAuthorProfile(profile);

      setLoading(false);
    };

    fetchArticle();
  }, [isDbArticle, dbId]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center text-muted-foreground">Loading article...</div>
      </Layout>
    );
  }

  // DB article rendering
  if (isDbArticle && dbArticle) {
    const authorName = authorProfile?.full_name || "Unknown Author";
    const authorInitials = authorName.split(" ").map((n: string) => n[0]).join("").slice(0, 2);
    const publishedDate = dbArticle.published_at || dbArticle.created_at;
    const isAuthor = user && user.id === dbArticle.user_id;

    return (
      <Layout>
        <article className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center justify-between mb-8">
                <Button variant="ghost" size="sm" className="-ml-2 rounded-full" onClick={() => navigate(-1)}>
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back
                </Button>
                {isAuthor && (
                  <Button variant="outline" size="sm" className="rounded-full" asChild>
                    <Link to={`/news/edit/${dbArticle.id}`}>
                      <Settings className="h-4 w-4 mr-1.5" /> Edit This Page
                    </Link>
                  </Button>
                )}
              </motion.div>

              <div className="flex flex-col lg:flex-row gap-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                  className="flex-1 min-w-0"
                >
                  {dbArticle.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {dbArticle.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  )}

                  <h1 className="text-3xl md:text-4xl font-display font-bold mb-6 leading-tight">{dbArticle.title}</h1>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-10 pb-6 border-b border-border/50">
                    {authorProfile && (
                      <Link
                        to={`/community/${dbArticle.user_id}`}
                        className="flex items-center gap-1.5 hover:text-primary transition-colors"
                      >
                        <User className="h-4 w-4" /> {authorName}
                      </Link>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />{" "}
                      {new Date(publishedDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {dbArticle.image_url && (
                    <div className="rounded-xl overflow-hidden mb-10">
                      <img src={dbArticle.image_url} alt={dbArticle.title} className="w-full h-64 md:h-80 object-cover" />
                    </div>
                  )}

                  {dbArticle.summary && (
                    <p className="text-lg text-muted-foreground mb-8 italic">{dbArticle.summary}</p>
                  )}

                  {dbSections.length > 0 ? (
                    <div className="space-y-8">
                      {dbSections.map((section) => (
                        <div key={section.id}>
                          {section.title && (
                            <h2 className="text-2xl font-display font-bold mb-4">{section.title}</h2>
                          )}
                          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-a:text-primary">
                            <ReactMarkdown>{section.body}</ReactMarkdown>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No content sections yet.</p>
                  )}

                  <CommentsThreads pageId={`news-${dbArticle.id}`} />
                </motion.div>

                {/* Author sidebar */}
                {authorProfile && (
                  <motion.aside
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="lg:w-64 shrink-0"
                  >
                    <div className="lg:sticky lg:top-24 space-y-4">
                      <div className="rounded-xl border border-border/60 bg-card p-5">
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4">About the Author</p>
                        <Link to={`/community/${dbArticle.user_id}`} className="group block">
                          <div className="flex items-center gap-3 mb-4">
                            <Avatar className="h-12 w-12">
                              {authorProfile.avatar_url && <AvatarImage src={authorProfile.avatar_url} />}
                              <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                                {authorInitials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <h4 className="font-display font-bold text-sm group-hover:text-primary transition-colors truncate">
                                {authorName}
                              </h4>
                              {authorProfile.username && (
                                <p className="text-xs text-muted-foreground truncate">@{authorProfile.username}</p>
                              )}
                            </div>
                          </div>
                        </Link>
                        {authorProfile.blurb && (
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4 mb-4">
                            {authorProfile.blurb}
                          </p>
                        )}
                        {authorProfile.expertise?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {authorProfile.expertise.map((e: string) => (
                              <Badge key={e} variant="secondary" className="text-[10px]">{e}</Badge>
                            ))}
                          </div>
                        )}
                        <Button asChild variant="outline" size="sm" className="w-full rounded-full text-xs">
                          <Link to={`/community/${dbArticle.user_id}`}>
                            View Profile <ExternalLink className="h-3 w-3 ml-1.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </motion.aside>
                )}
              </div>
            </div>
          </div>
        </article>
      </Layout>
    );
  }

  // Mock article rendering (existing)
  if (!mockArticle) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Article Not Found</h1>
          <Button variant="outline" className="rounded-full" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </Layout>
    );
  }

  const author = communityMembers.find((m) => m.id === mockArticle.authorId);
  const institutionOrg = partners.find((p) => p.name === mockArticle.institution);

  return (
    <Layout>
      <article className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Button variant="ghost" size="sm" className="mb-8 -ml-2 rounded-full" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="flex-1 min-w-0"
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  {mockArticle.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>

                <h1 className="text-3xl md:text-4xl font-display font-bold mb-6 leading-tight">{mockArticle.title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-10 pb-6 border-b border-border/50">
                  <Link to={`/community/${mockArticle.authorId}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <User className="h-4 w-4" /> {mockArticle.author}
                  </Link>
                  {institutionOrg ? (
                    <Link to={`/partners/${institutionOrg.id}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      <Building2 className="h-4 w-4" /> {mockArticle.institution}
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4" /> {mockArticle.institution}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />{" "}
                    {new Date(mockArticle.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>

                {articleImages[mockArticle.id] && (
                  <div className="rounded-xl overflow-hidden mb-10">
                    <img src={articleImages[mockArticle.id]} alt={mockArticle.title} className="w-full h-64 md:h-80 object-cover" />
                  </div>
                )}

                <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-a:text-primary">
                  <ReactMarkdown>{mockArticle.content}</ReactMarkdown>
                </div>

                <CommentsThreads pageId={`news-${mockArticle.id}`} />
              </motion.div>

              {author && (
                <motion.aside
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="lg:w-64 shrink-0"
                >
                  <div className="lg:sticky lg:top-24 space-y-4">
                    <div className="rounded-xl border border-border/60 bg-card p-5">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4">About the Author</p>
                      <Link to={`/community/${author.id}`} className="group block">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                              {author.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <h4 className="font-display font-bold text-sm group-hover:text-primary transition-colors truncate">{author.name}</h4>
                            <p className="text-xs text-muted-foreground truncate">{author.institution}</p>
                          </div>
                        </div>
                      </Link>
                      {author.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-3">
                          <MapPin className="h-3 w-3 shrink-0" /> {author.location}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4 mb-4">{author.bio}</p>
                      {author.expertise && author.expertise.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {author.expertise.map((e) => (
                            <Badge key={e} variant="secondary" className="text-[10px]">{e}</Badge>
                          ))}
                        </div>
                      )}
                      <Button asChild variant="outline" size="sm" className="w-full rounded-full text-xs">
                        <Link to={`/community/${author.id}`}>
                          View Profile <ExternalLink className="h-3 w-3 ml-1.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.aside>
              )}
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default NewsDetail;
