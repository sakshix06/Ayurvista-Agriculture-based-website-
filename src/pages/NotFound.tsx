
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-green-500 to-green-600">
      <div className="text-center text-white max-w-md mx-4">
        <h1 className="text-9xl font-bold mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-xl mb-8 opacity-90">
          The page you're looking for doesn't exist in our virtual garden.
        </p>
        <div className="space-y-4">
          <Link to="/dashboard">
            <Button className="bg-white text-green-600 hover:bg-gray-100 mr-4">
              <Home className="mr-2" size={20} />
              Go Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              <ArrowLeft className="mr-2" size={20} />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
