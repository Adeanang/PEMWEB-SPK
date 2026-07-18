"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subKriteriaControllers_1 = require("../controllers/subKriteriaControllers");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const router = express_1.default.Router();
router.get("/", subKriteriaControllers_1.getSubKriterias);
router.get("/:id", subKriteriaControllers_1.getSubKriteriaById);
router.post("/", authMiddlewares_1.authenticate, subKriteriaControllers_1.createSubKriteria);
router.put("/:id", authMiddlewares_1.authenticate, subKriteriaControllers_1.updateSubKriteria);
router.delete("/:id", authMiddlewares_1.authenticate, subKriteriaControllers_1.deleteSubKriteria);
exports.default = router;
