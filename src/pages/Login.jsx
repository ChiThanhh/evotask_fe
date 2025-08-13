import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/services/AuthService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Login({ onSwitch, setIsLoggedIn }) {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await login(data);

      const token = response.token;
      localStorage.setItem("data", JSON.stringify(response));
      localStorage.setItem("token", token);
      setIsLoggedIn(true); // trigger re-render
      navigate("/dashboard");
      toast.success("Đăng nhập thành công!");
    } catch (error) {
      toast.error("Đăng nhập thất bại!");
    }
  };
  return (
    <div className="flex items-center justify-center h-full">
      <Card className=" w-full max-w-lg ">
        <CardHeader>
          <CardTitle>Đăng nhập tài khoản của bạn</CardTitle>
          <CardDescription>
            Nhập email của bạn bên dưới để đăng nhập vào tài khoản của bạn
          </CardDescription>
          <CardAction>
            <Button
              className="cursor-pointer"
              variant="link"
              onClick={onSwitch}
            >
              Đăng ký
            </Button>
          </CardAction>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@gmail.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="******"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 mt-8">
            <Button type="submit" className="w-full cursor-pointer">
              Đăng nhập
            </Button>
            <Button variant="outline" className="w-full cursor-pointer">
              Đăng nhập với Google
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
