import { RiOpenaiFill, RiPerplexityFill, RiGeminiFill, RiWebhookFill  } from "react-icons/ri";
import { SiGoogleforms, SiSlack, SiGmail, SiGoogledrive, SiGithub  } from "react-icons/si";
import { SlGlobe } from "react-icons/sl";;
import { FiMousePointer } from "react-icons/fi";

const IconMap = {
    manual: FiMousePointer,
    http: SlGlobe,
    httpWebhook: RiWebhookFill,
    googleForm: SiGoogleforms,
    gmail: SiGmail,
    googleDrive: SiGoogledrive,
    slack: SiSlack,
    openAI: RiOpenaiFill,
    perplexityAI: RiPerplexityFill,
    geminiAI: RiGeminiFill,
    github: SiGithub,
}

export default IconMap;
