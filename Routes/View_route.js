import express from "express";
import { recordUniqueView, getViewCount } from "../Controllers/View_Con.js";

const ViewRoute = express.Router();

ViewRoute.get("/", recordUniqueView);
ViewRoute.get("/count", getViewCount);


export default ViewRoute;
