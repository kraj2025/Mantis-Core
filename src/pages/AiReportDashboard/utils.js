import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
 
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const RedirectURL = (url) => {
  window.open(`${baseurl}/${url}`, "_blank");
  window.focus();
};

export const maxLengthChecker = (str, maxLength) => {
  return str.length > maxLength
    ? isMobile
      ? str
      : str.substring(0, maxLength) + "..."
    : str;
};

export const ReportAIChatPdfAPI = async (payload) => {
    try {
      const option = {
        method: "post",
        data:payload
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.ReportAIChatPdf}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };