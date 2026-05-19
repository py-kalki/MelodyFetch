import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      
      {/* watermark pill */}
      <a 
        href="https://www.vedanshh.dev"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-[999] bg-[#0a0a0a] text-gray-300 px-4 py-2 rounded-full text-xs sm:text-sm border border-white/10 shadow-xl hover:border-green-500/50 hover:text-white transition-all duration-300"
      >
        Designed and Developed by <span className="text-green-400">Vedanshh.dev</span>
      </a>
    </>
  );
}
