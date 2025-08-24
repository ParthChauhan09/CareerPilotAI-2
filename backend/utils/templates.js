// LaTeX templates for different document types
const templates = {
  // Resume template with common sections
  resumeTemplate: `
\\documentclass[10pt, letterpaper]{article}
\\usepackage[
    ignoreheadfoot,
    top=2cm,
    bottom=2cm,
    left=2cm,
    right=2cm,
    footskip=1.0cm
]{geometry}
\\usepackage{titlesec}
\\usepackage{tabularx}
\\usepackage{array}
\\usepackage[dvipsnames]{xcolor}
\\definecolor{primaryColor}{RGB}{0,79,144}
\\usepackage{enumitem}
\\usepackage{fontawesome5}
\\usepackage{amsmath}
\\usepackage[
    pdftitle={John Doe's CV},
    pdfauthor={John Doe},
    pdfcreator={LaTeX with RenderCV},
    colorlinks=true,
    urlcolor=primaryColor
]{hyperref}
\\usepackage[pscoord]{eso-pic}
\\usepackage{calc}
\\usepackage{bookmark}
\\usepackage{lastpage}
\\usepackage{changepage}
\\usepackage{paracol}
\\usepackage{ifthen}
\\usepackage{needspace}
\\usepackage{iftex}
\\ifPDFTeX
    \\input{glyphtounicode}
    \\pdfgentounicode=1
    \\usepackage[utf8]{inputenc}
    \\usepackage{lmodern}
\\fi
\\AtBeginEnvironment{adjustwidth}{\\partopsep0pt}
\\pagestyle{empty}
\\setcounter{secnumdepth}{0}
\\setlength{\\parindent}{0pt}
\\setlength{\\topskip}{0pt}
\\setlength{\\columnsep}{0cm}
\\makeatletter
\\let\\ps@customFooterStyle\\ps@plain
\\patchcmd{\\ps@customFooterStyle}{\\thepage}{
    \\color{gray}\\textit{\\small John Doe - Page \\thepage{} of \\pageref*{LastPage}}
}{}{}
\\makeatother
\\pagestyle{customFooterStyle}
\\titleformat{\\section}{\\needspace{4\\baselineskip}\\bfseries\\large}{}{0pt}{}[\\vspace{1pt}\\titlerule]
\\titlespacing{\\section}{-1pt}{0.3cm}{0.2cm}
\\renewcommand\\labelitemi{\\circ}
\\newenvironment{highlights}{\\begin{itemize}[topsep=0.10cm,parsep=0.10cm,partopsep=0pt,itemsep=0pt,leftmargin=0.4cm+10pt]}{\\end{itemize}}
\\newenvironment{highlightsforbulletentries}{\\begin{itemize}[topsep=0.10cm,parsep=0.10cm,partopsep=0pt,itemsep=0pt,leftmargin=10pt]}{\\end{itemize}}
\\newenvironment{onecolentry}{\\begin{adjustwidth}{0.2cm+0.00001cm}{0.2cm+0.00001cm}}{\\end{adjustwidth}}
\\newenvironment{twocolentry}[2][]{\\onecolentry\\def\\secondColumn{#2}\\setcolumnwidth{\\fill,4.5cm}\\begin{paracol}{2}}{\\switchcolumn\\raggedleft\\secondColumn\\end{paracol}\\endonecolentry}
\\newenvironment{header}{\\setlength{\\topsep}{0pt}\\par\\kern\\topsep\\centering\\linespread{1.5}}{\\par\\kern\\topsep}
\\newcommand{\\placelastupdatedtext}{\\AddToShipoutPictureFG*{\\put(\\LenToUnit{\\paperwidth-2cm-0.2cm+0.05cm},\\LenToUnit{\\paperheight-1.0cm}){\\vtop{{\\null}\\makebox[0pt][c]{\\small\\color{gray}\\textit{Last updated in September 2024}\\hspace{\\widthof{Last updated in September 2024}}}}}}}
\\let\\hrefWithoutArrow\\href
\\renewcommand{\\href}[2]{\\hrefWithoutArrow{#1}{\\ifthenelse{\\equal{#2}{}}{ }{#2 }\\raisebox{.15ex}{\\footnotesize \\faExternalLink*}}}

\\begin{document}
\\newcommand{\\AND}{\\unskip\\cleaders\\copy\\ANDbox\\hskip\\wd\\ANDbox\\ignorespaces}
\\newsavebox\\ANDbox
\\sbox\\ANDbox{}
\\placelastupdatedtext
\\begin{header}
\\textbf{\\fontsize{24 pt}{24 pt}\\selectfont Your Name}

\\normalsize
\\mbox{{\\color{black}\\footnotesize\\faMapMarker*}\\hspace*{0.13cm}  City, State }\\kern0.25cm\\AND\\kern0.25cm
\\mbox{\\hrefWithoutArrow{mailto:your.email@example.com}{\\color{black}{\\footnotesize\\faEnvelope[regular]}\\hspace*{0.13cm} your.email@example.com }}\\kern0.25cm\\AND\\kern0.25cm
\\mbox{\\hrefWithoutArrow{tel:+1-555-123-4567}{\\color{black}{\\footnotesize\\faPhone*}\\hspace*{0.13cm}+1 (555) 123-4567}}\\kern0.25cm\\AND\\kern0.25cm
\\mbox{\\hrefWithoutArrow{https://linkedin.com/in/yourprofile}{\\color{black}{\\footnotesize\\faLinkedinIn}\\hspace*{0.13cm}linkedin.com/in/yourprofile}}\\kern0.25cm\\AND\\kern0.25cm
\\mbox{\\hrefWithoutArrow{https://github.com/yourusername}{\\color{black}{\\footnotesize\\faGithub}\\hspace*{0.13cm}github.com/yourusername}}
\\end{header}
\\vspace{0.0cm}
\\section{Professional Summary}
\\begin{onecolentry}
Write a compelling professional summary that highlights your key achievements, skills, and career objectives. This section should be tailored to the specific role you're applying for.
\\end{onecolentry}
\\section{Education}
\\begin{twocolentry}{\\textit{Graduation MM/YYYY}}
\\textbf{University Name}
\\textit{Degree Type in Major/Field of Study}
\\end{twocolentry}
\\vspace{0.10cm}
\\begin{onecolentry}
\\begin{highlights}
\\item Relevant coursework, GPA, honors, or achievements
\\item Additional academic accomplishments or projects
\\end{highlights}
\\end{onecolentry}
\\section{Experience}
\\begin{twocolentry}{\\textit{Location} \\textit{MM/YYYY - Present}}
\\textbf{Job Title}
\\textit{Company Name}
\\end{twocolentry}
\\vspace{0.10cm}
\\begin{onecolentry}
\\begin{highlights}
\\item Describe your key responsibilities and achievements with quantifiable results
\\item Highlight specific technologies, methodologies, or processes you used
\\item Include any leadership, mentoring, or cross-functional collaboration experience
\\end{highlights}
\\end{onecolentry}
\\section{Certifications}
\\begin{onecolentry}
Include relevant certifications, licenses, or professional credentials that are applicable to your target role.
\\end{onecolentry}
\\section{Projects}
\\begin{twocolentry}{\\textit{\\href{https://github.com/yourusername/project}{Project Link}}}
\\textbf{Project Name 1}
\\end{twocolentry}
\\vspace{0.10cm}
\\begin{onecolentry}
\\begin{highlights}
\\item Brief description of the project and its purpose
\\item Technologies used and your specific contributions
\\item Impact, results, or key features implemented
\\end{highlights}
\\end{onecolentry}
\\section{Technical Skills}
\\begin{onecolentry}
\\textbf{Programming Languages:} List your technical skills organized by category
\\end{onecolentry}
\\begin{onecolentry}
\\textbf{Frameworks \& Tools:} Include frameworks, databases, cloud platforms, and development tools
\\end{onecolentry}
\\end{document}


`,

  // Cover Letter template
  coverLetterTemplate: `
\\documentclass[11pt,a4paper]{letter}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=1in]{geometry}
\\usepackage{hyperref}

\\begin{document}

\\begin{letter}{[Company Address]}

\\opening{Dear [Hiring Manager's Name],}

[First paragraph: Introduction and position you're applying for]

[Second paragraph: Your relevant skills and experiences]

[Third paragraph: Why you're interested in the company]

[Fourth paragraph: Call to action and closing]

\\closing{Sincerely,}

\\vspace{4\\parskip}
[Your Name]
[Your Contact Information]

\\end{letter}
\\end{document}
`,

  // LinkedIn Bio template (can be converted to text format)
  linkedinBioTemplate: `
\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=1in]{geometry}
\\usepackage{hyperref}
\\usepackage{enumitem}

\\begin{document}

\\title{LinkedIn Professional Profile}
\\author{[Professional Name]}
\\date{}
\\maketitle

\\section*{Professional Headline}
[Write a compelling professional headline that includes current position, industry, and key value proposition]

\\section*{About}
[Write a professional summary that includes:
- Brief introduction and current role
- Key achievements and quantifiable results
- Core expertise and specializations
- Career goals and what you're passionate about
- Call to action for networking or opportunities]

\\section*{Experience Highlights}
\\begin{itemize}[leftmargin=*]
    \\item [Key achievement or project with quantifiable impact]
    \\item [Leadership experience or team management accomplishment]
    \\item [Technical skill or innovation that drove results]
    \\item [Industry recognition, award, or significant milestone]
\\end{itemize}

\\section*{Core Skills \\& Expertise}
[List core technical and professional skills organized by category, relevant to target role and industry]

\\section*{Education \\& Certifications}
[Include relevant education background and professional certifications]

\\section*{Professional Interests}
[Mention industry trends, technologies, or areas of professional interest that align with career goals]

\\end{document}
`,
};

// Helper function to get a specific template
const getTemplate = (templateType) => {
  return templates[templateType] || null;
};

// Helper function to customize template with user data
const customizeTemplate = (template, userData) => {
  let customizedTemplate = template;

  // Replace placeholders with actual data
  Object.entries(userData).forEach(([key, value]) => {
    const placeholder = `[${key}]`;
    customizedTemplate = customizedTemplate.replace(
      new RegExp(placeholder, "g"),
      value
    );
  });

  return customizedTemplate;
};

module.exports = {
  templates,
  getTemplate,
  customizeTemplate,
};
