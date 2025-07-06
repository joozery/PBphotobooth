router.get("/", async (req, res) => {
  try {
    const { eventId, showAll } = req.query;
    if (!eventId) return res.status(400).json({ error: "Missing eventId" });
    
    if (showAll === 'true') {
      // สำหรับ Dashboard - ดูทั้งหมด
      const results = await db.query(
        "SELECT id, image, profile_image, name, message, side, agreement, created_at FROM wishes2 WHERE event_id = ? ORDER BY created_at DESC",
        [eventId]
      );
      
      // แปลง field names ให้ตรงกับ frontend
      const wishes = results.map(wish => ({
        id: wish.id,
        image_url: wish.image,
        profile_image: wish.profile_image,
        name: wish.name,
        message: wish.message,
        side: wish.side,
        show_in_slideshow: wish.agreement === 1,
        created_at: wish.created_at
      }));
      
      res.json(wishes);
    } else {
      // สำหรับ Slideshow - เฉพาะรูป image (snapshot)
      const results = await db.query(
        "SELECT image FROM wishes2 WHERE event_id = ? AND image IS NOT NULL ORDER BY id DESC",
        [eventId]
      );
      res.json(results.map(r => r.image));
    }
  } catch (err) {
    console.error("❌ Get wishes error:", err);
    res.status(500).json({ error: "Database error" });
  }
}); 