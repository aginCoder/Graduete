const ALBUM_PHOTOS = [
  {
    id: "photo-1",
    src: "assets/images/thu_van_profile.jpg",
    caption: "Kỷ niệm ngày khoác lên mình chiếc áo cử nhân HIU rạng rỡ",
    category: "portrait"
  },
  {
    id: "photo-2",
    src: "assets/images/thu_van_portrait.jpg",
    caption: "Nụ cười rạng rỡ chạm mốc tân cử nhân xuất sắc",
    category: "portrait"
  },
  {
    id: "photo-3",
    src: "assets/images/van_sunflowers.jpg",
    caption: "Nắng vàng thanh xuân bên bó hoa hướng dương tươi thắm",
    category: "ceremony"
  },
  {
    id: "photo-4",
    src: "assets/images/van_besties.jpg",
    caption: "Cùng hội bạn thân kề vai sát cánh đi qua bao mùa deadline",
    category: "besties"
  },
  {
    id: "photo-5",
    src: "assets/images/cap_toss.jpg",
    caption: "Khoảnh khắc tung mũ cử nhân bay vút lên bầu trời ước mơ",
    category: "ceremony"
  },
  {
    id: "photo-6",
    src: "assets/images/celebration_flowers.jpg",
    caption: "Ngập tràn hoa chúc mừng và tình yêu thương từ gia đình, bạn bè",
    category: "ceremony"
  },
  {
    id: "photo-7",
    src: "assets/images/campus_memories.jpg",
    caption: "Kỷ niệm những buổi chiều ôn thi, họp nhóm dưới bóng mát sân trường",
    category: "besties"
  }
];

let currentLightboxIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  initGuestPersonalization();
  initPersonalizedLinkModal();
  initVerticalScrollNavigation();
  initCountdownTimer();
  initAudioExperience();
  initAlbumGallery();
  initPhotoHeartReactions();
  initEnhancedLightbox();
  initGuestbook();
  initShareAndCalendar();
  initAmbientPetalsAndSparkles();
  initCelebrationConfetti();
  initFloatingCapInteraction();
});

function initGuestPersonalization() {
  const guestInput = document.getElementById("guestNameInput");
  if (!guestInput) return;

  // Read URL parameters (?to=... or ?guest=... or ?name=...)
  const params = new URLSearchParams(window.location.search);
  const rawParam = params.get("to") || params.get("guest") || params.get("name");

  if (rawParam) {
    try {
      const decoded = decodeURIComponent(rawParam).trim();
      guestInput.value = decoded;
      document.title = `Thiệp Mời Dự Lễ Tốt Nghiệp | Thân Gửi ${decoded}`;
    } catch (e) {
      guestInput.value = rawParam.trim();
    }
  }

  // Adjust input width dynamically based on content length
  const adjustWidth = () => {
    const tempSpan = document.createElement("span");
    tempSpan.style.visibility = "hidden";
    tempSpan.style.position = "absolute";
    tempSpan.style.font = window.getComputedStyle(guestInput).font;
    tempSpan.style.whiteSpace = "pre";
    tempSpan.textContent = guestInput.value || guestInput.placeholder;
    document.body.appendChild(tempSpan);
    const measuredWidth = Math.max(140, Math.min(tempSpan.getBoundingClientRect().width + 12, 240));
    guestInput.style.width = `${measuredWidth}px`;
    document.body.removeChild(tempSpan);
  };

  // When editing guest name directly on card:
  guestInput.addEventListener("input", () => {
    adjustWidth();
    const val = guestInput.value.trim();
    if (val) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("to", val);
      window.history.replaceState({}, "", newUrl.toString());
      document.title = `Thiệp Mời Dự Lễ Tốt Nghiệp | Thân Gửi ${val}`;
    }
  });

  adjustWidth();
}

