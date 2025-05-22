
import React from "react";
import { useLocation } from "react-router-dom";

// Define the security codes for each user
export const SECURITY_CODES = {
  macha: ["MACH4-2X5P", "MACH4-7Y3Q"],
  veerendra: ["V33R-8K7Z", "V33R-9L2P"]
};

interface SpaceContextProps {
  userId: "macha" | "veerendra" | null;
  userSpace: "Macha" | "Veerendra" | "Both" | null;
  securityVerified: boolean;
  verifySecurityCode: (code: string) => boolean;
  getSpaceColor: () => string;
  clearAuthentication: () => void;
}

const SpaceContext = React.createContext<SpaceContextProps>({
  userId: null,
  userSpace: null,
  securityVerified: false,
  verifySecurityCode: () => false,
  getSpaceColor: () => "",
  clearAuthentication: () => {}
});

interface SpaceProviderProps {
  children: React.ReactNode;
}

export const SpaceProvider: React.FC<SpaceProviderProps> = ({ children }) => {
  const location = useLocation();
  const [userId, setUserId] = React.useState<"macha" | "veerendra" | null>(null);
  const [userSpace, setUserSpace] = React.useState<"Macha" | "Veerendra" | "Both" | null>(null);
  const [securityVerified, setSecurityVerified] = React.useState<boolean>(false);

  // Determine user from path whenever location changes
  React.useEffect(() => {
    if (location.pathname.includes("/macha")) {
      setUserId("macha");
      setUserSpace("Macha");
    } else if (location.pathname.includes("/veerendra")) {
      setUserId("veerendra");
      setUserSpace("Veerendra");
    } else {
      // For Dashboard and other pages, check if we have a previously verified user
      const savedUserId = localStorage.getItem("current-user-id");
      if (savedUserId === "macha" || savedUserId === "veerendra") {
        setUserId(savedUserId);
        setUserSpace(savedUserId === "macha" ? "Macha" : "Veerendra");
      } else {
        setUserId(null);
        setUserSpace("Both");
      }
    }

    // Check if security was previously verified
    if (userId) {
      const isVerified = localStorage.getItem(`${userId}-security-verified`) === 'true';
      setSecurityVerified(isVerified);
    } else {
      setSecurityVerified(true); // Default to true for "Both" space
    }
  }, [location.pathname, userId]);

  const verifySecurityCode = (code: string): boolean => {
    if (!userId) return false;

    const userCodes = SECURITY_CODES[userId];
    const isValid = userCodes.includes(code);

    if (isValid) {
      setSecurityVerified(true);
      localStorage.setItem(`${userId}-security-verified`, 'true');
      localStorage.setItem("current-user-id", userId);
    }

    return isValid;
  };

  const getSpaceColor = () => {
    switch (userSpace) {
      case "Macha":
        return "bg-purple-600";
      case "Veerendra":
        return "bg-blue-600";
      default:
        return "bg-slate-600";
    }
  };

  const clearAuthentication = () => {
    if (userId) {
      localStorage.removeItem(`${userId}-security-verified`);
    }
    localStorage.removeItem("current-user-id");
    setSecurityVerified(false);
  };

  return (
    <SpaceContext.Provider
      value={{
        userId,
        userSpace,
        securityVerified,
        verifySecurityCode,
        getSpaceColor,
        clearAuthentication
      }}
    >
      {children}
    </SpaceContext.Provider>
  );
};

export const useSpace = () => React.useContext(SpaceContext);
