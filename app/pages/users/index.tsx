import { TablePage } from "@kottster/react";
import LocationEditor from "../../../components/LocationEditor";
import FileUploader from "../../../components/FileUploader";

export default () => (
  <TablePage
    nested={{
      // To find this key, click open a nested table in the UI.
      // The key will appear in a small badge at the top of the screen, change __c__ to __p__
      sightings__p__user_id: {
        columnOverrides: {
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
        },
      },
    }}
  />
);