// ===================================================================
// 2. PERSONALIZED GUEST LINK GENERATOR MODAL (TẠO THIỆP GỬI TỪNG NGƯỜI)
// ===================================================================
function initPersonalizedLinkModal() {
  const modal = document.getElementById("linkCreatorModal");
  const openBtn = document.getElementById("openLinkCreatorBtn");
  const closeBtn = document.getElementById("closeLinkCreatorBtn");
  const nameInput = document.getElementById("creatorGuestName");
  const clearBtn = document.getElementById("clearGuestNameBtn");
  const linkOutput = document.getElementById("generatedLinkInput");
  const copyBtn = document.getElementById("copyPersonalizedLinkBtn");
  const shareZaloBtn = document.getElementById("shareViaZaloBtn");
  const previewBtn = document.getElementById("previewPersonalizedBtn");
  const chips = document.querySelectorAll(".name-chip");
  const guestCardInput = document.getElementById("guestNameInput");

  if (!modal || !nameInput || !linkOutput) return;

  function buildUrl(name) {
    const clean = name.trim();
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    if (!clean || clean.toLowerCase() === "quý khách") {
      return `${origin}${pathname}`;
    }
    // Clean, readable URL format: ?to=Gia+Ân instead of %20
    const encoded = encodeURIComponent(clean).replace(/%20/g, "+");
    return `${origin}${pathname}?to=${encoded}`;
  }

  function updateGeneratedLink() {
    linkOutput.value = buildUrl(nameInput.value);
  }

  function openModal() {
    if (guestCardInput && guestCardInput.value) {
      nameInput.value = guestCardInput.value;
    }
    updateGeneratedLink();
    modal.classList.add("active");
    setTimeout(() => {
      nameInput.focus();
      nameInput.select();
    }, 150);
  }

  function closeModal() {
    modal.classList.remove("active");
  }

  if (openBtn) openBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  // Close when clicking backdrop
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Typing updates live URL
  nameInput.addEventListener("input", updateGeneratedLink);

  // Clear button
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      nameInput.value = "";
      updateGeneratedLink();
      nameInput.focus();
    });
  }

  // Quick suggestion chips
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const chosen = chip.getAttribute("data-name");
      if (chosen) {
        nameInput.value = chosen;
        updateGeneratedLink();
        createMiniSparkle(chip.getBoundingClientRect().left, chip.getBoundingClientRect().top);
      }
    });
  });

  // Copy personalized link
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      updateGeneratedLink();
      const urlToCopy = linkOutput.value;
      try {
        await navigator.clipboard.writeText(urlToCopy);
        const guest = nameInput.value.trim() || "khách mời";
        showToast(`📋 Đã sao chép link gửi cho ${guest}!`);
        triggerConfettiBurst();
      } catch (err) {
        linkOutput.select();
        document.execCommand("copy");
        showToast("📋 Đã sao chép link!");
      }
    });
  }

  // Share via Zalo / Messenger
  if (shareZaloBtn) {
    shareZaloBtn.addEventListener("click", async () => {
      updateGeneratedLink();
      const url = linkOutput.value;
      const guest = nameInput.value.trim() || "quý khách";
      const shareText = `Thân gửi ${guest}! Kính mời ${guest} đến tham dự Lễ Tốt Nghiệp của Đào Thị Tố Uyên tại Trường ĐH Văn Hiến vào ngày 18.07.2026. Mở thiệp tại:`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: `Thiệp Mời Dự Lễ Tốt Nghiệp | Thân Gửi ${guest}`,
            text: shareText,
            url: url
          });
          return;
        } catch (e) {}
      }

      try {
        await navigator.clipboard.writeText(`${shareText}\n${url}`);
        showToast(`💬 Đã sao chép lời mời và link! Hãy dán vào Zalo gửi cho ${guest} nhé!`, 4000);
      } catch (e) {
        linkOutput.select();
        document.execCommand("copy");
        showToast(`💬 Đã sao chép link thiệp mời!`);
      }
    });
  }

  if (previewBtn) {
    previewBtn.addEventListener("click", () => {
      const chosen = nameInput.value.trim() || "Quý khách";
      if (guestCardInput) {
        guestCardInput.value = chosen;
        guestCardInput.dispatchEvent(new Event("input"));
      }
      closeModal();
      const hero = document.getElementById("slide-1");
      if (hero) hero.scrollIntoView({ behavior: "smooth" });
      showToast(`✨ Đã cập nhật thiệp cho: ${chosen}!`);
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}

function createMiniSparkle(x, y) {
  const sparkle = document.createElement("div");
  sparkle.className = "flying-love-heart";
  sparkle.textContent = Math.random() > 0.5 ? "✨" : "⭐";
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;
  sparkle.style.fontSize = `${Math.random() * 12 + 14}px`;
  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 1400);
}

function initCountdownTimer() {
  const daysEl = document.getElementById("timerDays");
  const hoursEl = document.getElementById("timerHours");
  const minutesEl = document.getElementById("timerMinutes");
  const secondsEl = document.getElementById("timerSeconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const targetTime = new Date("2026-07-18T10:00:00+07:00").getTime();

  function update() {
    const now = Date.now();
    const difference = targetTime - now;

    if (difference <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const d = Math.floor(difference / (1000 * 60 * 60 * 24));
    const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((difference % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, "0");
    hoursEl.textContent = String(h).padStart(2, "0");
    minutesEl.textContent = String(m).padStart(2, "0");
    secondsEl.textContent = String(s).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

function initAudioExperience() {
  const musicBtn = document.getElementById("bgMusicBtn");
  if (!musicBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let melodyTimer = null;
  let currentNoteIndex = 0;

  const noteFrequencies = {
    "F3": 174.61, "A3": 220.00, "C4": 261.63, "D4": 293.66, "E4": 329.63,
    "F4": 349.23, "G4": 392.00, "A4": 440.00, "Bb4": 466.16, "C5": 523.25,
    "D5": 587.33, "E5": 659.25, "F5": 698.46, "G5": 783.99, "A5": 880.00
  };

  const melodyScore = [
    { notes: ["F3", "A4", "C5"], duration: 1.2 },
    { notes: ["C4", "G4", "C5"], duration: 1.0 },
    { notes: ["D4", "F4", "A4"], duration: 1.2 },
    { notes: ["Bb4", "D5", "F5"], duration: 1.4 },
    { notes: ["A4", "C5", "E5"], duration: 1.2 },
    { notes: ["G4", "Bb4", "D5"], duration: 1.0 },
    { notes: ["C4", "E4", "G4", "Bb4"], duration: 1.4 },
    { notes: ["F3", "C4", "F4", "A4"], duration: 2.0 }
  ];

  function playPianoChord(chord) {
    if (!audioCtx || !isPlaying) return;

    chord.notes.forEach((noteName) => {
      const freq = noteFrequencies[noteName];
      if (!freq) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      const now = audioCtx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + chord.duration * 1.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + chord.duration * 1.6);
    });
  }

  function playNextChord() {
    if (!isPlaying) return;
    const chord = melodyScore[currentNoteIndex];
    playPianoChord(chord);
    currentNoteIndex = (currentNoteIndex + 1) % melodyScore.length;
    melodyTimer = setTimeout(playNextChord, chord.duration * 1000);
  }

  function startAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    isPlaying = true;
    musicBtn.classList.add("playing");
    playNextChord();
    showToast("🎵 Đang phát giai điệu thanh xuân!");
  }

  function stopAudio() {
    isPlaying = false;
    musicBtn.classList.remove("playing");
    if (melodyTimer) clearTimeout(melodyTimer);
    showToast("Đã tắt nhạc nền");
  }

  musicBtn.addEventListener("click", () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  });
}

// ===================================================================
// 6. ALBUM OF YOUTH: CATEGORY FILTER TABS
// ===================================================================
function initAlbumGallery() {
  const tabs = document.querySelectorAll(".filter-tab");
  const items = document.querySelectorAll(".grid-photo-item");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.getAttribute("data-filter");

      items.forEach((item) => {
        const itemCat = item.getAttribute("data-category");
        if (filter === "all" || itemCat === filter) {
          item.classList.remove("hidden");
          item.style.animation = "zoomLightbox 0.3s ease";
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });
}

// ===================================================================
// 7. PHOTO HEART REACTIONS & FLYING LOVE PARTICLES
// ===================================================================
function initPhotoHeartReactions() {
  const heartBtns = document.querySelectorAll(".photo-heart-btn");

  heartBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent opening lightbox when clicking heart
      const countEl = btn.querySelector(".heart-count");
      let count = parseInt(countEl.textContent, 10) || 0;
      count++;
      countEl.textContent = count;

      btn.classList.add("popped");
      setTimeout(() => btn.classList.remove("popped"), 500);

      const rect = btn.getBoundingClientRect();
      spawnFlyingHeart(rect.left + rect.width / 2, rect.top);
    });
  });
}

function spawnFlyingHeart(x, y) {
  const heart = document.createElement("div");
  heart.className = "flying-love-heart";
  heart.textContent = Math.random() > 0.3 ? "❤️" : "💖";
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 1400);
}

