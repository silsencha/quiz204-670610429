import { Router, type Request, type Response } from "express";
// import Zod validators
import {
  zUserId,
  zItemId,
  zItemPostBody,
  zItemPutBody,
  zItemDeleteBody,
} from "../libs/zodValidators.js";
// import types
import type { Item } from "../libs/types.ts";
// import database
import { items, users } from "../db/db.ts";
//import uuid
import { v4 as uuidv4 } from "uuid";
import { success } from "zod";
import { authenticateToken } from "../middlewares/authenMiddleware.ts";

const router = Router();

// GET /api/vXXX/items/:userId
router.get("/:userId", (req: Request, res: Response) => {
  try {
    const id = req.params.userId;

    if (id) {
      let filterItem = items.filter((i) => i.userId === id);
      if (filterItem.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Item for user ID ${id} not found`,
        });
      }
      return res.status(200).json({
        success: true,
        data: filterItem,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

// POST /api/vXXX/items/:userId, body = {new item data}
// add a new Item for userId
router.post("/:userId", async (req: Request, res: Response) => {
  try {
    const body = (await req.body) as Item;
    const id = req.params.userId;

    const result = zItemPostBody.safeParse(body);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    const found = users.find((u) => u.userId === id);
    if (found) {
      return res.status(200).json({
        success: true,
        message: "user found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

// Delete /api/vXXX/items/:userId

export default router;
