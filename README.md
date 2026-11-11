# AVIS Executive Proposals (`avis-proposals`)

- **Live Production Portal (Vercel)**: https://avis-proposals.vercel.app
- **Public GitHub Repository**: https://github.com/0xAstroAlpha/avis-proposals
- **Media CDN (Cloudflare R2 — AVIS Academy Pattern)**: `https://media.lehuyducanh.com/avis-proposals/`

Kho lưu trữ công khai trọn bộ **HTML Executive Proposals** chuẩn **AVIS Brand Guideline V2** cho 8 nhóm khách hàng chiến lược của **Công ty Cổ phần AVIS AI** (`MST: 0318832218`), nhúng trực tiếp toàn bộ 22 video thực chứng từ AVIS Showcase & AVIS Credential qua Cloudflare R2 CDN.

## Danh sách 8 Proposal Chuyên biệt theo Nhóm Khách hàng

1. **Đơn vị Sản xuất Phim Độc lập, Điện ảnh & Series OTT** (`creative-studio`) — [Live Vercel](https://avis-proposals.vercel.app/proposals/indie-cinema-ott) · [`proposals/indie-cinema-ott.html`](proposals/indie-cinema-ott.html)
2. **Production House Sản xuất TVC, MV & Phim Thương mại** (`creative-studio`) — [Live Vercel](https://avis-proposals.vercel.app/proposals/production-house-tvc) · [`proposals/production-house-tvc.html`](proposals/production-house-tvc.html)
3. **Studio Kỹ xảo Điện ảnh (VFX), CGI, 3D & Hoạt hình IP** (`creative-studio`) — [Live Vercel](https://avis-proposals.vercel.app/proposals/vfx-cgi-animation) · [`proposals/vfx-cgi-animation.html`](proposals/vfx-cgi-animation.html)
4. **Nhà Sản xuất Short Drama, Web Drama, MCN & Remake Quốc tế** (`creative-studio`) — [Live Vercel](https://avis-proposals.vercel.app/proposals/short-drama-remake) · [`proposals/short-drama-remake.html`](proposals/short-drama-remake.html)
5. **Studio Diễn họa Kiến trúc (Archviz), Phim 3D BĐS & Thiết kế Nội thất** (`creative-studio`) — [Live Vercel](https://avis-proposals.vercel.app/proposals/archviz-interior-design) · [`proposals/archviz-interior-design.html`](proposals/archviz-interior-design.html)
6. **Creative Agency, Branding, Social & Performance Marketing Agency** (`creative-studio`) — [Live Vercel](https://avis-proposals.vercel.app/proposals/creative-digital-agency) · [`proposals/creative-digital-agency.html`](proposals/creative-digital-agency.html)
7. **Startup AI/SaaS, Doanh nghiệp Chuyển đổi số, App Publisher & SI (AVIS Gateway)** (`gateway`) — [Live Vercel](https://avis-proposals.vercel.app/proposals/ai-saas-enterprise-gateway) · [`proposals/ai-saas-enterprise-gateway.html`](proposals/ai-saas-enterprise-gateway.html)
8. **Trường Đại học, Cao đẳng & Học viện Đào tạo Sáng tạo (AVIS Creative Campus)** (`masterbrand`) — [Live Vercel](https://avis-proposals.vercel.app/proposals/creative-campus-academy) · [`proposals/creative-campus-academy.html`](proposals/creative-campus-academy.html)

## Chuẩn Nhận Diện & Kiến Trúc Kỹ Thuật
- **Official AVIS Brand Guideline V2**: Bảng màu phẳng chuẩn (`#0080FB` Azure, `#1B346B` Intense Sapphire Blue, `#65FFDB` Electric Turquoise, `#E8EEF5` Sea White), góc vuông `0px` không gradient, bộ font self-hosted `IBM Plex Sans` / `IBM Plex Sans Condensed` / `IBM Plex Mono`, logo SVG chính thức cho `masterbrand`, `creative-studio` và `gateway`.
- **Direct Inline R2 CDN Video Embeds**: Toàn bộ 22 video `.mp4` và 22 ảnh `.jpg` poster được đồng bộ lên Cloudflare R2 (`media.lehuyducanh.com/avis-proposals/`) và nhúng trực tiếp bằng `<video controls playsinline crossorigin="anonymous">` kèm `loading="lazy"` + `IntersectionObserver` fallback.
- **Zero-Build Static Deployment**: Triển khai tức thì lên **Vercel** (`cleanUrls: true`) và hỗ trợ xuất bản in PDF A4 (`Ctrl/Cmd + P`).
