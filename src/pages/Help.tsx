import { useState, useMemo } from "react";
import { ChevronDown, Search, HelpCircle } from "lucide-react";
import { helpCategories, helpTopics } from "../data/help";

export function HelpPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>({});

  const filteredTopics = useMemo(() => {
    return helpTopics.filter((topic) => {
      const matchesCategory =
        selectedCategory === "All" || topic.category === selectedCategory;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        topic.question.toLowerCase().includes(q) ||
        topic.answer.toLowerCase().includes(q) ||
        topic.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const toggleQuestion = (question: string) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [question]: !prev[question],
    }));
  };

  return (
    <section className="help-page">
      <div className="help-hero">
        <span className="eyebrow">
          <span /> Help centre
        </span>
        <h1>Answers that get you moving.</h1>
        <p>
          Guidance for filing, tracking, payments and appeals in this mock
          portal.
        </p>

        <div className="search-input big" style={{ maxWidth: 460, margin: "20px auto 0" }}>
          <Search size={18} aria-hidden />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions or keywords..."
            aria-label="Search help topics"
          />
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "40px auto 0" }}>
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "32px",
          }}
        >
          {["All", ...helpCategories].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                border: "1px solid",
                borderColor: selectedCategory === cat ? "var(--ink)" : "var(--line)",
                background: selectedCategory === cat ? "var(--ink)" : "#fff",
                color: selectedCategory === cat ? "#fff" : "var(--ink)",
                padding: "6px 14px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="faq-list">
          {filteredTopics.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 20px",
                color: "var(--muted)",
              }}
            >
              <HelpCircle size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
              <h3 style={{ fontSize: "16px", color: "var(--ink)", margin: "0 0 6px" }}>
                No matching answers found
              </h3>
              <p style={{ fontSize: "13px", margin: 0 }}>
                Try adjusting your search or selecting a different category.
              </p>
            </div>
          ) : (
            filteredTopics.map((topic) => {
              const isOpen = !!openQuestions[topic.question];
              return (
                <article key={topic.question} className="faq-item">
                  <button
                    type="button"
                    onClick={() => toggleQuestion(topic.question)}
                    aria-expanded={isOpen}
                    className="faq-toggle-button"
                  >
                    <span>
                      <small>{topic.category}</small>
                      <b>{topic.question}</b>
                    </span>
                    <div
                      className={`faq-arrow ${isOpen ? "open" : ""}`}
                      aria-hidden="true"
                    >
                      <ChevronDown size={18} />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="faq-answer">
                      <p>{topic.answer}</p>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
