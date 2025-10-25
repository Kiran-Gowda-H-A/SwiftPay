import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ message, type = "success", show, onClose }) {
  const bg =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-gray-700";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          className={`${bg} fixed bottom-6 right-6 text-white px-4 py-2 rounded-lg shadow-lg flex items-center`}
        >
          <span>{message}</span>
          <button
            onClick={onClose}
            className="ml-3 text-sm font-semibold hover:underline"
          >
            Close
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
