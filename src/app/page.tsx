
export default function Home() {
  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <nav className="flex flex-col items-center">
          <a href="/about" className="mb-4 text-blue-500 hover:underline">
            About
          </a>
          <a href="/contact" className="text-blue-500 hover:underline">
            Contact
          </a>
        </nav>
        <div className="mt-8 text-center">
          </div>
    </div>
    </>
  );
}
