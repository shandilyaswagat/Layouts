export type Product = {
  name: string;
  blurb: string;
  note: string;
};

/** The rest of the Talvios shelf. All of these run on your own machine. */
export const PRODUCTS: Product[] = [
  {
    name: "JobHunt",
    blurb:
      "Search the job boards you care about, score roles against your resume, and keep the ones worth pursuing in a sheet you own.",
    note: "Runs locally",
  },
  {
    name: "ColdMail Pro",
    blurb:
      "Send cold outreach one email at a time, with sensible pacing and limits instead of blasting the same message everywhere.",
    note: "Runs locally",
  },
  {
    name: "Resume Generator",
    blurb:
      "Give it a job description and your resume. It rewrites the relevant parts for the role without inventing experience you don't have.",
    note: "Runs locally",
  },
  {
    name: "Naukri Autopilot",
    blurb:
      "Keep your Naukri profile active without remembering to do it yourself. It nudges the profile and keeps a record of the activity.",
    note: "Runs locally",
  },
];
