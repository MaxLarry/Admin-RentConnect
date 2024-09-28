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
  gender: z.string().min(1, "Gender is required."),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits.")
    .regex(/^\d+$/, "Phone number must contain only numbers."),
  address: z.string().min(5, "Complete the Address"),
});

function EditLandlordModal({ occupantToEdit, title, closeModal }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: occupantToEdit?.firstName || "",
      lastName: occupantToEdit?.lastName || "",
      gender: occupantToEdit?.gender || "",
      phone: occupantToEdit?.contactDetails.phone || "",
      address: occupantToEdit?.contactDetails.address || "",
    },
  });

  const [isChanged, setIsChanged] = useState(false);

  // Watch form changes to set isChanged
  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasChanges =
        value.firstName !== occupantToEdit.firstName ||
        value.lastName !== occupantToEdit.lastName ||
        value.gender !== occupantToEdit.gender ||
        value.phone !== occupantToEdit.contactDetails.phone ||
        value.address !== occupantToEdit.contactDetails.address;

      setIsChanged(hasChanges);
    });

    return () => subscription.unsubscribe();
  }, [form, occupantToEdit]);

  // Submit handler
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Ensure data structure is correct
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        phone: data.phone,
        address: data.address,
      };

      const response = await axios.put(
        `/user/user-edit/${occupantToEdit.profile_id}`,
        payload
      );
      toast({
        title: "Success",
        description: "Occupant profile updated successfully.",
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
          <DialogTitle>Edit Occupant Profile</DialogTitle>
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
              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
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

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="flex ml-auto"
              type="submit"
              disabled={loading || !isChanged || !form.formState.isValid} // disable when loading, no changes, or form is invalid
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
