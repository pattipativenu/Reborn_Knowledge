"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const shakeVariants1 = {
  shake: {
    x: [0, -2, 2, -1, 1, 0],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "easeInOut",
    },
  },
};

const shakeVariants2 = {
  shake: {
    x: [0, 1.5, -1.5, 2, -2, 0],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "easeInOut",
    },
  },
};

const shakeVariants3 = {
  shake: {
    x: [0, -1, 1, -2, 2, -1, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "easeInOut",
    },
  },
};

const shakeVariants4 = {
  shake: {
    x: [0, 2, -1, 1.5, -2, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "easeInOut",
    },
  },
};

const shakeVariants5 = {
  shake: {
    x: [0, -1.5, 1, -1, 2, -2, 0],
    transition: {
      duration: 0.7,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "easeInOut",
    },
  },
};

const getVariants = (index: number) => {
  const variants = [
    shakeVariants1,
    shakeVariants2,
    shakeVariants3,
    shakeVariants4,
    shakeVariants5,
  ];
  return variants[index % variants.length];
};

const getRandomDelay = () => Math.random() * 2;

const FuzzyWrapper = ({
  children,
  baseIntensity = 0.3,
  className,
}: {
  children: React.ReactNode;
  baseIntensity?: number;
  className?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement & { cleanupFuzzy?: () => void }>(
    null
  );
  const svgContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let isCancelled = false;
    const canvas = canvasRef.current;
    const svgContainer = svgContainerRef.current;

    if (!canvas || !svgContainer) return;

    // Clean up previous animation if it exists
    if (canvas.cleanupFuzzy) {
      canvas.cleanupFuzzy();
    }

    const init = async () => {
      if (isCancelled) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Get the SVG element
      const svgElement = svgContainer.querySelector("svg");
      if (!svgElement) return;

      // Wait for fonts and animations to be ready
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Get SVG dimensions
      const svgRect = svgElement.getBoundingClientRect();
      const svgWidth = svgRect.width || 800;
      const svgHeight = svgRect.height || 232;

      // Create offscreen canvas
      const offscreen = document.createElement("canvas");
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      offscreen.width = svgWidth;
      offscreen.height = svgHeight;

      // Convert SVG to canvas
      const convertSvgToCanvas = () => {
        return new Promise<void>((resolve) => {
          const svgData = new XMLSerializer().serializeToString(svgElement);
          const img = new Image();
          const svgBlob = new Blob([svgData], {
            type: "image/svg+xml;charset=utf-8",
          });
          const url = URL.createObjectURL(svgBlob);

          img.onload = () => {
            offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
            offCtx.drawImage(img, 0, 0, svgWidth, svgHeight);
            URL.revokeObjectURL(url);
            resolve();
          };

          img.src = url;
        });
      };

      // Setup main canvas
      const horizontalMargin = 50;
      const verticalMargin = 50;
      canvas.width = svgWidth + horizontalMargin * 2;
      canvas.height = svgHeight + verticalMargin * 2;

      const fuzzRange = 20;

      const run = async () => {
        if (isCancelled) return;

        // Re-render SVG to capture animation changes
        await convertSvgToCanvas();

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(horizontalMargin, verticalMargin);

        // Apply fuzzy effect line by line
        for (let j = 0; j < svgHeight; j++) {
          const dx = Math.floor(
            baseIntensity * (Math.random() - 0.5) * fuzzRange
          );
          ctx.drawImage(offscreen, 0, j, svgWidth, 1, dx, j, svgWidth, 1);
        }

        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        animationFrameId = window.requestAnimationFrame(run);
      };

      run();

      const cleanup = () => {
        window.cancelAnimationFrame(animationFrameId);
      };

      canvas.cleanupFuzzy = cleanup;
    };

    init();

    return () => {
      isCancelled = true;
      window.cancelAnimationFrame(animationFrameId);
      if (canvas && canvas.cleanupFuzzy) {
        canvas.cleanupFuzzy();
      }
    };
  }, [baseIntensity]);

  return (
    <div className="relative">
      {/* Hidden SVG container for rendering */}
      <div
        ref={svgContainerRef}
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{ zIndex: -1 }}
      >
        {children}
      </div>

      {/* Canvas with fuzzy effect */}
      <canvas
        ref={canvasRef}
        className={className}
        style={{ display: "block" }}
      />
    </div>
  );
};

