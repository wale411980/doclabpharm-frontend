import type React from "react";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { ChevronDown, Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useUpdateProfileSettings,
  useDoctorUpdatePassword,
  useGetSpecializationList,
} from "@/queries";
import { useAuth } from "@/hooks/useAuth";
import ImageUpload from "@/components/ImageUpload";
import RichTextEditor from "./RichTextEditor";
import { toast } from "react-toastify";

export default function DoctorSettings() {
  const { data: specializationList } = useGetSpecializationList();
  const { mutate: updateProfile, isPending } = useUpdateProfileSettings();
  const { mutate: updatePassword, isPending: isPendingPassword } =
    useDoctorUpdatePassword();
  const { user, login } = useAuth(); // 👈 Get current user and login function
  const doctorId = user?.id;

  const [activeTab, setActiveTab] = useState("profile");
  const [passwordVisible, setPasswordVisible] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form states
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: "",
    phone: "",
    address: "",
    city: "",
    specializationId: "",
    about: "",
    certifications: "",
    experience: "",
    profile_image: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const toggleCollapsible = (id: string) => {
    setOpenCollapsible(openCollapsible === id ? null : id);
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setPasswordVisible({
      ...passwordVisible,
      [field]: !passwordVisible[field],
    });
  };

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = async () => {
    // Validate form
    const newErrors: Record<string, string> = {};

    if (!passwordData.oldPassword.trim())
      newErrors.oldPassword = "Current password is required";
    if (!passwordData.newPassword.trim())
      newErrors.newPassword = "New password is required";
    if (!passwordData.confirmPassword.trim())
      newErrors.confirmPassword = "Confirm password is required";

    // If there are errors, show them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check minimum length for new and confirm passwords
    if (
      passwordData.newPassword.length < 8 ||
      passwordData.confirmPassword.length < 8
    ) {
      toast.error("Password must be at least 8 characters long.", {
        position: "top-right",
      });
      return;
    }

    // Check if new password and confirm password match
    if (
      passwordData.newPassword.trim() &&
      passwordData.confirmPassword.trim() &&
      passwordData.newPassword !== passwordData.confirmPassword
    ) {
      toast.error("New password and confirm password do not match.", {
        position: "top-right",
      });
      return;
    }

    updatePassword(
      {
        data: {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        },
      },
      {
        onSuccess: (updatedPassword: any) => {
          // merge updated data into existing user
          const updatedUser = { ...user, ...updatedPassword };
          // update context + localStorage
          login(updatedUser);

          // Navigate to dashboard after successful update and notify
          window.location.href = "/doctor/dashboard"; // 🔁 Hard reload of the page
          toast.success("Password updated successfully!", {
            position: "top-right",
          });
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message;
          toast.error(
            "Failed to update password. Please try again. " + errMsg,
            { position: "top-right" }
          );
        },
      }
    );
  };

  const handleSaveChanges = async () => {
    // Handle saving changes based on active tab

    // Reset errors
    setErrors({});

    // Validate form
    const newErrors: Record<string, string> = {};

    if (!profileData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!profileData.lastName.trim())
      newErrors.lastName = "Last name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profileData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(profileData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!profileData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!profileData.address.trim()) newErrors.address = "Address is required";
    if (!profileData.specializationId)
      newErrors.specializationId = "Specialization is required";
    if (!profileData.about.trim())
      newErrors.about = "Professional bio is required";
    if (!profileData.certifications.trim())
      newErrors.certifications = "Certifications are required";
    if (!profileData.experience.trim())
      newErrors.experience = "Experience is required";
    if (!profileData.profile_image.trim())
      newErrors.profile_image = "Profile Image is required";
    if (!profileData.city.trim()) newErrors.city = "Profile Image is required";

    // If there are errors, show them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    switch (activeTab) {
      case "profile":
        if (!doctorId || !user) {
          toast.error("Doctor ID or user data is missing", {
            position: "top-right",
          });
          return;
        }
        updateProfile(
          {
            doctorId,
            data: {
              firstName: profileData.firstName,
              lastName: profileData.lastName,
              email: profileData.email,
              phone: profileData.phone,
              address: profileData.address,
              city: profileData.city,
              specializationId: Number(profileData.specializationId),
              about: profileData.about,
              certifications: profileData.certifications,
              experience: profileData.experience,
              profile_image: profileData.profile_image,
            },
          },
          {
            onSuccess: (updatedDoctor: any) => {
              // merge updated data into existing user
              const updatedUser = { ...user, ...updatedDoctor };
              // update context + localStorage
              login(updatedUser);

              // Navigate to dashboard after successful update and notify
              window.location.href = "/doctor/dashboard"; // 🔁 Hard reload of the page
              toast.success("Profile updated successfully!", {
                position: "top-right",
              });
            },
            onError: (error: any) => {
              const errMsg = error?.response?.data?.message;
              toast.error(
                "Failed to update profile. Please try again. " + errMsg,
                { position: "top-right" }
              );
            },
          }
        );
        break;
      case "security":
        break;
      default:
        break;
    }
  };

  return (
    <div className="">
      <h1 className="text-teal-800 text-sm font-medium mb-4">
        Manage your account settings and preferences
      </h1>

      <Tabs
        defaultValue="profile"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-6 gap-4 px-4">
          <TabsTrigger
            value="profile"
            className={cn(
              "data-[state=active]:bg-green-700 data-[state=active]:text-white border border-green-700 text-green-700 rounded-full",
              "data-[state=inactive]:bg-white data-[state=inactive]:text-green-700"
            )}
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className={cn(
              "data-[state=active]:bg-green-700 data-[state=active]:text-white border border-green-700 text-green-700 rounded-full",
              "data-[state=inactive]:bg-white data-[state=inactive]:text-green-700"
            )}
          >
            Security
          </TabsTrigger>
        </TabsList>

        <div className="bg-[#e6f2ef] rounded-lg p-6">
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-teal-800 mb-1">
                Profile Information
              </h2>
              <p className="text-sm text-teal-800 mb-6">
                Update your professional profile information.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-teal-800">
                  First name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                  className="bg-white"
                  disabled
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-teal-800">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                  className="bg-white"
                  disabled
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-teal-800">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="bg-white"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-teal-800">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="bg-white"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-teal-800">
                  City
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={profileData.city}
                  onChange={handleProfileChange}
                  className="bg-white"
                />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-teal-800">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  className="bg-white"
                />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="specializationId" className="text-teal-800">
                  Specialization
                </Label>
                <Select
                  value={profileData.specializationId}
                  onValueChange={(value) =>
                    setProfileData({ ...profileData, specializationId: value })
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializationList?.map((specialization) => (
                      <SelectItem
                        key={specialization.id}
                        value={specialization.id.toString()}
                      >
                        {specialization.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.specializationId && (
                  <p className="text-sm text-red-500">
                    {errors.specializationId}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="about" className="text-teal-800">
                  Professional Bio
                </Label>
                <Textarea
                  id="about"
                  name="about"
                  value={profileData.about}
                  onChange={handleProfileChange}
                  className="bg-white min-h-[100px]"
                />
                {errors.about && (
                  <p className="text-sm text-red-500">{errors.about}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="about" className="text-teal-800">
                  Experience
                </Label>
                <RichTextEditor
                  value={profileData.experience}
                  onChange={(data: string) =>
                    setProfileData({ ...profileData, experience: data })
                  }
                />
                {errors.experience && (
                  <p className="text-sm text-red-500">{errors.experience}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="certifications" className="text-teal-800">
                  Qualifications & Certifications
                </Label>

                <RichTextEditor
                  value={profileData.certifications}
                  onChange={(data: string) =>
                    setProfileData({ ...profileData, certifications: data })
                  }
                />
                {errors.certifications && (
                  <p className="text-sm text-red-500">
                    {errors.certifications}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="profile_image" className="text-teal-800">
                Profile Image
              </Label>
              <ImageUpload
                onUploadComplete={(url: string) => {
                  setProfileData((prev) => ({ ...prev, profile_image: url }));
                }}
              />
              {errors.profile_image && (
                <p className="text-sm text-red-500">{errors.profile_image}</p>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outline"
                className="border-green-700 text-green-700 hover:bg-green-50"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveChanges}
                className="bg-green-700 text-white hover:bg-green-800"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-teal-800 mb-1">
                Security Settings
              </h2>
              <p className="text-sm text-teal-800 mb-6">
                Manage your password and security preferences.
              </p>
            </div>

            <div className="space-y-4">
              <Collapsible
                open={openCollapsible === "password"}
                onOpenChange={() => toggleCollapsible("password")}
                className="border rounded-md overflow-hidden"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                  <div className="flex items-center">
                    <Lock className="mr-2 h-5 w-5 text-teal-700" />
                    <span className="font-medium text-teal-800">
                      Change Password
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-teal-700 transition-transform ${
                      openCollapsible === "password" ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 pt-0 border-t">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="oldPassword" className="text-teal-800">
                        Current Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="oldPassword"
                          name="oldPassword"
                          type={passwordVisible.current ? "text" : "password"}
                          value={passwordData.oldPassword}
                          onChange={handlePasswordChange}
                          className="bg-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("current")}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {passwordVisible.current ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                      {errors.oldPassword && (
                        <p className="text-sm text-red-500">
                          {errors.oldPassword}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-teal-800">
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={passwordVisible.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="bg-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("new")}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {passwordVisible.new ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <p className="text-sm text-red-500">
                          {errors.newPassword}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-teal-800"
                      >
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={passwordVisible.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="bg-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("confirm")}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {passwordVisible.confirm ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outline"
                className="border-green-700 text-green-700 hover:bg-green-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePasswordSubmit}
                className="bg-green-700 text-white hover:bg-green-800"
                disabled={isPendingPassword}
              >
                {isPendingPassword ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
                {/* Save Changes */}
              </Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
