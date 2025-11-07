import { Box, TextInput, FileInput, Loader } from "@mantine/core";
import { CustomFieldInput } from "@kottster/common";
import { ChangeEvent, useEffect, useState } from "react";

export default function FileUploader({
  params,
}: {
  params: Parameters<NonNullable<CustomFieldInput["renderComponent"]>>[0];
}) {
  const { value, record, updateFieldValue } = params;
  const [file, setFile] = useState<File | null>(null);
  const [uploadWait, setUploadWait] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function uploadFile(file: File | null) {
    setFile(file);
    if (file) {
      setUploadError("");
      setUploadWait(true);
      try {
        console.log("~~ Would upload", file);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        setUploadError(e + "");
      } finally {
        setUploadWait(false);
      }
    }
  }

  return (
    <Box>
      {/* TODO - show image if exists and not uploadWait */}

      {uploadWait && <Loader color="blue" />}

      <FileInput
        label="Upload New File"
        description="Attach an image of the sighting"
        placeholder=".png or .jpg"
        accept="image/png,image/jpeg"
        multiple={false}
        value={file}
        onChange={uploadFile}
        disabled={uploadWait}
      />
    </Box>
  );
}
