import { jsPDF } from 'jspdf';
import type { CertificateCategory, PortfolioData, SkillCategory } from '../types/portfolio';

export function generateResumePdf(data: PortfolioData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 44;
  const maxWidth = pageWidth - marginX * 2;
  let y = 48;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 44) {
      doc.addPage();
      y = 48;
    }
  };

  const addSectionHeading = (title: string) => {
    ensureSpace(34);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(29, 78, 216);
    doc.text(title.toUpperCase(), marginX, y);
    y += 5;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.75);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 14;
  };

  const addWrappedText = (
    text: string,
    opts?: { fontSize?: number; bold?: boolean; color?: [number, number, number]; indent?: number; lineHeight?: number }
  ) => {
    const fontSize = opts?.fontSize ?? 9.5;
    const bold = opts?.bold ?? false;
    const color = opts?.color ?? [30, 41, 59];
    const indent = opts?.indent ?? 0;
    const lineHeight = opts?.lineHeight ?? fontSize * 1.42;

    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);

    const lines = doc.splitTextToSize(text, maxWidth - indent) as string[];
    for (const line of lines) {
      ensureSpace(lineHeight + 4);
      doc.text(line, marginX + indent, y);
      y += lineHeight;
    }
  };

  // 1. Personal Information and Professional Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42);
  doc.text(data.profile.fullName, marginX, y);
  y += 16;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(37, 99, 235);
  doc.text(data.profile.headline, marginX, y);
  y += 14;

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `${data.profile.location}  |  ${data.profile.email}  |  GitHub: ${data.profile.githubUrl}`,
    marginX,
    y
  );
  y += 12;
  doc.text(`LinkedIn: ${data.profile.linkedinUrl}`, marginX, y);
  y += 12;

  addSectionHeading('1. Professional Summary');
  data.profile.introduction.forEach((para) => {
    addWrappedText(para, { fontSize: 9.5 });
    y += 4;
  });

  // 2. Online Study Courses Related to the Subject Area
  addSectionHeading('2. Online Study Courses Related to the Subject Area');
  const categoryOrder: CertificateCategory[] = [
    'Python & Programming',
    'Mathematics & Computer Science',
    'Artificial Intelligence & Machine Learning',
    'IT & Cybersecurity',
    'English Language & Communication',
  ];

  categoryOrder.forEach((cat) => {
    const items = data.onlineCourses.filter((c) => c.category === cat);
    if (items.length === 0) return;
    ensureSpace(26);
    addWrappedText(cat, { fontSize: 10, bold: true, color: [15, 23, 42] });
    items.forEach((course) => {
      ensureSpace(28);
      addWrappedText(
        `• ${course.title} — ${course.institution} (${course.year})`,
        { fontSize: 9.2, bold: true, indent: 8 }
      );
      addWrappedText(`Verify: ${course.verificationUrl}`, {
        fontSize: 8.5,
        color: [37, 99, 235],
        indent: 18,
      });
    });
    y += 4;
  });

  // 3. Project Participation
  addSectionHeading('3. Project Participation');
  data.projects.forEach((project) => {
    ensureSpace(44);
    addWrappedText(`${project.title} (${project.year})`, {
      fontSize: 10,
      bold: true,
      color: [15, 23, 42],
    });
    const cleanDesc = project.description.replace(/\n+/g, ' ');
    addWrappedText(cleanDesc, { fontSize: 9.2, indent: 8 });
    if (project.techStack.length > 0) {
      addWrappedText(`Technologies: ${project.techStack.join(', ')}`, {
        fontSize: 8.8,
        color: [71, 85, 105],
        indent: 8,
      });
    }
    if (project.liveUrl) {
      addWrappedText(`Live URL: ${project.liveUrl}`, {
        fontSize: 8.8,
        color: [37, 99, 235],
        indent: 8,
      });
    }
    if (project.githubUrl) {
      addWrappedText(`GitHub: ${project.githubUrl}`, {
        fontSize: 8.8,
        color: [37, 99, 235],
        indent: 8,
      });
    }
    y += 5;
  });

  // 4. Work Experience
  addSectionHeading('4. Work Experience');
  data.experience.forEach((exp) => {
    ensureSpace(36);
    addWrappedText(`${exp.position} — ${exp.organization} (${exp.period})`, {
      fontSize: 9.8,
      bold: true,
      color: [15, 23, 42],
    });
    addWrappedText(exp.description, { fontSize: 9.2, indent: 8 });
    y += 4;
  });

  // 5. Science / Technology / Mathematics Competition Awards
  addSectionHeading('5. Science, Technology & Mathematics Competition Awards');
  data.awards.forEach((award) => {
    ensureSpace(24);
    addWrappedText(
      `• ${award.title} — ${award.issuer} (${award.year})`,
      { fontSize: 9.2, indent: 6 }
    );
  });

  // 6. Other Qualifications and Certificates
  addSectionHeading('6. Other Qualifications and Certificates');
  data.otherQualifications.forEach((qual) => {
    ensureSpace(24);
    const issued = qual.issuedBy ? ` | Issued by: ${qual.issuedBy}` : '';
    addWrappedText(
      `• ${qual.title} — ${qual.institution}${issued} (${qual.year})`,
      { fontSize: 9.2, indent: 6 }
    );
  });

  // 7. Academic Background (No grades or percentages)
  addSectionHeading('7. Academic Background');
  data.education.forEach((edu) => {
    ensureSpace(24);
    addWrappedText(
      `• ${edu.period} | ${edu.title} — ${edu.institution}`,
      { fontSize: 9.3, indent: 6 }
    );
  });

  // 8. Technical Skills
  addSectionHeading('8. Technical Skills');
  const skillCategories: SkillCategory[] = [
    'Programming',
    'AI & Machine Learning',
    'Web Development',
    'Other',
  ];
  skillCategories.forEach((cat) => {
    const names = data.skills
      .filter((s) => s.category === cat)
      .map((s) => s.name);
    if (names.length === 0) return;
    addWrappedText(`${cat}: ${names.join(', ')}`, {
      fontSize: 9.3,
      indent: 6,
    });
  });

  // 9. Contact Information and Profile Links
  addSectionHeading('9. Contact Information and Profile Links');
  addWrappedText(`Email: ${data.profile.email}`, { fontSize: 9.2, indent: 6 });
  addWrappedText(`Location: ${data.profile.location}`, { fontSize: 9.2, indent: 6 });
  addWrappedText(`GitHub: ${data.profile.githubUrl}`, { fontSize: 9.2, indent: 6 });
  addWrappedText(`LinkedIn: ${data.profile.linkedinUrl}`, { fontSize: 9.2, indent: 6 });
  addWrappedText('DreamPath AI: https://dreampathai.vercel.app/', { fontSize: 9.2, indent: 6 });
  addWrappedText('Health Guide App: https://health-guide-app.vercel.app/', { fontSize: 9.2, indent: 6 });
  addWrappedText('ThumbForge: https://thumb-forge-beta.vercel.app/', { fontSize: 9.2, indent: 6 });

  doc.save('Muhammad_Khan_CV.pdf');
}
