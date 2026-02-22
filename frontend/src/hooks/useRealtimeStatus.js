import { useInngestSubscription } from "@inngest/realtime/hooks";

export function ExecutionStatus() {
  const { latestData, state } = useInngestSubscription({
    channel: "http/request", 
    topics: ["status"],
    
    refreshToken: async () => {
      const response = await fetch("http://localhost:5000/api/realtime/token");// make the api for this or use tanstack query
      return response.json();
    },
  });

  console.log("Latest Data: ", latestData, "State: ", state);

//   const isTarget = latestData?.nodeId === nodeId;

//   return (
//     <div>
//       <p>Connection: {state}</p> {/* Shows "active" when connected */}
//       {isTarget && (
//         <div className="status-indicator">
//           Node Status: <strong>{latestData.status}</strong>
//         </div>
//       )}
//     </div>
//   );
}