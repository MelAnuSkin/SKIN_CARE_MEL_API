import express from "express";
import { recordView, getViews } from "../Controllers/View_Con.js";

const ViewRoute = express.Router();

ViewRoute.post("/record", recordView); 
ViewRoute.get("/count", getViews);     

export default ViewRoute;
