import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const Signup = () => {
  const navigate=useNavigate(); 
  const [input, SetInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const {user}=useSelector(store=>store.auth)

  const handleInput = (e) => {
    SetInput({ ...input, [e.target.name]: e.target.value });
  };

  const signuphandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true)
      const res = await axios.post(
        "http://localhost:7777/api/v1/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
         navigate("/login")
        SetInput({
        username: "",
        email: "",
        password: "", 
      })
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message); 
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } finally {
      setLoading(false);
    }
  };



useEffect(() => {
  if(user){
    navigate("/")
  }
  
}, []);

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={signuphandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">LOGO</h1>
          <p className="text-sm text-center">
            Signup to see photos & videos from your friends
          </p>
        </div>

        <div>
          <span className="font-medium">Username</span>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={handleInput}
            className="focus-visible:ring-transparent my-2"
          />
        </div>

        <div>
          <span className="font-medium">Email</span>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={handleInput}
            className="focus-visible:ring-transparent my-2"
          />
        </div>

        <div>
          <span className="font-medium">Password</span>
          <Input
            name="password"
            type="password"
            value={input.password}
            onChange={handleInput}
            className="focus-visible:ring-transparent my-2"
          />
        </div>

          {
          loading?(
            <Button>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Please wait
</Button>

          ):(
        <Button type="submit">Signup</Button>

          )
        }

        <span className="text-center">already havee an account ? <Link className="text-blue-500" to={"/login"}>
        Login
        </Link></span>

      </form>
    </div>
  );
};

export default Signup;
