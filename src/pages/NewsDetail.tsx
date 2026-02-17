import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { newsArticles } from "@/data/newsData";
import ReactMarkdown from "react-markdown";
import CommentsThreads from "@/components/CommentsThreads";

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const article = newsArticles.find((a) => a.id === id);

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Article Not Found</h1>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/news">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Button asChild variant="ghost" size="sm" className="mb-8 -ml-2 rounded-full">
              <Link to="/news">
                <ArrowLeft className="mr-1 h-4 w-4" /> Back to News
              </Link>
            </Button>

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
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" /> {article.institution}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />{" "}
                {new Date(article.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-a:text-primary">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>

            <CommentsThreads pageId={`news-${article.id}`} />
          </motion.div>
        </div>
      </article>
    </Layout>
  );
};

export default NewsDetail;
