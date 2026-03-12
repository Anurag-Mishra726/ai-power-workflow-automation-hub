import CopyToClipboard from "../common/CopyToClipboard";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useDeleteApiKey } from "@/hooks/useIntegration";
import toast from "react-hot-toast";

const providerIcons = {
  openai: "/openai.svg",
  gemini: "/gemini.svg",
  perplexity: "/perplexity.svg",
  //TODO: Add default icon for unknown providers
};

const IntegrationCard = ({data}) => {

  const { mutate, isPending } = useDeleteApiKey();
  const navigate = useNavigate();

  const maskKey = (key) => `•••• •••• ${key.slice(-4)}`;

  const handleDelete = (provider) => {
    mutate(provider, {
      onSuccess: () => {
        toast.success("API key deleted successfully.");
      },
      onError: (error) => {
        toast.error(error || "Something went wrong!");
      }
    });
  }

  return (
    <div className="  p-5 text-zinc-100 font-sans">
      <div className=" mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Integrations</h1>
            <p className="text-zinc-400 mt-1">Manage your API connections and provider keys.</p>
          </div>
          <button className="flex items-center gap-1 bg-white text-black px-4 py-2 rounded-lg font-medium
           hover:bg-blue-500 hover:text-white transition-colors "
            onClick={() => navigate("/integrations/add/new/apikey")}
          >
            <FaPlus size={14} /> 
            <span className="text-lg">Add Integration</span>
          </button>
        </div>

        {/* Integration List */}
        <div className="grid gap-4">
          {data.map((conn) => (
            <div
              key={conn.id}
              className="group flex items-center justify-between bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-200"
            >
              {/* Left: Icon & Info */}
              <div className="flex items-center gap-5">
                <div className="bg-zinc-950 w-12 h-12 flex items-center justify-center rounded-xl border border-zinc-700 text-2xl group-hover:scale-105 transition-transform">
                  <img src={providerIcons[conn.provider]} alt="AI Provider" className="h-7 w-7" />
                </div>

                <div>
                  <div>
                    <h3 className="font-semibold text-lg">{conn.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 border rounded-md border-zinc-800">
                      {maskKey(conn.apiKey)}
                    </code>
                    <div className="">
                      <CopyToClipboard text={conn.apiKey} size={12}/>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                <p className="text-xs text-zinc-400 mr-4 hidden sm:block">
                  Added {new Date(conn.createdAt).toLocaleDateString()}
                </p>
                <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition"
                  onClick={() => navigate(`/integrations/edit/${conn.provider}/apikey`)}
                >
                  <HiOutlineExternalLink size={20} />
                </button>
                <button className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition"
                  onClick={() => handleDelete(conn.provider)} 
                  disabled={isPending}
                >
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