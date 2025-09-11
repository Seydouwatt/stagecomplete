import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Login, Register } from "./pages";
import { ROUTES } from "./constants";

// Composant Dashboard temporaire
const Dashboard = () => (
  <div className="min-h-screen bg-base-100 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">🎭 Dashboard</h1>
      <p className="text-lg text-base-content/70">
        Bienvenue sur StageComplete !
      </p>
    </div>
  </div>
);

function App() {
  return (
    <div data-theme="stagecomplete">
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />

          {/* Dashboard Route */}
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />

          {/* Default redirect */}
          <Route
            path={ROUTES.HOME}
            element={<Navigate to={ROUTES.LOGIN} replace />}
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

// ----------------------------------------2nd EDIT----------------------------------------
// import { useState } from "react";
// import "./App.css";

// function App() {
//   const [count, setCount] = useState(0);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
//       <div className="card w-96 bg-base-100 shadow-xl">
//         <div className="card-body">
//           <h2 className="card-title text-2xl font-bold text-center justify-center">
//             🎭 StageComplete
//           </h2>
//           <p className="text-center text-base-content/70">
//             TailwindCSS + DaisyUI configuré avec succès !
//           </p>

//           <div className="flex flex-col gap-4 mt-6">
//             <button
//               className="btn btn-primary"
//               onClick={() => setCount((count) => count + 1)}
//             >
//               Compteur: {count}
//             </button>

//             <div className="flex gap-2">
//               <button className="btn btn-secondary flex-1">Artiste</button>
//               <button className="btn btn-accent flex-1">Venue</button>
//             </div>

//             <div className="alert alert-success">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="stroke-current shrink-0 h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <span>Configuration réussie!</span>
//             </div>
//           </div>

//           <div className="card-actions justify-end mt-4">
//             <button className="btn btn-ghost btn-sm">Documentation</button>
//             <button className="btn btn-primary btn-sm">Commencer</button>
//           </div>
//           <div className="mt-4">
//             <p className="text-sm text-base-content/50">
//               🚀 Ready for authentication pages!
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
// ----------------------------------------1rst EDIT----------------------------------------
// import { useState } from "react";
// import "./App.css";

// function App() {
//   const [count, setCount] = useState(0);

//   return (
//     <div className="min-h-screen bg-base-100" data-theme="stagecomplete">
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center">
//           <h1 className="text-4xl font-bold text-primary mb-4">
//             🎭 StageComplete
//           </h1>
//           <p className="text-lg text-base-content/70 mb-8">
//             La première plateforme complète de l'écosystème artistique
//           </p>

//           <div className="card w-96 bg-base-100 shadow-xl mx-auto">
//             <div className="card-body">
//               <h2 className="card-title justify-center">Frontend Setup ✅</h2>
//               <p>React + Vite + TailwindCSS + DaisyUI</p>

//               <div className="my-4">
//                 <button
//                   className="btn btn-primary"
//                   onClick={() => setCount((count) => count + 1)}
//                 >
//                   Count is {count}
//                 </button>
//               </div>

//               <div className="flex gap-2 justify-center">
//                 <div className="badge badge-primary">React 18</div>
//                 <div className="badge badge-secondary">Vite</div>
//                 <div className="badge badge-accent">TailwindCSS</div>
//                 <div className="badge badge-info">DaisyUI</div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
