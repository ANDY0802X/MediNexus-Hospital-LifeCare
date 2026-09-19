(function () {
    "use strict";

    var FRAME_COUNT = 40;
    var FRAME_PATH = function (i) {
        return "assets/img/frames_mine/frame-" + (i + 1) + ".png";
    };
    var HEIGHT_RATIO = 0.8; // matches the background-size: auto 80%
    var stage = document.getElementById("scrollStage");
    var canvas = document.getElementById("docCanvas");
    var heroPin = document.getElementById("heroPin");
    var maleDoctor = document.getElementById("maleDoctor");
    var maleShowcase = document.querySelector(".doctor-showcase");
    var contentSections = stage ? stage.querySelectorAll("#heroPin > .content_div") : [];
    
    if (!stage || !canvas) return;

    var portraitPhone = window.matchMedia("(max-width: 767px) and (orientation: portrait)");
    if (portraitPhone.matches) return;

    var ctx = canvas.getContext("2d");
    var frames = new Array(FRAME_COUNT);
    var currentIndex = -1;
    var contentOffset = 0;
    var ticking = false;
    var dpr = Math.max(1, window.devicePixelRatio || 1);
    var MALE_REVEAL_FRAME = 14; // zero-based: frame 15
    var maleStartRect = null;

    function updateDoctorLayout() {
        if (!heroPin || !maleDoctor) return;
        var rect = heroPin.getBoundingClientRect();
        var femaleHeight = rect.height * HEIGHT_RATIO;
        var maleWidth = femaleHeight * (1024 / 1536);
        var femaleWidth = femaleHeight * (720 / 1280);
        var hasRoom = window.innerWidth >= 768 && rect.width >= maleWidth + femaleWidth + 64;
        heroPin.classList.toggle("has-doctor-room", hasRoom);
        if (hasRoom) {
            maleDoctor.style.height = femaleHeight + "px";
            maleDoctor.style.width = "auto";
            maleDoctor.classList.add("is-visible");
        } else {
            maleDoctor.classList.remove("is-visible");
        }
    }

    function contentTravel() {
        var stageTop = stage.getBoundingClientRect().top;
        var contentBottom = 0;
        for (var i = 0; i < contentSections.length; i++) {
            contentBottom = Math.max(contentBottom, contentSections[i].getBoundingClientRect().bottom + contentOffset);
        }
        return Math.max(0, contentBottom - stageTop);
    }

    function captureMaleStart() {
        if (!maleDoctor || !maleShowcase || !heroPin.classList.contains("has-doctor-room")) return;
        maleShowcase.style.transform = "";
        maleStartRect = maleDoctor.getBoundingClientRect();
    }

    function moveMaleDoctor(travel) {
        if (!maleDoctor || !maleShowcase || !heroPin.classList.contains("has-doctor-room")) return;
        if (!maleStartRect) captureMaleStart();
        if (!maleStartRect) return;

        var canvasRect = canvas.getBoundingClientRect();
        var targetHeight = canvasRect.height * HEIGHT_RATIO;
        var targetWidth = targetHeight * (1024 / 1536);
        var targetLeft = canvasRect.left + canvasRect.width * 0.28 - targetWidth / 2;
        var targetTop = canvasRect.bottom - targetHeight;
        var offsetAtFrame15 = (MALE_REVEAL_FRAME / (FRAME_COUNT - 1)) * travel;
        var servicesLift = window.innerWidth >= 768
            ? Math.min(390, canvasRect.height * 0.55)
            : 0;

        var x = targetLeft - maleStartRect.left;
        var y = targetTop + offsetAtFrame15 - maleStartRect.top - contentOffset - servicesLift;
        maleShowcase.style.transform = "translate(" + x + "px, " + y + "px)";
    }

    function preload() {
        for (var i = 0; i < FRAME_COUNT; i++) {
            var img = new Image();
            img.src = FRAME_PATH(i);
            frames[i] = img;
        }
    }

    function nearestLoaded(index) {
        if (frames[index] && frames[index].complete && frames[index].naturalWidth) {
            return frames[index];
        }
        for (var d = 1; d < FRAME_COUNT; d++) {
            var back = index - d, fwd = index + d;
            if (back >= 0 && frames[back].complete && frames[back].naturalWidth) return frames[back];
            if (fwd < FRAME_COUNT && frames[fwd].complete && frames[fwd].naturalWidth) return frames[fwd];
        }
        return null;
    }

    function resizeCanvas() {
        for (var i = 0; i < contentSections.length; i++) {
            contentSections[i].style.transform = "";
        }
        contentOffset = 0;
        maleStartRect = null;
        updateDoctorLayout();
        var rect = canvas.getBoundingClientRect();
        canvas.width = Math.max(1, Math.round(rect.width * dpr));
        canvas.height = Math.max(1, Math.round(rect.height * dpr));
        var frame = frameForScroll();
        draw(frame, true);
        moveContentUp(frame);
    }

    function draw(index, force) {
        if (!force && index === currentIndex) return;
        var img = nearestLoaded(index);
        if (!img) return;
        currentIndex = index;

        var cw = canvas.width, ch = canvas.height;
        ctx.clearRect(0, 0, cw, ch);

        var h = ch * HEIGHT_RATIO;
        var w = h * (img.naturalWidth / img.naturalHeight);
        var laptopShift = window.innerWidth >= 768 && window.innerWidth <= 1366
            ? Math.min(90 * dpr, cw * 0.07)
            : 0;
        var x = cw - w - laptopShift;
        var y = ch - h;
        ctx.drawImage(img, x, y, w, h);
    }

    function frameForScroll() {
        var total = stage.scrollHeight - stage.clientHeight;
        if (total <= 0) return 0;
        var progress = stage.scrollTop / total;
        progress = Math.min(1, Math.max(0, progress));
        return Math.round(progress * (FRAME_COUNT - 1));
    }

    function moveContentUp(frame) {
        var total = stage.scrollHeight - stage.clientHeight;
        var progress = total <= 0 ? 0 : stage.scrollTop / total;
        var travel = contentTravel();
        var offset = progress * travel;
        contentOffset = offset;
        for (var i = 0; i < contentSections.length; i++) {
            contentSections[i].style.transform = "translateY(-" + offset + "px)";
        }
        moveMaleDoctor(travel);
    }

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            var frame = frameForScroll();
            draw(frame);
            moveContentUp(frame);
            ticking = false;
        });
    }

    function forwardWheel(event) {
        if (stage.contains(event.target)) return;
        var maxScroll = stage.scrollHeight - stage.clientHeight;
        if (maxScroll <= 0) return;
        event.preventDefault();
        stage.scrollTop = Math.min(maxScroll, Math.max(0, stage.scrollTop + event.deltaY));
    }

    function tiltMaleDoctor(event) {
        if (!maleDoctor || !heroPin.classList.contains("has-doctor-room")) return;
        var rect = maleDoctor.getBoundingClientRect();
        var amount = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        amount = Math.max(-1, Math.min(1, amount));
        maleDoctor.style.setProperty("--male-tilt", (amount * 5).toFixed(2) + "deg");
    }

    function resetMaleTilt() {
        if (maleDoctor) maleDoctor.style.setProperty("--male-tilt", "0deg");
    }

    stage.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("wheel", forwardWheel, { passive: false });
    maleDoctor.addEventListener("mousemove", tiltMaleDoctor);
    maleDoctor.addEventListener("mouseleave", resetMaleTilt);
    window.addEventListener("resize", resizeCanvas);

    preload();
    frames[0].addEventListener("load", function () { resizeCanvas(); });
    maleDoctor.addEventListener("load", resizeCanvas);
    resizeCanvas();
})();

