"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const perbandinganKriteriaRoutes_1 = require("../controllers/perbandinganKriteriaRoutes");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const router = express_1.default.Router();
router.get("/", perbandinganKriteriaRoutes_1.getPerbandinganKriterias);
router.get("/:id", perbandinganKriteriaRoutes_1.getPerbandinganById);
router.post("/", authMiddlewares_1.authenticate, perbandinganKriteriaRoutes_1.createPerbandinganKriteria);
router.put("/:id", authMiddlewares_1.authenticate, perbandinganKriteriaRoutes_1.updatePerbandinganKriteria);
router.delete("/:id", authMiddlewares_1.authenticate, perbandinganKriteriaRoutes_1.deletePerbandinganKriteria);
exports.default = router;
