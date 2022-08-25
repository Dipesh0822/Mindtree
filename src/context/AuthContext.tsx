// ** React Imports
import { createContext, useEffect, useState, ReactNode } from "react";

// ** Next Import
import { useRouter } from "next/router";

// ** Axios
import axios from "axios";

// ** Config
import authConfig from "src/configs/auth";

import toast from "react-hot-toast";

// ** Defaults
const defaultProvider: any = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve(),
};

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<any | null>(defaultProvider.user);
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);
  const [isInitialized, setIsInitialized] = useState<boolean>(
    defaultProvider.isInitialized
  );

  // ** Hooks
  const router = useRouter();

  useEffect(() => {
    setIsInitialized(true);
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("userData") || "{}");
    if (Object.keys(user).length) {
      setUser({ ...user });
    }
    setLoading(false);
  }, []);

  const handleLogin = async (params: any, errorCallback?: any) => {
    try {
      const response = await fetch("http://54.226.108.109:3000/admin/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          EMAIL: params.email,
          PASSWORD: params.password,
        }),
      });

      if (response.status === 200) {
        const res = await response.json();
        if (res.status) {
          const data = Object.fromEntries(
            Object.entries(res.data).map(([k, v]) => [k.toLowerCase(), v])
          );
          console.log("data", data);
          setUser({ ...data });
          localStorage.setItem("userData", JSON.stringify(data));
          toast.success("Login Successfull");

          router.replace("/dashboard" as string);
        } else {
          toast.error("Unable to login. Please email and password");
        }
      }
    } catch (err: any) {
      if (errorCallback) errorCallback(err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsInitialized(false);
    window.localStorage.removeItem("userData");
    router.push("/login");
  };

  const handleRegister = (params: any, errorCallback?: any) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then((res) => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error);
        } else {
          handleLogin({ email: params.email, password: params.password });
        }
      })
      .catch((err: { [key: string]: string }) =>
        errorCallback ? errorCallback(err) : null
      );
  };

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
