import { app } from "../../_server/app";
import { fileUploadProcedures } from '../../../lib/fileUploadProcedures'

// https://kottster.app/docs/table/configuration/api#custom-server-api
const controller = app.defineTableController(
  {},
  fileUploadProcedures
);

// The Procedures type can be used on the frontend
// to get type-safety when calling server procedures.
export type Procedures = typeof controller.procedures;

export default controller;
