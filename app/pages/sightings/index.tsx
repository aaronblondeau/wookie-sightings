import { TablePage } from "@kottster/react";
import LocationEditor from "../../../components/LocationEditor";
import FileUploader from "../../../components/FileUploader";

export default () => (
  <TablePage
    columnOverrides={{
      location: (column) => ({
        ...column,
        label: "Location",
        fieldInput: {
          type: "custom",
          renderComponent: (params) => {
            return <LocationEditor params={params} />;
          },
        },
      }),
      photo: (column) => ({
        ...column,
        label: "Photo",
        fieldInput: {
          type: "custom",
          renderComponent: (params) => {
            return <FileUploader params={params} />;
          },
        },
      }),
    }}
  />
);
