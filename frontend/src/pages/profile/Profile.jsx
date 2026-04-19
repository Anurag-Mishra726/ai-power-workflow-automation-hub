import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { deleteProfileApi, getProfileApi } from "@/api/profile.api";
import { logoutApi } from "@/api/auth.api";
import useAuthStore from "@/stores/authStore";
import useWorkflowData from "@/stores/workflowDataStore";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((state) => state.logout);
  const clearData = useWorkflowData((state) => state.clearData);

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await getProfileApi();
      return response.data;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      logoutStore();
      clearData();
      navigate("/auth/login");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProfileApi,
    onSuccess: () => {
      logoutStore();
      clearData();
      toast.success("Account deleted successfully");
      navigate("/auth/signup");
    },
    onError: (error) => {
      toast.error(error || "Failed to delete account");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleDeleteAccount = () => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!shouldDelete) {
      return;
    }

    deleteMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center text-xl text-zinc-300">
        Loading profile...
      </div>
    );
  }

  return (
    <section className="profile-page mx-auto w-full max-w-5xl p-6 md:p-8 text-white">
      <div className="profile-card rounded-3xl border border-zinc-700 bg-zinc-950/80 p-6 md:p-8 shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">My Profile</h1>
        <p className="text-zinc-400 mb-8">Manage your account details and security settings.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* <InfoBlock label="User ID" value={data?.id} /> */}
          <InfoBlock label="Username" value={data?.username} />
          <InfoBlock label="Email" value={data?.email} />
          <InfoBlock
            label="Joined"
            value={data?.created_at ? new Date(data.created_at).toLocaleString() : "-"}
          />
          <InfoBlock
            label="Last Updated"
            value={data?.updated_at ? new Date(data.updated_at).toLocaleString() : "-"}
          />
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutMutation.isPending || deleteMutation.isPending}
            className="rounded-xl border border-zinc-600 px-5 py-3 font-semibold text-zinc-200 hover:bg-zinc-900 transition-colors disabled:opacity-50"
          >
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={logoutMutation.isPending || deleteMutation.isPending}
            className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-500 transition-colors disabled:opacity-50"
          >
            {deleteMutation.isPending ? "Deleting account..." : "Delete Account"}
          </button>
        </div>
      </div>
    </section>
  );
};

const InfoBlock = ({ label, value }) => {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900/80 p-4">
      <p className="text-zinc-400 text-sm">{label}</p>
      <p className="text-lg font-semibold break-words">{value || "-"}</p>
    </div>
  );
};

export default Profile;
