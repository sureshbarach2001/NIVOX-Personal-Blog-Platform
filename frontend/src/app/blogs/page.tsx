"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import BlogCard from "@/components/BlogCard";
import { BlogPost } from "@/types";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"; // Added useEffect

export default function BlogsPage() {
  const router = useRouter();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [latticeNodes, setLatticeNodes] = useState<React.ReactNode[]>([]);

  // Generate lattice nodes only on client-side mount
  useEffect(() => {
    const nodes = Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-lumen-white/20 rounded-full animate-latticeNode"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
        }}
      />
    ));
    setLatticeNodes(nodes);
  }, []);

  const { data: blogs, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ["blogs"],
    queryFn: async () => {
      const { data } = await api.get("/blogs");
      return data;
    },
  });

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-depth-black">
        <Loader />
      </div>
    );
  }

  if (error || !blogs) {
    return (
      <p className="text-center text-lumen-white animate-depthFade bg-depth-black h-screen flex items-center justify-center font-mono text-xl">
        Error loading blogs
      </p>
    );
  }

  return (
    <div className="fixed inset-0 bg-depth-black flex flex-col overflow-hidden pt-[80px] z-10">
      {/* Infinite-Depth Lattice */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(20,20,30,0.9)_50%,rgba(0,0,0,1)_50%)] bg-[length:30px_30px] animate-latticeDrift">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(20,20,30,0.9)_50%,rgba(0,0,0,1)_50%)] bg-[length:30px_30px] animate-latticeDriftReverse" />
        <div className="absolute inset-0">{latticeNodes}</div>
      </div>

      {/* Heading Section */}
      <div className="fixed top-[80px] left-0 w-full min-h-[60px] sm:min-h-[80px] bg-[linear-gradient(45deg,rgba(0,200,255,0.2),rgba(255,0,200,0.2))] p-4 sm:p-6 shadow-[0_0_15px_rgba(0,200,255,0.5)] animate-depthEdge flex items-center justify-between z-60 shrink-0">
        <button
          onClick={handleBack}
          className="relative text-lumen-white font-mono px-4 py-2 hover:text-lumen-cyan transition-all duration-300 text-sm sm:text-base md:text-lg whitespace-nowrap"
        >
          Back
          <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-lumen-cyan transform scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-center" />
        </button>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono text-lumen-white tracking-wider animate-depthGlow text-center flex-1">
          All Blogs
        </h2>
        <div className="w-12 sm:w-16" /> {/* Spacer */}
      </div>

      {/* Blog Cards */}
      <div className="flex-1 w-full p-4 sm:p-6 overflow-y-auto z-10 mt-[60px] sm:mt-[80px]">
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 h-full">
          {blogs.map((blog, index) => (
            <div
              key={blog._id}
              className="relative transform transition-all duration-500 animate-paneRise flex items-center justify-center"
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <div
                className={`absolute inset-0 bg-[linear-gradient(45deg,rgba(0,200,255,0.2),rgba(255,0,200,0.2))] opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl ${
                  hoverIndex === index ? "animate-paneTrail" : ""
                }`}
                style={{
                  transform: `perspective(500px) rotateY(${hoverIndex === index ? 5 : 0}deg) rotateX(${hoverIndex === index ? -5 : 0}deg)`,
                }}
              />
              <div className="relative z-10 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(0,200,255,0.5)] transition-all duration-300 w-full">
                <BlogCard blog={blog} />
              </div>
              <div
                className="absolute inset-0 border border-lumen-cyan/20 rounded-xl animate-paneEdge"
                style={{
                  transform: `perspective(500px) rotateY(${hoverIndex === index ? 3 : 0}deg)`,
                  transition: "transform 0.3s ease-out",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        /* Custom Depth Colors */
        :global(:root) {
          --depth-black: #0A0A0F;
          --lumen-white: #E0F0FF;
          --lumen-cyan: #00C8FF;
          --lumen-magenta: #FF00C8;
        }
        .bg-depth-black {
          background-color: var(--depth-black);
        }
        .text-lumen-white {
          color: var(--lumen-white);
        }
        .text-lumen-cyan {
          color: var(--lumen-cyan);
        }
        .border-lumen-cyan {
          border-color: var(--lumen-cyan);
        }

        @keyframes latticeDrift {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 30px 30px;
          }
        }
        @keyframes latticeDriftReverse {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: -30px -30px;
          }
        }
        @keyframes latticeNode {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.5);
          }
        }
        @keyframes depthGlow {
          0%,
          100% {
            text-shadow: 0 0 5px rgba(0, 200, 255, 0.3);
          }
          50% {
            text-shadow: 0 0 10px rgba(0, 200, 255, 0.5),
              0 0 5px rgba(255, 0, 200, 0.5);
          }
        }
        @keyframes depthEdge {
          0%,
          100% {
            box-shadow: 0 0 15px rgba(0, 200, 255, 0.5);
          }
          50% {
            box-shadow: 0 0 25px rgba(0, 200, 255, 0.7),
              0 0 10px rgba(255, 0, 200, 0.7);
          }
        }
        @keyframes paneRise {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes paneTrail {
          0%,
          100% {
            opacity: 0.8;
            transform: perspective(500px) rotateY(5deg) rotateX(-5deg);
          }
          50% {
            opacity: 1;
            transform: perspective(500px) rotateY(7deg) rotateX(-7deg);
          }
        }
        @keyframes paneEdge {
          0%,
          100% {
            border-color: rgba(0, 200, 255, 0.2);
          }
          50% {
            border-color: rgba(0, 200, 255, 0.4);
          }
        }
        @keyframes depthFade {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-latticeDrift {
          animation: latticeDrift 25s linear infinite;
        }
        .animate-latticeDriftReverse {
          animation: latticeDriftReverse 25s linear infinite;
        }
        .animate-latticeNode {
          animation: latticeNode 3s ease-in-out infinite;
        }
        .animate-depthGlow {
          animation: depthGlow 2s ease-in-out infinite;
        }
        .animate-depthEdge {
          animation: depthEdge 3s ease-in-out infinite;
        }
        .animate-paneRise {
          animation: paneRise 0.5s ease-out forwards;
        }
        .animate-paneTrail {
          animation: paneTrail 1.5s ease-in-out infinite;
        }
        .animate-paneEdge {
          animation: paneEdge 2s ease-in-out infinite;
        }
        .animate-depthFade {
          animation: depthFade 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}