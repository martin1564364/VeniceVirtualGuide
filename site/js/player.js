// Minimal audio player wrapping a single <audio> element, with Media Session
// integration. Native controls are inconsistent across Android skins, so the
// UI drives a single shared <audio> element instead of using native controls.
(function () {
  "use strict";

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ":" + String(s).padStart(2, "0");
  }

  function artworkFor(src) {
    if (!src) return [];
    const ext = src.split("?")[0].split(".").pop().toLowerCase();
    const typeByExt = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      svg: "image/svg+xml",
      webp: "image/webp",
    };
    const artwork = { src };
    if (typeByExt[ext]) artwork.type = typeByExt[ext];
    return [artwork];
  }

  class AudioPlayer {
    constructor(root) {
      this.root = root;
      this.audio = new Audio();
      this.audio.preload = "none";

      this.toggleBtn = root.querySelector(".audio-player__toggle");
      this.iconPlay = root.querySelector(".icon-play");
      this.iconPause = root.querySelector(".icon-pause");
      this.seek = root.querySelector(".audio-player__seek");
      this.currentTimeEl = root.querySelector(".audio-player__time--current");
      this.durationEl = root.querySelector(".audio-player__time--duration");
      this.errorEl = root.querySelector(".audio-player__error");

      this._seeking = false;
      this._bind();
    }

    _bind() {
      this.toggleBtn.addEventListener("click", () => {
        if (this.audio.paused) this.audio.play().catch(() => this._showError());
        else this.audio.pause();
      });

      this.audio.addEventListener("play", () => this._setPlayingState(true));
      this.audio.addEventListener("pause", () => this._setPlayingState(false));

      this.audio.addEventListener("loadedmetadata", () => {
        this.seek.max = String(Math.floor(this.audio.duration) || 0);
        this.durationEl.textContent = formatTime(this.audio.duration);
      });

      this.audio.addEventListener("timeupdate", () => {
        if (this._seeking) return;
        this.seek.value = String(Math.floor(this.audio.currentTime));
        this.currentTimeEl.textContent = formatTime(this.audio.currentTime);
      });

      this.audio.addEventListener("error", () => this._showError());

      this.seek.addEventListener("input", () => {
        this._seeking = true;
        this.currentTimeEl.textContent = formatTime(Number(this.seek.value));
      });

      this.seek.addEventListener("change", () => {
        this.audio.currentTime = Number(this.seek.value);
        this._seeking = false;
      });
    }

    _setPlayingState(isPlaying) {
      this.root.dataset.state = isPlaying ? "playing" : "paused";
      this.iconPlay.hidden = isPlaying;
      this.iconPause.hidden = !isPlaying;
      this.toggleBtn.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
      }
    }

    _showError() {
      this.root.dataset.state = "error";
      this.toggleBtn.disabled = true;
      this.seek.disabled = true;
      this.errorEl.hidden = false;
    }

    _resetError() {
      this.root.dataset.state = "idle";
      this.toggleBtn.disabled = false;
      this.seek.disabled = false;
      this.errorEl.hidden = true;
    }

    _clearMediaSession() {
      if (!("mediaSession" in navigator)) return;
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.playbackState = "none";
      try {
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
      } catch {
        // Some browsers reject unsupported Media Session actions.
      }
    }

    /**
     * Load a new track, stopping any track currently playing.
     * @param {{src: string, title: string, artist: string, artwork: string}} track
     */
    load(track) {
      this.audio.pause();
      this._resetError();
      this.seek.value = "0";
      this.currentTimeEl.textContent = "0:00";
      this.durationEl.textContent = "0:00";
      this.audio.src = track.src;
      this.audio.load();

      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.title,
          artist: track.artist,
          artwork: artworkFor(track.artwork),
        });
        navigator.mediaSession.playbackState = "paused";
        try {
          navigator.mediaSession.setActionHandler("play", () => {
            this.audio.play().catch(() => this._showError());
          });
          navigator.mediaSession.setActionHandler("pause", () => this.audio.pause());
        } catch {
          // Some browsers reject unsupported Media Session actions.
        }
      }
    }

    stop() {
      this.audio.pause();
      this.audio.removeAttribute("src");
      this.audio.load();
      this.seek.value = "0";
      this.seek.max = "0";
      this.currentTimeEl.textContent = "0:00";
      this.durationEl.textContent = "0:00";
      this._resetError();
      this._clearMediaSession();
    }
  }

  window.AudioPlayer = AudioPlayer;
})();
