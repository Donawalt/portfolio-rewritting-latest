import { client } from "./sanityClient";
import { getAllLandings, getAllArticles, getAllProjects, getDocumentById } from "./api";

// Build-time data access. The same collections are requested by many routes,
// endpoints and slices; keep one in-flight request per collection for the whole
// build and hand each caller its own copy so page-level mutations stay isolated.
const cache = new Map();

const cached = (key, load) => {
  if (!cache.has(key)) {
    cache.set(
      key,
      load().catch((error) => {
        cache.delete(key);
        throw error;
      })
    );
  }
  return cache.get(key).then((data) => structuredClone(data));
};

export const getLandings = () => cached("landings", () => client.fetch(getAllLandings()));

export const getArticles = () => cached("articles", () => client.fetch(getAllArticles()));

export const getProjects = () => cached("projects", () => client.fetch(getAllProjects()));

export const getProjectById = async (id) => {
  const projects = await getProjects();
  return projects.find((project) => project?._id === id) ?? client.fetch(getDocumentById(id));
};
