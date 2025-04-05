"use client";

import { z } from "zod";
import UploadFormInput from "./upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import {
  generatePdfSummary,
  storePdfSummaryAction,
} from "@/actions/upload-actions";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import  LoadingSkeleton  from "./loading-skeleton";
//schema with zod

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "File size must be less than 20MB"
    )
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});

export default function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("uploaded successfully!");
    },
    onUploadError: (err) => {
      console.log("error occurred while uploading", err);
      toast(" Error occurred while uploading", {
        description: err.message,
      });
    },
    onUploadBegin: (data) => {
      console.log("upload has begun for", data);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      //validating the fields
      const validatedFields = schema.safeParse({ file });
      
      if (!validatedFields.success) {
        toast("❌ Something went wrong", {
          description:
            validatedFields.error.flatten().fieldErrors.file?.[0] ??
            "Invalid file.",
          style: { color: "red" },
        });
        setIsLoading(false);
        return;
      }

      toast("📄 Uploading PDF...", {
        description: "We are uploading your PDF! ",
      });

      //upload the file to the uploadthing

      const uploadResponse = await startUpload([file]);
      if (!uploadResponse) {
        toast("Something went wrong", {
          description: "Please use a different file",
          style: { color: "red" },
        });
        setIsLoading(false);
        return;
      }

      toast("⏳ Processing PDF...", {
        description: "Hang tight! Our AI is reading through your document! ✨",
      });

      const uploadFileUrl=uploadResponse[0].serverData.fileUrl;

      //parse the pdf using lang chain
      const result = await generatePdfSummary({
        fileUrl:uploadFileUrl,
        fileName:file.name,
      });

      const { data = null, message = null } = result || {};

      if (data) {
        let storeResult: any;

        toast("💾 Saving PDF...", {
          description: "Hang tight! We are saving your summary! ✨",
        });

        if (data.summary) {
          // save the summary to the database
          storeResult = await storePdfSummaryAction({
            summary: data.summary,
            fileUrl: uploadFileUrl,
            title: data.title,
            fileName: file.name,
          });

          toast("✨ Summary Generated!", {
            description:
              "Your summary has been successfully summarized and saved",
          });

          formRef.current?.reset();
          router.push(`/summaries/${storeResult.data.id}`);
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error("error occurred", error);
      formRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200 dark:border-gray-800" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-muted-foreground text-sm">
            Upload PDF
          </span>
        </div>
      </div>

      <UploadFormInput
        isLoading={isLoading}
        ref={formRef}
        onSubmit={handleSubmit}
      />
      {isLoading && (
        <>
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-muted-foreground text-sm">
                Processing
              </span>
            </div>
          </div>

          <LoadingSkeleton/>
        </>
      )}
    </div>
  );
}
