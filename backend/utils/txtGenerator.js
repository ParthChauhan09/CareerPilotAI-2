/**
 * Generate TXT content
 * @param {Object} data - Document data
 * @param {string} documentType - Type of document (resume, coverLetter, linkedin)
 * @param {string} title - Document title
 * @returns {string} - Plain text content
 */
exports.generateTxt = (data, documentType, title) => {
  try {
    let content = '';
    
    // Generate content based on type
    switch (documentType) {
      case 'resume':
        content = generateResumeTxt(data, title);
        break;
      case 'coverLetter':
        content = generateCoverLetterTxt(data, title);
        break;
      case 'linkedin':
        content = generateLinkedInTxt(data, title);
        break;
      default:
        content = `${title}\n\n${data}`;
    }
    
    return content;
  } catch (error) {
    console.error('TXT Generation Error:', error);
    throw new Error('Failed to generate TXT content');
  }
};

/**
 * Generate a resume in plain text
 * @param {Object} data - Resume data
 * @param {string} title - Document title
 * @returns {string} - Plain text content
 */
function generateResumeTxt(data, title) {
  const { personal, experience, education, skills } = data;
  let content = '';
  
  // Header
  content += `${personal.firstName.toUpperCase()} ${personal.lastName.toUpperCase()}\n`;
  content += `${personal.email} | ${personal.phone} | ${personal.city}, ${personal.state}\n\n`;
  
  // Summary
  if (personal.summary) {
    content += 'SUMMARY\n';
    content += '=======\n';
    content += `${personal.summary}\n\n`;
  }
  
  // Experience
  content += 'EXPERIENCE\n';
  content += '==========\n';
  
  experience.forEach((job) => {
    content += `${job.position} at ${job.company}\n`;
    content += `${job.startDate} - ${job.endDate}\n`;
    content += `${job.description}\n\n`;
  });
  
  // Education
  content += 'EDUCATION\n';
  content += '=========\n';
  
  education.forEach((edu) => {
    content += `${edu.degree} in ${edu.field}\n`;
    content += `${edu.institution}\n`;
    content += `${edu.startDate} - ${edu.endDate}\n\n`;
  });
  
  // Skills
  content += 'SKILLS\n';
  content += '======\n';
  
  const skillsText = skills.map(skill => skill.name).join(', ');
  content += skillsText;
  
  return content;
}

/**
 * Generate a cover letter in plain text
 * @param {Object} data - Cover letter data
 * @param {string} title - Document title
 * @returns {string} - Plain text content
 */
function generateCoverLetterTxt(data, title) {
  const { job, personal, content } = data;
  let txtContent = '';
  
  // Date
  txtContent += `${new Date().toLocaleDateString()}\n\n`;
  
  // Recipient
  if (job.hiringManager) {
    txtContent += `${job.hiringManager}\n`;
  }
  txtContent += `${job.company}\n\n`;
  
  // Greeting
  txtContent += job.hiringManager ? `Dear ${job.hiringManager},\n\n` : 'Dear Hiring Manager,\n\n';
  
  // Content
  txtContent += `${content}\n\n`;
  
  // Closing
  txtContent += 'Sincerely,\n\n';
  txtContent += `${personal.firstName} ${personal.lastName}`;
  
  return txtContent;
}

/**
 * Generate a LinkedIn profile in plain text
 * @param {Object} data - LinkedIn data
 * @param {string} title - Document title
 * @returns {string} - Plain text content
 */
function generateLinkedInTxt(data, title) {
  const { profile, content } = data;
  let txtContent = '';
  
  // Header
  txtContent += `${profile.firstName.toUpperCase()} ${profile.lastName.toUpperCase()}\n`;
  txtContent += `${content.headline || profile.headline}\n`;
  txtContent += `${profile.location} | ${profile.industry}\n\n`;
  
  // About
  txtContent += 'ABOUT\n';
  txtContent += '=====\n';
  txtContent += `${content.about}\n\n`;
  
  // Experience
  txtContent += 'EXPERIENCE\n';
  txtContent += '==========\n';
  txtContent += `${profile.currentPosition}\n`;
  txtContent += `${content.experience}\n`;
  
  return txtContent;
}
