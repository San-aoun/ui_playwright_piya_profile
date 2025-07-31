export const testData = {
  user: {
    validName: 'John Doe',
    validEmail: 'john.doe@example.com',
    invalidEmail: 'invalid-email',
    longName: 'A'.repeat(100),
    message: 'This is a test message for the contact form.',
    longMessage: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(20),
  },
  
  navigation: {
    expectedSections: ['Home', 'About', 'Skills', 'Projects', 'Contact'],
    socialPlatforms: ['LinkedIn', 'GitHub', 'Twitter', 'Instagram'],
  },
  
  skills: {
    categories: ['Frontend', 'Backend', 'Database', 'Tools', 'Languages'],
    expectedSkills: [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
      'HTML', 'CSS', 'Git', 'Docker', 'AWS'
    ],
  },
  
  projects: {
    expectedCategories: ['Web Development', 'Mobile App', 'API Development'],
    minProjectCount: 3,
  },
  
  performance: {
    maxLoadTime: 3000, // 3 seconds
    maxFirstContentfulPaint: 2000, // 2 seconds
  },
  
  accessibility: {
    requiredAriaLabels: ['navigation', 'main', 'banner', 'contentinfo'],
    colorContrastRatio: 4.5,
  },
  
  responsive: {
    breakpoints: {
      mobile: { width: 375, height: 667 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1920, height: 1080 },
    },
  },
};
