import EmptyState from "./EmptyState";
import IntegrationCard from "./IntegrationCard";
import { useGetAllIntegrations } from "@/hooks/useIntegration";
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";

const IntegrationMain = () => {
  const { data, isPending, isError } = useGetAllIntegrations();

  if(isPending){
    return (
      <div className="flex justify-center items-center mt-40">
        <LoadingState
            text="LOADING*AI*INTEGRATIONS*"
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

  const isEmpty = data.allApiKeys.length === 0;

  return (
    <>
      {
        isEmpty ? (
          <EmptyState />
        ) : (
          <IntegrationCard data={data.allApiKeys} />
        )
      }  
    </>
  );
}

export default IntegrationMain;
