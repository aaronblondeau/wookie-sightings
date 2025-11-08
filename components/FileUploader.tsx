import { Box, FileInput, Loader, Alert, Image } from "@mantine/core";
import { CustomFieldInput } from "@kottster/common";
import { useEffect, useState } from "react";
import { useCallProcedure } from "@kottster/react";
import { TriangleAlert } from "lucide-react";

export default function FileUploader({
  params,
}: {
  params: Parameters<NonNullable<CustomFieldInput["renderComponent"]>>[0];
}) {
  const { value, record, updateFieldValue } = params;
  console.log(params);

  const [file, setFile] = useState<File | null>(null);
  const [uploadWait, setUploadWait] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Get an "Expected 1 arguments, but got 2." error on callProcedure, so using an "as" to fix it:
  const callProcedure = useCallProcedure() as (
    procedure: string,
    payload: Record<string, unknown>
  ) => Promise<any>;

  useEffect(() => {
    async function getPhotoUrl() {
      if (value) {
        const result = await callProcedure("urlForKey", { key: value });
        if (result) {
          setPhotoUrl(result);
        }
      }
    }
    getPhotoUrl();
  });

  async function uploadFile(file: File | null) {
    setFile(file);
    if (file) {
      setUploadError("");
      setUploadWait(true);
      try {
        // // Can't do this :-(
        // const result = await callProcedure("uploadFile", { file });

        // // FormData doesn't work either :-(
        // const form = new FormData();
        // form.append("file", file);
        // const result = await callProcedure("uploadFile", form);

        // // base64 encoded does work, but we hit a payload size issue pretty quick...
        // const fileData = await new Promise((resolve, reject) => {
        //   const reader = new FileReader();
        //   reader.onloadend = () => {
        //     resolve(reader.result);
        //   };
        //   reader.readAsDataURL(file);
        // });
        // const result = await callProcedure("uploadFile", {
        //   sightingId: params.record?.id,
        //   name: file.name,
        //   data: fileData,
        // });
        // console.log("~~ UI got", result);
        // updateFieldValue("photo", result.key);

        // Use a presigned url instead

        const uploadInfo = await callProcedure("getFileUploadUrl", {
          sightingId: params.record?.id,
          name: file.name,
          contentType: file.type,
        });

        console.log("~~ uploadInfo", uploadInfo);

        // Use fetch to PUT file to uploadUrl
        await fetch(uploadInfo.url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        updateFieldValue("photo", uploadInfo.key);
      } catch (e) {
        setUploadError(e + "");
      } finally {
        setUploadWait(false);
      }
    }
  }

  if (!record) {
    return (
      <Box>
        <div>
          Please create the record first and then upload will become available.
        </div>
      </Box>
    );
  }

  return (
    <Box>
      {/* TODO - show message to save first before uploading if no record */}

      {uploadWait && <Loader color="blue" />}

      {!uploadWait && photoUrl && <Image radius="md" h={200} src={photoUrl} />}

      {uploadError && (
        <Alert
          variant="light"
          color="red"
          title="Invalid Input"
          icon={<TriangleAlert />}
          className="my-2"
        >
          {uploadError}
        </Alert>
      )}

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
