import { TablePage } from "@kottster/react";
import LocationEditor from "../../../components/LocationEditor";

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
    }}
  />
);
