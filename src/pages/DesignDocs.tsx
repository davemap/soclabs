import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { referenceDesigns } from "@/data/mockData";
import { nanosocDocs } from "@/data/nanosocDocs";
import ReactMarkdown from "react-markdown";

const DesignDocs = () => {
  const { id } = useParams<{ id: string }>();
  const design = referenceDesigns.find((d) => d.id === id);

  if (!design) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Design Not Found</h1>
          <Link to="/designs" className="text-primary hover:underline">
            Back to Designs
          </Link>
        </div>
      </Layout>
    );
  }

  // For now, only nanosoc has docs
  const docs = id === "nanosoc" ? nanosocDocs : null;

  if (!docs) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">
            Documentation not available yet
          </h1>
          <Link to={`/designs/${id}`} className="text-primary hover:underline">
            Back to {design.name}
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Back link */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link
              to={`/designs/${id}`}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" /> Back to {design.name}
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold">
                  {design.name} Documentation
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Sourced from the{" "}
                  <a
                    href={design.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    official ReadTheDocs
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary">{design.processor}</Badge>
              <Badge variant="outline">v{design.version || "latest"}</Badge>
            </div>
          </motion.div>

          {/* Documentation tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Tabs defaultValue={docs[0].id} className="w-full">
              <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/50 p-1.5 rounded-xl mb-8">
                {docs.map((section) => (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    className="rounded-lg text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    {section.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {docs.map((section) => (
                <TabsContent key={section.id} value={section.id}>
                  <div className="rounded-2xl border bg-card p-6 md:p-10">
                    <h2 className="text-2xl font-display font-bold mb-6">
                      {section.title}
                    </h2>
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-table:border-collapse prose-th:border prose-th:border-border prose-th:px-3 prose-th:py-2 prose-th:bg-muted/50 prose-td:border prose-td:border-border prose-td:px-3 prose-td:py-2 prose-a:text-primary">
                      <ReactMarkdown>{section.content}</ReactMarkdown>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default DesignDocs;
