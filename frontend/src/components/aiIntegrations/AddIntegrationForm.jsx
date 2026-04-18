import React from "react";
import { useForm } from "react-hook-form";
import { useAddApiKey } from "@/hooks/useAiIntegration";
import { AiIntegrationSchema } from "@/schemas/aiIntegrationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const providers = [
  { id: "openai", name: "OpenAI", icon: "/openai.svg"  },
  { id: "gemini", name: "Google Gemini", icon: "/gemini.svg" },
  { id: "perplexity", name: "Perplexity", icon: "/perplexity.svg" },
];

const AddIntegrationForm = () => {
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    // defaultValues: {
    //   provider: "openai",
    //   name: "",
    //   apiKey: "",
    // },
    resolver: zodResolver(AiIntegrationSchema),
  });

  const { mutate, isPending } = useAddApiKey();
  const navigate = useNavigate();

  const selectedProvider = watch("provider");

  const onSubmit = (data) => {
    
    mutate(data, {
      onSuccess: () => {
        toast.success("API Key added successfully.");
        reset();
        navigate("/ai/integrations");
      },
      onError: (error) => {
        toast.error(error || "Failed to add API Key.");
      }
    });
     
  };

  return (
      <div className="max-w-screen-sm mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white">New Integration</h2>
          <p className="text-zinc-400 text-sm mt-1">Configure your AI provider settings.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Provider Selection (Custom UI) */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              1. Choose Provider
            </label>
            <div className="grid grid-cols-3 gap-3">
              {providers.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setValue("provider", p.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200 group ${
                    selectedProvider === p.id
                      ? " border-white text-white shadow-lg shadow-white"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  <div className="text-2xl">
                    <img src={p.icon} alt="AI Provider" className="h-12 w-12" />
                  </div>
                  <span className="text-sm font-bold uppercase">{p.id}</span>
                </button>
              ))}
            </div>
            {errors.provider && <span className="text-red-500 text-xs">{errors.provider.message}</span>}
          </div>

          {/* Input: Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              2. Integration Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="Production Key"
              className={`w-full bg-zinc-950 border ${errors.name ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-4 py-3.5
              text-white focus:outline-none focus:ring-2 focus:ring-white/10 transition`}
            />
            {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
          </div>

          {/* Input: API Key */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              3. API Key
            </label>
            <input
              type="password"
              {...register("apiKey", { 
                  required: "API Key is required",
              })}
              placeholder="sk-••••••••••••"
              className={`w-full bg-zinc-950 border ${errors.apiKey ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-4 py-3.5
              text-white font-mono focus:outline-none focus:ring-2 focus:ring-white/10 transition`}
            />
            {errors.apiKey && <span className="text-red-500 text-xs">{errors.apiKey.message}</span>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-zinc-200 transition-all active:scale-[0.98] 
            shadow-xl shadow-white/5"
            disabled={isPending}
          >
            Complete Integration
          </button>
        </form>
      </div>
  );
};

export default AddIntegrationForm;
