import { motion } from "framer-motion";
import React from "react";

const ShootingStar: React.FC = () => {
  return (
    <motion.div
      style={{
        position: "absolute",
        width: "3px",
        height: "100px",
        background: "linear-gradient(white, transparent)",
        opacity: 0.8,
        transform: "rotate(-45deg)",
      }}
      initial={{ x: "100vw", y: "-10vh", opacity: 0 }}
      animate={{
        x: ["100vw", "-10vw"],
        y: ["-10vh", "100vh"],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatDelay: 5,
        ease: "linear",
      }}
    />
  );
};

export default ShootingStar;
