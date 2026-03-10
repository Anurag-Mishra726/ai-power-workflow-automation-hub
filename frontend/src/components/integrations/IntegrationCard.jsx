import { SiOpenai, SiGoogle } from "react-icons/si";
import { FaRobot, FaRegCopy, FaTrashAlt } from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";

const connections = [
  { id: 1, name: "My OpenAI Key", provider: "openai", apiKey: "sk-abcde123456789", created_at: "2026-03-10", status: "Active" },
  { id: 2, name: "Gemini Personal", provider: "gemini", apiKey: "AIzaSyABCDE123456", created_at: "2026-03-09", status: "Active" },
  { id: 3, name: "AI Testing Key", provider: "unknown", apiKey: "test12345ABCDE", created_at: "2026-03-08", status: "Inactive" }
];

const providerIcons = {
  openai: <SiOpenai className="text-emerald-400" />,
  gemini: <SiGoogle className="text-blue-400" />,
  default: <FaRobot className="text-zinc-400" />
};

const IntegrationCard = () => {
  const maskKey = (key) => `•••• •••• ${key.slice(-4)}`;

  return (
    <div className="  p-5 text-zinc-100 font-sans">
      <div className=" mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Integrations</h1>
            <p className="text-zinc-500 mt-1">Manage your API connections and provider keys.</p>
          </div>
          <button className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors text-sm">
            + Add Integration
          </button>
        </div>

        {/* Integration List */}
        <div className="grid gap-4">
          {connections.map((conn) => (
            <div
              key={conn.id}
              className="group flex items-center justify-between bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-200"
            >
              {/* Left: Icon & Info */}
              <div className="flex items-center gap-5">
                <div className="bg-zinc-800 w-12 h-12 flex items-center justify-center rounded-xl border border-zinc-700 text-2xl group-hover:scale-105 transition-transform">
                  {providerIcons[conn.provider] || providerIcons.default}
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{conn.name}</h3>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      conn.status === 'Active' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10' : 'border-zinc-700 text-zinc-500 bg-zinc-800'
                    }`}>
                      {conn.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded">
                      {maskKey(conn.apiKey)}
                    </code>
                    <button className="text-zinc-600 hover:text-zinc-300 transition-colors">
                      <FaRegCopy size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                <p className="text-xs text-zinc-600 mr-4 hidden sm:block">
                  Added {new Date(conn.created_at).toLocaleDateString()}
                </p>
                <button className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition">
                  <HiOutlineExternalLink size={20} />
                </button>
                <button className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition">
                  <FaTrashAlt size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntegrationCard;