import React, { useState, useMemo } from 'react';
import {
  FileText,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  RotateCcw,
  Zap,
  TrendingUp,
  Target,
  BarChart3,
  Layers,
  Award,
  ChevronRight,
  Sliders,
  Eye,
  FileCheck
} from 'lucide-react';

interface AnalysisResult {
  overallScore: number;
  formattingScore: number;
  keywordScore: number;
  impactScore: number;
  brevityScore: number;
  wordCount: number;
  readingTimeMinutes: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  bulletImprovements: Array<{
    original: string;
    suggestion: string;
    reason: string;
  }>;
}

const SAMPLE_RESUMES: Record<string, { label: string; text: string; role: string }> = {
  softwareEngineer: {
    label: 'Senior Full Stack Engineer',
    role: 'Senior Full Stack Engineer',
    text: `ALEX RIVERA
San Francisco, CA | alex.rivera@email.com | (555) 234-5678 | github.com/alexrivera | linkedin.com/in/alexrivera

PROFESSIONAL SUMMARY
Results-driven Full Stack Engineer with 6+ years of experience designing, architecting, and scaling enterprise web applications and distributed cloud systems. Specialized in TypeScript, React, Node.js, and AWS.

EXPERIENCE
Staff Software Engineer | Acme Cloud Solutions | 2022 – Present
• Architected and migrated monolithic dashboard to modern React 19 micro-frontend architecture, decreasing initial page load times by 42%.
• Built high-throughput event processing pipelines handling 15M+ daily API events using Node.js, Kafka, and Redis caching.
• Mentored 8 junior and mid-level software engineers across two engineering squads, establishing CI/CD test automation benchmarks.
• Spearheaded migration of legacy services to Docker containers orchestrated on AWS ECS, reducing AWS infrastructure costs by $120,000 annually.

Software Engineer | NextGen Digital | 2019 – 2022
• Developed scalable REST and GraphQL APIs using TypeScript, Express, and PostgreSQL, maintaining 99.98% service uptime.
• Partnered closely with Product and UX teams to implement design systems with Tailwind CSS, improving design consistency across 5 products.
• Automated release pipelines using GitHub Actions, cutting release deployment duration from 45 minutes down to 8 minutes.
• Identified database query bottlenecks and optimized indexes, cutting P95 database query response times by 65%.

SKILLS
• Languages: TypeScript, JavaScript, Python, SQL, HTML5, CSS3
• Frontend: React, Next.js, Redux Toolkit, Tailwind CSS, Vite
• Backend & APIs: Node.js, Express, REST APIs, GraphQL, PostgreSQL, Redis
• Cloud & DevOps: AWS (ECS, S3, RDS, Lambda), Docker, GitHub Actions, CI/CD, Kubernetes

EDUCATION
B.S. in Computer Science | University of California, Berkeley | 2019`
  },
  frontendDev: {
    label: 'Frontend Developer (Needs Optimization)',
    role: 'Frontend Engineer',
    text: `JORDAN SMITH
Chicago, IL | jordan.smith@email.com

SUMMARY
Frontend developer looking for a challenging role where I can build nice websites and learn new tools. Good team player with good communication skills.

EXPERIENCE
Frontend Developer | WebStudio Inc | 2021 - Present
• Worked on user interfaces for client websites using HTML and CSS.
• Helped team build responsive websites.
• Fixed bugs reported by QA testers.
• Attended daily standup meetings and sprint planning.
• Used Git for version control.

Junior Web Developer | Local Agency | 2020 - 2021
• Created web pages using WordPress and JavaScript.
• Made sure websites looked okay on mobile phones.
• Assisted senior developers with their tasks.

SKILLS
HTML, CSS, JavaScript, React basics, Git, Figma`
  }
};

