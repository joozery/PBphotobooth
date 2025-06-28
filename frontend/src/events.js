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

      groomLabel,
      brideLabel,
      groomIcon,
      brideIcon,
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
      groomLabel,
      brideLabel,
      groomIcon,
      groomIconImageUrl,
      brideIconImageUrl,
      coverImage2Url,
      promptpay_groom || null,
      promptpay_bride || null,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("❌ MySQL insert error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      const eventId = result.insertId;

      // ✅ Insert templates ที่ลิงก์กับ event นี้
      if (templateIds.length > 0) {
        const templateSql = `
          INSERT INTO event_templates (event_id, template_id)
          VALUES ${templateIds.map(() => "(?, ?)").join(", ")}
        `;
        const templateValues = templateIds.flatMap((id) => [eventId, id]);

        db.query(templateSql, templateValues, (err2) => {
          if (err2) {
            console.error("❌ Insert event_templates error:", err2);
            // ไม่ return error เพราะ event หลัก insert สำเร็จแล้ว
          }
          res.status(201).json({ success: true, id: eventId });
        });
      } else {
        res.status(201).json({ success: true, id: eventId });
      }
    });
  } catch (error) {
    console.error("❌ Upload or insert error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ GET /api/events - ดึงรายการงานทั้งหมด
router.get("/", (req, res) => {
  const sql = "SELECT * FROM events ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ MySQL fetch error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});

// ✅ GET /api/events/:id
router.get("/:id", (req, res) => {
  const sqlEvent = "SELECT * FROM events WHERE id = ?";
  const sqlTemplates =
    "SELECT template_id FROM event_templates WHERE event_id = ?";

  db.query(sqlEvent, [req.params.id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    const event = results[0];

    db.query(sqlTemplates, [req.params.id], (err2, templateRows) => {
      if (err2) {
        console.error("❌ Fetch templates error:", err2);
        return res.json(event); // ❌ แบบนี้ไม่มี templateIds
      }

      event.templateIds = templateRows.map((r) => r.template_id); // ✅ ต้องเพิ่มตรงนี้
      res.json(event);
    });
  });
});

// ✅ DELETE /api/events/:id - ลบงาน
router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM events WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("❌ MySQL delete error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ success: true });
  });
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

      groomLabel,
      brideLabel,
      groomIcon,
      brideIcon,
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
      const rows = await new Promise((resolve, reject) => {
        db.query(
          "SELECT cover_image2 FROM events WHERE id = ?",
          [req.params.id],
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
      });
      if (rows.length > 0) {
        coverImage2Url = rows[0].cover_image2;
      }
    }

    // ✅ ถ้าไม่มีทั้ง req.file และ coverImageUrl → ดึงจาก DB เดิม
    if (!coverImageUrl) {
      const rows = await new Promise((resolve, reject) => {
        db.query(
          "SELECT cover_image FROM events WHERE id = ?",
          [req.params.id],
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
      });
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
      groomLabel,
      brideLabel,
      groomIcon,
      brideIcon,
      groomIconImageUrl,
      brideIconImageUrl,
      coverImage2Url,
      promptpay_groom || null,
      promptpay_bride || null,
      req.params.id,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("❌ MySQL update error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      const eventId = req.params.id;

      // ✅ ลบ template เดิม และเพิ่มใหม่
      db.query(
        "DELETE FROM event_templates WHERE event_id = ?",
        [eventId],
        (delErr) => {
          if (delErr) {
            console.error("❌ Failed to delete old templates:", delErr);
            return res.json({ success: true }); // ไม่หยุด flow
          }

          if (templateIds.length > 0) {
            const insertSql = `
            INSERT INTO event_templates (event_id, template_id)
            VALUES ${templateIds.map(() => "(?, ?)").join(", ")}
          `;
            const insertValues = templateIds.flatMap((id) => [eventId, id]);

            db.query(insertSql, insertValues, (insertErr) => {
              if (insertErr) {
                console.error("❌ Failed to insert new templates:", insertErr);
              }
              res.json({ success: true });
            });
          } else {
            res.json({ success: true });
          }
        }
      );
    });
  } catch (error) {
    console.error("❌ Update event error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/wishes
router.post("/wishes", uploadSingle, async (req, res) => {
  const { name, message, side, eventId } = req.body;
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

  const sql = `INSERT INTO wishes (event_id, name, message, side, image_url) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [eventId, name, message, side, imageUrl], (err, result) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.status(201).json({ success: true });
  });
});

// GET /api/events/:id/templates
router.get("/events/:id/templates", (req, res) => {
  const eventId = req.params.id;
  const sql = `
    SELECT t.*
    FROM event_templates et
    JOIN templates t ON et.template_id = t.id
    WHERE et.event_id = ?
  `;
  db.query(sql, [eventId], (err, results) => {
    if (err) {
      console.error("❌ Load templates by event failed:", err);
      return res.status(500).json({ error: "Server error" });
    }
    res.json(results);
  });
});

// ✅ GET /api/templates - ดึงเทมเพลตทั้งหมด
router.get("/templates", (req, res) => {
  const sql = `SELECT id, name FROM templates ORDER BY id DESC`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Cannot fetch templates:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results); // 👈 ส่งกลับทั้งหมดให้ frontend
  });
});

// ✅ export router หลังจากประกาศ route ทั้งหมด
module.exports = router;
