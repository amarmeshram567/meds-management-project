import express from "express";
import { addMedications, getAdherence, getMedications, markMedicationTaken, uploadPhoto } from "../controller/medicationController.js";
import protecteRoute from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";

const medicationRoutes = express.Router()


medicationRoutes.post('/add-medicine', protecteRoute, addMedications)

medicationRoutes.get('/get-medicine', protecteRoute, getMedications);

medicationRoutes.post('/medicine/mark', protecteRoute, markMedicationTaken )

medicationRoutes.post('/upload-photo', protecteRoute, upload.single("photo"), uploadPhoto )

medicationRoutes.get('/adherence', protecteRoute, getAdherence)

export default medicationRoutes


