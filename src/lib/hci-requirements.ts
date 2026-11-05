export const hciSources = {
  specialization: "https://omscs.gatech.edu/specialization-human-computer-interaction",
  degree: "https://omscs.gatech.edu/degree-requirements",
  courses: "https://omscs.gatech.edu/current-courses",
};

export type RequirementCourse = {
  code: string;
  title: string;
  offeredOnline: boolean;
};

export type CompletedCourse = RequirementCourse & {
  bucket: string;
};

export const completedCourses: CompletedCourse[] = [
  {
    code: "CS 6750",
    title: "Human-Computer Interaction",
    bucket: "Core",
    offeredOnline: true,
  },
  {
    code: "CS 6795",
    title: "Introduction to Cognitive Science",
    bucket: "Elective · Design and evaluation concepts",
    offeredOnline: true,
  },
  {
    code: "CS 7632",
    title: "Game AI",
    bucket: "Elective · Interactive technology",
    offeredOnline: true,
  },
  {
    code: "CS 6035",
    title: "Introduction to Information Security",
    bucket: "Free elective",
    offeredOnline: true,
  },
  {
    code: "CS 6200",
    title: "Introduction to Operating Systems",
    bucket: "Free elective",
    offeredOnline: true,
  },
  {
    code: "CS 7641",
    title: "Machine Learning",
    bucket: "Free elective",
    offeredOnline: true,
  },
];

export const coreStillRequired: RequirementCourse = {
  code: "CS 7470",
  title: "Mobile and Ubiquitous Computing",
  offeredOnline: true,
};

export const coreAlternateNotOffered: RequirementCourse = {
  code: "CS 6456",
  title: "Principles of User Interface Software",
  offeredOnline: false,
};

export const designElectives: RequirementCourse[] = [
  { code: "CS 6010", title: "Principles of Design", offeredOnline: false },
  { code: "CS 6320", title: "Software Requirements Analysis and Specification", offeredOnline: false },
  { code: "CS 6435", title: "Digital Health Equity", offeredOnline: true },
  { code: "CS 6454", title: "Qualitative Methods for Design of Human Computer Interaction", offeredOnline: false },
  { code: "CS 6457", title: "Video Game Design", offeredOnline: true },
  { code: "CS 6460", title: "Educational Technology: Conceptual Foundations", offeredOnline: true },
  { code: "CS 6465", title: "Computational Journalism", offeredOnline: false },
  { code: "CS 6470", title: "Design of Online Communities", offeredOnline: false },
  { code: "CS 6795", title: "Introduction to Cognitive Science", offeredOnline: true },
  { code: "CS 7465", title: "Educational Technology: Design and Evaluation", offeredOnline: false },
  { code: "CS 7467", title: "Computer-Supported Collaborative Learning", offeredOnline: false },
];

export const interactiveElectives: RequirementCourse[] = [
  { code: "CS 6440", title: "Introduction to Health Informatics", offeredOnline: true },
  { code: "CS 6452", title: "Prototyping Interactive Systems", offeredOnline: false },
  { code: "CS 6456", title: "Principles of User Interface Software", offeredOnline: false },
  { code: "CS 6641", title: "Personal Health Informatics", offeredOnline: false },
  { code: "CS 6730", title: "Data Visualization: Principles and Applications", offeredOnline: false },
  { code: "CS 6745", title: "Information & Communication Technologies and Global Development", offeredOnline: false },
  { code: "CS 6763", title: "Design of Design Environments", offeredOnline: false },
  { code: "CS 6770", title: "Mixed Reality Experience Design", offeredOnline: false },
  { code: "CS 7450", title: "Information Visualization", offeredOnline: false },
  { code: "CS 7451", title: "Human-Centered Data Analysis", offeredOnline: false },
  { code: "CS 7460", title: "Collaborative Computing", offeredOnline: false },
  { code: "CS 7462", title: "Animal Computer Interaction", offeredOnline: false },
  { code: "CS 7470", title: "Mobile and Ubiquitous Computing", offeredOnline: true },
  { code: "CS 7632", title: "Game AI", offeredOnline: true },
  { code: "CS 7711", title: "Health Sensing and Interventions", offeredOnline: true },
];

const completedCodes = new Set(completedCourses.map((course) => course.code));

export const openOnlineElectives: RequirementCourse[] = [...designElectives, ...interactiveElectives].filter(
  (course) => course.offeredOnline && !completedCodes.has(course.code) && course.code !== coreStillRequired.code,
);

export const freeElectivesRemaining = 2;

export const programRules = [
  "The degree is 30 credit hours: 10 courses.",
  "Human-Computer Interaction is 15 hours: CS 6750, either CS 6456 or CS 7470, and 3 electives with at least one from each sub-area.",
  "Every specialization course needs a grade of B or higher.",
  "The other 15 hours are free electives. Any OMSCS course counts, with a grade of C or higher.",
  "A 3.0 cumulative GPA is required to graduate.",
];
