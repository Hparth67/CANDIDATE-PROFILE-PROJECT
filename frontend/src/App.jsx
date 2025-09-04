import { useEffect, useState } from "react";
import axios from "axios";
const API_BASE = "http://localhost:3000"; // Update if hosted elsewhere

function App() {
  const [profile, setProfile] = useState(null);
  const [skillQuery, setSkillQuery] = useState("");
  const [projectResults, setProjectResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/profile`).then((res) => setProfile(res.data)).catch(console.error);
  }, []);

  const searchBySkill = () => {
    if (!skillQuery) return setProjectResults([]);
    axios
      .get(`${API_BASE}/projects`, { params: { skill: skillQuery } })
      .then((res) => setProjectResults(res.data))
      .catch(console.error);
  };

  const searchAll = () => {
    if (!searchQuery) return setSearchResults(null);
    axios
      .get(`${API_BASE}/search`, { params: { q: searchQuery } })
      .then((res) => setSearchResults(res.data))
      .catch(console.error);
  };

  return (
    <div className="font-sans m-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">Candidate Playground</h1>

      {profile ? (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Profile</h2>
          <p className="mb-1">
            <strong className="font-semibold">Name:</strong> {profile.name}
          </p>
          <p className="mb-1">
            <strong className="font-semibold">Email:</strong> {profile.email}
          </p>
          <p className="mb-1">
            <strong className="font-semibold">Education:</strong> {profile.education}
          </p>
          <p className="mb-4">
            <strong className="font-semibold">Links:</strong>{" "}
            {profile.links && (
              <>
                <a href={profile.links.github} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline mr-2">
                  GitHub
                </a>
                |
                <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline mx-2">
                  LinkedIn
                </a>
                |
                <a href={profile.links.portfolio} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline ml-2">
                  Portfolio
                </a>
              </>
            )}
          </p>

          <h3 className="text-xl font-semibold mb-2">Skills</h3>
          <ul className="flex flex-wrap gap-2 mb-6">
            {profile.skills.map((s, i) => (
              <li key={i} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                {s}
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-semibold mb-2">Projects</h3>
          <ul className="list-disc list-inside mb-6">
            {profile.projects.map((p, i) => (
              <li key={i} className="mb-2">
                <strong>{p.title}</strong> - {p.description}{" "}
                <a href={p.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline ml-1">
                  Link
                </a>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-semibold mb-2">Work Experience</h3>
          <ul className="list-disc list-inside">
            {profile.work.map((w, i) => (
              <li key={i} className="mb-3">
                <strong>{w.role}</strong> at {w.company} ({w.from_date} - {w.to_date})
                <br />
                {w.description}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}

      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Search Projects by Skill</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter skill..."
            onChange={(e) => setSkillQuery(e.target.value)}
            value={skillQuery}
            className="border px-3 py-2 rounded flex-grow focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={searchBySkill}
            className="bg-indigo-600 text-white px-4 rounded hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </div>
        <ul className="list-disc list-inside">
          {projectResults.map((p, i) => (
            <li key={i} className="mb-2">
              <strong>{p.title}</strong> - {p.description}{" "}
              <a href={p.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline ml-1">
                Link
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Search All</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search projects, skills, work..."
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            className="border px-3 py-2 rounded flex-grow focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={searchAll}
            className="bg-indigo-600 text-white px-4 rounded hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </div>
        {searchResults && (
          <>
            <h3 className="text-xl font-semibold mb-2">Projects</h3>
            <ul className="list-disc list-inside mb-4">
              {searchResults.projects.map((p, i) => (
                <li key={i} className="mb-2">
                  <strong>{p.title}</strong> - {p.description}{" "}
                  <a href={p.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline ml-1">
                    Link
                  </a>
                </li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold mb-2">Skills</h3>
            <ul className="flex flex-wrap gap-2 mb-4">
              {searchResults.skills.map((s, i) => (
                <li key={i} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                  {s}
                </li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold mb-2">Work</h3>
            <ul className="list-disc list-inside">
              {searchResults.work.map((w, i) => (
                <li key={i} className="mb-3">
                  <strong>{w.role}</strong> at {w.company}
                  <br />
                  {w.description}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
