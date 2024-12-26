import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main
        className="flex-grow flex items-center justify-center bg-cover bg-center"
      >
        <div className="text-center">
          {/* Logo and Site Info */}
          <div className="flex flex-col items-center mb-4">
            <Image
              src="/logo.png"
              alt="GreenFuture Logo"
              width={250}
              height={250}
              className="mb-6" // Increased height and width
            />
            <h1 className="text-4xl font-bold text-teal-500">
              GreenFuture IMS-Connect
            </h1>
            <p className="text-md text-gray-300">
              Your trusted system for seamless inventory management.
            </p>
          </div>

          {/* Welcome Message */}
          <h2 className="text-3xl font-bold text-teal-500 mb-4">
            Welcome to IMS-Connect
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Please log in to access the system.
          </p>
          <a href="/login" className="font-large">
          <button className="bg-teal-500 hover:bg-teal-300 text-white py-3 px-6 rounded shadow-lg">
         
              Login
            
          </button>
          </a>

        </div>
      </main>
    </div>
  );
}