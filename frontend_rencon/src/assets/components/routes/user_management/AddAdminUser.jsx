import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react"; // Make sure to import the Plus icon
import axios from "axios"; // Import axios once
import LoaderSpinner from "@/assets/components/ui/LoaderSpinner"; // Import your LoaderSpinner component

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters." }),
  role: z.string().min(1, { message: "Role is required." }),
});

export function AddAdminUser() {
  const [loading, setLoading] = useState(false); // State for showing the loader
  const [isOpen, setIsOpen] = useState(false); // State for dialog visibility
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      role: "",
    },
  });

  async function onSubmit(data) {
    setLoading(true); // Start loader
    const formattedData = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: data.role,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay for 2 seconds
      const response = await axios.post("/user/admin/add", formattedData);
      console.log(response.data); // Handle success

      // Toast for successful addition
      toast({
        description: response.data.message, //message from backend
        variant: "success", // Use a success variant
      });

      setIsOpen(false); // Close the dialog upon success
    } catch (error) {
      // Extracting the error message from the response, if available
      const errorMessage = error.response?.data?.message || error.message;
      toast({
        description: errorMessage, // Use the extracted error message
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Stop loader
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="text-xs space-x-1" variant="outline">
          <Plus className="w-5" />
          <span>Add Admin</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Admin</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new admin user.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin@rentconnect.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+63 912 345 6789"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue="">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Super-Admin">Super-Admin</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Listing Manager">
                        Listing Manager
                      </SelectItem>
                      <SelectItem value="User Manager">User Manager</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="flex ml-auto"
              disabled={loading} // disable when loading
              type="submit"
            >
              {loading ? "Processing..." : "Add Admin"}
            </Button>
          </form>
        </Form>
        {loading ? (
          <div className="absolute inset-0 flex justify-center items-center bg-black/40">
            <LoaderSpinner /> {/* Centered LoaderSpinner */}
          </div>
        ) : (
          ""
        )}
      </DialogContent>
      <Toaster />
    </Dialog>
  );
}
