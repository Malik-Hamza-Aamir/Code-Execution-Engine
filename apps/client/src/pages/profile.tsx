import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../components/index";
import { Trash2 } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  bio: z.string().max(160).optional(),
});

type ProfileData = z.infer<typeof profileSchema>;

export function Profile() {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "John Doe",
      email: "john@example.com",
      bio: "",
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
    },
    multiple: false,
  });

  const onSubmit = (data: ProfileData) => {
    console.log("Profile Updated", { ...data, profileImage });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete your profile permanently?")) {
      // call delete logic here
      console.log("Profile deleted.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-10">
      <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>

      {/* Image Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-6 rounded-lg cursor-pointer text-center transition ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-full mx-auto"
          />
        ) : (
          <p className="text-gray-500">Drag & drop a PNG or JPG image, or click to select one</p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            {...register("name")}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            {...register("email")}
            type="email"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            {...register("bio")}
            rows={3}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.bio && <p className="text-red-500 text-sm">{errors.bio.message}</p>}
        </div>

        <div className="flex items-center gap-4 mt-6">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            Update Profile
          </Button>

          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-5 h-5" />
            Delete Profile
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
