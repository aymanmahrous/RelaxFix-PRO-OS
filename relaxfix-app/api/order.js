// أضف هذا الجزء داخل دالة المعالجة في ملف order.js الحالي
const { data: wallet } = await supabase.from('user_wallets').select('balance_credits').eq('user_id', orderData.userId).single();

if (wallet && wallet.balance_credits >= 10) { // خصم 10 عملات لكل طلب
    await supabase.from('user_wallets').update({ balance_credits: wallet.balance_credits - 10 }).eq('user_id', orderData.userId);
    console.log("✅ Credits deducted successfully");
} else {
    console.log("⚠️ No sufficient credits, proceeding as guest");
}
