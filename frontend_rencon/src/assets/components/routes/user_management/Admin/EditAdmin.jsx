import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import LoaderSpinner from "@/assets/components/ui/LoaderSpinner";

// Form validation schema using zod
const formSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits.")
    .regex(/^\d+$/, "Phone number must contain only numbers."),
});

function EditLandlordModal({ adminToEdit, title, closeModal }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const admin_list = [
    "Super-Admin",
    "Admin",
    "Listing Manager",
    "User Manager",
  ];
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: adminToEdit?.first_name || "",
      lastName: adminToEdit?.last_name || "",
      role: adminToEdit?.role || "",
      phone: adminToEdit?.phone_num || "",
    },
  });

  const [isChanged, setIsChanged] = useState(false);
  // Watch form changes to set isChanged
  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasChanges =
        value.firstName !== adminToEdit.first_name ||
        value.lastName !== adminToEdit.last_name ||
        value.role !== adminToEdit.role ||
        value.phone !== adminToEdit.phone_num;

      setIsChanged(hasChanges); // Moved setIsChanged inside the condition check
    });

    return () => subscription.unsubscribe();
  }, [form, adminToEdit]);

  // Submit handler
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Ensure data structure is correct
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        phone: data.phone,
      };

      const response = await axios.put(
        `/user/admin-edit/${adminToEdit._id}`,
        payload
      );
      toast({
        title: "Success",
        description: "Admin updated successfully.",
        status: "success",
        variant: "success",
      });
      closeModal();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast({
        description: errorMessage, // Use the extracted error message
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Landlord Profile</DialogTitle>
          <DialogDescription>{title}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex space-x-4">
              {/* First Name */}
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

              {/* Last Name */}
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

            <div className="flex space-x-4">
              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {admin_list.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              className="flex ml-auto"
              type="submit"
              disabled={loading || !isChanged || !form.formState.isValid} // Disable button when loading, no changes, or form is invalid
            >
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </Form>

        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-black/40">
            <LoaderSpinner />
          </div>
        )}
      </DialogContent>
      <Toaster />
    </Dialog>
  );
}

export default EditLandlordModal;
