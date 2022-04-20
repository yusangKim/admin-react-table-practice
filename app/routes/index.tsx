import { useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { requestToken } from "~/apis/oauth/token";

export default function Index() {
  const navigate = useNavigate();

  const [login, setLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      navigate("/users");
    }
  }, []);

  const handleLogin = async () => {
    const grant_type = "password";
    let result = await requestToken(username, password);

    console.log(result);
    if (result.status === 200) {
      localStorage.setItem("access_token", result.data.access_token);
      localStorage.setItem("refresh_token", result.data.refresh_token);
      navigate("/users");
    } else {
      console.log(result.status);
    }
  };

  return (
    <>
      <div>
        <div>Uesr name</div>
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleLogin}>Log in</button>
      </div>
    </>
  );
}
