import React from "react";
import { useForm } from "react-hook-form";
import { SiOpenai, SiGoogle, SiPerplexity } from "react-icons/si";
import { FaRobot } from "react-icons/fa";

// 1. Dummy Data Object (Simulating "Selected" item)
const currentIntegration = {
  id: 1,
  name: "My OpenAI Key",
  provider: "openai",
  apiKey: "sk-1234567890abcdef",
};

// 2. Icon Map
const providerIcons = {
  openai: <SiOpenai className="text-emerald-400 text-3xl" />,
  gemini: <SiGoogle className="text-blue-400 text-3xl" />,
  perplexity: <SiPerplexity className="text-cyan-400 text-3xl" />,
  default: <FaRobot className="text-zinc-400 text-3xl" />,
};

const EditIntegrationForm = () => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: currentIntegration.name,
      apiKey: currentIntegration.apiKey,
    },
  });

  const onSubmit = (data) => {
    console.log("Updated Data:", { ...data, provider: currentIntegration.provider });
    alert("Integration updated! Check console.");
  };

  return (
    <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
      <h2 className="text-xl font-bold text-white mb-6">Edit Integration</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Logo Display instead of text */}
        <div className="flex items-center gap-4 p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
          <div className="w-16 h-16 flex items-center justify-center bg-zinc-900 rounded-xl border border-zinc-800">
            {providerIcons[currentIntegration.provider] || providerIcons.default}
          </div>
          <div>
            <p className="text-zinc-400 text-xs uppercase font-bold tracking-widest">Provider</p>
            <p className="text-white font-medium capitalize">{currentIntegration.provider}</p>
          </div>
        </div>

        {/* Input: Name */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Friendly Name</label>
          <input
            {...register("name", { required: true })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-white outline-none"
          />
        </div>

        {/* Input: API Key */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">New API Key</label>
          <input
            type="password"
            {...register("apiKey", { required: true })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white font-mono focus:ring-1 focus:ring-white outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditIntegrationForm;