// تعريف المنفذ (Port) مرة واحدة فقط
const PORT = process.env.PORT || 3000;

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`🚀 RelaxFix PRO OS is firing up on port ${PORT}`);
    console.log(`🌐 System is live and ready for orders!`);
});