// ===================================================================
// 8. ENHANCED FULLSCREEN LIGHTBOX WITH PREV / NEXT & COUNTER
// ===================================================================
function initEnhancedLightbox() {
  const modal = document.getElementById("photoLightbox");
  const backdrop = document.getElementById("lightboxBackdrop");
  const closeBtn = document.getElementById("lightboxCloseBtn");
  const imgEl = document.getElementById("lightboxImage");
  const captionEl = document.getElementById("lightboxCaption");
  const counterEl = document.getElementById("lightboxCounter");
  const prevBtn = document.getElementById("lightboxPrevBtn");
  const nextBtn = document.getElementById("lightboxNextBtn");
  const loveBtn = document.getElementById("lightboxLoveBtn");

  if (!modal || !imgEl) return;

  function renderPhotoAt(index) {
    if (index < 0) index = ALBUM_PHOTOS.length - 1;
    if (index >= ALBUM_PHOTOS.length) index = 0;
    currentLightboxIndex = index;

    const photo = ALBUM_PHOTOS[currentLightboxIndex];
    imgEl.style.opacity = "0.4";
    imgEl.src = photo.src;
    imgEl.onload = () => {
      imgEl.style.opacity = "1";
    };

    if (captionEl) captionEl.textContent = photo.caption;
    if (counterEl) counterEl.textContent = `Ảnh ${currentLightboxIndex + 1} / ${ALBUM_PHOTOS.length}`;
  }

  function openLightbox(index) {
    renderPhotoAt(index);
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Bind click on all photo items
  document.querySelectorAll(".photo-card, .grid-photo-item").forEach((el) => {
    el.addEventListener("click", () => {
      const idxAttr = el.getAttribute("data-index");
      const index = idxAttr !== null ? parseInt(idxAttr, 10) : 0;
      openLightbox(index);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      renderPhotoAt(currentLightboxIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      renderPhotoAt(currentLightboxIndex + 1);
    });
  }

  if (loveBtn) {
    loveBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const rect = loveBtn.getBoundingClientRect();
      spawnFlyingHeart(rect.left + rect.width / 2, rect.top);
      showToast("❤️ Đã thả tim vào bức ảnh thanh xuân này!");
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (backdrop) backdrop.addEventListener("click", closeLightbox);

  window.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "ArrowLeft") {
      renderPhotoAt(currentLightboxIndex - 1);
    } else if (e.key === "ArrowRight") {
      renderPhotoAt(currentLightboxIndex + 1);
    } else if (e.key === "Escape") {
      closeLightbox();
    }
  });
}

// ===================================================================
// 9. FLOATING GRADUATION CAP INTERACTION
// ===================================================================
function initFloatingCapInteraction() {
  const cap = document.getElementById("floatingCapIcon");
  if (!cap) return;

  cap.addEventListener("click", () => {
    triggerConfettiBurst();
    showToast("🎓 Chúc mừng Tân Cử Nhân Đào Thị Tố Uyên!");
  });
}

function initGuestbook() {
  const form = document.getElementById("wishForm");
  const senderInput = document.getElementById("wishSenderName");
  const messageInput = document.getElementById("wishMessageText");
  const dynamicContainer = document.getElementById("dynamicWishesContainer");
  const toggleMoreBtn = document.getElementById("toggleMoreWishesBtn");
  const expandBtnText = document.getElementById("expandBtnText");

  if (!form || !senderInput || !messageInput || !dynamicContainer) return;

  const STORAGE_KEY = "hiu_graduation_wishes_van_v2";
  let wishes = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) wishes = JSON.parse(raw);
  } catch (err) {
    wishes = [];
  }

  function renderDynamicWishes() {
    dynamicContainer.innerHTML = "";
    wishes.forEach((w) => {
      const card = document.createElement("div");
      card.className = "wish-card";
      card.innerHTML = `
        <div class="wish-card-inner">
          <div class="wish-author-name">${escapeHtml(w.name)}</div>
          <div class="wish-message-body">${escapeHtml(w.message)}</div>
        </div>
      `;
      dynamicContainer.appendChild(card);
    });
  }

  renderDynamicWishes();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = senderInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) {
      showToast("Vui lòng nhập tên và lời chúc của bạn nhé!");
      return;
    }

    const newWish = {
      id: Date.now(),
      name: name,
      message: message,
      date: new Date().toLocaleDateString("vi-VN")
    };

    wishes.unshift(newWish);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    } catch (err) {
      console.warn(err);
    }

    renderDynamicWishes();
    form.reset();

    triggerConfettiBurst();
    showToast("✨ Cảm ơn bạn rất nhiều vì lời chúc ý nghĩa!");
  });

  if (toggleMoreBtn) {
    let isExpanded = false;
    toggleMoreBtn.addEventListener("click", () => {
      isExpanded = !isExpanded;
      if (isExpanded) {
        dynamicContainer.style.display = "flex";
        if (expandBtnText) expandBtnText.textContent = "Thu gọn lời chúc ↑";
      } else {
        if (expandBtnText) expandBtnText.textContent = "Xem thêm lời chúc ↓";
      }
    });
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ===================================================================
// 11. SHARE LINK & GOOGLE CALENDAR
// ===================================================================
function initShareAndCalendar() {
  const shareBtn = document.getElementById("shareLinkBtn");
  const calBtn = document.getElementById("addToCalBtn");

  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      const modal = document.getElementById("linkCreatorModal");
      const openBtn = document.getElementById("openLinkCreatorBtn");
      if (openBtn) {
        openBtn.click();
      } else if (modal) {
        modal.classList.add("active");
      }
    });
  }

  if (calBtn) {
    calBtn.addEventListener("click", () => {
      const title = encodeURIComponent("Lễ Tốt Nghiệp - Đào Thị Tố Uyên (VHU)");
      const details = encodeURIComponent("Lễ trao bằng tốt nghiệp đại học của Đào Thị Tố Uyên - Khoa Quản trị Sự kiện, Trường ĐH Văn Hiến.");
      const location = encodeURIComponent("Trường Đại học Văn Hiến, 613 Âu Cơ, Phường Phú Trung, Quận Tân Phú, Thành Phố Hồ Chí Minh");
      const dates = "20260718T030000Z/20260718T053000Z";

      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
      window.open(googleCalUrl, "_blank");
    });
  }
}

