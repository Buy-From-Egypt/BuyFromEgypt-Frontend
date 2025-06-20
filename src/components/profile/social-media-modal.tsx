"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  useGetSocialMediasQuery,
  useCreateSocialMediaMutation,
  useUpdateSocialMediaMutation,
  useDeleteSocialMediaMutation,
} from "@/store/apis/profile";
import {
  SocialMedia,
  SocialMediaPlatform,
  socialMediaPlatforms,
} from "@/types/social-media";
import { Pencil1Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

const socialMediaFormSchema = z.object({
  platform: z.enum([
    "facebook",
    "instagram",
    "tiktok",
    "x",
    "whatsapp",
    "linkedin",
  ] as const),
  url: z.string().url("Please enter a valid URL"),
});

type SocialMediaFormValues = z.infer<typeof socialMediaFormSchema>;

interface SocialMediaModalProps {
  socialMedia?: SocialMedia;
  children: React.ReactNode;
}

export function SocialMediaModal({
  socialMedia,
  children,
}: SocialMediaModalProps) {
  const [open, setOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: socialMedias = [], isLoading } = useGetSocialMediasQuery();
  const [createSocialMedia] = useCreateSocialMediaMutation();
  const [updateSocialMedia] = useUpdateSocialMediaMutation();
  const [deleteSocialMedia] = useDeleteSocialMediaMutation();

  const isEditMode = !!socialMedia;
  const defaultValues = {
    platform: socialMedia?.platform || "facebook",
    url: socialMedia?.url || "",
  };

  const form = useForm<SocialMediaFormValues>({
    resolver: zodResolver(socialMediaFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: SocialMediaFormValues) => {
    try {
      if (isEditMode && socialMedia) {
        await updateSocialMedia({
          id: socialMedia.id,
          data: { platform: data.platform, url: data.url },
        }).unwrap();
        toast.success("Social media updated successfully");
      } else {
        await createSocialMedia({
          platform: data.platform as SocialMediaPlatform,
          url: data.url,
        }).unwrap();
        toast.success("Social media added successfully");
      }
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error saving social media:", error);
      toast.error("Failed to save social media. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!socialMedia) return;
    try {
      await deleteSocialMedia(socialMedia.id).unwrap();
      toast.success("Social media removed successfully");
      setOpen(false);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting social media:", error);
      toast.error("Failed to delete social media. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className={cn(isEditMode ? "bg-primary" : "")}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Social Media" : "Add Social Media"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {socialMediaPlatforms.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/username"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between pt-4">
              <div>
                {isEditMode && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={isLoading}
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {isEditMode ? "Save Changes" : "Add Social Media"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Delete Social Media</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to remove this social media link? This action
            cannot be undone.
          </p>
          <div className="flex justify-end space-x-2 pt-4">

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
