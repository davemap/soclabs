import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Building2, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Layout from "@/components/Layout";
import { newsArticles } from "@/data/newsData";
import { communityMembers, partners } from "@/data/mockData";
import ReactMarkdown from "react-markdown";
import CommentsThreads from "@/components/CommentsThreads";

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
  const { id } = useParams<{ id: string }>();
  const article = newsArticles.find((a) => a.id === id);

  if (!article) {
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

  const author = communityMembers.find((m) => m.id === article.authorId);
  const authorOrgs = author?.organisations || [];
  const institutionOrg = partners.find((p) => authorOrgs.includes(p.id) && p.name === article.institution)
    || partners.find((p) => authorOrgs.includes(p.id));

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
              {/* Main content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="flex-1 min-w-0"
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-3xl md:text-4xl font-display font-bold mb-6 leading-tight">{article.title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-10 pb-6 border-b border-border/50">
                  <Link
                    to={`/community/${article.authorId}`}
                    className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  >
                    <User className="h-4 w-4" /> {article.author}
                  </Link>
                  {institutionOrg ? (
                    <Link
                      to={`/partners/${institutionOrg.id}`}
                      className="flex items-center gap-1.5 hover:text-primary transition-colors"
                    >
                      <Building2 className="h-4 w-4" /> {article.institution}
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4" /> {article.institution}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />{" "}
                    {new Date(article.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {articleImages[article.id] && (
                  <div className="rounded-xl overflow-hidden mb-10">
                    <img
                      src={articleImages[article.id]}
                      alt={article.title}
                      className="w-full h-64 md:h-80 object-cover"
                    />
                  </div>
                )}

                <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-a:text-primary">
                  <ReactMarkdown>{article.content}</ReactMarkdown>
                </div>

                <CommentsThreads pageId={`news-${article.id}`} />
              </motion.div>

              {/* Floating author sidebar */}
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
                            <h4 className="font-display font-bold text-sm group-hover:text-primary transition-colors truncate">
                              {author.name}
                            </h4>
                            <p className="text-xs text-muted-foreground truncate">{author.institution}</p>
                          </div>
                        </div>
                      </Link>

                      {author.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-3">
                          <MapPin className="h-3 w-3 shrink-0" /> {author.location}
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4 mb-4">
                        {author.bio}
                      </p>

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
