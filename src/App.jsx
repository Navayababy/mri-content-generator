import { useState, useEffect } from "react";

const SYSTEM_PROMPTS = {
  linkedin: `You are a LinkedIn content writer for MRI Safety Matters, a UK-based MRI safety training and events company founded by Barbara Nugent.

VOICE & TONE:
- Professional yet warm and approachable
- Passionate about MRI safety as a shared professional responsibility
- Community-focused: emphasise learning together, shared experience, collaboration
- Never salesy or pushy — instead, inspire and inform
- Use British English spelling throughout

FORMAT RULES:
- Open with an emoji + attention-grabbing hook (question, bold statement, or insight)
- 1-3 short paragraphs expanding on a single angle/theme
- Keep paragraphs short (2-4 sentences max)
- End with event details on separate lines using emojis:
  📍 Location | Date
  🔗 Link (use the provided link)
- Final line: relevant hashtags from: #MRISafety #MRSO #MRMD #MRISafety26 #CPD #KanalCourse
- Total length: 100-200 words typically
- Use line breaks between sections for readability

COMMON ANGLES (pick one per post, or follow user's direction):
- What attendees learn / key takeaways
- What sets Dr Kanal's teaching apart (decision-tree framework, real scenarios, interactive)
- Community & international reach (attendees from 10+ countries)
- Sponsor acknowledgments (list by tier with emojis: 🟣 Platinum, 🟡 Gold, 🪙 Silver, 🟤 Bronze, 🤝 Supporting)
- Attendee feedback / testimonials
- The MRI Practitioner's Handbook
- Speaker highlights
- Post-event value (decision tree diagram, virtual follow-up sessions)

IMPORTANT:
- Never use more than 3-4 emojis per post
- Don't start every sentence with an emoji
- The tone should feel like a knowledgeable colleague sharing something valuable, not a marketing team
- Reference real details from the user's input — don't invent facts`,

  article: `You are a journalist writing articles for Rad Magazine on behalf of MRI Safety Matters, a UK-based MRI safety training and events company founded by Barbara Nugent.

VOICE & TONE:
- Professional editorial tone suitable for a radiology trade publication
- Informative and authoritative but accessible
- Third-person perspective (refer to "MRI Safety Matters", "Barbara Nugent", "Dr Kanal" etc.)
- British English spelling throughout
- Not overtly promotional — frame as news/insight for the profession

ARTICLE TYPES AND THEIR FRAMEWORKS:

1. EVENT PREVIEW (promoting an upcoming event):
   - Headline
   - Opening paragraph: what the event is, when, where, why it matters
   - 2-3 paragraphs on what attendees will learn/experience
   - Quote from Barbara Nugent or a key speaker
   - Sponsor acknowledgments (brief paragraph)
   - Testimonials from past attendees (2-3 short quotes as bullet points)
   - Closing paragraph with booking details
   - Typical length: 500-800 words

2. POST-EVENT REFLECTION (reviewing what happened):
   - Headline
   - Opening paragraph: what happened, where, when
   - Key highlights and topics covered
   - Quotes from Dr Kanal and/or Barbara Nugent
   - Sponsor acknowledgments
   - Attendee feedback quotes
   - Forward-looking closing (next event)
   - Typical length: 400-600 words

3. SPOTLIGHT INTERVIEW (Q&A with a speaker/expert):
   - Headline: "Spotlight Interview: [Name] on [Topic]"
   - Brief bio introduction paragraph
   - Q&A format with bold questions and quoted answers
   - 6-10 questions covering: their background, views on MRI safety, the event, advice for professionals
   - Closing editorial paragraph summarising their contribution
   - Typical length: 1500-2000 words

4. PARTNERSHIP/COLLABORATION ANNOUNCEMENT:
   - Headline
   - What the partnership is and why it matters
   - What it means for attendees/professionals
   - Quote from Barbara Nugent
   - Brief description of the partner organisation
   - Event details
   - Typical length: 250-400 words

5. YEAR-IN-REVIEW:
   - Headline
   - Overview of the year's events
   - Key highlights from each event (with sponsor lists)
   - Delegate reflections
   - Quote from Barbara Nugent reflecting on the year
   - Looking ahead to next year
   - Typical length: 800-1200 words

IMPORTANT:
- Use the user's provided details — never invent quotes, names, or facts
- If the user provides quotes, integrate them naturally
- Structure with clear paragraphs, not excessive bullet points (Rad Magazine is editorial, not a brochure)
- Always include a way for readers to find out more (website/email) at the end
- Sponsor acknowledgments should feel like genuine thanks, not advertising`,

  extract: `You are extracting LinkedIn post content from an article written for Rad Magazine about MRI Safety Matters events.

Given the article text, generate 3 different LinkedIn posts, each taking a DIFFERENT angle from the article content. Each post should be able to stand alone without reading the article.

Follow these rules:
- Each post should be 100-200 words
- Each should have a different hook and angle
- Use the same format: emoji hook → short paragraphs → event details → link → hashtags
- Use British English
- Don't copy sentences directly from the article — rewrite for LinkedIn's more conversational tone
- Include hashtags from: #MRISafety #MRSO #MRMD #MRISafety26 #CPD #KanalCourse

Separate each post with "---POST---"

Label each post with its angle, e.g. "ANGLE: What attendees learn"`
};

