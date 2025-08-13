import React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { register } from "@/services/AuthService"
import { toast } from "sonner"

export default function Register({ onSwitch }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
      display_name: formData.get("display_name"),
    };
    try {
      await register(data);
      toast.success("Đăng ký thành công!");
      onSwitch();
    } catch (error) {
      toast.error("Đăng ký thất bại!");
    }
  };
  return (
    <div className="flex items-center justify-center h-full">
      <Card className=" w-full max-w-lg ">
        <CardHeader>
          <CardTitle>Đăng ký tài khoản của bạn</CardTitle>
          <CardDescription>
            Nhập email của bạn bên dưới để đăng ký tài khoản của bạn
          </CardDescription>
          <CardAction>
            <Button className="cursor-pointer" variant="link" onClick={onSwitch}>Đăng nhập</Button>
          </CardAction>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>

            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="display_name">Tên hiển thị</Label>
                <Input
                  id="display_name"
                  type="text"
                  name="display_name"
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>
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
                <Input id="password" name="password" type="password" placeholder="******"
                  required />
              </div>
            </div>

          </CardContent>
          <CardFooter className="flex-col gap-2 mt-8">
            <Button type="submit" className="w-full" >
              Đăng ký
            </Button>
            <Button variant="outline" className="w-full">
              Đăng nhập với Google
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
