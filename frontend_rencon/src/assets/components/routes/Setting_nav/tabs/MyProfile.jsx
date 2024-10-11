import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { format } from "date-fns";
import CopyableText from "../../../ui/CopyableText";
import ProfileSkeleton from "./ProfileSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuth from "../../../auth/useAuth";
import { IoIosCamera } from "react-icons/io";
import Cropper from "react-easy-crop";
import getCroppedImg from "./CropImage";
import LoaderSpinner from "@/assets/components/ui/LoaderSpinner"; // Import your LoaderSpinner component
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

// Form validation schema using zod
const formSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits.")
    .regex(/^\d+$/, "Phone number must contain only numbers."),
});

function MyProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRemoving, setIsRemoving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState();
  const [file, setFile] = useState(null); // Store the actual file
  const [previewUrl, setPreviewUrl] = useState(null); // Store the preview URL

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
    aspect: 1,
  });

  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const fileInputRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      phone: "",
    },
  });

  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (user) {
      // Update the form fields with user data when it's available
      form.reset({
        firstName: user?.first_name || "",
        lastName: user?.last_name || "",
        email: user?.email || "",
        role: user?.role || "",
        phone: user?.phone_num || "",
      });
      setProfilePicture(user?.profilePicture);
      setLoading(false); // Set loading to false when user data is loaded
    }
  }, [user, form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasChanges =
        value.firstName !== user?.first_name ||
        value.lastName !== user?.last_name ||
        value.email !== user?.email ||
        value.phone !== user?.phone_num;

      setIsChanged(hasChanges);
    });

    return () => subscription.unsubscribe();
  }, [form, user]);

  if (loading || !user) {
    return <ProfileSkeleton />; // Show skeleton or loading state until user data is loaded
  }

  // Function to toggle edit mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Function to cancel edit mode
  const handleCancel = () => {
    form.reset({
      firstName: user?.first_name,
      lastName: user?.last_name,
      email: user?.email,
      phone: user?.phone_num,
    });
    setIsEditing(false); // Exit edit mode
  };

  // Submit handler
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Ensure data structure is correct
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        phone: data.phone,
      };

      await axios.put(`/user/admin-edit/${user._id}`, payload);
      toast({
        title: "Success",
        description: "Admin updated successfully.",
        status: "success",
        variant: "success",
      });
      setIsEditing(false);
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

  const handleSelectFile = (e) => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      console.log("File selected:", file);
      console.log("Selected File Type:", file.type); // Log the file type

      setFile(file); // Store the actual file for further processing (uploading)
      setPreviewUrl(URL.createObjectURL(file)); // Create a preview URL for display

      console.log("Updated File Type:", file.type); // Check the file type
    } else {
      console.log("No file selected");
      setFile(null);
      setPreviewUrl(null); // Reset preview URL if no file is selected
    }
  };

  const handleUpload = async () => {
    setLoadingUpload(true);
    if (!file || !croppedArea) {
      toast({
        description:
          "Please select a valid image and crop it before uploading.",
        variant: "destructive",
      });
      return;
    }

    console.log("Selected File Type:", file.type);

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast({
        description:
          "Invalid file type. Please upload a JPEG, PNG, or WEBP image.",
        variant: "destructive",
      });
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay for 2 seconds
      const croppedImageUrl = await getCroppedImg(previewUrl, croppedArea);
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      URL.revokeObjectURL(croppedImageUrl);

      const formData = new FormData();
      const fileExtension = file.type.split("/")[1];
      formData.append(
        "profilePicture",
        blob,
        `profile-picture.${fileExtension}`,
        `${user._id}`
      );
      formData.append("adminId", user._id); // Add adminId here

      console.log("Uploading to:", `/user/admin-edit-pic/${user._id}`);
      console.log("FormData Entries:", Array.from(formData.entries())); // Log FormData entries

      const uploadResponse = await axios.put(
        `/user/admin-edit-pic/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload Response:", uploadResponse.data);
      toast({
        title: "Success",
        description: "Profile picture uploaded successfully.",
        variant: "success",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.log("Upload Error:", error.response || error.message);
      toast({
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingUpload(false); // Stop loader
    }
  };

  const handleProfilePictureRemove = async () => {
    setIsRemoving(true); // Set loading state on remove
    try {
      await axios.put(`/user/admin-remove-pic/${user._id}`);
      setProfilePicture("");
      toast({
        title: "Success",
        description: "Profile picture removed successfully.",
        variant: "success",
      });
    } catch (error) {
      toast({
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    } finally {
      setIsRemoving(false); // Stop loading state
    }
  };

  return (
    <div className="block pb-5 translate-all duration-300">
      <div className="flex justify-between items-center p-4">
        <div>
          <h1 className="font-bold text-2xl">My Profile</h1>
          <p className="font-thin text-sm">Manage and protect your account.</p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 py-4">
        <div className="w-full lg:w-1/4 p-4 rounded-md flex flex-col items-center">
          {isRemoving ? (
            <Skeleton className="w-36 h-36 rounded-full" /> // Show Skeleton on remove
          ) : (
            <Avatar className="w-36 h-36 mb-4">
              {profilePicture ? (
                <AvatarImage src={profilePicture} alt="admin_photo" />
              ) : (
                <AvatarFallback className="w-full h-full">
                  <FaUserCircle className="w-full h-full" />
                </AvatarFallback>
              )}
            </Avatar>
          )}
          <span
            onClick={() => setIsDialogOpen(true)}
            className="cursor-pointer text-teal-500 text-sm"
          >
            Change Profile Picture
          </span>
          <span
            onClick={profilePicture ? handleProfilePictureRemove : null}
            className={`cursor-pointer text-red-500 text-sm ${
              !profilePicture ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            Remove Image
          </span>
        </div>

        {/* Right side */}
        <div className="w-full lg:w-2/3 p-4 rounded-md ">
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
                        <Input {...field} disabled={!isEditing} />
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
                        <Input {...field} disabled={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex space-x-4 py-4">
                {/* email*/}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
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
                        <Input {...field} disabled={!isEditing} />
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
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {!isEditing ? (
                <Button className="flex ml-auto" onClick={handleEdit}>
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-4">
                  <Button
                    className="flex ml-auto"
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex ml-auto"
                    type="submit"
                    disabled={loading || !isChanged || !form.formState.isValid}
                  >
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </div>
      </div>

      {/* Dialog for cropping and uploading image */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Profile Picture</DialogTitle>
            <DialogDescription>
              Adjust the image to fit the desired profile picture.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center overflow-hidden">
            <div className="relative bg-zinc-800 dark:bg-gray-100 w-64 h-64 ">
              {previewUrl && (
                <Cropper
                  image={previewUrl}
                  crop={crop}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={(crop, croppedAreaPixels) =>
                    setCroppedArea(croppedAreaPixels)
                  }
                  zoom={zoom}
                  onZoomChange={setZoom}
                  objectFit="cover"
                  cropShape="round"
                />
              )}
            </div>
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" // Hide the input element
              accept="image/jpeg,image/png,image/webp" // Accept image files only
            />
            <div
              onClick={handleSelectFile}
              className="flex justify-center cursor-pointer"
            >
              <div className="p-2 flex justify-center items-center rounded-md gap-2 border w-1/2">
                <IoIosCamera className="text-sm" />
                <span className="text-xs">Upload from the computer</span>
              </div>
            </div>
          </div>

          <div className="flex ml-auto gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setSelectedFile(null);
                setFile(null);
              }}
            >
              Cancel
            </Button>

            <Button onClick={handleUpload} disabled={!croppedArea}>
              Upload Profile
            </Button>
          </div>
          {loadingUpload ? (
            <div className="absolute inset-0 flex justify-center items-center bg-black/40">
              <LoaderSpinner />
            </div>
          ) : (
            ""
          )}
        </DialogContent>
      </Dialog>

      {/* Toaster for notifications */}
      <Toaster />
    </div>
  );
}

export default MyProfile;
