import { toast} from "react-toastify";

export default function useToast (msg) {
    /**
     * 기본 Alert
     * @param {*} msg 
     * @returns 
     */
    const toastAlertDefault = (msg) => toast(msg);

    const toastAlertWarning = (msg) => toast.warn(msg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
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
    const toastAlertSuccessCallback = (msg, callback) => toast.success(msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        onClose: callback
        });

    const toastAlertError = (msg) => toast.error(msg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });

    return { toastAlertDefault, toastAlertWarning, toastAlertSuccess, toastAlertSuccessCallback, toastAlertError };

}
