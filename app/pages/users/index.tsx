import { TablePage } from "@kottster/react";
import LocationEditor from "../../../components/LocationEditor";

export default () => (
  <TablePage
    nested={{
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
        },
      },
    }}
  />
);
