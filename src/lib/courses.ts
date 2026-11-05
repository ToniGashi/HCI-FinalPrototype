export type Course = {
  id: string;
  code: string;
  title: string;
  specialization: string;
  credits: number;
  openSeats: boolean;
  overview: string;
  prerequisites: string;
};

export type Season = "Spring" | "Summer" | "Fall";

export type Semester = {
  id: string;
  year: number;
  season: Season;
  courseIds: string[];
};

export const informationSource =
  "Illustrative prototype content only. In a real deployment, course facts, prerequisites and live seats would come from official Georgia Tech sources.";

export const registration = {
  term: "Spring 2027",
  headline: "Spring 2027 – Time ticket coming on November 10th, stay tuned",
  timeTicketLabel: "Spring 2027 Time ticket",
  timeTicket: "November 10th",
  registrationEndsLabel: "Spring 2027 Registration ends",
  registrationEnds: "November 17th",
  status: "Not registered",
  ticketLabel: "No time ticket yet",
  note: "Planning does not register you for classes or reserve seats. Check your time ticket and complete registration in OSCAR when registration time comes.",
};

export const degreeProgress = {
  program: "MS in Computer Science",
  percent: 60,
  remainingCourses: 4,
  status: "On Track",
};

export const studentSpecialization = "Human-Computer Interaction";

export const specializationOptions = [
  "OMSCS",
  "Computing Systems",
  "Machine Learning",
  "Human-Computer Interaction",
  "Interactive Intelligence",
] as const;

export const pageLede =
  "Explore OMSCS courses and build your semester-by-semester path. This will make your registration much easier and quicker when your registration time comes.";

export const courses: Course[] = [
  {
    id: "cs6250",
    code: "CS 6250",
    title: "Computer Networks",
    specialization: "Computing Systems",
    credits: 3,
    openSeats: true,
    overview:
      "Networking fundamentals, routing, transport protocols, and system design.",
    prerequisites:
      "Recommended: familiarity with operating systems and networking fundamentals.",
  },
  {
    id: "cs6300",
    code: "CS 6300",
    title: "Software Development Process",
    specialization: "Computing Systems",
    credits: 3,
    openSeats: true,
    overview:
      "How software teams plan, build, review, and release work from requirements through delivery.",
    prerequisites:
      "Recommended: experience writing and testing programs in a general-purpose language.",
  },
  {
    id: "cs6035",
    code: "CS 6035",
    title: "Introduction to Information Security",
    specialization: "Computing Systems",
    credits: 3,
    openSeats: false,
    overview:
      "Core security principles, threats, and defensive design for networked systems.",
    prerequisites:
      "Recommended: comfort with operating systems, networking, and a scripting language.",
  },
  {
    id: "cs6200",
    code: "CS 6200",
    title: "Introduction to Operating Systems",
    specialization: "Computing Systems",
    credits: 3,
    openSeats: false,
    overview:
      "Processes, memory, file systems, and concurrency inside a modern operating system.",
    prerequisites: "Recommended: computer organization and programming in C or C++.",
  },
  {
    id: "cs6290",
    code: "CS 6290",
    title: "Algorithms",
    specialization: "Computing Systems",
    credits: 3,
    openSeats: true,
    overview:
      "Algorithm design, complexity, and the techniques used to reason about efficient solutions.",
    prerequisites: "Recommended: discrete math and data structures.",
  },
  {
    id: "cs6450",
    code: "CS 6450",
    title: "Software Programming Process",
    specialization: "Computing Systems",
    credits: 3,
    openSeats: true,
    overview: "Practices for designing, implementing, and evolving software with a team.",
    prerequisites: "Recommended: prior software project experience.",
  },
  {
    id: "cs6500",
    code: "CS 6500",
    title: "Human-Computer Interaction",
    specialization: "Human-Computer Interaction",
    credits: 3,
    openSeats: true,
    overview:
      "How people use interfaces, and how to study, prototype, and evaluate those interactions.",
    prerequisites:
      "Recommended: interest in design and user research. No prior studio course required.",
  },
  {
    id: "cs6601",
    code: "CS 6601",
    title: "Artificial Intelligence",
    specialization: "Machine Learning",
    credits: 3,
    openSeats: true,
    overview:
      "Search, knowledge representation, reasoning, and the foundations of intelligent systems.",
    prerequisites: "Recommended: algorithms, probability, and comfort with mathematical notation.",
  },
  {
    id: "cs7637",
    code: "CS 7637",
    title: "Knowledge-Based Artificial Intelligence",
    specialization: "Interactive Intelligence",
    credits: 3,
    openSeats: true,
    overview:
      "Knowledge representations and reasoning methods used to model human-like problem solving.",
    prerequisites: "Recommended: an introductory artificial intelligence course.",
  },
  {
    id: "cs7641",
    code: "CS 7641",
    title: "Machine Learning",
    specialization: "Machine Learning",
    credits: 3,
    openSeats: true,
    overview: "Supervised and unsupervised learning, evaluation, and where models fail in practice.",
    prerequisites: "Recommended: probability, linear algebra, and programming for data analysis.",
  },
];

export const courseById: Record<string, Course> = Object.fromEntries(
  courses.map((course) => [course.id, course]),
);

export const initialSemesters: Semester[] = [
  { id: "2027-spring", year: 2027, season: "Spring", courseIds: ["cs6250"] },
  { id: "2027-summer", year: 2027, season: "Summer", courseIds: ["cs6300"] },
  { id: "2027-fall", year: 2027, season: "Fall", courseIds: [] },
];

export function semesterLabel(semester: Semester) {
  return `${semester.season} ${semester.year}`;
}

export function degreeTitle(specialization: string) {
  if (specialization === "OMSCS") return "MS in Computer Science · OMSCS";
  return `MS in Computer Science · ${specialization}`;
}

export function loadFor(ids: string[]) {
  const count = ids.length;
  const credits = ids.reduce((sum, id) => sum + (courseById[id]?.credits ?? 0), 0);
  const courseWord = count === 1 ? "course" : "courses";
  const creditWord = credits === 1 ? "credit" : "credits";
  return {
    count,
    credits,
    label: `${count} ${courseWord} · ${credits} ${creditWord}`,
    courseLabel: `${count} ${count === 1 ? "Course" : "Courses"}`,
  };
}

export const catalogSpecializations = [
  "All specializations",
  ...Array.from(new Set(courses.map((course) => course.specialization))).sort(),
];
