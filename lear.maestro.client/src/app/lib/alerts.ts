// lib/alerts.ts
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const SwalWithReact = withReactContent(Swal);
let currentPopupType: "autoClose" | "manuallyClose" = "autoClose";

export const showLoadingPopup = (message = "Loading...") => {
  currentPopupType = "autoClose";
  return SwalWithReact.fire({
    // icon: "info",
    title: "Please wait...",
    text: message,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const showSuccessPopup = (message = "Operation succedded") => {
  currentPopupType = "manuallyClose";
  return SwalWithReact.fire({
    icon: "success",
    title: "Success",
    text: message,
    confirmButtonText: "OK",
    allowOutsideClick: false,
  });
};

export const showErrorPopup = (message = "Operation failed") => {
  currentPopupType = "manuallyClose";
  return SwalWithReact.fire({
    icon: "error",
    title: "Error",
    text: message,
    confirmButtonText: "OK",
    allowOutsideClick: false,
  });
};

export const closePopup = () => {
  if (currentPopupType === "autoClose") {
    Swal.close();
    currentPopupType = "autoClose";
  }
};
