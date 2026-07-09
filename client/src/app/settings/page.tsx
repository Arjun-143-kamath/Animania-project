"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { User, Upload, Settings as SettingsIcon, Save, Lock, LayoutDashboard, Globe } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  
  // States for Profile
  const [username, setUsername] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // States for Preferences
  const [titleLanguage, setTitleLanguage] = useState("english");
  const [defaultLibraryView, setDefaultLibraryView] = useState("WATCHING");

  // States for Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI States
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });
  const [hasPassword, setHasPassword] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        const user = res.data;
        setUsername(user.username || "");
        setAvatarPreview(user.avatar || null);
        setTitleLanguage(user.titleLanguage || "english");
        setDefaultLibraryView(user.defaultLibraryView || "WATCHING");
        // If user has googleId/githubId and no password, they don't have a password
        if (!user.password && (user.googleId || user.githubId)) {
          setHasPassword(false);
        }
      } catch (err) {
        console.error("Failed to load user data:", err);
        router.push("/login");
      }
    };
    fetchUser();
  }, [router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);
    setProfileMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("titleLanguage", titleLanguage);
      formData.append("defaultLibraryView", defaultLibraryView);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await api.put("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update local storage
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userObj = JSON.parse(userStr);
        const updatedUser = { ...userObj, ...res.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Dispatch event for Header to update
        window.dispatchEvent(new Event("profileUpdated"));
      }

      setProfileMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err: any) {
      setProfileMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Failed to update profile." 
      });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 5) {
      setPasswordMessage({ type: "error", text: "Password must be at least 5 characters." });
      return;
    }

    setIsPasswordLoading(true);
    setPasswordMessage({ type: "", text: "" });

    try {
      await api.put("/auth/password", { currentPassword, newPassword });
      setPasswordMessage({ type: "success", text: "Password updated successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Failed to update password." 
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-10">
          <SettingsIcon className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-extrabold tracking-tight">Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigation/Sidebar */}
          <div className="md:col-span-1 space-y-2">
            <a href="#profile" className="flex items-center gap-3 p-4 rounded-xl bg-card border border-white/5 hover:bg-card/80 transition-colors">
              <User className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold">Profile & Preferences</span>
            </a>
            {hasPassword && (
              <a href="#security" className="flex items-center gap-3 p-4 rounded-xl hover:bg-card/80 transition-colors border border-transparent hover:border-white/5">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold text-muted-foreground">Security</span>
              </a>
            )}
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Profile & Preferences Form */}
            <div id="profile" className="bg-card border border-white/5 p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profile Information
              </h2>
              
              <form onSubmit={handleProfileSubmit} className="space-y-8 relative z-10">
                {/* Avatar Upload */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative group w-32 h-32 rounded-full overflow-hidden bg-secondary border-2 border-white/10 shadow-lg shrink-0">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <User className="w-12 h-12" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-white" />
                    </button>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold text-lg mb-1">Profile Picture</h3>
                    <p className="text-sm text-muted-foreground mb-4">Upload a custom avatar (JPG, PNG, max 5MB).</p>
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-full transition-colors"
                    >
                      Choose Image
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleAvatarChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Display Name</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full p-4 bg-background border border-border/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                  />
                </div>

                <div className="border-t border-border/50 pt-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    App Preferences
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">Title Language</label>
                      <select
                        value={titleLanguage}
                        onChange={(e) => setTitleLanguage(e.target.value)}
                        className="w-full p-4 bg-background border border-border/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none appearance-none"
                      >
                        <option value="english">English (e.g. Attack on Titan)</option>
                        <option value="romaji">Romaji (e.g. Shingeki no Kyojin)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">Default Library View</label>
                      <select
                        value={defaultLibraryView}
                        onChange={(e) => setDefaultLibraryView(e.target.value)}
                        className="w-full p-4 bg-background border border-border/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none appearance-none"
                      >
                        <option value="WATCHING">Watching</option>
                        <option value="WATCHLIST">Watchlist</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {profileMessage.text && (
                  <div className={`p-4 rounded-xl text-sm font-semibold ${profileMessage.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                    {profileMessage.text}
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isProfileLoading}
                    className="flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-3 rounded-full hover:bg-primary/90 hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isProfileLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Security Form */}
            {hasPassword && (
              <div id="security" className="bg-card border border-white/5 p-8 rounded-3xl shadow-xl relative overflow-hidden mt-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Security
                </h2>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-4 bg-background border border-border/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-4 bg-background border border-border/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                        required
                        minLength={5}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-4 bg-background border border-border/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                        required
                        minLength={5}
                      />
                    </div>
                  </div>

                  {passwordMessage.text && (
                    <div className={`p-4 rounded-xl text-sm font-semibold ${passwordMessage.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                      {passwordMessage.text}
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={isPasswordLoading}
                      className="flex items-center gap-2 bg-secondary text-secondary-foreground font-bold px-8 py-3 rounded-full hover:bg-secondary/80 hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {isPasswordLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Lock className="w-4 h-4" /> Update Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
