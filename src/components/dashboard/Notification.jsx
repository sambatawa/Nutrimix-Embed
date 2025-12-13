import { motion, AnimatePresence } from "framer-motion";

export default function Notification({ show, message }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-4 right-4 bg-[#6C5F57] text-white px-5 py-3 rounded-xl shadow-lg"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
