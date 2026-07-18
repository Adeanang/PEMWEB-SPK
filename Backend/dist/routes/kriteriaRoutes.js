"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const kriteriaControllers_1 = require("../controllers/kriteriaControllers");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const router = express_1.default.Router();
router.get("/", kriteriaControllers_1.getKriterias);
router.get("/:id", kriteriaControllers_1.getKriteriaById);
router.post("/", authMiddlewares_1.authenticate, kriteriaControllers_1.createKriteria);
router.put("/:id", authMiddlewares_1.authenticate, kriteriaControllers_1.updateKriteria);
router.delete("/:id", authMiddlewares_1.authenticate, kriteriaControllers_1.deleteKriteria);
exports.default = router;
