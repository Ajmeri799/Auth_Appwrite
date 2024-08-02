import React, { useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import authService from "@/appwrite/auth";
import { Button } from "@/components/ui/button";

interface ProtectedRoute {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRoute> = ({ children }) => {
  const [user, setUser] = useState<{ email: string; name: string } | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const response = await authService.getCurrentUser();
      if (response) {
        setUser({
          email: response.email,
          name: response.name,
        });
      } else {
        navigate("/login");
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  if (!user) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="w-full">
      <div className=" flex justify-evenly">
        <div>
          <h1 className=" text-yellow-400 font-bold text-3xl">Welcome</h1>
          <h2 className=" text-xl font-bold">{user.name}</h2>
        </div>
        <div>
          <Button onClick={handleLogout}>LogOut</Button>
        </div>
      </div>
      {children}
    </div>
  );
};

export default ProtectedRoute;