function initAmbientPetalsAndSparkles() {
  const canvas = document.getElementById("ambientCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const sparkles = [];

  // Rose / Sakura Petals drifting gently
  for (let i = 0; i < 22; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedY: Math.random() * 0.8 + 0.4,
      speedX: Math.random() * 0.6 - 0.3,
      angle: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      sway: Math.random() * Math.PI,
      opacity: Math.random() * 0.4 + 0.25
    });
  }

  // Golden Dust Sparkles
  for (let i = 0; i < 26; i++) {
    sparkles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedY: Math.random() * 0.3 + 0.1,
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw Golden Sparkles
    sparkles.forEach((s) => {
      s.y -= s.speedY;
      s.x += s.speedX;
      s.pulse += 0.03;

      if (s.y < -10) {
        s.y = height + 10;
        s.x = Math.random() * width;
      }

      const alpha = s.opacity * (0.6 + 0.4 * Math.sin(s.pulse));
      ctx.fillStyle = `rgba(212, 175, 55, ${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Falling Petals
    petals.forEach((p) => {
      p.y += p.speedY;
      p.sway += 0.02;
      p.x += Math.sin(p.sway) * 0.6 + p.speedX;
      p.angle += p.rotSpeed;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = `rgba(228, 151, 169, ${p.opacity})`;

      // Delicate oval petal shape
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  draw();
}

// ===================================================================
// 13. CELEBRATION CONFETTI ENGINE (FOR WISHES & CEREMONY)
// ===================================================================
let confettiParticles = [];
let confettiCtx = null;
let confettiAnimId = null;

function initCelebrationConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;
  confettiCtx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

function triggerConfettiBurst() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas || !confettiCtx) return;

  const colors = ["#D4AF37", "#E497A9", "#7B384A", "#F7E7A9", "#C41230", "#FFFFFF"];
  const count = 75;

  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height * 0.65,
      size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      velX: (Math.random() - 0.5) * 14,
      velY: -(Math.random() * 12 + 6),
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      gravity: 0.28,
      opacity: 1
    });
  }

  if (!confettiAnimId) {
    animateConfetti();
  }
}

function animateConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas || !confettiCtx) return;

  confettiCtx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.velY += p.gravity;
    p.x += p.velX;
    p.y += p.velY;
    p.rot += p.rotSpeed;
    p.opacity -= 0.008;

    if (p.opacity <= 0 || p.y > canvas.height + 20) {
      confettiParticles.splice(i, 1);
      continue;
    }

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate((p.rot * Math.PI) / 180);
    confettiCtx.globalAlpha = Math.max(0, p.opacity);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
    confettiCtx.restore();
  }

  if (confettiParticles.length > 0) {
    confettiAnimId = requestAnimationFrame(animateConfetti);
  } else {
    confettiAnimId = null;
    confettiCtx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// ===================================================================
// TOAST NOTIFICATION HELPER
// ===================================================================
function showToast(message, duration = 3000) {
  const hub = document.getElementById("toastHub");
  if (!hub) return;

  const pill = document.createElement("div");
  pill.className = "toast-pill";
  pill.textContent = message;
  hub.appendChild(pill);

  setTimeout(() => {
    pill.style.opacity = "0";
    pill.style.transition = "opacity 0.3s";
    setTimeout(() => pill.remove(), 300);
  }, duration);
}
