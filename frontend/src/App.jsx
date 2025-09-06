import { useEffect, useState } from "react";
import axios from "axios";

// const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const BASE_URL = isLocalhost ? "http://localhost:5000" : process.env.REACT_APP_API_URL;

function App() {
  // Existing states
  const [profile, setProfile] = useState(null);
  const [skillQuery, setSkillQuery] = useState("");
  const [projectResults, setProjectResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  // New state for create profile form
  const [newProfile, setNewProfile] = useState({
    name: "",
    email: "",
    education: "",
    skills: "[]", // Input as JSON string for simplicity
    projects: "[]",
    work: "[]",
    links: "{}"
  });

  useEffect(() => {
    axios.get(`${BASE_URL}/profile`).then((res) => setProfile(res.data)).catch(console.error);
  }, []);

  // Existing search functions...
  const searchBySkill = () => {
    if (!skillQuery) return setProjectResults([]);
    axios
      .get(`${BASE_URL}/projects`, { params: { skill: skillQuery } })
      .then((res) => setProjectResults(res.data))
      .catch(console.error);
  };

  const searchAll = () => {
    if (!searchQuery) return setSearchResults(null);
    axios
      .get(`${BASE_URL}/search`, { params: { q: searchQuery } })
      .then((res) => setSearchResults(res.data))
      .catch(console.error);
  };

  // New function to handle input changes for create profile form
  const handleNewProfileChange = (e) => {
    const { name, value } = e.target;
    setNewProfile((prev) => ({ ...prev, [name]: value }));
  };

  // New function to submit create profile POST request
  const createProfile = async () => {
    try {
      // Parse JSON fields before sending
      const body = {
        ...newProfile,
        skills: JSON.parse(newProfile.skills),
        projects: JSON.parse(newProfile.projects),
        work: JSON.parse(newProfile.work),
        links: JSON.parse(newProfile.links),
      };
      const res = await axios.post(`${BASE_URL}/profile`, body);
      alert("Profile created successfully");
      setProfile(res.data.createdProfile || null);
      // Optionally clear the form
      setNewProfile({
        name: "",
        email: "",
        education: "",
        skills: "[]",
        projects: "[]",
        work: "[]",
        links: "{}"
      });
    } catch (error) {
      alert("Error creating profile: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="font-sans m-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">Candidate Playground</h1>

      {/* Create Profile Form and Profile Display - Side by Side */}
      <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Profile Form */}
        <div className="border p-4 rounded">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-center">Create Profile</h2>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newProfile.name}
              onChange={handleNewProfileChange}
              className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newProfile.email}
              onChange={handleNewProfileChange}
              className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="education"
              placeholder="Education"
              value={newProfile.education}
              onChange={handleNewProfileChange}
              className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              name="skills"
              placeholder='Skills as JSON array, e.g. ["JavaScript","Node.js"]'
              value={newProfile.skills}
              onChange={handleNewProfileChange}
              rows={2}
              className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              name="projects"
              placeholder='Projects as JSON array of objects'
              value={newProfile.projects}
              onChange={handleNewProfileChange}
              rows={3}
              className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              name="work"
              placeholder='Work as JSON array of objects'
              value={newProfile.work}
              onChange={handleNewProfileChange}
              rows={3}
              className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              name="links"
              placeholder='Links as JSON object, e.g. {"github":"url","linkedin":"url"}'
              value={newProfile.links}
              onChange={handleNewProfileChange}
              rows={2}
              className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={createProfile}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Create Profile
            </button>
          </div>
        </div>

        {/* Profile Display */}
        <div className="border p-4 rounded">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-center">Profile</h2>
          {profile ? (
            <div>
              <p className="mb-2">
                <strong className="font-semibold">Name:</strong> {profile.name}
              </p>
              <p className="mb-2">
                <strong className="font-semibold">Email:</strong> {profile.email}
              </p>
              <p className="mb-2">
                <strong className="font-semibold">Education:</strong> {profile.education}
              </p>
              <div className="mb-4">
                <strong className="font-semibold">Links:</strong>{" "}
                {profile.links && (
                  <div className="mt-1">
                    {profile.links.github && (
                      <a
                        href={profile.links.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline mr-2 text-sm"
                      >
                        GitHub
                      </a>
                    )}
                    {profile.links.linkedin && (
                      <a
                        href={profile.links.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline mx-2 text-sm"
                      >
                        LinkedIn
                      </a>
                    )}
                    {profile.links.portfolio && (
                      <a
                        href={profile.links.portfolio}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline ml-2 text-sm"
                      >
                        Portfolio
                      </a>
                    )}
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-1 mb-4">
                {(profile.skills || []).map((s, i) => (
                  <span
                    key={i}
                    className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <h3 className="text-lg font-semibold mb-2">Projects</h3>
              <div className="mb-4 max-h-32 overflow-y-auto">
                {(profile.projects || []).map((p, i) => (
                  <div key={i} className="mb-2 text-sm">
                    <strong>{p.title}</strong> - {p.description}{" "}
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Link
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-semibold mb-2">Work Experience</h3>
              <div className="max-h-32 overflow-y-auto">
                {(profile.work || []).map((w, i) => (
                  <div key={i} className="mb-3 text-sm">
                    <strong>{w.role}</strong> at {w.company} ({w.from_date} - {w.to_date})
                    <br />
                    <span className="text-gray-600">{w.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>No profile available. Create a profile to see it here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Search by Skill */}
      <div className="mb-8 border p-4 rounded">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-center">Search Projects by Skill</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter skill to search projects"
            value={skillQuery}
            onChange={(e) => setSkillQuery(e.target.value)}
            className="flex-grow border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={searchBySkill}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
        <ul className="mt-4 list-disc list-inside">
          {projectResults.map((project, i) => (
            <li key={i}>
              <strong>{project.title}</strong> - {project.description}
            </li>
          ))}
        </ul>
      </div>

      {/* General Search */}
      <div className="mb-8 border p-4 rounded">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-center">General Search</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search projects, skills, work..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={searchAll}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            Search
          </button>
        </div>
        {searchResults && (
          <>
            <h3 className="mt-4 font-semibold">Projects</h3>
            <ul className="list-disc list-inside">
              {searchResults.projects.map((p, i) => (
                <li key={i}>
                  <strong>{p.title}</strong> - {p.description}
                </li>
              ))}
            </ul>
            <h3 className="mt-4 font-semibold">Skills</h3>
            <ul className="list-disc list-inside">
              {searchResults.skills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
            <h3 className="mt-4 font-semibold">Work</h3>
            <ul className="list-disc list-inside">
              {searchResults.work.map((w, i) => (
                <li key={i}>
                  <strong>{w.role}</strong> at {w.company}
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


// import { useEffect, useState } from "react";
// import axios from "axios";

// // const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
// const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
// const BASE_URL = isLocalhost ? "http://localhost:5000" : process.env.REACT_APP_API_URL;


// function App() {
//   // Existing states
//   const [profile, setProfile] = useState(null);
//   const [skillQuery, setSkillQuery] = useState("");
//   const [projectResults, setProjectResults] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState(null);

//   // New state for create profile form
//   const [newProfile, setNewProfile] = useState({
//     name: "",
//     email: "",
//     education: "",
//     skills: "[]", // Input as JSON string for simplicity
//     projects: "[]",
//     work: "[]",
//     links: "{}"
//   });

//   useEffect(() => {
//     axios.get(`${BASE_URL}/profile`).then((res) => setProfile(res.data)).catch(console.error);
//   }, []);

//   // Existing search functions...
//   const searchBySkill = () => {
//     if (!skillQuery) return setProjectResults([]);
//     axios
//       .get(`${BASE_URL}/projects`, { params: { skill: skillQuery } })
//       .then((res) => setProjectResults(res.data))
//       .catch(console.error);
//   };

//   const searchAll = () => {
//     if (!searchQuery) return setSearchResults(null);
//     axios
//       .get(`${BASE_URL}/search`, { params: { q: searchQuery } })
//       .then((res) => setSearchResults(res.data))
//       .catch(console.error);
//   };

//   // New function to handle input changes for create profile form
//   const handleNewProfileChange = (e) => {
//     const { name, value } = e.target;
//     setNewProfile((prev) => ({ ...prev, [name]: value }));
//   };

//   // New function to submit create profile POST request
//   const createProfile = async () => {
//     try {
//       // Parse JSON fields before sending
//       const body = {
//         ...newProfile,
//         skills: JSON.parse(newProfile.skills),
//         projects: JSON.parse(newProfile.projects),
//         work: JSON.parse(newProfile.work),
//         links: JSON.parse(newProfile.links),
//       };
//       const res = await axios.post(`${BASE_URL}/profile`, body);
//       alert("Profile created successfully");
//       setProfile(res.data.profile || null);
//       // Optionally clear the form
//       setNewProfile({
//         name: "",
//         email: "",
//         education: "",
//         skills: "[]",
//         projects: "[]",
//         work: "[]",
//         links: "{}"
//       });
//     } catch (error) {
//       alert("Error creating profile: " + (error.response?.data?.error || error.message));
//     }
//   };

//   return (
//     <div className="font-sans m-8 max-w-4xl mx-auto">
//       <h1 className="text-4xl font-bold mb-6 text-center">Candidate Playground</h1>

//       {/* Create Profile Form */}
//       <div className="mb-16 border p-4 rounded">
//         <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-center">Create Profile</h2>
//         <div className="grid grid-cols-1 gap-4 ">
//           <input
//             type="text"
//             name="name"
//             placeholder="Name"
//             value={newProfile.name}
//             onChange={handleNewProfileChange}
//             className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={newProfile.email}
//             onChange={handleNewProfileChange}
//             className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <input
//             type="text"
//             name="education"
//             placeholder="Education"
//             value={newProfile.education}
//             onChange={handleNewProfileChange}
//             className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <textarea
//             name="skills"
//             placeholder='Skills as JSON array, e.g. ["JavaScript","Node.js"]'
//             value={newProfile.skills}
//             onChange={handleNewProfileChange}
//             rows={2}
//             className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <textarea
//             name="projects"
//             placeholder='Projects as JSON array of objects'
//             value={newProfile.projects}
//             onChange={handleNewProfileChange}
//             rows={3}
//             className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <textarea
//             name="work"
//             placeholder='Work as JSON array of objects'
//             value={newProfile.work}
//             onChange={handleNewProfileChange}
//             rows={3}
//             className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <textarea
//             name="links"
//             placeholder='Links as JSON object, e.g. {"github":"url","linkedin":"url"}'
//             value={newProfile.links}
//             onChange={handleNewProfileChange}
//             rows={2}
//             className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <button
//             onClick={createProfile}
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
//           >
//             Create Profile
//           </button>
//         </div>
//       </div>

//       {/* Existing profile display and search UI unchanged below */}
//       {profile ? (
//         // ... existing profile display JSX ...
//         <div className="mb-12">
//           <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Profile</h2>
//           <p className="mb-1">
//             <strong className="font-semibold">Name:</strong> {profile.name}
//           </p>
//           <p className="mb-1">
//             <strong className="font-semibold">Email:</strong> {profile.email}
//           </p>
//           <p className="mb-1">
//             <strong className="font-semibold">Education:</strong> {profile.education}
//           </p>
//           <p className="mb-4">
//             <strong className="font-semibold">Links:</strong>{" "}
//             {profile.links && (
//               <>
//                 <a href={profile.links.github} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline mr-2">
//                   GitHub
//                 </a>
//                 |
//                 <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline mx-2">
//                   LinkedIn
//                 </a>
//                 |
//                 <a href={profile.links.portfolio} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline ml-2">
//                   Portfolio
//                 </a>
//               </>
//             )}
//           </p>

//           <h3 className="text-xl font-semibold mb-2">Skills</h3>
//           <ul className="flex flex-wrap gap-2 mb-6">
//             {(profile.skills || []).map((s, i) => (
//               <li key={i} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
//                 {s}
//               </li>
//             ))}
//           </ul>

//           <h3 className="text-xl font-semibold mb-2">Projects</h3>
//           <ul className="list-disc list-inside mb-6">
//             {(profile.projects || []).map((p, i) => (
//               <li key={i} className="mb-2">
//                 <strong>{p.title}</strong> - {p.description}{" "}
//                 <a href={p.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline ml-1">
//                   Link
//                 </a>
//               </li>
//             ))}
//           </ul>

//           <h3 className="text-xl font-semibold mb-2">Work Experience</h3>
//           <ul className="list-disc list-inside">
//             {(profile.work || []).map((w, i) => (
//               <li key={i} className="mb-3">
//                 <strong>{w.role}</strong> at {w.company} ({w.from_date} - {w.to_date})
//                 <br />
//                 {w.description}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <p>Loading profile...</p>
//       )}

//       {/* Existing search by skill and search all JSX unchanged below */}
//       {/* ... */}
//     </div>
//   );
// }

// export default App;
