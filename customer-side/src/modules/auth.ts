// Importera dina verktyg
import { apiKey, baseURL } from "../utils";

// Definiera typer för API-respons
interface ApiResponse<T> {
  data?: T;
  message?: string;
  token: string;
  errors?: {
    detail: string;
  };
}

interface AuthData {
  token: string;
}
interface UserCredentials {
  email: string;
  password_hash: string;
  role: string;
  name: string;
  phone: string;
}

interface UserCredentialsLogin {
  email: string;
  password: string;
}

// Auth-modulen
const auth = {
  token: sessionStorage.getItem("token") || "", // Load from storage if exists

  // Typa login-metoden
  async login(username: string, password: string): Promise<string> {
    const user: UserCredentialsLogin = {
      email: username,
      password: password,
    };

    const response = await fetch(`${baseURL}v1/user/login`, {
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const result: ApiResponse<AuthData> = await response.json();

    if (result.message === 'Auth failed') {
      return result.message;
    } else if (result.message === 'Auth successful') {
    this.token = result.token;
    sessionStorage.setItem("token", result.token); // Save in sessionStorage
      console.log(this.token);
      return "ok";
    } else {
      return "Unexpected error occurred.";
    }
  },

  // Typa register-metoden
  async register(username: string, password: string, email: string, role: string, phone: string): Promise<string> {
    const user: UserCredentials = {
      email: email,
      password_hash: password,
      name: username,
      role: role,
      phone: phone,
    };

    console.log("userdata", user);
    console.log("baseurl", baseURL);
    const response = await fetch(`${baseURL}v1/user/add`, {
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const result: ApiResponse<AuthData> = await response.json();
    console.log(result);
    if (result.message === 'User already exists') {
      return result.message;
    } else if (result.message === 'User created') {
      return "ok";
    } else {
      return "Unexpected error occurred.";
    }
  },

  logout() {
    this.token = "";
    sessionStorage.removeItem("token");
  }

};

export default auth;
