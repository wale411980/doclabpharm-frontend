import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the different possible user types
type BaseUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  emailVerifiedAt: string;
  status: "verified" | "unverified" | "banned";
  userType:
    | "user"
    | "admin"
    | "doctor"
    | "pharmacy"
    | "lab_technician"
    | "super_admin"; // match your backend if needed
};

type GeneralUser = BaseUser & { userType: "user" };
type Admin = BaseUser & { userType: "admin" };
type SuperAdmin = BaseUser & { userType: "super_admin" };
type Doctor = BaseUser & { userType: "doctor"; specialization?: string };
type Pharmacy = BaseUser & { userType: "pharmacy"; licenseId?: string };
type LabTechnician = BaseUser & {
  userType: "lab_technician";
  licenseId?: string;
};

export type AppUser =
  | GeneralUser
  | Admin
  | Doctor
  | Pharmacy
  | LabTechnician
  | SuperAdmin
  | null;

export type CartItem =
  | {
      service_type: "consult";
      service_id: number;
      doctor_id: number;
      slot_id: number;
      complaint: string;
      consultation_type: "Physical" | "Virtual";
      price: number;
      name: string;
      qty?: number;
    }
  | {
      service_type: "lab";
      service_id: number;
      lab_technician_id: number;
      date: string;
      time: string;
      price: number;
      name: string;
      qty?: number;
    }
  | {
      service_type: "med";
      product_id: number;
      qty: number;
      price: number;
      name: string;
    };

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateItem: (index: number, item: Partial<CartItem>) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
}

// Define context type
type AuthContextType = {
  user: AppUser;
  cartContext: CartContextType | undefined;
  login: (user: AppUser) => void;
  logout: () => void;
};

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  cartContext: undefined,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser>(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem("patient_cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("patient_cart", JSON.stringify(items));
    window.dispatchEvent(new Event("storage"));
  }, [items]);

  const addItem = (item: CartItem) => setItems((prev) => [...prev, item]);

  const updateItem = (index: number, changes: Partial<CartItem>) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? ({ ...item, ...changes } as CartItem) : item
      )
    );
  };

  const removeItem = (index: number) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems[index];

      // Get testBooking from localStorage
      const stored = localStorage.getItem("testBooking");
      if (stored && itemToRemove.service_type === "lab") {
        try {
          const testBooking = JSON.parse(stored);

          // Compare with current item
          const isSameTestBooking =
            testBooking?.id === itemToRemove.service_id &&
            testBooking?.labId === itemToRemove.lab_technician_id;

          if (isSameTestBooking) {
            localStorage.removeItem("testBooking");
          }
        } catch (e) {
          console.error("Error parsing testBooking from localStorage:", e);
        }
      }

      // Always remove item from cart
      return prevItems.filter((_, i) => i !== index);
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("testBooking");
  };

  const login = (user: AppUser) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
  };

  const cartContext: CartContextType = {
    items,
    addItem,
    updateItem,
    removeItem,
    clearCart,
  };

  return (
    <AuthContext.Provider value={{ user, cartContext, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