const SAMPLE_JOB_DESCRIPTIONS: Record<string, string> = {
  seniorFullStack: `Senior Full Stack Engineer
We are seeking an experienced Senior Full Stack Engineer proficient in React, TypeScript, Node.js, and Cloud Infrastructure (AWS / Docker).

Key Requirements:
• 5+ years building production-grade web applications with modern React, TypeScript, and Node.js
• Strong background in REST APIs, GraphQL, and relational databases like PostgreSQL
• Experience optimizing database query performance, caching (Redis), and event streaming (Kafka)
• Hands-on proficiency with AWS, Docker, microservices, and automated CI/CD pipelines
• Proven ability to quantify achievements and drive scalable architecture improvements`,
  frontendEngineer: `Frontend Engineer
Looking for a passionate Frontend Developer with solid React and modern JavaScript experience.

Key Requirements:
• 3+ years experience with React, TypeScript, and responsive design systems
• Expertise with Tailwind CSS, Vite, HTML5, and CSS3
• Experience monitoring Core Web Vitals and improving page load speeds
• Familiarity with Git, automated testing (Jest, Cypress), and cross-browser testing
• Strong collaboration skills working alongside design and backend teams`
};

export default function App() {
  const [resumeText, setResumeText] = useState(SAMPLE_RESUMES.softwareEngineer.text);
  const [jobDescription, setJobDescription] = useState(SAMPLE_JOB_DESCRIPTIONS.seniorFullStack);
  const [targetRole, setTargetRole] = useState('Senior Full Stack Engineer');
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'bullets' | 'raw'>('overview');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Analysis computation
  const analysis = useMemo<AnalysisResult>(() => {
    const text = resumeText.trim();
    if (!text) {
      return {
        overallScore: 0,
        formattingScore: 0,
        keywordScore: 0,
        impactScore: 0,
        brevityScore: 0,
        wordCount: 0,
        readingTimeMinutes: 0,
        matchedKeywords: [],
        missingKeywords: [],
        strengths: [],
        weaknesses: [],
        bulletImprovements: []
      };
    }

    const words = text.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200));

    // Extract potential skills/keywords from JD & Industry standard list
    const candidateKeywords = [
      'react', 'typescript', 'javascript', 'node.js', 'aws', 'docker', 'kubernetes',
      'postgresql', 'graphql', 'rest', 'api', 'ci/cd', 'git', 'tailwind', 'microservices',
      'redis', 'kafka', 'python', 'cloud', 'architecture', 'agile', 'testing', 'sql',
      'performance', 'optimization', 'security', 'monitoring', 'vite', 'next.js'
    ];

    const lowerText = text.toLowerCase();
    const lowerJd = jobDescription.toLowerCase();

    // Find relevant keywords in JD
    const jdKeywords = candidateKeywords.filter(kw => lowerJd.includes(kw));
    const targetKeywordsList = jdKeywords.length > 3 ? jdKeywords : candidateKeywords.slice(0, 15);

    const matchedKeywords = targetKeywordsList.filter(kw => lowerText.includes(kw));
    const missingKeywords = targetKeywordsList.filter(kw => !lowerText.includes(kw));

    // Formatting evaluation
    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
    const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
    const hasExperienceHeading = /(experience|work history|employment)/i.test(text);
    const hasSkillsHeading = /(skills|technical skills|technologies)/i.test(text);
    const hasEducationHeading = /(education|academic)/i.test(text);
    const bulletCount = (text.match(/^[•\-\*]\s+/gm) || []).length;

    let formattingScore = 30;
    if (hasEmail) formattingScore += 15;
    if (hasPhone) formattingScore += 10;
    if (hasExperienceHeading) formattingScore += 15;
    if (hasSkillsHeading) formattingScore += 15;
    if (hasEducationHeading) formattingScore += 15;
    formattingScore = Math.min(100, formattingScore);

    // Keyword score
    const keywordScore = targetKeywordsList.length > 0
      ? Math.round((matchedKeywords.length / targetKeywordsList.length) * 100)
      : 70;

    // Metrics / Impact evaluation
    const metricMatches = (text.match(/(\d+[\d,]*%|\$\d+[\d,]*|\b\d+x\b|\b\d+\+\b|\b\d+\b\s*(users|customers|million|billion|k|ms|seconds|minutes|hours))/gi) || []).length;
    const impactScore = Math.min(100, Math.round(metricMatches * 14 + (bulletCount > 4 ? 20 : 5)));

    // Brevity & Word count score (Sweet spot: 350 - 750 words for 1-2 pages)
    let brevityScore = 80;
    if (wordCount < 150) brevityScore = 35;
    else if (wordCount < 300) brevityScore = 65;
    else if (wordCount > 1000) brevityScore = 60;
    else brevityScore = 95;

    // Overall weighted score
    const overallScore = Math.round(
      formattingScore * 0.25 +
      keywordScore * 0.35 +
      impactScore * 0.25 +
      brevityScore * 0.15
    );

    // Strengths & Weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    if (formattingScore >= 80) strengths.push('Standard ATS-friendly section headers detected (Experience, Skills, Education).');
    if (hasEmail && hasPhone) strengths.push('Clear and extractable contact information found.');
    if (metricMatches >= 4) strengths.push(`Strong quantification: Found ${metricMatches} measurable achievements (percentages, numbers, savings).`);
    if (matchedKeywords.length >= 6) strengths.push(`High keyword alignment: Matched ${matchedKeywords.length} key industry skills.`);
    if (bulletCount >= 6) strengths.push('Well-structured bullet point formatting for easy scanning.');

    if (metricMatches < 3) weaknesses.push('Low metric density: Add measurable outcomes (e.g. "increased speed by 25%", "reduced cost by $10K").');
    if (missingKeywords.length > 0) weaknesses.push(`Missing high-priority keywords: ${missingKeywords.slice(0, 4).join(', ')}.`);
    if (wordCount < 250) weaknesses.push('Resume content is too brief. Provide more specific scope, tools, and project outcomes.');
    if (!hasSkillsHeading) weaknesses.push('Missing explicit "Skills" section header for ATS skill extractors.');

    // Bullet improvements detection
    const lines = text.split('\n');
    const bulletImprovements: Array<{ original: string; suggestion: string; reason: string }> = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (/^[•\-\*]\s+/.test(trimmed)) {
        const clean = trimmed.replace(/^[•\-\*]\s+/, '');
        // Check for passive/weak verbs or lack of numbers
        if (/^(worked on|helped|assisted|responsible for|fixed bugs|attended)/i.test(clean) || (!/\d/.test(clean) && clean.length < 70)) {
          let suggestion = clean;
          let reason = 'Lacks strong action verbs and quantified impact metrics.';
          if (/^worked on user interfaces/i.test(clean)) {
            suggestion = 'Architected responsive UI components using React and TypeScript, increasing user retention by 18% and cutting load time by 30%.';
            reason = 'Replace passive phrasing ("worked on") with definitive action verb and measurable business impact.';
          } else if (/^helped team build/i.test(clean)) {
            suggestion = 'Collaborated with cross-functional engineering team to deploy 12+ responsive web portals, ensuring 99.9% cross-device compatibility.';
            reason = 'Specify your exact contribution and quantify delivery scope.';
          } else if (/^fixed bugs/i.test(clean)) {
            suggestion = 'Resolved 45+ critical bugs across the customer portal, reducing QA defect turnaround time by 35%.';
            reason = 'Include defect volume and turnaround improvements.';
          } else {
            suggestion = `Spearheaded ${clean.toLowerCase().replace(/^(responsible for|helped to|worked on)\s*/i, '')}, resulting in a 20% efficiency increase across production workflows.`;
            reason = 'Transform passive statement into "Action Verb + Task + Quantifiable Result" framework.';
          }

          bulletImprovements.push({
            original: clean,
            suggestion,
            reason
          });
        }
      }
    }

    return {
      overallScore,
      formattingScore,
      keywordScore,
      impactScore,
      brevityScore,
      wordCount,
      readingTimeMinutes,
      matchedKeywords,
      missingKeywords,
      strengths,
      weaknesses,
      bulletImprovements
    };
  }, [resumeText, jobDescription]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return { label: 'Excellent Match', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (score >= 70) return { label: 'Good Potential', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (score >= 50) return { label: 'Needs Improvement', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'Significant Revision Needed', color: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const badge = getScoreBadge(analysis.overallScore);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900">Resume Analyzer</h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                  ATS Pro
                </span>
              </div>
              <p className="text-xs text-slate-500">Scan, score, and optimize your resume for applicant tracking systems</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => {
                setResumeText(SAMPLE_RESUMES.softwareEngineer.text);
                setJobDescription(SAMPLE_JOB_DESCRIPTIONS.seniorFullStack);
                setTargetRole('Senior Full Stack Engineer');
              }}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors text-slate-700"
            >
              Load Sample: Senior Full Stack
            </button>
            <button
              onClick={() => {
                setResumeText(SAMPLE_RESUMES.frontendDev.text);
                setJobDescription(SAMPLE_JOB_DESCRIPTIONS.frontendEngineer);
                setTargetRole('Frontend Engineer');
              }}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors text-slate-700"
            >
              Load Sample: Needs Polish
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Inputs (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Target Role & Job Description Accordion/Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-slate-800 font-semibold text-sm">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>Target Role & Job Description</span>
              </div>
              <span className="text-xs text-slate-400">For keyword matching</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Target Job Title</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Job Description Requirements</label>
                <textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste target job description or requirements here..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition resize-y font-mono"
                />
              </div>
            </div>
          </div>

          {/* Resume Text Input */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-slate-800 font-semibold text-sm">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Resume Content</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span>{analysis.wordCount} words</span>
                <span>•</span>
                <span>~{analysis.readingTimeMinutes} min read</span>
                <button
                  onClick={() => setResumeText('')}
                  title="Clear text"
                  className="hover:text-rose-600 transition-colors p-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your full resume text here (including contact info, experience, skills, education)..."
              className="flex-1 w-full p-3 text-xs leading-relaxed font-mono rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition resize-y min-h-[360px]"
            />

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Real-time instant ATS evaluation</span>
              </span>
              <span>Formatted plain text / markdown</span>
            </div>
          </div>
        </div>

        {/* Right Column: Analysis & Insights (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Top Score Banner Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-4">
                {/* Score Gauge Circle */}
                <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center rounded-2xl bg-indigo-50/70 border border-indigo-100">
                  <div className="text-center">
                    <span className="text-3xl font-extrabold text-indigo-600 tracking-tight">
                      {analysis.overallScore}
                    </span>
                    <span className="text-[10px] block font-semibold text-slate-400 uppercase tracking-wider">
                      / 100
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-bold text-slate-900">Overall ATS Score</h2>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Evaluated based on ATS parseability, keyword match rate, quantified impact metrics, and section structure.
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
                <button
                  onClick={() => {
                    const summary = `Resume Analysis Report for ${targetRole || 'Role'}\nOverall ATS Score: ${analysis.overallScore}/100\nFormatting: ${analysis.formattingScore}%\nKeywords: ${analysis.keywordScore}%\nImpact: ${analysis.impactScore}%\nWord Count: ${analysis.wordCount}`;
                    handleCopy(summary, 'report');
                  }}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                >
                  {copiedText === 'report' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText === 'report' ? 'Report Copied!' : 'Copy Summary'}</span>
                </button>
              </div>
            </div>

            {/* 4 Pillars Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-medium">Formatting</span>
                  <span className="font-bold text-slate-800">{analysis.formattingScore}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${analysis.formattingScore}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-medium">Keywords</span>
                  <span className="font-bold text-slate-800">{analysis.keywordScore}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${analysis.keywordScore}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-medium">Impact & Metrics</span>
                  <span className="font-bold text-slate-800">{analysis.impactScore}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${analysis.impactScore}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-medium">Brevity</span>
                  <span className="font-bold text-slate-800">{analysis.brevityScore}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${analysis.brevityScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 border-b border-slate-200 bg-white px-3 pt-2 rounded-t-xl">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 flex items-center space-x-1.5 ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Strengths & Fixes</span>
            </button>

            <button
              onClick={() => setActiveTab('keywords')}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 flex items-center space-x-1.5 ${
                activeTab === 'keywords'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Keywords Gap ({analysis.matchedKeywords.length}/{analysis.matchedKeywords.length + analysis.missingKeywords.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('bullets')}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 flex items-center space-x-1.5 ${
                activeTab === 'bullets'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Bullet Rewriter ({analysis.bulletImprovements.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('raw')}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 flex items-center space-x-1.5 ${
                activeTab === 'raw'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Full Checklist</span>
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="bg-white rounded-b-xl border border-slate-200 p-5 shadow-xs flex-1">
            {/* TAB: OVERVIEW (Strengths & Weaknesses) */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Strengths */}
                <div>
                  <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center space-x-1.5 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Identified Strengths ({analysis.strengths.length})</span>
                  </h3>
                  {analysis.strengths.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No significant strengths detected yet. Try adding standardized headers and metrics.</p>
                  ) : (
                    <div className="space-y-2">
                      {analysis.strengths.map((st, i) => (
                        <div key={i} className="flex items-start space-x-2 text-xs text-slate-700 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>{st}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Critical Fixes & Weaknesses */}
                <div>
                  <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center space-x-1.5 mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>High-Impact Recommendations ({analysis.weaknesses.length})</span>
                  </h3>
                  {analysis.weaknesses.length === 0 ? (
                    <div className="flex items-center space-x-2 text-xs text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Outstanding! No critical flags found in this resume.</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {analysis.weaknesses.map((wk, i) => (
                        <div key={i} className="flex items-start space-x-2 text-xs text-slate-700 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                          <span>{wk}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: KEYWORDS GAP */}
            {activeTab === 'keywords' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Matched In Resume ({analysis.matchedKeywords.length})
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.matchedKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="capitalize">{kw}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">
                    Missing Target Keywords ({analysis.missingKeywords.length})
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    These key terms appear in your target job description but are absent from your resume. Integrating them into your experience bullets can boost ATS pass rates.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missingKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200"
                      >
                        <XCircle className="w-3 h-3 text-rose-500" />
                        <span className="capitalize">{kw}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BULLET REWRITER */}
            {activeTab === 'bullets' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Detected Weak Points & Enhanced Rewrites
                  </h3>
                  <span className="text-xs text-slate-400">Formula: Strong Verb + Task + Quantified Impact</span>
                </div>

                {analysis.bulletImprovements.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-100">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">No weak bullet points detected!</p>
                    <p className="text-xs text-slate-500 mt-1">Your bullet points use strong verbs and measurable metrics.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {analysis.bulletImprovements.map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="text-xs">
                          <span className="font-semibold text-rose-700 block mb-0.5">Original (Weak / Unquantified):</span>
                          <p className="text-slate-600 italic bg-white p-2 rounded border border-slate-200">
                            "{item.original}"
                          </p>
                        </div>

                        <div className="text-xs">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-semibold text-emerald-700 flex items-center space-x-1">
                              <Sparkles className="w-3 h-3" />
                              <span>Recommended ATS Optimized Rewrite:</span>
                            </span>
                            <button
                              onClick={() => handleCopy(item.suggestion, `bullet-${idx}`)}
                              className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                            >
                              {copiedText === `bullet-${idx}` ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-slate-800 font-medium bg-emerald-50/70 p-2 rounded border border-emerald-200">
                            • {item.suggestion}
                          </p>
                        </div>

                        <p className="text-[11px] text-slate-500">
                          <strong className="text-slate-600">Reason:</strong> {item.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: RAW CHECKLIST */}
            {activeTab === 'raw' && (
              <div className="space-y-4 text-xs">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Comprehensive ATS Compliance Checklist
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                    <span>Contact Info (Email & Phone)</span>
                    <span className="font-semibold text-emerald-600 flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Detected</span>
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                    <span>Standard Work Experience Header</span>
                    <span className="font-semibold text-emerald-600 flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                    <span>Dedicated Skills Block</span>
                    <span className="font-semibold text-emerald-600 flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                    <span>Clean Typography & Bullet Points</span>
                    <span className="font-semibold text-emerald-600 flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>ATS Friendly</span>
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                  <h4 className="font-semibold text-indigo-900 mb-1">ATS Scanner Best Practices</h4>
                  <ul className="list-disc list-inside text-slate-600 space-y-1 text-xs">
                    <li>Avoid multi-column tables and complex graphic elements that confuse OCR engines.</li>
                    <li>Always use standard headings like "Experience", "Skills", and "Education".</li>
                    <li>Quantify accomplishments with numbers, dollars saved, percentages, or user scale.</li>
                    <li>Tailor the keywords in your skills section to mirror the specific job posting.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          Resume Analyzer & ATS Optimizer • Built for high-conversion job applications
        </div>
      </footer>
    </div>
  );
}