async function callClaude(systemPrompt, userMessage) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system: systemPrompt, userMessage }),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.text;
}

// ── UI Components ──

function StepIndicator({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 32 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: i <= current ? "#0F5132" : "#E2E8F0",
              color: i <= current ? "#fff" : "#94A3B8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.3s ease",
            }}
          >
            {i + 1}
          </div>
          {i < total - 1 && (
            <div
              style={{
                width: 40,
                height: 2,
                background: i < current ? "#0F5132" : "#E2E8F0",
                transition: "all 0.3s ease",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 4, hint }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label
        style={{
          display: "block",
          marginBottom: 6,
          fontSize: 14,
          fontWeight: 600,
          color: "#1E293B",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {label}
      </label>
      {hint && (
        <p style={{ margin: "0 0 8px", fontSize: 13, color: "#64748B", fontFamily: "'DM Sans', sans-serif" }}>
          {hint}
        </p>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: "100%",
          padding: "12px 14px",
          border: "1.5px solid #CBD5E1",
          borderRadius: 10,
          fontSize: 15,
          fontFamily: "'DM Sans', sans-serif",
          resize: "vertical",
          outline: "none",
          transition: "border-color 0.2s",
          background: "#FAFBFC",
          boxSizing: "border-box",
          lineHeight: 1.6,
        }}
        onFocus={(e) => (e.target.style.borderColor = "#0F5132")}
        onBlur={(e) => (e.target.style.borderColor = "#CBD5E1")}
      />
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, hint }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label
        style={{
          display: "block",
          marginBottom: 6,
          fontSize: 14,
          fontWeight: 600,
          color: "#1E293B",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {label}
      </label>
      {hint && (
        <p style={{ margin: "0 0 8px", fontSize: 13, color: "#64748B", fontFamily: "'DM Sans', sans-serif" }}>
          {hint}
        </p>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "12px 14px",
          border: "1.5px solid #CBD5E1",
          borderRadius: 10,
          fontSize: 15,
          fontFamily: "'DM Sans', sans-serif",
          outline: "none",
          transition: "border-color 0.2s",
          background: "#FAFBFC",
          boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#0F5132")}
        onBlur={(e) => (e.target.style.borderColor = "#CBD5E1")}
      />
    </div>
  );
}

function Button({ children, onClick, variant = "primary", disabled, style: extraStyle }) {
  const styles = {
    primary: {
      background: disabled ? "#94A3B8" : "#0F5132",
      color: "#fff",
      border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
    },
    secondary: {
      background: "transparent",
      color: "#0F5132",
      border: "1.5px solid #0F5132",
      cursor: "pointer",
    },
    ghost: {
      background: "transparent",
      color: "#64748B",
      border: "1.5px solid #E2E8F0",
      cursor: "pointer",
    },
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        padding: "12px 24px",
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
        transition: "all 0.2s ease",
        ...styles[variant],
        ...extraStyle,
      }}
      onMouseEnter={(e) => {
        if (!disabled && variant === "primary") e.target.style.background = "#0A3D25";
      }}
      onMouseLeave={(e) => {
        if (!disabled && variant === "primary") e.target.style.background = "#0F5132";
      }}
    >
      {children}
    </button>
  );
}

function OutputCard({ title, content }) {
  const [copied, setCopied] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #E2E8F0",
        borderRadius: 14,
        padding: 24,
        marginBottom: 20,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 700,
            color: "#1E293B",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {title}
        </h3>
        <Button variant="secondary" onClick={handleCopy} style={{ padding: "8px 16px", fontSize: 13 }}>
          {copied ? "✓ Copied" : "Copy"}
        </Button>
      </div>
      <textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        style={{
          width: "100%",
          minHeight: 200,
          padding: "14px 16px",
          border: "1.5px solid #E2E8F0",
          borderRadius: 10,
          fontSize: 15,
          fontFamily: "'DM Sans', sans-serif",
          resize: "vertical",
          outline: "none",
          lineHeight: 1.7,
          background: "#FAFBFC",
          boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#0F5132")}
        onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
      />
    </div>
  );
}

// ── Article Type Configs ──

const ARTICLE_TYPES = {
  event_preview: {
    label: "Event Preview",
    description: "Promote an upcoming event — what it is, why attend, what to expect",
    fields: [
      { key: "eventName", label: "Event name", placeholder: "e.g. Dr Kanal's 6th European MRMD/MRSO Course" },
      { key: "dates", label: "Dates", placeholder: "e.g. 1-3 June 2026" },
      { key: "venue", label: "Venue & location", placeholder: "e.g. Royal National Hotel, London" },
      { key: "keyTopics", label: "Key topics or highlights", placeholder: "What will be covered? Any standout sessions?", type: "textarea", hint: "List the main subjects, workshops, or themes" },
      { key: "speakers", label: "Speakers", placeholder: "Names and their topics, if known", type: "textarea" },
      { key: "quotes", label: "Quotes (optional)", placeholder: "Any quotes from Barbara, Dr Kanal, speakers, or past attendees", type: "textarea", hint: "Include who said it" },
      { key: "sponsors", label: "Sponsors (optional)", placeholder: "List by tier if applicable: Platinum, Gold, Silver, Bronze", type: "textarea" },
      { key: "bookingInfo", label: "Booking info", placeholder: "Website URL, email, pricing if relevant" },
      { key: "wordCount", label: "Approximate word count", placeholder: "e.g. 600" },
      { key: "additionalNotes", label: "Anything else to include?", placeholder: "Any specific angle, key message, or detail", type: "textarea" },
    ],
  },
  post_event: {
    label: "Post-Event Reflection",
    description: "Review and celebrate what happened at a recent event",
    fields: [
      { key: "eventName", label: "Event name", placeholder: "e.g. Kanal's 5th European MRMD/MRSO Course" },
      { key: "dates", label: "When it took place", placeholder: "e.g. June 16-18, 2025" },
      { key: "venue", label: "Venue & location", placeholder: "e.g. Queen Elizabeth II Centre, London" },
      { key: "highlights", label: "Key highlights", placeholder: "What stood out? Topics covered, special moments", type: "textarea" },
      { key: "quotes", label: "Quotes", placeholder: "From Dr Kanal, Barbara, speakers, or attendees", type: "textarea", hint: "Include who said it" },
      { key: "attendeeFeedback", label: "Attendee feedback", placeholder: "Any testimonials or reactions?", type: "textarea" },
      { key: "sponsors", label: "Sponsors", placeholder: "List by tier", type: "textarea" },
      { key: "nextEvent", label: "What's next?", placeholder: "Details of upcoming events to promote" },
      { key: "bookingInfo", label: "Booking info for next event", placeholder: "Website URL, email" },
      { key: "wordCount", label: "Approximate word count", placeholder: "e.g. 500" },
      { key: "additionalNotes", label: "Anything else?", placeholder: "", type: "textarea" },
    ],
  },
  spotlight: {
    label: "Spotlight Interview",
    description: "Q&A profile of a speaker, expert, or contributor",
    fields: [
      { key: "personName", label: "Person's name and title", placeholder: "e.g. Professor Martin Graves, Professor of MR Physics, University of Cambridge" },
      { key: "bio", label: "Brief bio / achievements", placeholder: "Key roles, awards, publications, experience", type: "textarea" },
      { key: "questionsAndAnswers", label: "Questions and answers", placeholder: "Paste the Q&A content here. Use Q: and A: to separate.", type: "textarea", hint: "This is the main body. Include as many Q&As as you have." },
      { key: "eventConnection", label: "How are they connected to MRI Safety Matters events?", placeholder: "e.g. Long-standing speaker at the November event", type: "textarea" },
      { key: "closingMessage", label: "Key closing message or takeaway", placeholder: "What should readers remember about this person?", type: "textarea" },
      { key: "eventDetails", label: "Event details to include", placeholder: "Upcoming event dates, venue, booking link" },
      { key: "wordCount", label: "Approximate word count", placeholder: "e.g. 1500" },
      { key: "additionalNotes", label: "Anything else?", placeholder: "", type: "textarea" },
    ],
  },
  partnership: {
    label: "Partnership / Collaboration",
    description: "Announce a new sponsor, partner, or collaboration",
    fields: [
      { key: "partnerName", label: "Partner / company name", placeholder: "e.g. Corsmed" },
      { key: "whatItIs", label: "What is the partnership about?", placeholder: "What are they doing together? What does it offer?", type: "textarea" },
      { key: "benefitToAttendees", label: "What does it mean for attendees/professionals?", placeholder: "e.g. 12 months simulator access", type: "textarea" },
      { key: "quotes", label: "Quotes (optional)", placeholder: "From Barbara or the partner", type: "textarea" },
      { key: "eventDetails", label: "Related event details", placeholder: "Which event, dates, location" },
      { key: "bookingInfo", label: "Booking / more info link", placeholder: "Website URL" },
      { key: "wordCount", label: "Approximate word count", placeholder: "e.g. 300" },
      { key: "additionalNotes", label: "Anything else?", placeholder: "", type: "textarea" },
    ],
  },
  year_review: {
    label: "Year-in-Review",
    description: "Annual summary of events, achievements, and what's ahead",
    fields: [
      { key: "year", label: "Year", placeholder: "e.g. 2025" },
      { key: "events", label: "Events held this year", placeholder: "List each event with dates, venue, key highlights", type: "textarea", hint: "Be as detailed as you can — this drives the article" },
      { key: "sponsors", label: "Sponsors across events", placeholder: "List by event and tier", type: "textarea" },
      { key: "quotes", label: "Quotes", placeholder: "From Barbara, speakers, delegates", type: "textarea" },
      { key: "delegateFeedback", label: "Delegate feedback", placeholder: "Testimonials from across the year", type: "textarea" },
      { key: "lookingAhead", label: "What's coming next year?", placeholder: "2026 events, dates, venues", type: "textarea" },
      { key: "bookingInfo", label: "Booking info", placeholder: "Website URL" },
      { key: "wordCount", label: "Approximate word count", placeholder: "e.g. 1000" },
      { key: "additionalNotes", label: "Anything else?", placeholder: "", type: "textarea" },
    ],
  },
};

// ── LinkedIn Angle Configs ──

const LINKEDIN_ANGLES = [
  { value: "custom", label: "Custom — I'll describe what I want" },
  { value: "what_attendees_learn", label: "What attendees learn" },
  { value: "what_sets_apart", label: "What sets the course/event apart" },
  { value: "community", label: "Community & international reach" },
  { value: "sponsors", label: "Sponsor acknowledgment" },
  { value: "feedback", label: "Attendee feedback / testimonial" },
  { value: "handbook", label: "The MRI Practitioner's Handbook" },
  { value: "speaker_highlight", label: "Speaker highlight" },
  { value: "post_event_value", label: "Post-event value & follow-up" },
  { value: "look_ahead", label: "Looking ahead / upcoming event" },
];

// ── Main App ──

export default function App() {
  const [step, setStep] = useState(0);
  const [contentType, setContentType] = useState(null);
  const [articleType, setArticleType] = useState(null);
  const [linkedinAngle, setLinkedinAngle] = useState("custom");
  const [formData, setFormData] = useState({});
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [articleForExtract, setArticleForExtract] = useState("");

  const updateField = (key, val) => setFormData((prev) => ({ ...prev, [key]: val }));

  const reset = () => {
    setStep(0);
    setContentType(null);
    setArticleType(null);
    setLinkedinAngle("custom");
    setFormData({});
    setOutput(null);
    setError(null);
    setArticleForExtract("");
  };

  const buildLinkedinPrompt = () => {
    const angleLabel = LINKEDIN_ANGLES.find((a) => a.value === linkedinAngle)?.label || "Custom";
    let prompt = `Write a LinkedIn post for MRI Safety Matters.\n\nAngle: ${angleLabel}\n\n`;
    if (formData.eventName) prompt += `Event: ${formData.eventName}\n`;
    if (formData.dates) prompt += `Dates: ${formData.dates}\n`;
    if (formData.venue) prompt += `Location: ${formData.venue}\n`;
    if (formData.link) prompt += `Link: ${formData.link}\n`;
    if (formData.sponsors) prompt += `Sponsors:\n${formData.sponsors}\n`;
    if (formData.quotes) prompt += `Quotes to use:\n${formData.quotes}\n`;
    if (formData.keyPoints) prompt += `Key points:\n${formData.keyPoints}\n`;
    if (formData.customBrief) prompt += `Additional direction:\n${formData.customBrief}\n`;
    return prompt;
  };

  const buildArticlePrompt = () => {
    const config = ARTICLE_TYPES[articleType];
    let prompt = `Write a ${config.label} article for Rad Magazine.\n\n`;
    config.fields.forEach((f) => {
      if (formData[f.key]) prompt += `${f.label}: ${formData[f.key]}\n\n`;
    });
    return prompt;
  };

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      if (contentType === "linkedin") {
        const result = await callClaude(SYSTEM_PROMPTS.linkedin, buildLinkedinPrompt());
        setOutput([{ title: "LinkedIn Post", content: result }]);
      } else if (contentType === "article") {
        const result = await callClaude(SYSTEM_PROMPTS.article, buildArticlePrompt());
        setOutput([{ title: `${ARTICLE_TYPES[articleType].label} — Rad Magazine`, content: result }]);
      } else if (contentType === "extract") {
        const result = await callClaude(
          SYSTEM_PROMPTS.extract,
          `Here is the article:\n\n${articleForExtract}\n\nLink to include in posts: ${formData.link || "https://www.mrisafetymatters.co.uk"}`
        );
        const posts = result.split("---POST---").filter((p) => p.trim());
        setOutput(
          posts.map((p, i) => {
            const angleMatch = p.match(/ANGLE:\s*(.+)/);
            const angle = angleMatch ? angleMatch[1].trim() : `Post ${i + 1}`;
            const content = p.replace(/ANGLE:\s*.+\n?/, "").trim();
            return { title: `LinkedIn Post — ${angle}`, content };
          })
        );
      }
      setStep(2);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 3;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #F0F7F4 0%, #F8FAFC 40%, #F1F5F9 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Fraunces:wght@700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div
        style={{
          background: "#0F5132",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 800,
              color: "#fff",
              fontFamily: "'Fraunces', serif",
              letterSpacing: "-0.02em",
            }}
          >
            MRI Safety Matters
          </h1>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "#A7D5C1", fontWeight: 500 }}>
            Content Generator
          </p>
        </div>
        {step > 0 && (
          <button
            onClick={reset}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ← Start over
          </button>
        )}
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px 60px" }}>
        <StepIndicator current={step} total={totalSteps} />

        {/* Step 0: Choose type */}
        {step === 0 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F3524", margin: "0 0 8px", fontFamily: "'Fraunces', serif" }}>
              What would you like to create?
            </h2>
            <p style={{ color: "#64748B", fontSize: 15, margin: "0 0 28px", lineHeight: 1.5 }}>
              Choose your content type and we'll guide you through the rest.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { key: "linkedin", title: "LinkedIn Post", desc: "A single post for the MRI Safety Matters LinkedIn page", icon: "💬" },
                { key: "article", title: "Article for Rad Magazine", desc: "A full article following the established editorial format", icon: "📰" },
                { key: "extract", title: "Extract LinkedIn Posts from Article", desc: "Paste an article and get 3 LinkedIn posts pulled from it", icon: "✂️" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => { setContentType(opt.key); setStep(1); }}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 16, padding: "20px 22px",
                    background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 14,
                    cursor: "pointer", textAlign: "left", transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0F5132"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(15,81,50,0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <span style={{ fontSize: 28 }}>{opt.icon}</span>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: "#0F3524", fontFamily: "'DM Sans', sans-serif" }}>{opt.title}</div>
                    <div style={{ fontSize: 14, color: "#64748B", marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: LinkedIn form */}
        {step === 1 && contentType === "linkedin" && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F3524", margin: "0 0 8px", fontFamily: "'Fraunces', serif" }}>LinkedIn Post</h2>
            <p style={{ color: "#64748B", fontSize: 15, margin: "0 0 28px", lineHeight: 1.5 }}>Fill in what you can — the more detail, the better the output.</p>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 600, color: "#1E293B" }}>Post angle</label>
              <select
                value={linkedinAngle}
                onChange={(e) => setLinkedinAngle(e.target.value)}
                style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #CBD5E1", borderRadius: 10, fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: "none", background: "#FAFBFC", boxSizing: "border-box" }}
              >
                {LINKEDIN_ANGLES.map((a) => (<option key={a.value} value={a.value}>{a.label}</option>))}
              </select>
            </div>
            <InputField label="Event name" value={formData.eventName || ""} onChange={(v) => updateField("eventName", v)} placeholder="e.g. Dr Kanal's 6th European MRMD/MRSO Course" />
            <InputField label="Dates" value={formData.dates || ""} onChange={(v) => updateField("dates", v)} placeholder="e.g. 1-3 June 2026" />
            <InputField label="Location" value={formData.venue || ""} onChange={(v) => updateField("venue", v)} placeholder="e.g. London" />
            <InputField label="Link" value={formData.link || ""} onChange={(v) => updateField("link", v)} placeholder="e.g. https://lnkd.in/eNN8FAvg" />
            <TextArea label="Key points to mention" value={formData.keyPoints || ""} onChange={(v) => updateField("keyPoints", v)} placeholder="What should this post convey?" rows={3} />
            <TextArea label="Quotes (optional)" value={formData.quotes || ""} onChange={(v) => updateField("quotes", v)} placeholder="Any quotes to include or reference" rows={3} />
            <TextArea label="Sponsors (optional)" value={formData.sponsors || ""} onChange={(v) => updateField("sponsors", v)} placeholder="List sponsors by tier if this is a sponsor post" rows={3} />
            <TextArea label="Additional direction (optional)" value={formData.customBrief || ""} onChange={(v) => updateField("customBrief", v)} placeholder="Any specific tone, CTA, or detail" rows={2} />
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={generate} disabled={loading}>{loading ? "Generating..." : "Generate Post"}</Button>
            </div>
          </div>
        )}

        {/* Step 1: Article type selection */}
        {step === 1 && contentType === "article" && !articleType && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F3524", margin: "0 0 8px", fontFamily: "'Fraunces', serif" }}>Article for Rad Magazine</h2>
            <p style={{ color: "#64748B", fontSize: 15, margin: "0 0 28px", lineHeight: 1.5 }}>What type of article is this?</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Object.entries(ARTICLE_TYPES).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setArticleType(key)}
                  style={{ padding: "18px 20px", background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 12, cursor: "pointer", textAlign: "left", transition: "all 0.2s ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0F5132"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; }}
                >
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#0F3524", fontFamily: "'DM Sans', sans-serif" }}>{val.label}</div>
                  <div style={{ fontSize: 14, color: "#64748B", marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>{val.description}</div>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 20 }}><Button variant="ghost" onClick={() => setStep(0)}>Back</Button></div>
          </div>
        )}

        {/* Step 1: Article form */}
        {step === 1 && contentType === "article" && articleType && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F3524", margin: "0 0 8px", fontFamily: "'Fraunces', serif" }}>{ARTICLE_TYPES[articleType].label}</h2>
            <p style={{ color: "#64748B", fontSize: 15, margin: "0 0 28px", lineHeight: 1.5 }}>{ARTICLE_TYPES[articleType].description}. Fill in as much as you can.</p>
            {ARTICLE_TYPES[articleType].fields.map((f) =>
              f.type === "textarea" ? (
                <TextArea key={f.key} label={f.label} value={formData[f.key] || ""} onChange={(v) => updateField(f.key, v)} placeholder={f.placeholder} hint={f.hint} rows={4} />
              ) : (
                <InputField key={f.key} label={f.label} value={formData[f.key] || ""} onChange={(v) => updateField(f.key, v)} placeholder={f.placeholder} hint={f.hint} />
              )
            )}
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <Button variant="ghost" onClick={() => setArticleType(null)}>Back</Button>
              <Button onClick={generate} disabled={loading}>{loading ? "Generating..." : "Generate Article"}</Button>
            </div>
          </div>
        )}

        {/* Step 1: Extract form */}
        {step === 1 && contentType === "extract" && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F3524", margin: "0 0 8px", fontFamily: "'Fraunces', serif" }}>Extract LinkedIn Posts</h2>
            <p style={{ color: "#64748B", fontSize: 15, margin: "0 0 28px", lineHeight: 1.5 }}>Paste your article below and we'll pull out 3 LinkedIn posts, each with a different angle.</p>
            <TextArea label="Article text" value={articleForExtract} onChange={setArticleForExtract} placeholder="Paste the full article here..." rows={12} />
            <InputField label="Link to include in posts" value={formData.link || ""} onChange={(v) => updateField("link", v)} placeholder="e.g. https://www.mrisafetymatters.co.uk" />
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={generate} disabled={loading || !articleForExtract.trim()}>{loading ? "Generating..." : "Extract Posts"}</Button>
            </div>
          </div>
        )}

        {/* Step 2: Output */}
        {step === 2 && output && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F3524", margin: "0 0 8px", fontFamily: "'Fraunces', serif" }}>Your content is ready</h2>
            <p style={{ color: "#64748B", fontSize: 15, margin: "0 0 28px", lineHeight: 1.5 }}>Edit directly in the text boxes below, then copy when you're happy.</p>
            {output.map((item, i) => (<OutputCard key={i} title={item.title} content={item.content} />))}
            <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
              <Button variant="ghost" onClick={reset}>Create something new</Button>
              <Button variant="secondary" onClick={() => { setStep(1); setOutput(null); }}>Regenerate with same inputs</Button>
            </div>
          </div>
        )}

        {error && (
          <div style={{ marginTop: 20, padding: "16px 20px", background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 12, color: "#991B1B", fontSize: 14 }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading && (
          <div style={{ marginTop: 24, padding: "24px", background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 14, textAlign: "center" }}>
            <div style={{ width: 40, height: 40, border: "3px solid #E2E8F0", borderTopColor: "#0F5132", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
            <p style={{ color: "#64748B", fontSize: 15, margin: 0 }}>Generating your content...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
      </div>
    </div>
  );
}
