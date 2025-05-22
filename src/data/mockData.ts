
import { Hackathon } from "@/components/hackathons/HackathonCard";

export const hackathons: Hackathon[] = [
  {
    id: "1",
    title: "AI Innovation Challenge",
    organizer: "TechCrunch",
    startDate: "2025-05-25",
    endDate: "2025-05-27",
    status: "upcoming",
    progress: 30,
    platform: "UNSTOP",
    location: "Online",
    type: "hackathon"
  },
  {
    id: "2",
    title: "Blockchain Hackathon",
    organizer: "ETH Global",
    startDate: "2025-05-15",
    endDate: "2025-05-20",
    status: "active",
    progress: 65,
    platform: "DevPost",
    type: "hackathon"
  },
  {
    id: "3",
    title: "Climate Tech Challenge",
    organizer: "GreenTech Alliance",
    startDate: "2025-04-10",
    endDate: "2025-04-12",
    status: "completed",
    progress: 100,
    platform: "Apna",
    location: "Bangalore",
    type: "competition"
  },
  {
    id: "4",
    title: "Web Dev Quiz Competition",
    organizer: "CodeNation",
    startDate: "2025-06-05",
    endDate: "2025-06-05",
    status: "upcoming",
    progress: 10,
    platform: "UNSTOP",
    type: "quiz"
  }
];

export type Communication = {
  id: string;
  hackathonId: string;
  sender: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
  important: boolean;
};

export const communications: Communication[] = [
  {
    id: "1",
    hackathonId: "1",
    sender: "competitions@techcrunch.com",
    subject: "Welcome to AI Innovation Challenge",
    content: "Thank you for registering for the AI Innovation Challenge! We're excited to have you participate. Here's some important information about the event...",
    date: "2025-05-10T10:30:00",
    read: true,
    important: true
  },
  {
    id: "2",
    hackathonId: "1",
    sender: "team@techcrunch.com",
    subject: "Important Deadline Reminder",
    content: "This is a reminder that your prototype submission is due in 48 hours. Please ensure you upload your work by May 26th, 11:59 PM PST.",
    date: "2025-05-18T14:20:00",
    read: false,
    important: true
  },
  {
    id: "3",
    hackathonId: "2",
    sender: "hackathons@ethglobal.co",
    subject: "Blockchain Hackathon - Registration Confirmed",
    content: "Your team has been successfully registered for the Blockchain Hackathon. The event will begin on May 15th at 9 AM UTC.",
    date: "2025-05-05T09:15:00",
    read: true,
    important: false
  }
];

export type Task = {
  id: string;
  hackathonId: string;
  title: string;
  description: string;
  assignedTo: "Macha" | "Veerendra" | "Both";
  status: "todo" | "in-progress" | "done";
  dueDate?: string;
  priority: "low" | "medium" | "high";
};

export const tasks: Task[] = [
  {
    id: "1",
    hackathonId: "1",
    title: "Research AI models",
    description: "Investigate the latest AI models that could be applicable to our project idea.",
    assignedTo: "Macha",
    status: "done",
    dueDate: "2025-05-20",
    priority: "high"
  },
  {
    id: "2",
    hackathonId: "1",
    title: "Create prototype UI",
    description: "Design and implement a basic user interface for our application.",
    assignedTo: "Veerendra",
    status: "in-progress",
    dueDate: "2025-05-22",
    priority: "medium"
  },
  {
    id: "3",
    hackathonId: "1",
    title: "Prepare project documentation",
    description: "Write up comprehensive documentation for the final submission.",
    assignedTo: "Both",
    status: "todo",
    dueDate: "2025-05-26",
    priority: "high"
  }
];

export type Document = {
  id: string;
  hackathonId: string;
  name: string;
  type: "research" | "code" | "presentation" | "submission" | "other";
  uploadedBy: "Macha" | "Veerendra";
  uploadDate: string;
  url: string;
};

export const documents: Document[] = [
  {
    id: "1",
    hackathonId: "1",
    name: "Project Proposal.pdf",
    type: "submission",
    uploadedBy: "Macha",
    uploadDate: "2025-05-15",
    url: "#"
  },
  {
    id: "2",
    hackathonId: "1",
    name: "Market Research.docx",
    type: "research",
    uploadedBy: "Veerendra",
    uploadDate: "2025-05-17",
    url: "#"
  },
  {
    id: "3",
    hackathonId: "1",
    name: "Prototype Demo.mp4",
    type: "submission",
    uploadedBy: "Veerendra",
    uploadDate: "2025-05-20",
    url: "#"
  }
];

