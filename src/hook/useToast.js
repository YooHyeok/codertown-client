import { toast} from "react-toastify";

export default function useToast (msg) {
    /**
     * 기본 Alert
     * @param {*} msg 
     * @returns 
     */
    const toastAlertDefault = (msg) => toast(msg);

    const toastAlertSuccess = (msg) => toast.success(msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });

    const toastAlertError = (msg) => toast.error(msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });

    return { toastAlertDefault, toastAlertSuccess, toastAlertError };

}
