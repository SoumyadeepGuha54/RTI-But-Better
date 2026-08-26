/**
 * Public authorities available in this demo, with the CPIO and First Appellate
 * Authority names an applicant would really need to address.
 */

export type Authority = {
  id: number;
  name: string;
  category: "Central Ministry" | "Central Department" | "Organisation";
  description: string;
  /** Central Public Information Officer. */
  cpio: string;
  /** First Appellate Authority, used by the appeal flow. */
  appellateAuthority: string;
};

const raw: Omit<Authority, "id">[] = [
  {
    name: "Ministry of Education",
    category: "Central Ministry",
    description: "Education policy, grants, scholarships and institutions",
    cpio: "Under Secretary (RTI), Department of Higher Education",
    appellateAuthority: "Deputy Secretary (Appeals), Ministry of Education",
  },
  {
    name: "Ministry of Railways",
    category: "Central Ministry",
    description: "Rail services, infrastructure and passenger information",
    cpio: "Director (Public Grievances), Railway Board",
    appellateAuthority: "Executive Director (RTI), Railway Board",
  },
  {
    name: "Ministry of Finance",
    category: "Central Ministry",
    description: "Economic affairs, budget documents and public finance",
    cpio: "Under Secretary (RTI), Department of Expenditure",
    appellateAuthority: "Director (Coordination), Ministry of Finance",
  },
  {
    name: "Ministry of Home Affairs",
    category: "Central Ministry",
    description: "Internal security, administration and circulars",
    cpio: "Under Secretary (RTI Cell), Ministry of Home Affairs",
    appellateAuthority:
      "Deputy Secretary (Administration), Ministry of Home Affairs",
  },
  {
    name: "Ministry of Health and Family Welfare",
    category: "Central Ministry",
    description: "Public health programmes, hospitals and policy",
    cpio: "Under Secretary (RTI), Department of Health",
    appellateAuthority:
      "Director (Public Health), Ministry of Health and Family Welfare",
  },
  {
    name: "Ministry of Environment, Forest and Climate Change",
    category: "Central Ministry",
    description: "Environmental clearances, forest and climate programmes",
    cpio: "Scientist-D (RTI), Ministry of Environment",
    appellateAuthority:
      "Joint Secretary (Coordination), Ministry of Environment",
  },
  {
    name: "Ministry of Housing and Urban Affairs",
    category: "Central Ministry",
    description: "Urban development, housing schemes and metro projects",
    cpio: "Under Secretary (RTI), Ministry of Housing and Urban Affairs",
    appellateAuthority:
      "Director (Urban Development), Ministry of Housing and Urban Affairs",
  },
  {
    name: "Department of Personnel & Training",
    category: "Central Department",
    description: "Public service rules, recruitment and administrative matters",
    cpio: "Under Secretary (RTI Division), DoPT",
    appellateAuthority: "Director (Establishment), DoPT",
  },
  {
    name: "Department of Telecommunications",
    category: "Central Department",
    description: "Telecom licensing, spectrum and service quality",
    cpio: "Assistant Director General (RTI), DoT",
    appellateAuthority: "Deputy Director General (Administration), DoT",
  },
  {
    name: "Department of Consumer Affairs",
    category: "Central Department",
    description: "Consumer protection, price monitoring and standards",
    cpio: "Under Secretary (RTI), Department of Consumer Affairs",
    appellateAuthority:
      "Director (Consumer Protection), Department of Consumer Affairs",
  },
  {
    name: "Central Public Works Department",
    category: "Organisation",
    description: "Government construction, maintenance and public works",
    cpio: "Executive Engineer (RTI Cell), CPWD",
    appellateAuthority: "Superintending Engineer (Coordination), CPWD",
  },
  {
    name: "National Informatics Centre",
    category: "Organisation",
    description: "Digital government services and IT infrastructure",
    cpio: "Scientist-D (RTI), National Informatics Centre",
    appellateAuthority: "Deputy Director General, National Informatics Centre",
  },
  {
    name: "Food Corporation of India",
    category: "Organisation",
    description: "Food security, grain procurement and storage",
    cpio: "Assistant General Manager (RTI), FCI",
    appellateAuthority: "General Manager (Vigilance), FCI",
  },
  {
    name: "Airports Authority of India",
    category: "Organisation",
    description: "Airport operations, air navigation and infrastructure",
    cpio: "Joint General Manager (RTI), Airports Authority of India",
    appellateAuthority:
      "Executive Director (Administration), Airports Authority of India",
  },
  {
    name: "University Grants Commission",
    category: "Organisation",
    description: "University recognition, funding and academic standards",
    cpio: "Education Officer (RTI), UGC",
    appellateAuthority: "Joint Secretary, University Grants Commission",
  },
  {
    name: "Employees Provident Fund Organisation",
    category: "Organisation",
    description: "Provident fund accounts, pensions and claims",
    cpio: "Regional Provident Fund Commissioner (RTI), EPFO",
    appellateAuthority: "Additional Central Provident Fund Commissioner, EPFO",
  },
];

export const authorities: Authority[] = raw.map((item, id) => ({
  ...item,
  id,
}));

export function findAuthority(name: string): Authority | undefined {
  return authorities.find((item) => item.name === name);
}

export const authorityCategories = [
  "Central Ministry",
  "Central Department",
  "Organisation",
] as const;
