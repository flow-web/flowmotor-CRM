# Virtual Studio - User Guide

## 🎯 Overview
Transform parking-lot photos into showroom-quality images in one click.

## ✨ Features
- **AI Background Removal** - Removes messy backgrounds automatically
- **Luxury Studio Backdrop** - Dark grey concrete wall (premium aesthetic)
- **Professional Shadows** - AI-generated soft shadows for realism
- **Flow Motor Watermark** - Branded watermark in bottom-right corner
- **Auto-Primary Image** - Processed photo becomes the main vehicle image

---

## 🚀 Quick Start

### 1. Setup (One-time)
1. Sign up for Photoroom API: https://www.photoroom.com/api
2. Copy your API key from the dashboard
3. Add to your `.env.local` file:
   ```bash
   VITE_PHOTOROOM_API_KEY=your_api_key_here
   ```
4. Restart your dev server

### 2. Using Virtual Studio

#### In the CRM Interface:
1. Go to **Vehicle Cockpit** (click any vehicle in stock)
2. Navigate to **Galerie** tab
3. Upload a vehicle photo (if not already uploaded)
4. **Hover over the photo** → See action buttons
5. **Click the Sparkles (✨) button** — "Mode Studio"
6. Wait 3-5 seconds → Processing overlay appears
7. **Done!** → New studio image added and set as main photo

#### What You'll See:
```
Before:                       After:
┌─────────────────────┐      ┌─────────────────────┐
│ Car in parking lot  │  →   │ Car on studio bg    │
│ (messy background)  │      │ (clean, pro look)   │
│                     │      │    [Flow Motor]     │
└─────────────────────┘      └─────────────────────┘
```

---

## 💡 Best Practices

### Photo Quality Tips
✅ **Do:**
- Use well-lit photos (natural daylight or bright garage)
- Capture the full vehicle (all four corners visible)
- Shoot from eye-level or slightly below
- Use landscape orientation (horizontal)
- Clear the area around the car (less clutter = better results)

❌ **Don't:**
- Use heavily shadowed or dark photos
- Crop too tightly (AI needs context around the car)
- Process photos with people or reflections in the car
- Use very low resolution images (< 800px wide)

### When to Use Studio Mode
**Ideal for:**
- Hero images (main listing photo)
- Social media posts
- Print marketing materials
- Website homepage featured vehicles

**Skip for:**
- Interior photos (doesn't work on interiors)
- Detail shots (engine bay, wheels) — background doesn't matter
- Entire galleries (process 1-3 hero shots, not all 20+ photos)

---

## 🎨 Technical Details

### Background Specifications
- **Color**: `#2a2a2a` (dark grey concrete)
- **Shadow**: AI-generated soft shadow (30% intensity)
- **Format**: PNG with transparency support
- **Quality**: High (suitable for print and web)

### Watermark Specifications
- **Text**: "Flow Motor"
- **Color**: `#C4A484` (brand gold)
- **Opacity**: 50%
- **Position**: Bottom-right corner
- **Font**: Responsive (scales with image size)

### File Naming
- Original: `parking_photo.jpg`
- Processed: `studio_parking_photo.png`
- Stored in: Supabase Storage `vehicles/{vehicleId}/`

---

## 💰 Cost & Usage

### Pricing
- **Per Image**: ~€0.05 - €0.10 (Photoroom API)
- **Target Usage**: 1-3 hero images per vehicle
- **Monthly Estimate**: €5-20 for typical usage (50-100 vehicles/month)

### Monitoring Usage
- Each processed image is logged in browser console
- Check Photoroom dashboard for detailed usage stats
- Set up billing alerts in Photoroom account settings

---

## 🛠️ Troubleshooting

### Button Not Showing Up?
**Cause**: API key not configured
**Fix**: Add `VITE_PHOTOROOM_API_KEY` to `.env.local` and restart dev server

### "Invalid API Key" Error?
**Cause**: Wrong API key or expired subscription
**Fix**: Check Photoroom dashboard, verify key is active

### "Rate Limit Exceeded" Error?
**Cause**: Too many requests in short time
**Fix**: Wait 1 minute, try again. Consider upgrading Photoroom plan.

### "Quota Exceeded" Error?
**Cause**: Monthly quota used up
**Fix**: Check Photoroom billing, upgrade plan or wait for next billing cycle

### Processing Takes Forever?
**Cause**: Large image file or slow connection
**Fix**:
- Compress image before upload (< 2MB ideal)
- Check your internet connection
- Try a different photo

### Result Doesn't Look Good?
**Cause**: Poor source photo quality or unusual background
**Fix**:
- Try a different photo with better lighting
- Ensure car is fully visible in frame
- Avoid photos with complex backgrounds (people, other cars, trees overlapping)

---

## 🔐 Security & Production

### Current Setup (Development/MVP)
- API key stored in `.env.local` (client-side)
- Acceptable for MVP with usage monitoring
- **Do not commit `.env.local` to Git!**

### Production Recommendations
When scaling to production:
1. **Move API calls to Supabase Edge Function** (hide API key server-side)
2. **Implement rate limiting** (max 10 images per user per day)
3. **Add cost tracking** (log every API call with timestamp)
4. **Usage dashboard** (admin view of monthly API spend)
5. **User permissions** (only allow studio mode for premium accounts)

---

## 📊 Performance Metrics

### Expected Performance
- **Processing Time**: 3-5 seconds average
- **Success Rate**: > 95% (well-lit, clear photos)
- **File Size**: 500KB - 2MB (PNG format)
- **Resolution**: Maintained from original (max 4K)

### User Experience Goals
- ⚡ **Fast**: < 6 seconds end-to-end (click → success toast)
- ✅ **Reliable**: Works on 95%+ of photos
- 🎨 **Quality**: Professional enough for premium listings
- 💸 **Affordable**: < €0.10 per hero image

---

## 🔮 Future Features (Roadmap)

### Coming Soon
- [ ] **Batch Processing** - Select 5 photos, process all at once
- [ ] **Before/After Slider** - Compare original vs. studio version
- [ ] **Custom Backgrounds** - Choose from library (white, showroom, gradient)

### Future Enhancements
- [ ] **Shadow Intensity Slider** - Adjust shadow strength
- [ ] **360° Spin Processing** - Process entire 360° image sets
- [ ] **Video Backgrounds** - Animated studio backgrounds for social media
- [ ] **AI Upscaling** - Enhance low-res photos to 4K

---

## 📚 Additional Resources

- **Photoroom API Docs**: https://www.photoroom.com/api/docs
- **Photoroom Pricing**: https://www.photoroom.com/pricing
- **Support**: Contact support@photoroom.com
- **Flow Motor CRM Docs**: See `src/lib/api/README.md`

---

## 🆘 Need Help?

### Common Questions
**Q: Can I undo the studio processing?**
A: The original photo remains in the gallery. You can delete the studio version if needed.

**Q: Will this work on interior photos?**
A: No, Virtual Studio is designed for exterior shots only. Interior backgrounds are typically fine as-is.

**Q: Can I adjust the watermark?**
A: Currently fixed at 50% opacity. Custom watermark settings coming in future update.

**Q: What if I run out of API credits?**
A: Processing will fail with a clear error message. Upgrade your Photoroom plan or wait for monthly reset.

### Contact
For technical support or feature requests, contact the Flow Motor development team.
