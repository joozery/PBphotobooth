const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../db/db");
const cloudinary = require("../db/cloudinary");

// ตั้งค่าการอัปโหลดภาพ
const storage = multer.memoryStorage();
const uploadFields = multer({ storage }).fields([
  { name: "cover", maxCount: 1 },
  { name: "cover2", maxCount: 1 },
  { name: "groom_icon_image", maxCount: 1 }, // เพิ่ม
  { name: "bride_icon_image", maxCount: 1 }, // เพิ่ม
]);
const uploadSingle = multer({ storage }).single("image");

// ✅ POST /api/events - สร้างงานใหม่
router.post("/", uploadFields, async (req, res) => {
  try {
    const {
      title,
      eventDate,
      showWishButton,
      wishButtonText,
      wishButtonBg,
      wishButtonTextColor,

      showSlipButton,
      slipButtonText,
      slipButtonBg,
      slipButtonTextColor,

      showViewWishesButton,
      viewWishesButtonText,
      viewWishesButtonBg,
      viewWishesButtonTextColor,

      groom_label,
      bride_label,
      groom_icon,
      bride_icon,
      promptpay_groom, // เพิ่ม
      promptpay_bride, // เพิ่ม
    } = req.body;

    let coverImageUrl = null;
    let coverImage2Url = null; // ✅ เพิ่มตรงนี้
    const templateIds = JSON.parse(req.body.templateIds || "[]");

    let groomIconImageUrl = req.body.groom_icon_image || null;
    let brideIconImageUrl = req.body.bride_icon_image || null;

    // groom_icon_image
    if (
      req.files &&
      req.files.groom_icon_image &&
      req.files.groom_icon_image[0]
    ) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "event_icons" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.files.groom_icon_image[0].buffer);
      });
      groomIconImageUrl = result.secure_url;
    }

    // bride_icon_image
    if (
      req.files &&
      req.files.bride_icon_image &&
      req.files.bride_icon_image[0]
    ) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "event_icons" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.files.bride_icon_image[0].buffer);
      });
      brideIconImageUrl = result.secure_url;
    }

    // ✅ อัปโหลดภาพหน้าปกขึ้น Cloudinary
    if (req.files && req.files.cover && req.files.cover[0]) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "event_covers" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.files.cover[0].buffer);
      });
      coverImageUrl = result.secure_url;
    }

    // ✅ อัปโหลด cover2
    if (req.files && req.files.cover2 && req.files.cover2[0]) {
      const result2 = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "event_covers" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.files.cover2[0].buffer);
      });
      coverImage2Url = result2.secure_url;
    }

    // ✅ Insert into events
    const sql = `
      INSERT INTO events (
        title, event_date, cover_image,
        show_wish_button, wish_button_text, wish_button_bg, wish_button_text_color,
        show_slip_button, slip_button_text, slip_button_bg, slip_button_text_color,
        show_view_wishes_button, view_wishes_button_text, view_wishes_button_bg, view_wishes_button_text_color,
        groom_label, bride_label, groom_icon, groom_icon_image, bride_icon_image, cover_image2,
        promptpay_groom, promptpay_bride
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

    const values = [
      title,
      eventDate,
      coverImageUrl,
      showWishButton === "true",
      wishButtonText,
      wishButtonBg,
      wishButtonTextColor,
      showSlipButton === "true",
      slipButtonText,
      slipButtonBg,
      slipButtonTextColor,
      showViewWishesButton === "true",
      viewWishesButtonText,
      viewWishesButtonBg,
      viewWishesButtonTextColor,
      groom_label,
      bride_label,
      groom_icon,
      groomIconImageUrl,
      brideIconImageUrl,
      coverImage2Url,
      promptpay_groom || null,
      promptpay_bride || null,
    ];

    const result = await db.query(sql, values);
    const eventId = result.insertId;

    // ✅ Insert templates ที่ลิงก์กับ event นี้
    if (templateIds.length > 0) {
      const templateSql = `
        INSERT INTO event_templates (event_id, template_id)
        VALUES ${templateIds.map(() => "(?, ?)").join(", ")}
      `;
      const templateValues = templateIds.flatMap((id) => [eventId, id]);

      try {
        await db.query(templateSql, templateValues);
      } catch (err2) {
        console.error("❌ Insert event_templates error:", err2);
        // ไม่ return error เพราะ event หลัก insert สำเร็จแล้ว
      }
    }

    res.status(201).json({ success: true, id: eventId });
  } catch (error) {
    console.error("❌ Upload or insert error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ GET /api/events - ดึงรายการงานทั้งหมด
router.get("/", async (req, res) => {
  try {
    const sql = "SELECT * FROM events ORDER BY id DESC";
    const results = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("❌ MySQL fetch error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ GET /api/events/:id
router.get("/:id", async (req, res) => {
  try {
    const sqlEvent = "SELECT * FROM events WHERE id = ?";
    const sqlTemplates =
      "SELECT template_id FROM event_templates WHERE event_id = ?";

    const results = await db.query(sqlEvent, [req.params.id]);
    if (results.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    const event = results[0];

    try {
      const templateRows = await db.query(sqlTemplates, [req.params.id]);
      event.templateIds = templateRows.map((r) => r.template_id); // ✅ ต้องเพิ่มตรงนี้
      res.json(event);
    } catch (err2) {
      console.error("❌ Fetch templates error:", err2);
      res.json(event); // ❌ แบบนี้ไม่มี templateIds
    }
  } catch (err) {
    console.error("❌ Get event error:", err);
    res.status(404).json({ error: "Event not found" });
  }
});

// ✅ DELETE /api/events/:id - ลบงาน
router.delete("/:id", async (req, res) => {
  try {
    const sql = "DELETE FROM events WHERE id = ?";
    await db.query(sql, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ MySQL delete error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ PUT /api/events/:id - แก้ไขงาน
router.put("/:id", uploadFields, async (req, res) => {
  try {
    const {
      title,
      eventDate,
      showWishButton,
      wishButtonText,
      wishButtonBg,
      wishButtonTextColor,

      showSlipButton,
      slipButtonText,
      slipButtonBg,
      slipButtonTextColor,

      showViewWishesButton,
      viewWishesButtonText,
      viewWishesButtonBg,
      viewWishesButtonTextColor,

      groom_label,
      bride_label,
      groom_icon,
      bride_icon,
      promptpay_groom, // ✅ เพิ่มตรงนี้
      promptpay_bride, // ✅ เพิ่มตรงนี้
    } = req.body;

    let coverImageUrl = req.body.cover_image || null;
    const templateIds = JSON.parse(req.body.templateIds || "[]");

    let groomIconImageUrl = req.body.groom_icon_image || null;
    let brideIconImageUrl = req.body.bride_icon_image || null;

    // groom_icon_image
    if (
      req.files &&
      req.files.groom_icon_image &&
      req.files.groom_icon_image[0]
    ) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "event_icons" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.files.groom_icon_image[0].buffer);
      });
      groomIconImageUrl = result.secure_url;
    }

    // bride_icon_image
    if (
      req.files &&
      req.files.bride_icon_image &&
      req.files.bride_icon_image[0]
    ) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "event_icons" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.files.bride_icon_image[0].buffer);
      });
      brideIconImageUrl = result.secure_url;
    }

    // ✅ ถ้ามีไฟล์ใหม่ ให้อัปโหลดขึ้น Cloudinary
    if (req.files && req.files.cover && req.files.cover[0]) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "event_covers" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.files.cover[0].buffer);
      });
      coverImageUrl = result.secure_url;
    }

    let coverImage2Url = req.body.cover_image2 || null; // default

    // ถ้ามีไฟล์ใหม่
    if (req.files && req.files.cover2 && req.files.cover2[0]) {
      const result2 = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "event_covers" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.files.cover2[0].buffer);
      });
      coverImage2Url = result2.secure_url;
    }

    // Fallback coverImage2 ถ้า user ไม่ได้อัพโหลดใหม่
    if (!coverImage2Url) {
      const rows = await db.query(
        "SELECT cover_image2 FROM events WHERE id = ?",
        [req.params.id]
      );
      if (rows.length > 0) {
        coverImage2Url = rows[0].cover_image2;
      }
    }

    // ✅ ถ้าไม่มีทั้ง req.file และ coverImageUrl → ดึงจาก DB เดิม
    if (!coverImageUrl) {
      const rows = await db.query(
        "SELECT cover_image FROM events WHERE id = ?",
        [req.params.id]
      );
      if (rows.length > 0) {
        coverImageUrl = rows[0].cover_image;
      }
    }

    // ✅ อัปเดตข้อมูล event
    const sql = `
      UPDATE events SET
        title = ?, event_date = ?, cover_image = ?,
        show_wish_button = ?, wish_button_text = ?, wish_button_bg = ?, wish_button_text_color = ?,
        show_slip_button = ?, slip_button_text = ?, slip_button_bg = ?, slip_button_text_color = ?,
        show_view_wishes_button = ?, view_wishes_button_text = ?, view_wishes_button_bg = ?, view_wishes_button_text_color = ?,
        groom_label = ?, bride_label = ?, groom_icon = ?, bride_icon = ? , groom_icon_image = ?, bride_icon_image = ?, cover_image2 = ?,
        promptpay_groom = ?, promptpay_bride = ?
      WHERE id = ?
    `;

    const values = [
      title,
      eventDate,
      coverImageUrl,
      showWishButton === "true",
      wishButtonText,
      wishButtonBg,
      wishButtonTextColor,
      showSlipButton === "true",
      slipButtonText,
      slipButtonBg,
      slipButtonTextColor,
      showViewWishesButton === "true",
      viewWishesButtonText,
      viewWishesButtonBg,
      viewWishesButtonTextColor,
      groom_label,
      bride_label,
      groom_icon,
      bride_icon,
      groomIconImageUrl,
      brideIconImageUrl,
      coverImage2Url,
      promptpay_groom || null,
      promptpay_bride || null,
      req.params.id,
    ];

    await db.query(sql, values);
    const eventId = req.params.id;

    // ✅ ลบ template เดิม และเพิ่มใหม่
    await db.query("DELETE FROM event_templates WHERE event_id = ?", [eventId]);

    if (templateIds.length > 0) {
      const insertSql = `
        INSERT INTO event_templates (event_id, template_id)
        VALUES ${templateIds.map(() => "(?, ?)").join(", ")}
      `;
      const insertValues = templateIds.flatMap((id) => [eventId, id]);

      try {
        await db.query(insertSql, insertValues);
      } catch (insertErr) {
        console.error("❌ Failed to insert new templates:", insertErr);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Update event error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/wishes
router.post("/wishes", uploadSingle, async (req, res) => {
  try {
    const { name, message, side, eventId, agree } = req.body;
    let imageUrl = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "wish_images" }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const sql = `INSERT INTO wishes (event_id, name, message, side, image_url, show_in_slideshow) VALUES (?, ?, ?, ?, ?, ?)`;
    const result = await db.query(sql, [eventId, name, message, side, imageUrl, agree === 'true']);
    res.status(201).json({ success: true });
  } catch (error) {
    console.error("❌ Post wish error:", error);
    res.status(500).json({ error: "DB error" });
  }
});

// POST /api/wishes/image - สำหรับส่งเฉพาะรูปภาพ (snapshot)
router.post("/wishes/image", uploadSingle, async (req, res) => {
  try {
    const { name, message, side, eventId, agree } = req.body;
    let imageUrl = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "wish_images" }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const sql = `INSERT INTO wishes (event_id, name, message, side, image_url, show_in_slideshow) VALUES (?, ?, ?, ?, ?, ?)`;
    const result = await db.query(sql, [eventId, name, message, side, imageUrl, agree === 'true']);
    res.status(201).json({ success: true });
  } catch (error) {
    console.error("❌ Upload wish image error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/wishes?eventId=:eventId - ดึงคำอวยพรของงาน (รองรับทั้ง slideshow และ dashboard)
router.get("/wishes", async (req, res) => {
  try {
    const { eventId, showAll } = req.query;
    if (!eventId) {
      return res.status(400).json({ error: "Missing eventId parameter" });
    }

    let sql;
    if (showAll === 'true') {
      // สำหรับ Dashboard - ดูทั้งหมด
      sql = `
        SELECT id, image_url, name, message, side, show_in_slideshow, created_at
        FROM wishes 
        WHERE event_id = ?
        ORDER BY created_at DESC
      `;
      const results = await db.query(sql, [eventId]);
      res.json(results);
    } else {
      // สำหรับ Slideshow - เฉพาะที่แสดงได้
      sql = `
        SELECT image_url, name, message, side, show_in_slideshow
        FROM wishes 
        WHERE event_id = ? AND show_in_slideshow = 1
        ORDER BY created_at ASC
      `;
      const results = await db.query(sql, [eventId]);
      const imageUrls = results.map(wish => wish.image_url).filter(url => url);
      res.json(imageUrls);
    }
  } catch (err) {
    console.error("❌ Fetch wishes error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/wishes/:id - ลบคำอวยพร
router.delete("/wishes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const sql = `DELETE FROM wishes WHERE id = ?`;
    const result = await db.query(sql, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Wish not found" });
    }
    
    res.json({ success: true, message: "Wish deleted successfully" });
  } catch (err) {
    console.error("❌ Delete wish error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/events/:id/templates
router.get("/events/:id/templates", async (req, res) => {
  try {
    const eventId = req.params.id;
    const sql = `
      SELECT t.*
      FROM event_templates et
      JOIN templates t ON et.template_id = t.id
      WHERE et.event_id = ?
    `;
    const results = await db.query(sql, [eventId]);
    res.json(results);
  } catch (err) {
    console.error("❌ Load templates by event failed:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET /api/templates - ดึงเทมเพลตทั้งหมด
router.get("/templates", async (req, res) => {
  try {
    const sql = `SELECT id, name FROM templates ORDER BY id DESC`;
    const results = await db.query(sql);
    res.json(results); // 👈 ส่งกลับทั้งหมดให้ frontend
  } catch (err) {
    console.error("❌ Cannot fetch templates:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ======= SLIPS API ENDPOINTS =======

// POST /api/slips/upload - อัปโหลดสลิป
router.post("/slips/upload", uploadSingle, async (req, res) => {
  try {
    const { name, side, amount, eventId } = req.body;
    let slipImageUrl = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "slip_images" }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(req.file.buffer);
      });
      slipImageUrl = result.secure_url;
    }

    const sql = `INSERT INTO slips (event_id, name, side, amount, slip_image_url) VALUES (?, ?, ?, ?, ?)`;
    await db.query(sql, [eventId, name, side, parseFloat(amount), slipImageUrl]);
    res.status(201).json({ success: true });
  } catch (error) {
    console.error("❌ Upload slip error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/slips/summary - ดึงสรุปยอดสลิปทั้งหมดแยกตามงาน
router.get("/slips/summary", async (req, res) => {
  try {
    const sql = `
      SELECT 
        e.id as event_id,
        e.title as event_name,
        COALESCE(SUM(CASE WHEN s.side = 'bride' THEN s.amount ELSE 0 END), 0) as total_bride,
        COALESCE(SUM(CASE WHEN s.side = 'groom' THEN s.amount ELSE 0 END), 0) as total_groom,
        COALESCE(SUM(s.amount), 0) as total_amount,
        COUNT(s.id) as total_slips
      FROM events e
      LEFT JOIN slips s ON e.id = s.event_id
      GROUP BY e.id, e.title
      ORDER BY e.id DESC
    `;
    
    const results = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("❌ Fetch slip summary error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/slips/event/:eventId - ดึงรายละเอียดสลิปของงานเฉพาะ
router.get("/slips/event/:eventId", async (req, res) => {
  try {
    const sql = `
      SELECT 
        s.id,
        s.name,
        s.side,
        s.amount,
        s.slip_image_url,
        s.created_at
      FROM slips s
      WHERE s.event_id = ?
      ORDER BY s.created_at DESC
    `;
    
    const results = await db.query(sql, [req.params.eventId]);
    res.json(results);
  } catch (err) {
    console.error("❌ Fetch slip details error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ export router หลังจากประกาศ route ทั้งหมด
module.exports = router;
