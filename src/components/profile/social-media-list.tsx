"use client";

import { useGetSocialMediasQuery } from "@/store/apis/profile";
import { SocialMedia } from "@/types/social-media";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil1Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { SocialMediaModal } from "./social-media-modal";
import { useDeleteSocialMediaMutation } from "@/store/apis/profile";
import { toast } from "sonner";

export function SocialMediaList() {
  const { data: socialMedias = [], isLoading } = useGetSocialMediasQuery();
  const [deleteSocialMedia] = useDeleteSocialMediaMutation();

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this social media link?")) {
      try {
        await deleteSocialMedia(id).unwrap();
        toast.success("Social media link deleted successfully");
      } catch (error) {
        console.error("Error deleting social media:", error);
        toast.error("Failed to delete social media link. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Social Media Links</h3>
        <SocialMediaModal>
          <Button size="sm" className="gap-2">
            <PlusIcon className="h-4 w-4" />
            Add Social Media
          </Button>
        </SocialMediaModal>
      </div>

      {socialMedias.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-muted-foreground">No social media links added yet.</p>
          <SocialMediaModal>
            <Button variant="link" className="mt-2">
              Add your first social media link
            </Button>
          </SocialMediaModal>
        </div>
      ) : (
        <div className="space-y-3">
          {socialMedias.map((social) => (
            <div
              key={social.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-lg">
                    {getPlatformIcon(social.platform)}
                  </span>
                </div>
                <div>
                  <p className="font-medium capitalize">{social.platform}</p>
                  <p className="text-sm text-muted-foreground truncate max-w-xs">
                    {social.url}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <SocialMediaModal socialMedia={social}>
                  <Button  size="icon" className="h-9 w-9">
                    <Pencil1Icon className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </SocialMediaModal>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-9 w-9 text-white hover:text-white"
                  onClick={() => handleDelete(social.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getPlatformIcon(platform: string) {
  switch (platform) {
    case 'facebook':
      return 'f';
    case 'instagram':
      return '📸';
    case 'tiktok':
      return '🎵';
    case 'x':
      return '𝕏';
    case 'whatsapp':
      return '💬';
    case 'linkedin':
      return 'in';
    default:
      return '🔗';
  }
}