/* =======================================================
   MODAL & FORM CONTROLLERS (Global Scope)
   ======================================================= */
function openModal(modalId, param) {
    var modal = document.getElementById(modalId);
    if (!modal) return;
    
    // Set specific parameters if provided
    if (modalId === 'doctorModal' && param) {
        var docField = document.getElementById('doctorSelectField');
        if (docField) docField.value = param;
    } else if (modalId === 'vaxModal' && param) {
        var vaxSelect = document.getElementById('vaxTypeSelect');
        if (vaxSelect) vaxSelect.value = param;
    } else if (modalId === 'bloodModal' && param) {
        var bloodAction = document.getElementById('bloodActionType');
        if (bloodAction) bloodAction.value = param;
    }
    
    modal.classList.add('is-active');
}

function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('is-active');
}

// Close on backdrop click
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('is-active');
    }
});

// Toast Notification
function showToast(message) {
    var toast = document.getElementById('toast');
    var toastText = document.getElementById('toastText');
    if (!toast || !toastText) return;
    
    toastText.textContent = message;
    toast.style.display = 'flex';
    
    setTimeout(function () {
        toast.style.display = 'none';
    }, 4000);
}

function handleFormSubmit(event, successMsg) {
    event.preventDefault();
    var form = event.target;
    var modal = form.closest('.modal-overlay');
    if (modal) modal.classList.remove('is-active');
    form.reset();
    showToast(successMsg);
}