export type Note = {
  id: string;
  userId: "Macha" | "Veerendra";
  title: string;
  content: string;
  date: string;
  tags: string[];
  category?: string;  // Added this property
  progress?: number;  // Added this property
};

export const notes: Note[] = [
  {
    id: "1",
    userId: "Macha",
    title: "GitHub Account Details",
    content: "Username: macha-dev\nPassword: stored in password manager\nMain repositories: AI-Projects, Portfolio-2025",
    date: "2025-04-10",
    tags: ["account", "github"],
    category: "important",
    progress: 100
  },
  {
    id: "2",
    userId: "Veerendra",
    title: "Important Contacts",
    content: "TechCrunch Organizer: Sarah (sarah@techcrunch.com)\nMentor: Raj Kumar (raj.k@techmentor.org)",
    date: "2025-05-05",
    tags: ["contacts", "hackathon"],
    category: "event",
    progress: 80
  }
];

// New types for Projects, QuickTasks and QuickAccess
export type Project = {
  id: string;
  userId: "Macha" | "Veerendra" | "Both";
  name: string;
  description: string;
  directoryPath?: string;
  color: string;
  createdDate: string;
  progress: number;
};

export const projects: Project[] = [
  {
    id: "1",
    userId: "Macha",
    name: "Smart Calendar App",
    description: "A calendar app with AI capabilities to suggest optimal meeting times.",
    directoryPath: "/projects/smart-calendar",
    color: "#6E59A5",
    createdDate: "2025-05-01",
    progress: 45
  },
  {
    id: "2",
    userId: "Veerendra",
    name: "E-commerce Dashboard",
    description: "Analytics dashboard for online store performance.",
    directoryPath: "/projects/ecommerce-dashboard",
    color: "#0EA5E9",
    createdDate: "2025-04-15",
    progress: 70
  },
  {
    id: "3",
    userId: "Both",
    name: "Community Forum",
    description: "A community forum platform with moderation tools.",
    directoryPath: "/projects/community-forum",
    color: "#F97316",
    createdDate: "2025-05-10",
    progress: 25
  }
];

export type QuickTask = {
  id: string;
  userId: "Macha" | "Veerendra" | "Both";
  title: string;
  completed: boolean;
  dueDate?: string;
  createdDate: string;
  relatedTo?: string; // Can be related to a hackathon/competition or project
};

export const quickTasks: QuickTask[] = [
  {
    id: "1",
    userId: "Macha",
    title: "Complete AI hackathon registration form",
    completed: false,
    dueDate: "2025-05-22T18:00:00",
    createdDate: "2025-05-21T09:30:00",
    relatedTo: "1" // Related to AI Innovation Challenge
  },
  {
    id: "2",
    userId: "Veerendra",
    title: "Prepare slides for project pitch",
    completed: true,
    dueDate: "2025-05-20T17:00:00",
    createdDate: "2025-05-19T10:15:00",
    relatedTo: "2" // Related to Blockchain Hackathon
  },
  {
    id: "3",
    userId: "Both",
    title: "Brainstorm ideas for Web Dev Quiz",
    completed: false,
    createdDate: "2025-05-21T14:00:00",
    relatedTo: "4" // Related to Web Dev Quiz
  }
];

export type QuickAccess = {
  id: string;
  userId: "Macha" | "Veerendra" | "Both";
  title: string;
  url: string;
  createdDate: string;
  category?: string;
};

export const quickAccess: QuickAccess[] = [
  {
    id: "1",
    userId: "Macha",
    title: "AI Hackathon Platform",
    url: "https://unstop.com/hackathon/ai-innovation",
    createdDate: "2025-05-15",
    category: "hackathon"
  },
  {
    id: "2",
    userId: "Veerendra",
    title: "Blockchain Documentation",
    url: "https://docs.ethereumchain.org",
    createdDate: "2025-05-16",
    category: "research"
  },
  {
    id: "3",
    userId: "Both",
    title: "Team Collaboration Board",
    url: "https://miro.com/team-board",
    createdDate: "2025-05-17",
    category: "collaboration"
  }
];
