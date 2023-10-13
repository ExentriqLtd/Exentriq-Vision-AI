import ReactDOM from "react-dom";
import type { ModalPortalProps } from "~/types/backend/document";

const ModalPortal = ({ children }: ModalPortalProps) => {
  const domNode = document.getElementById("modal-root");
  return domNode ? ReactDOM.createPortal(children, domNode) : null;
};

export default ModalPortal;
