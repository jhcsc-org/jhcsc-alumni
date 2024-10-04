
import { AuthActionResponse, AuthProvider, useNavigation } from "@refinedev/core";
import { supabaseClient } from "./utility";

type RawUserMetaData = {
  first_name: string;
  middle_name: string;
  last_name: string;
  birth_date: string;
  degree_id: number;
  year_batch: number;
  year_graduation: number;
  profile_description: string;
  location: string;
  profile_picture: string;
}

interface RegisterParams {
  email: string;
  password: string;
  options: {
    data: RawUserMetaData;
  };
}

interface ExtendedAuthProvider extends Omit<AuthProvider, "register"> {
  register: (params: RegisterParams) => Promise<AuthActionResponse>;
}

function formatDate(date: string | Date): string {
  return new Date(date).toISOString().split('T')[0];
}

function parseInteger(value: string | number): number {
  return Number(value);
}

const authProvider: ExtendedAuthProvider = {
  login: async ({ email, password, providerName }) => {
    try {
      if (providerName) {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
          provider: providerName,
        });

        if (error) {
          return { success: false, error };
        }

        if (data?.url) {
          window.location.href = data.url;
          return { success: true, redirectTo: data.url };
        }
      }

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error };
      }

      if (data?.user) {
        return { success: true, redirectTo: "/" };
      }
    } catch (error: any) {
      return { success: false, error };
    }

    return {
      success: false,
      error: {
        message: "Login failed",
        name: "Invalid email or password",
      },
    };
  },

  register: async (values: RegisterParams) => {
    try {
      const { email, password, options } = values;
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...options.data,
            birth_date: formatDate(options.data.birth_date),
            degree_id: parseInteger(options.data.degree_id),
          }
        }
      });

      if (error) {
        return { success: false, error };
      }


      if (data?.user) {
        const navigation = useNavigation();
        navigation.replace("/welcome?wc=1");
        return { success: false };
      }
    } catch (error: any) {
      return { success: false, error };
    }

    return {
      success: false,
      error: {
        message: "Register failed",
        name: "Invalid email or password",
      },
    };
  },

  forgotPassword: async ({ email }) => {
    try {
      const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        return { success: false, error };
      }

      if (data) {
        return { success: true };
      }
    } catch (error: any) {
      return { success: false, error };
    }

    return {
      success: false,
      error: {
        message: "Forgot password failed",
        name: "Invalid email",
      },
    };
  },

  updatePassword: async ({ password }) => {
    try {
      const { data, error } = await supabaseClient.auth.updateUser({
        password,
      });

      if (error) {
        return { success: false, error };
      }

      if (data?.user) {
        return { success: true, redirectTo: "/" };
      }
    } catch (error: any) {
      return { success: false, error };
    }

    return {
      success: false,
      error: {
        message: "Update password failed",
        name: "Invalid password",
      },
    };
  },

  logout: async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        return { success: false, error };
      }

      return { success: true, redirectTo: "/" };
    } catch (error: any) {
      return { success: false, error };
    }
  },

  onError: async (error) => {
    console.error(error);
    return { error };
  },

  check: async () => {
    try {
      const { data } = await supabaseClient.auth.getSession();
      const { session } = data;

      if (!session) {
        return {
          authenticated: false,
          error: {
            message: "Check failed",
            name: "Session not found",
          },
          logout: true,
          redirectTo: "/login",
        };
      }

      return { authenticated: true };
    } catch (error: any) {
      return {
        authenticated: false,
        error: error || {
          message: "Check failed",
          name: "Not authenticated",
        },
        logout: true,
        redirectTo: "/login",
      };
    }
  },

  getPermissions: async () => {
    try {
      const { data, error } = await supabaseClient.auth.getUser();

      if (error || !data?.user) {
        return null;
      }

      return data.user.role || null;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  },

  getIdentity: async () => {
    try {
      const { data, error } = await supabaseClient.auth.getUser();

      if (error || !data?.user) {
        return null;
      }

      return {
        ...data.user,
        name: data.user.email,
      };
    } catch (error: any) {
      console.error(error);
      return null;
    }
  },
};
export default authProvider;