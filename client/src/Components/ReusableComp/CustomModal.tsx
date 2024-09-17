import { FC, ReactNode } from "react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const CustomModal: FC<CustomModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center  justify-center bg-black bg-opacity-50">
      <div className="bg-white relative p-6 rounded-lg shadow-lg">
        <button
          className="absolute text-4xl top-0 right-4 mt-2 mr-2 text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default CustomModal;
