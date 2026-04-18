import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";
import { useGetApiKey, useUpdateApiKey } from "@/hooks/useAiIntegration";
import { AiIntegrationSchema } from "@/schemas/aiIntegrationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const providerIcons = {
  openai: "/openai.svg",
  gemini: "/gemini.svg",
  perplexity: "/perplexity.svg",
  //TODO: Add default icon for unknown providers
};

const EditIntegrationForm = () => {

  const { provider } = useParams();
  const navigate = useNavigate();
  const { data, isPending, isError } = useGetApiKey(provider);
  const { mutate, isPending: isSaving } = useUpdateApiKey();

  const { register, handleSubmit, reset, formState: { errors }, } = useForm({
    defaultValues: {
      name: "",
      provider: "",
      apiKey: "",
    },
    resolver: zodResolver(AiIntegrationSchema),
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.apiKey.name || "",
        provider: data.apiKey.provider || "",
        apiKey: data.apiKey.apiKey || "",
      });
    }
  }, [data, reset]);

  if(isPending){
    return (
      <div className="flex justify-center items-center mt-40">
        <LoadingState
            text="LOADING*DATA*"
            onHover="speedUp"
            spinDuration={20}
            className="custom-class"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center mt-40">
        <ErrorState/>
      </div>
    );
  }  

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("API Key Udated successfully.");
        navigate("/ai/integrations");
      },
      onError: (error) => {
        toast.error(error || "Something went wrong!");
      }
    });
  };

  return (
    <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
      <h2 className="text-xl font-bold text-white mb-6">Edit Integration</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Logo Display instead of text */}
        <div className="flex items-center gap-4 p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
          <div className="w-16 h-16 flex items-center justify-center bg-zinc-900 rounded-xl border border-zinc-800">
            <img src={providerIcons[data?.apiKey.provider] || providerIcons.default} alt="AI Provider" className="h-12 w-12" />
          </div>
          <div>
            <p className="text-zinc-400 text-xs uppercase font-bold tracking-widest">Provider</p>
            <p className="text-white font-medium capitalize">{data?.apiKey.provider}</p>
          </div>
        </div>

        {/* Input: Name */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Friendly Name</label>
          <input
            {...register("name", { required: true })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-white outline-none"
          />
          {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
        </div>

        {/* Input: API Key */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">New API Key</label>
          <input
            type="password"
            {...register("apiKey")}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white font-mono focus:ring-1 focus:ring-white outline-none"
          />
          {errors.apiKey && <span className="text-red-500 text-xs">{errors.apiKey.message}</span>}
        </div>

        <div className="w-full flex justify-between">
          <button
          type="button"
            className="w-1/4 py-3 text-center rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition"
            onClick={() => navigate("/ai/integrations")}
          >
            Cancle
          </button>
          <button
            type="submit"
            className="w-1/4 py-3 text-center rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition"
            disabled={isSaving}
          >
            Save 
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditIntegrationForm;