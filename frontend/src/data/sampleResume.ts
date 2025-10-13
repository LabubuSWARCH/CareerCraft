import { ResumeData } from '@shared/template-schema';

export const sampleResume: ResumeData = {
  name: 'Avery Johnson',
  title: 'Senior Product Designer',
  email: 'avery.johnson@example.com',
  phone: '+1 (555) 123-4567',
  location: 'Seattle, WA',
  website: 'https://avery.design',
  summary:
    'Senior product designer with 8+ years building human-centered SaaS experiences for growth-stage startups and Fortune 500 teams.',
  skills: ['UX Research', 'Interaction Design', 'Storybook', 'Figma', 'Design Systems', 'Leadership'],
  experience: [
    {
      id: 'exp-1',
      company: 'Flowstate Labs',
      role: 'Lead Product Designer',
      start: '2021-03-01',
      end: '2024-08-01',
      bullets: [
        'Led redesign of analytics suite used by 6,000+ enterprise users, increasing retention by 18%.',
        'Mentored a team of 4 designers and partnered with PMs to launch quarterly roadmap initiatives.',
        'Instituted accessibility guidelines adopted company-wide.'
      ]
    },
    {
      id: 'exp-2',
      company: 'Northwind Insights',
      role: 'Product Designer',
      start: '2017-05-01',
      end: '2021-02-01',
      bullets: [
        'Redesigned onboarding flow reducing time-to-value by 46%.',
        'Co-led cross-functional design sprint that launched AI-assisted dashboard personalization.',
        'Conducted 50+ customer interviews to inform new product strategy.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      school: 'University of Washington',
      degree: 'B.A. in Human Centered Design & Engineering',
      start: '2012-09-01',
      end: '2016-06-01',
      details: 'Dean\'s List, Design Club President'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Compass Case Study',
      description: 'End-to-end case study on launching a mobile budgeting app with multimodal research.',
      link: 'https://avery.design/compass'
    },
    {
      id: 'proj-2',
      name: 'Design Systems Toolkit',
      description: 'Open-source Figma component library with Storybook integration.',
      link: 'https://github.com/avery/design-systems-toolkit'
    }
  ],
  showProjects: true
};