interface Glitchy404Props {
  width?: number;
  height?: number;
  color?: string;
}

export function Glitchy404({ width = 860, height = 232, color = "#fff" }: Glitchy404Props) {
  return (
    <FuzzyWrapper baseIntensity={0.4} className="cursor-pointer">
      <div className="relative">
        <svg
          width={width}
          height={height}
          viewBox="0 0 100 29"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
          className="cursor-pointer fill-current text-white"
          
        >
          {/* First "4" - Multiple chunks for variety */}
          <motion.g
            variants={getVariants(0)}
            animate="shake"
            transition={{ delay: getRandomDelay() }}
          >
            <path
              d="M28.364 12.4511V10.8261H25.926V9.95106L23.814 10.0511V18.6511H25.926C25.926 18.6881 28.364 18.7131 28.364 18.7131V13.1511H25.926V12.4511H28.364Z"
              fill={color}
            />
          </motion.g>

          <motion.g
            variants={getVariants(1)}
            animate="shake"
            transition={{ delay: getRandomDelay() }}
          >
            <path
              d="M26.3093 4.62023V9.79523H23.8713V10.3082L21.7583 10.4082V6.08223L17.2083 10.6332L10.4453 10.9582L10.5453 10.8582C10.5703 10.8582 10.5703 10.6702 10.5703 10.6702H15.0583V9.79523H11.6083L14.1833 7.22023H11.0203V5.29523H18.3203V4.00723H17.4013L18.5383 2.87023H22.4013V1.88223H19.5213L19.5713 1.83223C20.1226 1.27892 20.8257 0.90175 21.5916 0.748521C22.3574 0.595292 23.1515 0.672907 23.8732 0.971528C24.595 1.27015 25.2117 1.77633 25.6454 2.4259C26.0791 3.07547 26.3102 3.83919 26.3093 4.62023Z"
              fill={color}
            />
          </motion.g>

          <motion.g
            variants={getVariants(2)}
            animate="shake"
            transition={{ delay: getRandomDelay() }}
          >
            <path
              d="M30.8166 20.2344V23.5344H27.9536V24.7844H26.4036V28.7964H21.8536V24.7854H5.96562C5.33949 24.7839 4.72271 24.6334 4.16627 24.3463C3.60983 24.0592 3.12972 23.6438 2.76562 23.1344H17.8536V22.2344H7.60262C7.70273 22.5113 7.8418 22.7726 8.01562 23.0104H4.30263V22.2344H2.29062C2.10958 21.7898 2.0162 21.3144 2.01562 20.8344V20.4224C2.02388 20.2379 2.04459 20.0541 2.07763 19.8724H5.61562V19.1344H2.25262C2.37715 18.7691 2.55399 18.4239 2.77762 18.1094L9.06563 18.1844L7.40263 19.8474C7.39063 19.8974 7.37762 19.9344 7.36562 19.9844H7.26562L7.01562 20.2344H21.8536V19.1344H22.0286V18.5344H23.9666V18.3594L26.4036 18.3844V20.2344H30.8166Z"
              fill={color}
            />
          </motion.g>

          {/* "0" - Center piece, broken into chunks */}
          <motion.g
            variants={getVariants(3)}
            animate="shake"
            transition={{ delay: getRandomDelay() }}
          >
            <path
              d="M12.5 10.6011L9.988 13.1141H11.813V13.7271H0V15.2141H7.888L5.138 17.9641C4.99144 18.1108 4.85762 18.2697 4.738 18.4391L11.026 18.5141L19.264 10.2761L12.5 10.6011Z"
              fill={color}
            />
          </motion.g>

          <motion.g
            variants={getVariants(4)}
            animate="shake"
            transition={{ delay: getRandomDelay() }}
          >
            <path
              d="M64.3244 7.02188V8.33387L59.7744 8.54688V8.45988L59.6744 8.55987L57.4614 8.65987V7.59688H54.1864L56.5614 5.23388H41.9734C41.4695 5.23388 40.9863 5.43405 40.6299 5.79037C40.2736 6.14669 40.0734 6.62996 40.0734 7.13387V9.52187L35.5234 9.73488V7.02188C35.5258 5.33848 36.1956 3.72472 37.3859 2.53438C38.5763 1.34404 40.19 0.674256 41.8734 0.671875H57.9734C59.2397 0.677349 60.4757 1.05938 61.5242 1.76935C62.5727 2.47933 63.3863 3.48516 63.8614 4.65888H57.4614V6.08388H64.2244C64.2824 6.39342 64.3159 6.70706 64.3244 7.02188Z"
              fill={color}
            />
          </motion.g>

          <motion.g
            variants={getVariants(5)}
            animate="shake"
            transition={{ delay: getRandomDelay() }}
          >
            <path
              d="M64.4192 19.138V22.451C64.4179 23.3345 64.2305 24.2078 63.8692 25.014H54.5972V25.826H63.4352C62.8647 26.7347 62.0732 27.4841 61.1347 28.0042C60.1962 28.5242 59.1412 28.798 58.0682 28.8H47.0302V27.214H41.1302C42.101 27.8964 43.2566 28.2669 44.4432 28.276H39.0672V27.214H37.8172C37.1302 26.6244 36.5782 25.8939 36.1986 25.072C35.819 24.2502 35.6207 23.3563 35.6172 22.451V18.5L40.1682 18.55V21.025L42.6182 18.575L48.9802 18.65L43.3972 24.239H57.9562C58.4615 24.2398 58.9466 24.0403 59.3052 23.6842C59.6637 23.3281 59.8665 22.8443 59.8692 22.339V18.789L62.1442 18.814V19.139L64.4192 19.138Z"
              fill={color}
            />
          </motion.g>

          {/* Second "4" - Right side, multiple chunks */}
          <motion.g
            variants={getVariants(6)}
            animate="shake"
            transition={{ delay: getRandomDelay() }}
          >
            <path
              d="M66.377 11.9641V7.97606L61.827 8.18906V19.1141L64.102 19.1391V18.6521H66.377V13.9141H64.4V11.9641H66.377Z"
              fill={color}
            />
          </motion.g>

          <motion.g
            variants={getVariants(7)}
            animate="shake"
            transition={{ delay: getRandomDelay() }}
          >
            <path
              d="M93.5104 4.22761V6.89061L91.7734 6.97761V6.77761H88.9604V6.07761L88.2604 6.77761H86.3994V7.24061L81.0994 7.50261L82.0494 6.55261H80.8594V5.89061H82.7104L83.2354 5.36561H88.5104V4.65261H83.9474L86.7724 1.82761C87.3253 1.27765 88.028 0.902648 88.7926 0.749359C89.5573 0.59607 90.3502 0.671278 91.0724 0.965606C91.9519 1.33339 92.6674 2.00877 93.0854 2.86561H88.0224V4.00261H93.4604C93.4712 4.07709 93.4755 4.15237 93.4734 4.22761H93.5104Z"
              fill={color}
            />
          </motion.g>

          <motion.g
            variants={getVariants(8)}
            animate="shake"
            transition={{ delay: getRandomDelay() }}
          >
            <path
              d="M98.0208 23.3864V22.7234H94.8968V21.7484H96.5218V22.6364H98.2217V21.7234H98.0218V20.2354H93.6077V19.1734L89.0577 19.1234V20.2354H74.2188L75.4818 18.9604L69.5318 18.8984C69.3287 19.3814 69.2224 19.8995 69.2188 20.4234V20.8354C69.2209 21.8825 69.6377 22.8861 70.378 23.6265C71.1182 24.367 72.1217 24.7841 73.1687 24.7864H89.0577V27.2114H90.9827V27.9484H89.0577V28.7984H93.6077V24.7864H94.8968V25.1364H99.2848V23.3864H98.0208ZM89.1827 23.5364H81.6318V22.7234H89.1827V23.5364ZM92.9327 21.7484H86.4967V21.0234H92.9348L92.9327 21.7484ZM96.5198 24.5484H96.2698V23.5364H96.5198V24.5484Z"
              fill={color}
            />
          </motion.g>

          {/* Additional smaller chunks for extra detail */}
          <motion.g
            variants={getVariants(9)}
            animate="shake"
            transition={{ delay: getRandomDelay() }}
          >
            <path
              d="M80.4 16.3271L89.5 7.23906H88.45V6.88906L83.15 7.15106L81.763 8.53906H83.225V9.96406H81.054L81.542 9.47606H75.491V10.8011H79.5L77.187 13.1141H79.238V14.7271H76.3L77.3 13.7271H74.579V15.2141H75.091L72.341 17.9641C71.9813 18.3283 71.693 18.7567 71.491 19.2271L77.441 19.2891L79.154 17.5771H77.6V16.3271H80.4Z"
              fill={color}
            />
          </motion.g>

          <motion.g
            variants={getVariants(10)}
            animate="shake"
            transition={{ delay: getRandomDelay() }}
          >
            <path
              d="M94.363 17.8771V18.6521H92.205V17.5771H95.567V6.53906L93.83 6.62606V7.23906H91.017V19.4521L95.567 19.5021V18.8641H97.08V17.8771H94.363Z"
              fill={color}
            />
          </motion.g>

          {/* Smaller detail chunks */}
          <motion.g
            variants={getVariants(11)}
            animate="shake"
            transition={{ delay: getRandomDelay() }}
          >
            <path
              d="M65.34 16.3271V17.3521H62.853V16.3271H65.34ZM59.516 8.30106V8.53906H57.566L57.7 8.40106L55.362 8.51406C55.2213 8.53483 55.0791 8.5432 54.937 8.53906L46.637 16.8391H47.8V17.1891H47.174V18.3271H45.152L44.577 18.9021L50.94 18.9771L61.728 8.20106L59.516 8.30106Z"
              fill={color}
            />
          </motion.g>

          <motion.g
            variants={getVariants(12)}
            animate="shake"
            transition={{ delay: getRandomDelay() }}
          >
            <path
              d="M40.5 13.5141V12.6641H38.765V13.5141H37.577V18.8271L42.127 18.8771V13.5141H40.5ZM37.575 9.37606V9.43906H39.863V10.3141H38.452V10.5011H37.577V11.9641H42.127V9.16406L37.575 9.37606Z"
              fill={color}
            />
          </motion.g>

          {/* Tiny detail chunks */}
          <motion.g
            variants={getVariants(13)}
            animate="shake"
            transition={{ delay: getRandomDelay() }}
          >
            <path
              d="M67.252 18.8641V19.1771L69.652 19.2021V18.8641H67.252ZM44.725 12.6641V14.1011H46.25V12.6641H44.725ZM35.2099 23.3906V25.1406H31.4219V24.5526H34.0849V23.3906H35.2099Z"
              fill={color}
            />
          </motion.g>

          <motion.g
            variants={getVariants(14)}
            animate="shake"
            transition={{ delay: getRandomDelay() }}
          >
            <path
              d="M88.1833 26.8047H87.3203V27.4797H88.1833V26.8047ZM69.063 24.75V25.513H64.375C64.5321 25.2698 64.6698 25.0147 64.787 24.75H69.063ZM69.6578 19.2047V19.6297H67.2578V19.1797L69.6578 19.2047Z"
              fill={color}
            />
          </motion.g>

          <motion.g
            variants={getVariants(15)}
            animate="shake"
            transition={{ delay: getRandomDelay() }}
          >
            <path
              d="M57.8422 8.26562L57.7052 8.40262L55.3672 8.51562V8.26562H57.8422ZM61.7266 8.20156L61.8266 8.10156V8.18956L61.7266 8.20156ZM71.7125 5.53906V6.86406H67.1625C67.0977 6.4103 66.9802 5.96563 66.8125 5.53906H71.7125Z"
              fill={color}
            />
          </motion.g>

          <motion.g
            variants={getVariants(16)}
            animate="shake"
            transition={{ delay: getRandomDelay() }}
          >
            <path
              d="M31.927 13.1141V13.7521H35.114V13.1141H31.927ZM67.254 12.6641V14.4641H71.4V12.6641H67.254ZM31.927 10.3141V11.6011H34.064V10.3141H31.927Z"
              fill={color}
            />
          </motion.g>
        </svg>
      </div>
    </FuzzyWrapper>
  );
}