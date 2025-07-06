// GET /api/wishes?eventId=:eventId - ดึงคำอวยพรของงาน (สำหรับ slideshow และ gallery)
router.get("/wishes", async (req, res) => {
  try {
    const { eventId, showAll } = req.query;
    if (!eventId) {
      return res.status(400).json({ error: "Missing eventId parameter" });
    }

    let sql;
    if (showAll === 'true') {
      // สำหรับ gallery ที่ต้องการดูทั้งหมด
      sql = `
        SELECT id, image_url, name, message, side, show_in_slideshow, created_at
        FROM wishes 
        WHERE event_id = ?
        ORDER BY created_at DESC
      `;
      const results = await db.query(sql, [eventId]);
      res.json(results);
    } else {
      // สำหรับ slideshow ที่ต้องการเฉพาะที่แสดงได้
      sql = `
        SELECT image_url, name, message, side, show_in_slideshow
        FROM wishes 
        WHERE event_id = ? AND show_in_slideshow = 1
        ORDER BY created_at ASC
      `;
      const results = await db.query(sql, [eventId]);
      // ส่งกลับเฉพาะ image_url สำหรับ slideshow
      const imageUrls = results.map(wish => wish.image_url).filter(url => url);
      res.json(imageUrls);
    }
  } catch (err) {
    console.error("❌ Fetch wishes error:", err);
    res.status(500).json({ error: "Server error" });
  }
}); 